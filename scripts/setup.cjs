const { spawnSync } = require('node:child_process');
const path = require('node:path');
const requirements = require('../requirements.json');
const root = path.resolve(__dirname, '..');
const major = Number(process.versions.node.split('.')[0]);
if (major !== requirements.nodeMajor) {
  console.error(`Use Node.js ${requirements.nodeMajor} for this project. Download: ${requirements.tools[0].download}`);
  process.exit(1);
}
console.log('Installing project requirements from package.json and package-lock.json...');
// npm supplies its CLI path when running this script via npm run setup.
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error('Run this installer with: npm run setup');
  process.exit(1);
}
const result = spawnSync(process.execPath, [npmCli, 'ci'], { cwd: root, stdio: 'inherit' });
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status || 1);
console.log('Ready! Run npm start. For the iPhone simulator, install Xcode and an iOS runtime separately on macOS.');
