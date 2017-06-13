#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const { spawn } = require('child_process');

const sdfcliPath = path.resolve(__dirname, '..', '.dependencies', 'sdfcli');

program
  .option('-p, --password <value>', 'The path for the created project')
  .action((command, options = '') => {
    let { password } = program;
    let args = '';
    try {
      args = options.split(',')
        .map(option => {
          const [ key, value ] = option.split('=');
          return `-${ key } ${ value }`;
        })
        .join(' ');
    } catch (ignored) { null; }

    co(function* () {
      if (!password) {
        password = yield prompt('Enter password: ');
        process.stdin.pause();
      }

      const sdfcli = spawn(sdfcliPath, [ command, args ], { stdio: [ 'pipe', process.stdout, process.stderr ] });

      // send password to hidden prompt by sdfcli
      sdfcli.stdin.write(`${ password }\n`);
    });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ sdf cmd validate p=project');
  console.log('');
});

program.parse(process.argv);
