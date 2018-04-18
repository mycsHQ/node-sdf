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
async function handler(cmd, password = required('password'), options) {
  if (!cliCommands.includes(cmd)) throw new Error(`Command "${ cmd }" not available in sdf cli`);
  const args = options.entries(options).reduce((red, [ flag, value = '' ]) => `${ red }-${ flag } ${ value } `, '');

  const sdfcli = spawn(sdfcliPath, [ cmd, args ]);

  console.log(`\nExecuted Command:\n${ sdfcliPath } ${ cmd } ${ args }\n`);

  // send password to hidden prompt by sdfcli
  sdfcli.stdin.write(`${ password }\n`);

  sdfcli.stdout.on('data', async data => {
    const msg = data.toString();
    // cleanup of duplicate "Enter password:" prompt
    console.log(msg.replace('Enter password:', ''));
    const lowerCaseMsg = msg.toLowerCase();
    if (lowerCaseMsg.includes('?') || lowerCaseMsg.includes('Enter')) {
      throw new Error('Only commands without prompts allowed!');
    }
  });

  sdfcli.stderr.on('data', data => {
    throw new Error(`>>> Error ${ data }`);
  });

  sdfcli.on('close', code => {
    if (code !== 0) {
      throw new Error(`>>> SDFCLI exited with code ${ code }`);
    }
    sdfcli.stdin.end();
  });
}

module.exports = handler;
