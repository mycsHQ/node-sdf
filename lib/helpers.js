const readline = require('readline');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { templates } = require('../config');

/**
 * Make path in a recursive manner, creating all directories along the path
 *
 * @param {string} pathToCreate
 */
const mkdirRecursive = pathToCreate => {
  // Path separators could change depending on the platform
  pathToCreate.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
    return currentPath;
  }, '');
};

/**
 * Promisify prompt
 * @param {string} query
 * @returns {promise} user input
 */
const prompt = (query = required('query')) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(query, answer => {
      if (!answer) return reject('please enter value');
      resolve(answer);
      rl.close();
    });
  });
};

/**
 * Throw error
 * @param {string} p
 * @throws {error} Parameter "*" is required!
 */
const required = p => {
  throw new Error(`Parameter "${ p }" is required!`);
};

/**
 * Create an sdf project
 * @param {string} type ('1' or '2')
 * @param {object} projectOptions
 * @param {object} credentials
 */
const sdfCreateProject = (type, { name, path: pPath, id, version, publisherId }, { account = '', email = '', role = '', url = '' } = {}) => {
  const manifest = { ...templates.manifest };
  const deploy = { ...templates.deploy };
  manifest.manifest.projectname = name;

  let customName = name;
  let structure;
  switch (type) {
      case '1':
        structure = '/FileCabinet/SuiteScripts';

        manifest.manifest.$.projecttype = 'ACCOUNTCUSTOMIZATION';
        structure = [ 'FileCabinet', 'SuiteScripts' ];
        break;
      case '2':
        customName = `${ publisherId }.${ id }`;
        structure = `/FileCabinet/SuiteApps/${ customName }`;

        manifest.manifest.$.projecttype = 'SUITEAPP';
        manifest.manifest.publisherid = publisherId;
        manifest.manifest.projectid = id;
        manifest.manifest.projectversion = version;

        break;
      default:
        throw new Error('Project type has to be either 1 or 2!');
  }

  deploy.deploy.files.path = `~${ structure }/*`;

  const fileBasePath = path.resolve(newProjectPath, structure.split('/'));
  const newProjectPath = path.resolve(pPath, customName);
  mkdirRecursive(path.resolve(fileBasePath, '.attributes'));
  mkdirRecursive(path.resolve(newProjectPath, 'Objects'));

  // create .sdf file
  const sdfString = `account=${ account }\nemail=${ email }\nrole=${ role }\nurl=${ url }`;
  fs.writeFileSync(path.resolve(newProjectPath, '.sdf'), sdfString);

  const builder = new xml2js.Builder({ headless: true });
  // create deploy.xml file
  const deployXml = builder.buildObject(deploy);
  fs.writeFileSync(path.resolve(newProjectPath, 'deploy.xml'), deployXml);
  // create deploy.xml file
  const manifestXml = builder.buildObject(manifest);
  fs.writeFileSync(path.resolve(newProjectPath, 'manifest.xml'), manifestXml);

  return { newProjectPath, fileBasePath, ...manifest.manifest.$ };
};

module.exports = {
  prompt,
  required,
  mkdirRecursive,
  sdfCreateProject
};
