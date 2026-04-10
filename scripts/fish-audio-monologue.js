import 'dotenv/config';
import { writeFile, mkdir, readFile, stat } from 'fs/promises';
import { resolve } from 'path';
import { createInterface } from 'readline';

// ─── Voice mapping (Fish Audio reference_ids) — must match fish-audio-batch.js
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(question, ans => { rl.close(); res(ans.trim()); }));
}

async function loadMonologue(lang) {
  const path = resolve(`src/i18n/locales/${lang}.json`);
  const raw = await readFile(path, 'utf-8');
  const json = JSON.parse(raw);
  const lines = json?.presenter?.monologue;
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error(`presenter.monologue missing or empty in ${lang}.json`);
  }
  return lines;
}

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
        console.log('   ⏳ Rate limited, waiting 30s...');
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

async function main() {
  console.log('\n🎙️  Fish Audio TTS — Presenter monologue generation\n');

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    console.error('❌ FISH_AUDIO_API_KEY not found in .env');
    process.exit(1);
  }

  // Build jobs from i18n monologue arrays
  const jobs = [];
  for (const lang of LANGUAGES) {
    const lines = await loadMonologue(lang);
    lines.forEach((text, idx) => {
      const stepId = `monologue-${idx + 1}`;
      for (const gender of GENDERS) {
        jobs.push({
          lang, gender, stepId, text,
          voiceId: VOICES[`${lang}_${gender}`],
          outputPath: `${OUTPUT_BASE}/${lang}/${gender}/${stepId}.mp3`,
        });
      }
    });
  }

  // Idempotency: skip files > 1 KB
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

  console.log('═'.repeat(55));
  console.log('📊 Monologue batch summary:');
  console.log(`   Total jobs:     ${jobs.length}  (5 lines × 5 langs × 2 genders)`);
  console.log(`   Already exist:  ${skipped}`);
  console.log(`   To generate:    ${toProcess.length}`);
  console.log(`   Total chars:    ${totalChars.toLocaleString()}`);
  console.log(`   Est. credits:   ~${estimatedCredits.toLocaleString()}`);
  if (toProcess.length > 0) {
    console.log('\n   Preview (first 3 jobs):');
    for (const j of toProcess.slice(0, 3)) {
      console.log(`   - ${j.lang}/${j.gender}/${j.stepId}: "${j.text.slice(0, 60)}..."`);
    }
  }
  console.log('═'.repeat(55));

  if (toProcess.length === 0) {
    console.log('\n✅ Nothing to generate — all files already exist!');
    return;
  }

  const skipConfirm = process.argv.includes('--yes') || process.argv.includes('-y');
  if (!skipConfirm) {
    const answer = await ask(`\n❓ Generate ${toProcess.length} files? Type 'yes' to proceed: `);
    if (answer.toLowerCase() !== 'yes') {
      console.log('🛑 Aborted by user.');
      process.exit(0);
    }
  }

  // Ensure output directories
  for (const lang of LANGUAGES) {
    for (const gender of GENDERS) {
      await mkdir(`${OUTPUT_BASE}/${lang}/${gender}`, { recursive: true });
    }
  }

  const startTime = Date.now();
  let generated = 0;
  let failed = 0;
  const failures = [];

  console.log('\n🚀 Starting generation...\n');

  try {
    for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
      const batch = toProcess.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(j => generateOne(j, apiKey)));
      for (let k = 0; k < batch.length; k++) {
        const job = batch[k];
        const result = results[k];
        const idx = i + k + 1;
        if (result.ok) {
          generated++;
          const kb = (result.size / 1024).toFixed(1);
          console.log(`[${idx}/${toProcess.length}] ✅ ${job.lang}/${job.gender}/${job.stepId}.mp3 (${kb} KB)`);
        } else {
          failed++;
          failures.push({ path: `${job.lang}/${job.gender}/${job.stepId}`, error: result.error });
          console.log(`[${idx}/${toProcess.length}] ❌ ${job.lang}/${job.gender}/${job.stepId}.mp3 — ${result.error}`);
        }
      }
      if (i + CONCURRENCY < toProcess.length) await sleep(200);
    }
  } catch (err) {
    if (err.name === 'StopError') {
      console.error(`\n🛑 BATCH STOPPED: ${err.message}`);
      console.log(`   Generated ${generated} files before stopping.`);
    } else {
      throw err;
    }
  }

  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  console.log('\n' + '═'.repeat(55));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(55));
  console.log(`   Generated:  ${generated}`);
  console.log(`   Skipped:    ${skipped}`);
  console.log(`   Failed:     ${failed}`);
  console.log(`   Time:       ${totalTime}s`);
  if (failures.length > 0) {
    console.log('\n   ❌ Failures:');
    for (const f of failures) console.log(`      - ${f.path}: ${f.error}`);
  }
  console.log('');
}

main();
