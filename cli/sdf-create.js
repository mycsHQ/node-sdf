#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const { prompt } = require('../lib/helpers');

const {
  netsuite: { account = '', email = '', url = '', role = 3 }
} = require('../config');

/**
 * Replace all occurences of placeholders in template specified as key/value pairs
 *
 * @param {object} replaceOptions object with keys to be replaced in template
 * @param {string} templatePath path to template
 *
 * @returns {string} modified template content
 */
const processTemplate = (replaceOptions, templatePath) => {
  const template = fs.readFileSync(path.join(__dirname, templatePath)).toString();
  return Object.entries(replaceOptions).reduce((tmp, [ key, value ]) => tmp.replace(new RegExp(`@@${ key.toUpperCase() }`, 'g'), value), template);
};

/**
 * Make path in a recursive manner, creating all directories along the path
 *
 * @param {string} pathToCreate
 */
const mkdirRecursive = pathToCreate => {
  // Path separators could change depending on the platform
  pathToCreate.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
    return currentPath;
  }, '');
};

/**
 * Handle the create cli command
 *
 * @param {string} cmd
 * @param {object} options
 */
async function handler(cmd, { path: projectPath }) {
  if (cmd !== 'create') return;
  projectPath = path.resolve(process.cwd(), projectPath || '');

  console.log(`
  This script creates a new SuiteCloud project in the specified folder.
  Make sure that you have read/write access to that folder.

  Select Project Type
  ======================
  1. Account customization project
  2. SuiteApp project
  `);

  const projectType = await prompt('Type 1 or 2 then press ENTER: ');

  let publisherId;
  let projectId;
  let projectVersion;
  let projectName;

  if (projectType === '1') {
    projectName = await prompt('Enter a project name: ');
  } else if (projectType === '2') {
    publisherId = await prompt('Enter your publisher ID: ');
    projectId = await prompt('Enter your project ID: ');
    projectName = await prompt('Enter your project name: ');
    projectVersion = await prompt('Enter your project version: ');
  } else {
    console.error('Project type has to be either 1 or 2!');
    process.exit(1);
  }

  let newProjectPath;
  let customName;
  if (projectType === '1') {
    newProjectPath = path.resolve(projectPath, projectName);
    mkdirRecursive(path.resolve(newProjectPath, 'FileCabinet', 'SuiteScripts', '.attributes'));
  } else {
    customName = `${ publisherId }.${ projectId }`;
    newProjectPath = path.resolve(projectPath, customName);
    mkdirRecursive(path.resolve(newProjectPath, 'SuiteApps', customName, '.attributes'));
  }

  mkdirRecursive(path.resolve(newProjectPath, 'Objects'));
  fs.writeFileSync(path.resolve(newProjectPath, '.sdf'), `account=${ account }\nemail=${ email }\nrole=${ role }\nurl=${ url }`);

  const replaceDeploy = {
    path: projectType === '1' ? '~/FileCabinet/SuiteScripts/*' : `~/FileCabinet/SuiteApps/${ customName }/*`
  };
  const deployTemplate = processTemplate(replaceDeploy, './templates/deploy.xml');
  fs.writeFileSync(path.resolve(newProjectPath, 'deploy.xml'), deployTemplate);

  const replaceManifest = {
    projectName: `<projectname>${ projectName }</projectname>`,
    projectType: projectType === '1' ? 'ACCOUNTCUSTOMIZATION' : 'SUITEAPP',
    publisherId: projectType === '2' ? `<publisherid>${ publisherId }</publisherid>` : '',
    projectId: projectType === '2' ? `<projectid>${ projectId }</projectid>` : '',
    projectVersion: projectType === '2' ? `<projectversion>${ projectVersion }</projectversion>` : ''
  };
  const manifestTemplate = processTemplate(replaceManifest, './templates/manifest.xml');
  fs.writeFileSync(path.resolve(newProjectPath, 'manifest.xml'), manifestTemplate);

  console.log(`
  End of script.
  Edit the .sdf file in the new project folder to complete the process
  In the .sdf file, specify your account ID, login, and account URL.
  `);
}

module.exports = handler;
