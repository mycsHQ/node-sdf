#!/usr/bin/env node
const path = require('path');
const { spawn, execSync } = require('child_process');
const { cliCommands } = require('./config');

const dependenciesPath = path.resolve(__dirname, '.dependencies');
const sdfcliPath = path.resolve(dependenciesPath, 'sdfcli');
const sdfcliCreateProjectPath = path.resolve(dependenciesPath, 'sdfcli-createproject');

/**
 * Throw error
 * @param {string} p
 * @throws {error} Parameter "*" is required!
 */
const required = p => {
  throw new Error(`Parameter "${ p }" is required!`);
};

/**
 * Handle the route cli command
 *
 * @param {string} cmd
 * @param {string|object} options
 * @returns {promise}
 */
const sdf = (cmd, password = required('password'), options = required('options')) => {
  return new Promise((resolve, reject) => {
    if (!Object.values(cliCommands).includes(cmd)) return reject(Error(`Command "${ cmd }" not available in sdf cli`));

    const args = Object.entries(options).reduce((red, [ flag, value = '' ]) => `${ red }-${ flag } ${ value } `, '');

    const sdfcli = spawn(sdfcliPath, [ cmd, args ]);

    const execCommand = `${ sdfcliPath } ${ cmd } ${ args }`;
    console.log(`\nExecuted Command:\n${ execCommand }\n`); // eslint-disable-line no-console

    // send password to hidden prompt by sdfcli
    sdfcli.stdin.write(`${ password }\n`);

    let res = '';
    sdfcli.stdout.on('data', data => {
      const msg = data.toString().replace('Enter password:', '');
      if (msg.includes('Type YES to continue.')) sdfcli.stdin.write('YES\n');
      res += msg;
    });

    let err = '';
    sdfcli.stderr.on('data', data => {
      err += data.toString();
    });

    sdfcli.on('close', code => {
      sdfcli.stdin.end();
      if (code !== 0 || err) return reject(new Error(`>>> Command\n> ${ execCommand }\n> exited with code ${ code }\n> ${ err }`));
      resolve({ cmd: execCommand, res });
    });
  });
};

/**
 * Create an sdf project
 * @param {string} type ('1' or '2')
 * @param {object} projectOptions
 * @throws {error} 'Project type has to be either "1" or "2"!'
 * @returns {object}
 */
const sdfCreateProject = (type, projectOptions = required('projectOptions')) => {
  const {
    name, path: cwd = './', id, publisherId
  } = projectOptions;

  let projectName;
  let projectType;
  let keys;
  switch (type) {
      case '1':
        keys = [ 'name' ];
        projectName = name;
        projectType = 'Account customisation project';
        break;
      case '2':
        keys = [ 'publisherId', 'id', 'name', 'version' ];
        projectName = `${ publisherId }.${ id }`;
        projectType = 'SuiteApp project';
        break;
      default:
        throw new Error('Project type has to be either "1" or "2"!');
  }

  const sequence = [ type, ...keys.map(key => projectOptions[key]) ];

  execSync(`cd ${ cwd } && echo "${ sequence.join('\n') }\n" | ${ sdfcliCreateProjectPath }`);
  const projectDir = execSync(`cd ${ cwd } && echo $(pwd)`)
    .toString()
    .replace('\n', '');

  return {
    type: projectType,
    dir: `${ projectDir }/${ projectName }`,
    name: projectName,
    values: keys.reduce((red, key) => ({ ...red, [key]: projectOptions[key] }), {})
  };
};

/**
 * Create an sdf Account customisation project
 * @param {string} name
 * @param {string} [path='.']
 * @returns {object}
 */
const sdfCreateAccountCustomisationProject = (name = required('name'), path = './') => {
  return sdfCreateProject('1', { name, path });
};

/**
 * Create an sdf SuiteApp project
 * @param {string} name
 * @param {string} id
 * @param {string} version
 * @param {string} publisherId
 * @param {string} [path='.']
 * @returns {object}
 */
function sdfCreateSuiteAppProject(
  name = required('name'),
  id = required('id'),
  version = required('version'),
  publisherId = required('publisherId'),
  path = './'
) {
  return sdfCreateProject('2', {
    name,
    path,
    id,
    version,
    publisherId
  });
}

module.exports = {
  sdf,
  sdfCreateAccountCustomisationProject,
  sdfCreateSuiteAppProject,
  sdfCreateProject,
  cliCommands,
  sdfcliPath,
  sdfcliCreateProjectPath
};
