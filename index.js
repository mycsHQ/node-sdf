#!/usr/bin/env node
const path = require('path');
const { spawn, execSync } = require('child_process');
const rimraf = require('rimraf');
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
 * @param {number} [timeout=10000]
 * @returns {promise}
 */
const sdf = (cmd, password = required('password'), options = required('options'), timeout = 10000) => {
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
      sdfcli.stdin.write('YES\n');
      res += data.toString();
    });

    let err = '';
    sdfcli.stderr.on('data', data => {
      err += data.toString();
    });

    const timer = setTimeout(() => {
      sdfcli.stdin.end();
      console.error('>>> Output'); // eslint-disable-line no-console
      console.error(res); // eslint-disable-line no-console
      console.error('>>> Error'); // eslint-disable-line no-console
      console.dir(err, { depth: null, colors: true }); // eslint-disable-line no-console
      reject(new Error(`Connection timed out after ${ 5000 / 1000 }s`));
    }, timeout);

    sdfcli.on('close', code => {
      clearTimeout(timer);
      sdfcli.stdin.end();
      if (code !== 0 || err) return reject(new Error(`\n> ${ execCommand }\n> exited with code ${ code }\n> ${ err }`));
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
  let fileBaseSuffix;
  let keys;
  switch (type) {
      case '1':
        keys = [ 'name' ];
        fileBaseSuffix = '/FileCabinet/SuiteScripts';
        projectName = name;
        projectType = 'ACCOUNTCUSTOMIZATION';
        break;
      case '2':
        keys = [ 'publisherId', 'id', 'name', 'version' ];
        fileBaseSuffix = '/FileCabinet/SuiteApps';
        projectName = `${ publisherId }.${ id }`;
        projectType = 'SUITEAPP';
        break;
      default:
        throw new Error('Project type has to be either "1" or "2"!');
  }

  rimraf(path.normalize(`${ cwd }/${ projectName }`));

  const sequence = [ type, ...keys.map(key => projectOptions[key]) ];

  execSync(`cd ${ cwd } && echo "${ sequence.join('\n') }\n" | ${ sdfcliCreateProjectPath }`);
  const projectDir = execSync(`cd ${ cwd } && echo $(pwd)`)
    .toString()
    .replace('\n', '');

  const dir = `${ projectDir }/${ projectName }`;

  return {
    type: projectType,
    dir,
    filebase: `${ dir }${ fileBaseSuffix }`,
    name: projectName,
    values: keys.reduce((red, key) => ({ ...red, [key]: projectOptions[key] }), {})
  };
};

/**
 * Create an sdf account customization project
 * @param {string} name
 * @param {string} [path='.']
 * @returns {object}
 */
const sdfCreateAccountCustomizationProject = (name = required('name'), path = './') => {
  return sdfCreateProject('1', { name, path });
};

/**
 * Create an sdf suite app project
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
  sdfCreateAccountCustomizationProject,
  sdfCreateSuiteAppProject,
  sdfCreateProject,
  cliCommands,
  sdfcliPath,
  sdfcliCreateProjectPath
};
