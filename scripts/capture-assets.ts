import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function capture() {
  const publicDir = path.join(process.cwd(), 'public', 'landing');
  const videoDir = path.join(publicDir, 'videos');
  const imageDir = path.join(publicDir, 'images');
  const stateFile = path.join(process.cwd(), 'scripts', 'state.json');

  // Ensure directories exist
  [videoDir, imageDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const baseUrl = 'http://localhost:3000';
  const browser = await chromium.launch({ headless: true });

  try {
    // Stage 1: Login and save state (No video)
    console.log('🔐 Stage 1: Logging in to save state...');
    const loginContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const loginPage = await loginContext.newPage();
    await loginPage.goto(`${baseUrl}/login`);
    await loginPage.fill('input[id="email"]', 'saurabh@gmail.com');
    await loginPage.fill('input[id="password"]', 'test@123');
    await loginPage.click('button[type="submit"]');
    await loginPage.waitForTimeout(6000); // Wait for redirect
    await loginContext.storageState({ path: stateFile });
    await loginContext.close();
    console.log('✅ State saved.');

    // Stage 2: Capture Screenshots and Video (With authenticated state)
    console.log(
      '🚀 Stage 2: Starting capture process (Full HD, Dashboards Only)...'
    );
    const captureContext = await browser.newContext({
      storageState: stateFile,
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: videoDir,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await captureContext.newPage();

    const assets = [
      { name: 'dashboard-main.png', url: '/dashboard' },
      { name: 'kanban-board.png', url: '/dashboard/kanban' },
      { name: 'habit-tracker.png', url: '/dashboard/habits' },
      { name: 'pomodoro-timer.png', url: '/dashboard/pomodoro' },
      { name: 'journal-entries.png', url: '/dashboard/journal' },
      { name: 'calendar-schedule.png', url: '/dashboard/schedule' },
    ];

    // 1. Capture Screenshots
    for (const asset of assets) {
      console.log(`📸 Capturing screenshot: ${asset.name}...`);
      await page.goto(`${baseUrl}${asset.url}`);
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(imageDir, asset.name) });
    }

    // 2. Perform Walkthrough for Video
    console.log('🎬 Running dashboard walkthrough for video...');
    for (const asset of assets) {
      console.log(`📹 Recording view: ${asset.url}...`);
      await page.goto(`${baseUrl}${asset.url}`);
      await page.waitForTimeout(3000);
    }

    console.log('🏁 Closing capture context...');
    await captureContext.close();

    // Rename the recorded video
    const videoFile = await page.video()?.path();
    if (videoFile && fs.existsSync(videoFile)) {
      const finalVideoPath = path.join(videoDir, 'demo-walkthrough.webm');
      fs.renameSync(videoFile, finalVideoPath);
      console.log(`✅ Video saved as: ${finalVideoPath}`);
    }

    // Cleanup state file
    if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);
  } catch (error) {
    console.error('❌ Capture failed:', error);
  } finally {
    await browser.close();
    console.log('✨ Done!');
  }
}

capture().catch(console.error);
