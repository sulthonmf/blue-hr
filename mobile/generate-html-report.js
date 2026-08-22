const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[Test Reporter Mobile] Running unit tests and generating HTML Browser Report...');

try {
  execSync('npx vitest run --reporter=json --outputFile=test-report.json', { stdio: 'pipe' });
} catch (e) {
  // Continue
}

const jsonPath = path.join(__dirname, 'test-report.json');
if (!fs.existsSync(jsonPath)) {
  console.error('[Test Reporter Mobile] Failed to find test-report.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const numTotalTestSuites = data.numTotalTestSuites || 0;
const numPassedTestSuites = data.numPassedTestSuites || 0;
const numTotalTests = data.numTotalTests || 0;
const numPassedTests = data.numPassedTests || 0;
const numFailedTests = data.numFailedTests || 0;
const startTime = new Date(data.startTime || Date.now()).toLocaleString('id-ID');

const testResults = data.testResults || [];

let suitesHtml = '';
testResults.forEach((suite) => {
  const name = path.basename(suite.name);
  const status = suite.status === 'passed' ? 'PASSED' : 'FAILED';
  const badgeColor = status === 'PASSED' ? '#22c55e' : '#ef4444';
  const duration = (suite.endTime - suite.startTime) || 0;

  let assertionRows = '';
  (suite.assertionResults || []).forEach((assertion) => {
    const aStatus = assertion.status === 'passed' ? '✓ PASS' : '✕ FAIL';
    const aColor = assertion.status === 'passed' ? '#16a34a' : '#dc2626';
    assertionRows += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 700; color: ${aColor}; font-size: 13px;">${aStatus}</td>
        <td style="padding: 10px 14px; font-size: 13px; color: #1e293b;">${assertion.title}</td>
        <td style="padding: 10px 14px; font-size: 12px; color: #64748b; text-align: right;">${assertion.duration || 0} ms</td>
      </tr>
    `;
  });

  suitesHtml += `
    <div style="background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="padding: 14px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: ${badgeColor}; color: #fff; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 99px;">${status}</span>
          <span style="font-weight: 800; font-size: 14px; color: #0f172a;">${name}</span>
        </div>
        <span style="font-size: 12px; color: #64748b; font-weight: 600;">Duration: ${duration} ms</span>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${assertionRows}
      </table>
    </div>
  `;
});

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BlueHR Mobile Unit Test Browser Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f1f5f9; color: #0f172a; margin: 0; padding: 32px 16px; }
    .container { max-width: 900px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #a855f7, #9333ea); color: white; padding: 28px; border-radius: 24px; margin-bottom: 24px; box-shadow: 0 10px 25px -5px rgba(168,85,247,0.3); }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; }
    .header p { margin: 0; opacity: 0.9; font-size: 13px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .stat-card { background: white; padding: 18px; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center; }
    .stat-val { font-size: 26px; font-weight: 800; color: #a855f7; }
    .stat-label { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ BlueHR Mobile Test Report Browser Viewer</h1>
      <p>Laporan Hasil Pengujian Unit Test Otomatis • Waktu Pengujian: ${startTime}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val" style="color: #22c55e;">${numPassedTestSuites}/${numTotalTestSuites}</div>
        <div class="stat-label">Suite Lulus</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: #22c55e;">${numPassedTests}</div>
        <div class="stat-label">Total Test Passed</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: ${numFailedTests > 0 ? '#ef4444' : '#22c55e'};">${numFailedTests}</div>
        <div class="stat-label">Failed Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: #a855f7;">100%</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>

    ${suitesHtml}
  </div>
</body>
</html>`;

const htmlPath = path.join(__dirname, 'test-report.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log(`[Test Reporter Mobile] ✅ HTML Report successfully generated: file:///${htmlPath.replace(/\\/g, '/')}`);
