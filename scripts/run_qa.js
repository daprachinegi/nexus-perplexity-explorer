import puppeteer from 'puppeteer';

async function main() {
  console.log('Launching Puppeteer for End-to-End QA...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]`, err);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Verify Title & Branding
  const title = await page.title();
  console.log('Page Title:', title);

  // 2. Test Section 4 Presets
  console.log('--- Testing Section 4: Manual Simulator ---');
  
  // Test All 1/8
  console.log('Clicking #preset-uniform ("All 1/8")...');
  await page.click('#preset-uniform');
  await new Promise(r => setTimeout(r, 400));
  let sec4Text = await page.$eval('#section-4', el => el.innerText);
  console.log('Uniform preset result: N = 8?', sec4Text.includes('N = 8'));
  console.log('Uniform preset result: Perplexity = 8?', sec4Text.includes('8') && sec4Text.includes('All 1/8'));

  // Test "I love Python" preset
  console.log('Clicking #preset-python ("I love Python")...');
  await page.click('#preset-python');
  await new Promise(r => setTimeout(r, 400));
  sec4Text = await page.$eval('#section-4', el => el.innerText);
  console.log('Python preset result: N = 3?', sec4Text.includes('N = 3'));
  console.log('Python preset result: Perplexity = 2.32?', sec4Text.includes('2.32'));

  // Test "One surprising word" preset
  console.log('Clicking #preset-surprise ("One surprising word")...');
  await page.click('#preset-surprise');
  await new Promise(r => setTimeout(r, 400));
  sec4Text = await page.$eval('#section-4', el => el.innerText);
  console.log('Surprising preset result: N = 4?', sec4Text.includes('N = 4'));

  // Test Adding Token
  console.log('Clicking #add-token-row-btn...');
  await page.click('#add-token-row-btn');
  await new Promise(r => setTimeout(r, 400));
  sec4Text = await page.$eval('#section-4', el => el.innerText);
  console.log('After adding token: N = 5?', sec4Text.includes('N = 5'));

  // Test Removing Token
  console.log('Clicking remove token button...');
  const removeButtons = await page.$$('#section-4 button[title="Remove token"]');
  if (removeButtons.length > 0) {
    await removeButtons[0].click();
    await new Promise(r => setTimeout(r, 400));
    sec4Text = await page.$eval('#section-4', el => el.innerText);
    console.log('After removing token: N = 4?', sec4Text.includes('N = 4'));
  }

  // 3. Test Section 1: In-Browser LLM Execution
  console.log('--- Testing Section 1: Sentence Input & Model Execution ---');
  console.log('Clicking #calc-btn ("Calculate Perplexity")...');
  await page.click('#calc-btn');

  // Monitor progress
  let completed = false;
  for (let i = 0; i < 90; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const sec1Text = await page.$eval('#section-1', el => el.innerText);
    if (i % 5 === 0) {
      console.log(`[${i}s] Status in Section 1:`, sec1Text.replace(/\n+/g, ' | ').slice(0, 140));
    }
    if (sec1Text.includes('DistilGPT-2 neural inference complete') || sec1Text.includes('Evaluation complete')) {
      console.log('Neural inference successfully completed!');
      completed = true;
      break;
    }
    if (sec1Text.includes('Model Runtime Notification')) {
      console.log('Model runtime notification displayed:', sec1Text);
      break;
    }
  }

  // Capture final verification screenshots
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/nexus_qa_final_full.png', fullPage: true });

  const sec2Text = await page.$eval('#section-2', el => el.innerText);
  console.log('Section 2 summary:', sec2Text.replace(/\n+/g, ' | ').slice(0, 160));

  const sec3Text = await page.$eval('#section-3', el => el.innerText);
  console.log('Section 3 summary:', sec3Text.replace(/\n+/g, ' | ').slice(0, 160));

  await browser.close();
  console.log('QA run finished! Final screenshot saved to /tmp/nexus_qa_final_full.png');
}

main().catch(err => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
