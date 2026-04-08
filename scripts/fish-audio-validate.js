import 'dotenv/config';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

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

// ─── Test sentences (one per language, Inspecto domain vocabulary) ───
const TEST_SENTENCES = {
  fr: "Bonjour, je suis votre guide Inspecto. Je vais vous pr\u00e9senter notre plateforme de gestion qualit\u00e9 et vous montrer comment nous aidons les leaders industriels \u00e0 pr\u00e9venir les non-conformit\u00e9s.",
  en: "Hello, I'm your Inspecto guide. I'll walk you through our quality management platform and show you how we help industrial leaders prevent non-conformities.",
  es: "Hola, soy su gu\u00eda Inspecto. Le presentar\u00e9 nuestra plataforma de gesti\u00f3n de calidad y le mostrar\u00e9 c\u00f3mo ayudamos a los l\u00edderes industriales a prevenir las no conformidades.",
  it: "Salve, sono la sua guida Inspecto. Le presenter\u00f2 la nostra piattaforma di gestione della qualit\u00e0 e le mostrer\u00f2 come aiutiamo i leader industriali a prevenire le non conformit\u00e0.",
  de: "Guten Tag, ich bin Ihr Inspecto-Guide. Ich stelle Ihnen unsere Qualit\u00e4tsmanagement-Plattform vor und zeige Ihnen, wie wir Industrief\u00fchrer dabei unterst\u00fctzen, Nichtkonformit\u00e4ten zu vermeiden.",
};

const API_URL = 'https://api.fish.audio/v1/tts';
const OUTPUT_DIR = 'public/audio/_validation';
const MAX_RETRIES = 3;

/**
 * Generate a single TTS audio file via Fish Audio API.
 * Retries up to 3 times with exponential backoff.
 * @param {string} voiceKey - e.g. "fr_male"
 * @param {string} referenceId - Fish Audio voice reference ID
 * @param {string} text - Text to synthesize
 * @returns {Promise<{ok: boolean, size?: number, error?: string}>}
 */
async function generateVoice(voiceKey, referenceId, text) {
  const apiKey = process.env.FISH_AUDIO_API_KEY;

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
          text,
          reference_id: referenceId,
          format: 'mp3',
          mp3_bitrate: 128,
          sample_rate: 44100,
          normalize: true,
          latency: 'normal',
        }),
      });

      if (res.status === 401) {
        return { ok: false, error: '401 Unauthorized — check your FISH_AUDIO_API_KEY' };
      }
      if (res.status === 402) {
        return { ok: false, error: '402 Payment Required — insufficient Fish Audio credits' };
      }
      if (res.status === 429) {
        console.log(`   ⏳ Rate limited on ${voiceKey}, waiting 30s...`);
        await sleep(30000);
        continue;
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const outPath = `${OUTPUT_DIR}/${voiceKey}.mp3`;
      await writeFile(outPath, buffer);
      return { ok: true, size: buffer.length };

    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const wait = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`   ⚠️  Attempt ${attempt}/${MAX_RETRIES} failed for ${voiceKey}, retrying in ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        return { ok: false, error: err.message };
      }
    }
  }
  return { ok: false, error: 'Max retries exceeded' };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🎙️  Fish Audio TTS — Validation (10 voices)\n');

  // Check API key
  if (!process.env.FISH_AUDIO_API_KEY) {
    console.error('❌ FISH_AUDIO_API_KEY not found in .env — add it and retry.');
    process.exit(1);
  }

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created ${OUTPUT_DIR}/\n`);
  }

  const entries = Object.entries(VOICES);
  const results = [];

  for (const [voiceKey, refId] of entries) {
    const lang = voiceKey.split('_')[0];
    const text = TEST_SENTENCES[lang];
    process.stdout.write(`🔊 ${voiceKey.padEnd(12)} → `);

    const result = await generateVoice(voiceKey, refId, text);

    if (result.ok) {
      const kb = (result.size / 1024).toFixed(1);
      console.log(`✅ generated (${kb} KB)`);
    } else {
      console.log(`❌ failed: ${result.error}`);
    }

    results.push({ voice: voiceKey, ...result });

    // Rate limit pause (skip after last)
    if (voiceKey !== entries[entries.length - 1][0]) {
      await sleep(1000);
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────
  const success = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Results: ${success.length}/10 generated`);

  if (failed.length > 0) {
    console.log('\n❌ Failed voices:');
    for (const f of failed) {
      console.log(`   - ${f.voice}: ${f.error}`);
    }
  }

  console.log(`\n📂 Output: ${OUTPUT_DIR}/`);
  console.log('\n👉 Next: Listen to all 10 files and validate each voice.');
  console.log('   If a voice sounds bad, replace its reference_id in this script and re-run:');
  console.log('   npm run audio:validate\n');
}

main();
