const { spawnSync } = require('node:child_process');
const { mkdtempSync, readdirSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const build = mkdtempSync(path.join(tmpdir(), 'litspark-tests-'));
try {
  const compilation = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'),
    'lib/localStore.ts', 'lib/learningState.ts', '--module', 'commonjs', '--target', 'es2020',
    '--rootDir', '.', '--types', 'node', '--strict', '--skipLibCheck', '--outDir', build], { cwd: root, stdio: 'inherit' });
  if (compilation.status !== 0) process.exitCode = compilation.status || 1;
  else {
    const tests = readdirSync(path.join(root, 'tests')).filter(file => file.endsWith('.test.cjs')).map(file => path.join(root, 'tests', file));
    const result = spawnSync(process.execPath, ['--test', ...tests], { cwd: root, stdio: 'inherit', env: { ...process.env, LITSPARK_TEST_BUILD: path.join(build, 'lib') } });
    process.exitCode = result.status || (result.error ? 1 : 0);
  }
} finally { rmSync(build, { recursive: true, force: true }); }
