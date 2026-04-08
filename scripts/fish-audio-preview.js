import 'dotenv/config';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

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

// Short preview sentences — what the user hears when clicking the play button
const PREVIEW_SENTENCES = {
  fr: "Bonjour, je suis votre guide Inspecto. Je vous accompagne dans cette d\u00e9monstration.",
  en: "Hello, I'm your Inspecto guide. I'll walk you through this demonstration.",
  es: "Hola, soy su gu\u00eda Inspecto. Le acompa\u00f1ar\u00e9 en esta demostraci\u00f3n.",
  it: "Salve, sono la sua guida Inspecto. La accompagner\u00f2 in questa dimostrazione.",
  de: "Guten Tag, ich bin Ihr Inspecto-Guide. Ich begleite Sie durch diese Demonstration.",
};

const API_URL = 'https://api.fish.audio/v1/tts';
const OUTPUT_DIR = 'public/audio/preview';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generate(voiceKey, refId, text) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
      'Content-Type': 'application/json',
      'model': 's2-pro',
    },
    body: JSON.stringify({
      text, reference_id: refId,
      format: 'mp3', mp3_bitrate: 128, sample_rate: 44100,
      normalize: true, latency: 'normal',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log('\n\uD83C\uDFA4 Generating voice preview files...\n');

  if (!process.env.FISH_AUDIO_API_KEY) {
    console.error('\u274C FISH_AUDIO_API_KEY not found in .env');
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const langs = Object.keys(PREVIEW_SENTENCES);
  const genders = ['male', 'female'];
  let generated = 0;

  for (const lang of langs) {
    for (const gender of genders) {
      const genderCode = gender === 'male' ? 'm' : 'f';
      const filename = `preview_${lang}_${genderCode}.mp3`;
      const outPath = `${OUTPUT_DIR}/${filename}`;

      // Check if already exists
      if (existsSync(outPath)) {
        console.log(`\u23ED\uFE0F  ${filename} — already exists, skipping`);
        continue;
      }

      const voiceKey = `${lang}_${gender}`;
      process.stdout.write(`\uD83D\uDD0A ${filename} \u2192 `);

      try {
        const buf = await generate(voiceKey, VOICES[voiceKey], PREVIEW_SENTENCES[lang]);
        await writeFile(outPath, buf);
        const kb = (buf.length / 1024).toFixed(1);
        console.log(`\u2705 (${kb} KB)`);
        generated++;
      } catch (err) {
        console.log(`\u274C ${err.message}`);
      }

      await sleep(1000);
    }
  }

  console.log(`\n\u2705 Done — ${generated} new preview files generated in ${OUTPUT_DIR}/\n`);
}

main();
