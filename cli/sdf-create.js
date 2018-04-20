#!/usr/bin/env node
const path = require('path');

const { prompt } = require('../lib/helpers');
const { sdfCreateAccountCustomisationProject, sdfCreateSuiteAppProject } = require('../lib/methods');

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
  const projectName = await prompt('Enter a project name: ');

  switch (projectType) {
      case '1':
        return sdfCreateAccountCustomisationProject(projectName, projectPath);
      case '2':
        return sdfCreateSuiteAppProject(
          projectName,
          projectPath,
          await prompt('Enter your publisher ID: '),
          await prompt('Enter your project ID: '),
          await prompt('Enter your project version: ')
        );
      default:
        throw new Error('Project type has to be either 1 or 2!');
  }
}

module.exports = handler;
