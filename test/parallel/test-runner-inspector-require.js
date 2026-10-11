'use strict';

// Regression test for https://github.com/nodejs/node/issues/48467
// The inspector must be available to --require preloads in the
// `node --test` orchestrator process, as it is in the test child processes.

const common = require('../common');
common.skipIfInspectorDisabled();

const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fixtures = require('../common/fixtures');

const preload = fixtures.path('test-runner', 'inspector-require', 'open-inspector.js');
const testFile = fixtures.path('test-runner', 'inspector-require', 'test.js');

{
  const args = ['--require', preload, '--test', '--test-reporter=tap', testFile];
  const child = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.doesNotMatch(child.stderr, /initialized without a V8::Inspector/);
  assert.strictEqual(child.status, 0, child.stderr);
  assert.strictEqual(child.signal, null);
  const lines = child.stdout.split('\n');
  assert.strictEqual(
    lines.filter((l) => l === 'inspector opened in orchestrator: true').length,
    1);
  assert.match(child.stdout, /inspector opened in child: true/);
  assert.match(child.stdout, /# pass 1/);
}
