#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
const { cliCommands } = require('./config');
const { required } = require('./lib/helpers');

const sdfcliPath = path.resolve(__dirname, '.dependencies', 'sdfcli');

/**
 * Handle the route cli command
 *
 * @param {string} cmd
 * @param {string|object} options
 */
function handler(cmd, password = required('password'), options) {
  return new Promise((resolve, reject) => {
    if (!cliCommands.includes(cmd)) throw new Error(`Command "${ cmd }" not available in sdf cli`);
    const args = Object.entries(options).reduce((red, [ flag, value = '' ]) => `${ red }-${ flag } ${ value } `, '');

    const sdfcli = spawn(sdfcliPath, [ cmd, args ]);

    console.log(`\nExecuted Command:\n${ sdfcliPath } ${ cmd } ${ args }\n`);

    // send password to hidden prompt by sdfcli
    sdfcli.stdin.write(`${ password }\n`);

    let res = '';
    sdfcli.stdout.on('data', data => {
      const msg = data.toString().replace('Enter password:', '');
      if (msg.includes('Type YES to continue.')) {
        sdfcli.stdin.write('YES\n');
      }
      res += msg;
    });

    sdfcli.stderr.on('data', data => {
      throw new Error(`>>> Error ${ data }`);
    });

    sdfcli.on('close', code => {
      if (code !== 0) {
        throw new Error(`>>> SDFCLI exited with code ${ code }`);
      }
      sdfcli.stdin.end();
      resolve(res);
    });
  });
}

module.exports = handler;
