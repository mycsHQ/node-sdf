#!/usr/bin/env node
const program = require('commander');

const createHandler = require('./sdf-create');
const cmdHandler = require('./sdf-cmd');

program
  .description('run setup commands for all envs')
  .option('-p, --path [value]', 'The path for the created project')
  .action(createHandler);

program
  .description('route through sdfcli commands to java cli')
  .option('-P, --password <value>', 'The path for the created project')
  .action(cmdHandler);

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('   CREATE');
  console.log('    $ sdf create');
  console.log('    $ sdf create -p ./projectDirectory');
  console.log('');
  console.log('   CMD');
  console.log('    $ sdf listfiles folder=/SuiteScripts,url=system.eu1.netsuite.com,email=devs@mycs.com,account=4030959_SB1,role=3');
  console.log('    $ sdf validate p=project,email=foo@bar.com -P password');
  console.log('');
});

program.parse(process.argv);
