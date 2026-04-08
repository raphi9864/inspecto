import 'dotenv/config';
import { writeFile, mkdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { resolve } from 'path';
import { createInterface } from 'readline';

// ─── Voice mapping (Fish Audio reference_ids) ────────────────────────
const VOICES = {
  fr_male:   'ab0928ef51464a6b801c30da81e08bae',
  fr_female: '66ad7c01fe804d55829a8dc9cfbeb7e4',
  en_male:   'd8a1340984ee4b63ad1ffae27a6a4339',
  en_female: 'e3cd384158934cc9a01029cd7d278634',
  es_male:   'dfa5b230c8054f429e434f4a6e9bbdec',
  es_female: 'e296306da5d449999f6e35c2b9f60aea',
  it_male:   'b525ef2064b549189d4ab19715da62c4',
  it_female: '77043563e29e4a828972525e277d643f',
  de_male:   '90042f762dbf49baa2e7776d011eee6b',
  de_female: '88b18e0d81474a0ca08e2ea6f9df5ff4',
};

const LANGUAGES = ['fr', 'en', 'es', 'it', 'de'];
const GENDERS = ['male', 'female'];
const API_URL = 'https://api.fish.audio/v1/tts';
const OUTPUT_BASE = 'public/audio';
const CONCURRENCY = 5;
const MAX_RETRIES = 3;

// ─── Helpers ─────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ─── Parse demo scripts ─────────────────────────────────────────────

/**
 * Parse all demo scripts and return a flat array of { lang, stepId, text }.
 */
async function parseAllScripts() {
  const speaks = [];
  for (const lang of LANGUAGES) {
    const filePath = resolve(`src/data/demoScripts/${lang}.js`);
    const mod = await import(pathToFileURL(filePath).href);
    const steps = mod.default;
    for (const step of steps) {
      const text = step.text || step.speak;
      if (!text) continue;
      speaks.push({ lang, stepId: step.id, text });
    }
  }
  return speaks;
}

// ─── TTS generation ──────────────────────────────────────────────────

/**
 * Generate a single TTS file. Returns { ok, size?, error?, chars? }.
 * Throws a special StopError on 401/402 to halt the entire batch.
 */
class StopError extends Error {
  constructor(msg) { super(msg); this.name = 'StopError'; }
}

async function generateOne(job, apiKey) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'model': 's2-pro',
        },
        body: JSON.stringify({
          text: job.text,
          reference_id: job.voiceId,
          format: 'mp3',
          mp3_bitrate: 128,
          sample_rate: 44100,
          normalize: true,
          latency: 'normal',
        }),
      });

      if (res.status === 401) throw new StopError('401 Unauthorized — bad FISH_AUDIO_API_KEY');
      if (res.status === 402) throw new StopError('402 Payment Required — insufficient credits');

      if (res.status === 429) {
        console.log(`   ⏳ Rate limited, waiting 30s...`);
        await sleep(30000);
        continue;
      }

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(job.outputPath, buffer);
      return { ok: true, size: buffer.length, chars: job.text.length };

    } catch (err) {
      if (err instanceof StopError) throw err;
      if (attempt < MAX_RETRIES) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`   ⚠️  Attempt ${attempt}/${MAX_RETRIES} failed (${err.message}), retrying in ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        return { ok: false, error: err.message, chars: job.text.length };
      }
    }
  }
  return { ok: false, error: 'Max retries exceeded', chars: job.text.length };
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎙️  Fish Audio TTS — Full Batch Generation\n');

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    console.error('❌ FISH_AUDIO_API_KEY not found in .env');
    process.exit(1);
  }

  // ── 1. Parse scripts ──
  console.log('📖 Parsing demo scripts...');
  const speaks = await parseAllScripts();
  console.log(`   Found ${speaks.length} speaks across ${LANGUAGES.length} languages\n`);

  // ── 2. Build job list ──
  const jobs = [];
  for (const { lang, stepId, text } of speaks) {
    for (const gender of GENDERS) {
      const voiceKey = `${lang}_${gender}`;
      jobs.push({
        lang, gender, stepId, text,
        voiceId: VOICES[voiceKey],
        outputPath: `${OUTPUT_BASE}/${lang}/${gender}/${stepId}.mp3`,
      });
    }
  }

  // ── 3. Check idempotency (skip existing files) ──
  const toProcess = [];
  let skipped = 0;
  for (const job of jobs) {
    try {
      const s = await stat(job.outputPath);
      if (s.size > 1024) { skipped++; continue; }
    } catch {}
    toProcess.push(job);
  }

  const totalChars = toProcess.reduce((sum, j) => sum + j.text.length, 0);
  const estimatedCredits = Math.ceil(totalChars / 2);
  const estimatedMB = ((toProcess.length * 30) / 1024).toFixed(1);

  // ── 4. Dry run summary ──
  console.log('═'.repeat(55));
  console.log(`📊 Batch summary:`);
  console.log(`   Total speaks: ${speaks.length} × 2 genders = ${jobs.length} audio files`);
  console.log(`   Already exist (skip): ${skipped}`);
  console.log(`   To generate: ${toProcess.length}`);
  console.log(`   Total chars: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated credits: ~${estimatedCredits.toLocaleString()} (${(estimatedCredits / 250000 * 100).toFixed(1)}% of monthly Plus quota)`);
  console.log(`   Estimated size: ~${estimatedMB} MB`);
  console.log(`   Concurrency: ${CONCURRENCY} parallel requests`);

  if (toProcess.length > 0) {
    console.log(`\n   Preview (first 3 jobs):`);
    for (const j of toProcess.slice(0, 3)) {
      console.log(`   - ${j.lang}/${j.gender}/${j.stepId}: "${j.text.slice(0, 60)}..."`);
    }
  }

  console.log('═'.repeat(55));

  if (toProcess.length === 0) {
    console.log('\n✅ Nothing to generate — all files already exist!');
    return;
  }

  const answer = await ask(`\n❓ Generate ${toProcess.length} files? Type 'yes' to proceed: `);
  if (answer.toLowerCase() !== 'yes') {
    console.log('🛑 Aborted by user.');
    process.exit(0);
  }

  // ── 5. Create directories ──
  for (const lang of LANGUAGES) {
    for (const gender of GENDERS) {
      await mkdir(`${OUTPUT_BASE}/${lang}/${gender}`, { recursive: true });
    }
  }

  // ── 6. Process in batches of CONCURRENCY ──
  const startTime = Date.now();
  const totalJobs = jobs.length;
  let generated = 0;
  let failed = 0;
  let charsProcessed = 0;
  const failures = [];

  console.log(`\n🚀 Starting generation...\n`);

  try {
    for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
      const batch = toProcess.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(job => generateOne(job, apiKey)));

      for (let j = 0; j < batch.length; j++) {
        const job = batch[j];
        const result = results[j];
        const idx = i + j + 1 + skipped;

        if (result.ok) {
          generated++;
          charsProcessed += result.chars;
          const kb = (result.size / 1024).toFixed(1);
          console.log(`[${idx}/${totalJobs}] ✅ ${job.lang}/${job.gender}/${job.stepId}.mp3 (${kb} KB)`);
        } else {
          failed++;
          failures.push({ path: `${job.lang}/${job.gender}/${job.stepId}`, error: result.error });
          console.log(`[${idx}/${totalJobs}] ❌ ${job.lang}/${job.gender}/${job.stepId}.mp3 — ${result.error}`);
        }
      }

      // Progress report every 50 jobs
      const done = generated + failed;
      if (done > 0 && done % 50 < CONCURRENCY) {
        const elapsed = Date.now() - startTime;
        const rate = done / (elapsed / 1000);
        const remaining = toProcess.length - done;
        const eta = remaining > 0 ? formatTime((remaining / rate) * 1000) : '00:00:00';
        const creditsUsed = Math.ceil(charsProcessed / 2);
        console.log(`\n📈 Progress: ${done + skipped}/${totalJobs} (${((done + skipped) / totalJobs * 100).toFixed(0)}%) — ~${creditsUsed.toLocaleString()} credits — ETA: ${eta}\n`);
      }

      // Small delay between batches to be gentle on API
      if (i + CONCURRENCY < toProcess.length) {
        await sleep(200);
      }
    }
  } catch (err) {
    if (err.name === 'StopError') {
      console.error(`\n🛑 BATCH STOPPED: ${err.message}`);
      console.log(`   Generated ${generated} files before stopping.`);
      console.log(`   Re-run the script to resume (idempotent — existing files will be skipped).`);
    } else {
      throw err;
    }
  }

  // ── 7. Final summary ──
  const totalTime = Date.now() - startTime;
  const creditsUsed = Math.ceil(charsProcessed / 2);

  console.log('\n' + '═'.repeat(55));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(55));
  console.log(`   Total jobs:     ${jobs.length}`);
  console.log(`   Generated:      ${generated}`);
  console.log(`   Skipped:        ${skipped}`);
  console.log(`   Failed:         ${failed}`);
  console.log(`   Chars processed: ${charsProcessed.toLocaleString()}`);
  console.log(`   Credits used:   ~${creditsUsed.toLocaleString()}`);
  console.log(`   Total time:     ${formatTime(totalTime)}`);
  console.log(`   Output:         ${OUTPUT_BASE}/`);

  if (failures.length > 0) {
    console.log(`\n   ❌ Failures:`);
    for (const f of failures) {
      console.log(`      - ${f.path}: ${f.error}`);
    }
  }

  console.log('\n👉 Next steps:');
  console.log('   1. Test locally: npm run dev → launch demo → verify audio plays');
  console.log('   2. Commit: git add public/audio/ && git commit -m "feat: add multilingual TTS audio"');
  console.log('   3. Push → Vercel auto-deploys with audio included\n');
}

main();
