#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');

const { prompt } = require('../lib/helpers');

const sdfcliPath = path.resolve(__dirname, '..', '.dependencies', 'sdfcli');

/**
 * Handle the route cli command
 *
 * @param {string} cmd
 * @param {string|object} params
 * @param {string|object} options
 */
async function handler(cmd, params, options) {
  if (cmd === 'create') return;
  let { password } = typeof params === 'string' ? options : params;

  const args = typeof params === 'string' ?
    params.split(',')
      .map(option => {
        const [ key, value ] = option.split('=');
        return `-${ key } ${ value }`;
      })
      .join(' ')
    : '';

  if (!password) {
    password = await prompt('Enter password: ');
    process.stdin.pause();
  }

  const sdfcli = spawn(sdfcliPath, [ cmd, args ], { stdio: [ 'pipe', process.stdout, process.stderr ] });

  // send password to hidden prompt by sdfcli
  sdfcli.stdin.write(`${ password }\n`);
}

module.exports = handler;
