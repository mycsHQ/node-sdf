#!/usr/bin/env node

const program = require('commander');

program
  .version('0.1.0')
  .command('create', 'create new sdf project')
  .command('cmd <command> [options...]', 'call sdfcli commands');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('   CREATE');
  console.log('    $ sdf create -p ./projectDirectory');
  console.log('');
  console.log('   CMD');
  console.log('    $ sdf cmd validate p=project,email=foo@bar.com');
  console.log('');
});

program.parse(process.argv);
