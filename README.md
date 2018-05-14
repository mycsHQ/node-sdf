# node-sdf

[![Build Status](https://travis-ci.org/mycsHQ/node-sdf.svg?branch=master)](https://travis-ci.org/mycsHQ/node-sdf)
[![npm](https://img.shields.io/npm/v/node-sdf.svg)](https://www.npmjs.com/package/node-sdf)
[![Code Style](https://img.shields.io/badge/code%20style-eslint--mycs-brightgreen.svg)](https://github.com/mycsHQ/eslint-config-mycs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a node wrapper for Netsuite Suitescript Development Framework CLI. It provides the necessary dependencies to run the `sdfcli` in an encapsulated manner (NO global JAVA installation required!).
Additionally a wrapper that can be used to create project structures and call sdf commands in a node script is provided through methods in `index.js`.

- [node-sdf](#node-sdf)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Methods node wrapper](#methods-node-wrapper)
            - [sdf](#sdf)
            - [sdfCreateAccountCustomizationProject](#sdfcreateaccountcustomizationproject)
            - [sdfCreateSuiteAppProject](#sdfcreatesuiteappproject)
        - [General use CLI](#general-use-cli)
            - [Install and use commands globally](#install-and-use-commands-globally)
            - [Use commands locally](#use-commands-locally)
            - [Commands](#commands)
    - [Requirements](#requirements)
    - [License](#license)
    - [Maintainer](#maintainer)
    - [Whenever editing the repository](#whenever-editing-the-repository)

## Installation

```bash
npm install # downloads and installs the sdfcli dependencies
```

## Usage

### Methods node wrapper
Following methods can be called and used for use of the `sdfcli` in a node script.

#### sdf
> Please refer to the official NetSuite documentation for information about the commands and their required params
The `sdf` method can be used to directly call `sdfcli` commands:

```javascript
sdf('cmd', 'password', { path: 'path' }) // timeout in ms can be specified as last param (stalls hanging processes after 10s by default)
    .then(res => console.log(res))
    .catch(err => console.error(err));
```

#### sdfCreateAccountCustomizationProject
The `sdfCreateAccountCustomizationProject` creates the `sdf` boilerplate for an ACCOUNTCUSTOMIZATION in the specified directory:

```javascript
const res = sdfCreateAccountCustomizationProject('NAME', 'PATH');
/**
  *  {
  *      type: 'ACCOUNTCUSTOMIZATION',
  *      dir: '/absolutepath/PATH/NAME',
  *      name: 'NAME',
  *      values: { name: 'NAME' }
  *  }
  */
```

#### sdfCreateSuiteAppProject
The `sdfCreateSuiteAppProject` creates the `sdf` boilerplate for a SUITEAPP in the specified directory:

```javascript
const res = sdfCreateSuiteAppProject('NAME', 'ID', 'VERSION', 'PUBLISHERID', 'PATH');
/**
  *  {
  *      type: 'SUITEAPP',
  *      dir: '/absolutepath/PATH/PUBLISHERID.ID',
  *      name: 'PUBLISHERID.ID',
  *      values: {
  *         publisherId: 'PUBLISHERID',
  *         id: 'ID',
  *         name: 'NAME',
  *         version: 'VERSION'
  *     }
  *  }
  */
```


### General use CLI
The idea is to use the NetSuite sdfcli in a node environment and provide a way to generate boilerplate code for SDF projects 

#### Install and use commands globally
```bash
npm install -g
sdfcli [options]
sdfcli-createproject [options]
```

#### Use commands locally
```bash
./sdfcli [options]
./sdfcli-createproject [options]
```

#### Commands
As the commands are routed through to the original NetSuite sdfcli - the following commands are implemented.
> Please refer to the official NetSuite documentation for information about the commands and their required params

| Command                                                                                                | Description                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `adddependencies`                                                                                      | Adds missing dependencies to the manifet file.                                                                     |
| `deploy`                                                                                               | Deploys the folder or zip file that contains the SuiteCloud project.                                               |
| `importbundle`                                                                                         | Imports a customization bundle from your NetSuite account and converts it to an ACCOUNTCUSTOMIZATION.     |
| `importfiles`                                                                                          | Imports files from your NetSuite account to the ACCOUNTCUSTOMIZATION.                                     |
| `importobjects`                                                                                        | Imports custom objects from your NetSuite account to the SuiteCloud project.                                       |
| `listbundles`                                                                                          | Lists the customization bundles that were created in your NetSuite account.                                        |
| `listfiles`                                                                                            | Lists the files in the File Cabinet of your NetSuite account.                                                      |
| `listmissingdependencies`                                                                              | Lists the missing dependencies in the SuiteCloud project.                                                          |
| `listobjects`                                                                                          | Lists the custom objects in your NetSuite account.                                                                 |
| `preview`                                                                                              | Previews the deployment steps of a folder or zip file that contains the SuiteCloud project.                        |
| `project`                                                                                              | Sets the default project folder or zip file for CLI.                                                               |
| `update`                                                                                               | Updates existing custom objects in the SuiteCloud project folder with the custom objects in your NetSuite account. |
| `updatecustomrecordwithinstances`                                                                      | Updates the custom record object and its instances in the SuiteCloud project.                                      |
| `validate`                                                                                             | Validates the folder or zip file that contains the SuiteCloud project.                                             |


## Requirements
- NetSuite account settings have to be updated for SDF
- This project needs node > 8.

## License
MIT
© mycs 2017

## Maintainer
[jroehl](https://github.com/jroehl "jroehl")

## Whenever editing the repository
Should you update the readme, use npm script `semantic-release` to check if a new version has to be set and to publish it to npm.