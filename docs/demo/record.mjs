// Records the demo video: the real app, driven by Playwright with fictional data, on a desktop and on
// a phone at the same time. Everything happens in the browser, so there is no API to mock.
// See README.md in this folder.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '../..');
const ASSETS = join(ROOT, 'docs/assets');
// A port of our own, so a dev server you already have running is left alone.
const PORT = 5190;
const ORIGIN = `http://127.0.0.1:${String(PORT)}`;
const APP_URL = `${ORIGIN}/whatsapp-link-generator/`;

// Fictional data only: no real phone number on screen.
const PHONE = '(11) 90000-0000';
const MESSAGE = 'Olá! Vi a promoção no status da Ana e quero ser atendido por ela.';

// Just above the two-column breakpoint (56rem), so the phone keeps a fair share of the final video.
const DESKTOP_VIEWPORT = { width: 960, height: 812 };
const PHONE_VIEWPORT = { width: 375, height: 812 };
// The first moments only show the pages loading.
const TRIM_START_S = 1;
// --color-bg of the app in dark mode, so the gap between the screens blends in.
const BACKGROUND = '#0f172a';

await main();

async function main() {
  const devServer = await startDevServer();
  const workDir = mkdtempSync(join(tmpdir(), 'whatsapp-link-demo-'));
  try {
    const raw = await record(workDir);
    encode(raw);
  } finally {
    devServer.kill();
    rmSync(workDir, { recursive: true, force: true });
  }
}

async function startDevServer() {
  const server = spawn(
    'npx',
    ['vite', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: 'ignore' },
  );
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(APP_URL)).ok) return server;
    } catch {
      // Not up yet.
    }
    await sleep(500);
  }
  server.kill();
  throw new Error(`The dev server did not start at ${APP_URL}.`);
}

async function record(workDir) {
  const browser = await chromium.launch();
  const startedAt = Date.now();

  const newPage = async (name, viewport, extra = {}) => {
    const context = await browser.newContext({
      viewport,
      colorScheme: 'dark',
      locale: 'pt-BR',
      recordVideo: { dir: join(workDir, name), size: viewport },
      ...extra,
    });
    // "Copiar link" uses the real clipboard, so the "Copiado!" feedback shows up as it does for users.
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: ORIGIN });
    return context.newPage();
  };

  const desktopPage = await newPage('desktop', DESKTOP_VIEWPORT);
  const phonePage = await newPage('phone', PHONE_VIEWPORT, { isMobile: true, hasTouch: true });

  await Promise.all([desktopPage.goto(APP_URL), phonePage.goto(APP_URL)]);
  // The same steps on both screens, at the same time: one layout next to the other.
  await Promise.all([playScene(desktopPage), playScene(phonePage)]);
  const durationS = (Date.now() - startedAt) / 1000 - TRIM_START_S;

  const videos = { desktop: desktopPage.video(), phone: phonePage.video() };
  // Closing each context first lets Playwright finish writing its video.
  await Promise.all([desktopPage.context().close(), phonePage.context().close()]);
  await browser.close();
  return {
    durationS,
    desktop: await videos.desktop.path(),
    phone: await videos.phone.path(),
  };
}

async function playScene(page) {
  const phone = page.getByLabel('Número do WhatsApp');
  await phone.waitFor();
  await sleep(1800);
  await phone.click();
  await phone.pressSequentially(PHONE, { delay: 110 });
  await sleep(400);

  const message = page.getByLabel('Mensagem pronta');
  await message.click();
  await message.pressSequentially(MESSAGE, { delay: 45 });
  await sleep(700);
  await page.getByRole('button', { name: 'Gerar link' }).click();

  // The app scrolls to the result when it is not fully visible: the summary and the QR code.
  await page.getByRole('img', { name: /QR code/i }).waitFor();
  await sleep(2600);

  const copy = page.getByRole('button', { name: 'Copiar link' });
  await scrollIntoViewSmoothly(copy);
  await copy.click();
  await page.getByRole('button', { name: 'Copiado!' }).waitFor();
  await sleep(1600);
}

// Locator.click() jumps straight to an element out of view; a smooth scroll first keeps the video
// easy to follow. On the desktop the button is already visible, so the screen stays still. Both
// screens wait the same time, so they stay in step until the end.
async function scrollIntoViewSmoothly(locator) {
  await locator.evaluate((element) => {
    const { top, bottom } = element.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await sleep(800);
}

// WebM from Playwright -> one MP4 per screen, one with both side by side, a poster for each and the
// GIF for the README.
function encode(raw) {
  const timing = ['-ss', String(TRIM_START_S), '-t', raw.durationS.toFixed(2)];
  const asset = (name) => join(ASSETS, name);

  toMp4([...timing, '-i', raw.desktop], 'fps=30', asset('demo-desktop.mp4'));
  toMp4([...timing, '-i', raw.phone], 'fps=30', asset('demo-celular.mp4'));
  // Both screens with a gap between them, in the same height.
  toMp4(
    ['-i', asset('demo-desktop.mp4'), '-i', asset('demo-celular.mp4')],
    `[0:v]pad=iw+24:ih:0:0:color=${BACKGROUND}[desktop];[desktop][1:v]hstack=inputs=2`,
    asset('demo.mp4'),
  );
  for (const view of ['demo-desktop', 'demo-celular', 'demo']) {
    poster(asset(`${view}.mp4`), asset(`${view}.jpg`));
  }

  // Smaller and with fewer colors than the MP4, so it stays light in the README.
  ffmpeg([
    '-i',
    asset('demo.mp4'),
    '-filter_complex',
    'fps=8,scale=900:-1:flags=lanczos,split[a][b];' +
      '[a]palettegen=max_colors=128:stats_mode=diff[palette];' +
      '[b][palette]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle',
    '-loop',
    '0',
    asset('demo.gif'),
  ]);
  console.log(`Done: ${ASSETS}/demo.mp4, demo-desktop.mp4, demo-celular.mp4, demo*.jpg, demo.gif`);
}

// H.264 without audio, with the index at the start so the browser plays it before it fully loads.
function toMp4(inputs, filter, output) {
  ffmpeg([
    ...inputs,
    '-an',
    '-filter_complex',
    `${filter},format=yuv420p`,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '24',
    '-movflags',
    '+faststart',
    output,
  ]);
}

// The last moments: the result with the QR code and the "Copiado!" feedback.
function poster(mp4, output) {
  ffmpeg(['-sseof', '-0.5', '-i', mp4, '-frames:v', '1', '-q:v', '3', output]);
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
}
