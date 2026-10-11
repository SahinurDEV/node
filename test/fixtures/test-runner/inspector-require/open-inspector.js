'use strict';
// Simulates the bootloader that IDE debuggers inject with --require.
const inspector = require('node:inspector');
inspector.open(0, '127.0.0.1', false);
const role = process.env.NODE_TEST_CONTEXT ? 'child' : 'orchestrator';
console.log(`inspector opened in ${role}: ${inspector.url() !== undefined}`);
inspector.close();
