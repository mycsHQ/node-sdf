# node-sdf

<!--[![Build Status](https://travis-ci.org/mycsHQ/node-sdf.svg?branch=master)](https://travis-ci.org/mycsHQ/node-sdf)
[![npm](https://img.shields.io/npm/v/node-sdf.svg)](https://www.npmjs.com/package/node-sdf)
[![Code Style](https://img.shields.io/badge/code%20style-eslint--mycs-brightgreen.svg)](https://github.com/mycsHQ/eslint-config-mycs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)-->

A node wrapper for Netsuite Suitescript Development Framework CLI.

## Installation

```bash
npm install # downloads and installs the sdfcli dependencies
```

> Add your netsuite credentials to config files if the generated `.sdf` files should be prefilled with your credentials

## Usage

### General use
The idea is to use the NetSuite sdfcli in a node environment and supplying a way of generating boilerplate code for SDF projects 

### Use `sdf` command globally
```bash
npm install -g && npm link # once
sdf [options]
```

### Use locally
```bash
./cli/sdf.js [options]
```

### Access Help Menus

```bash
# global
sdf -h

# local
./cli/sdf.js -h
```
___

Following args can be used when calling cli command

```javascript
{
    -p: 'path' // path to create project in,
    -P: 'password' // password of netsuite account,
}
```

## Implemented commands

### sdf create

Command line interface to create sdf project boilerplate

```bash
sdf create
```

### sdf <cmd>

Route commands to sdfcli

```bash
# eg listfiles
sdf listfiles folder=/SuiteScripts,url=system.eu1.netsuite.com,email=foo@bar.com,account=12345678,role=3
# arguments for sdfcli have to be specified as key value pairs (foo=bar will be translated to -foo bar for sdfcli)
```

As the commands are routed through to the original NetSuite sdfcli - the following commands are implemented.
> Please refer to the open [documentation](https://ursuscode.com/public/netsuitehelp/chapter_4779302061.html) for information about the commands and their required params

| Command | Description |
| --------| ----------- |
| [`adddependencies`](https://ursuscode.com/public/netsuitehelp/section_4702656306.html) | Adds missing dependencies to the manifest file. |
| [`deploy`](https://ursuscode.com/public/netsuitehelp/section_4788673412.html) | Deploys the folder or zip file that contains the SuiteCloud project. |
| [`importbundle`](https://ursuscode.com/public/netsuitehelp/section_4788674233.html) | Imports a customization bundle from your NetSuite account and converts it to an account customization project. |
| [`importfiles`](https://ursuscode.com/public/netsuitehelp/section_4788674259.html) | Imports files from your NetSuite account to the account customization project. |
| [`importobjects`](https://ursuscode.com/public/netsuitehelp/section_4788674268.html) | Imports custom objects from your NetSuite account to the SuiteCloud project. |
| [`listbundles`](https://ursuscode.com/public/netsuitehelp/section_4788674270.html) | Lists the customization bundles that were created in your NetSuite account. |
| [`listfiles`](https://ursuscode.com/public/netsuitehelp/section_4788674292.html) | Lists the files in the File Cabinet of your NetSuite account. |
| [`listmissingdependencies`](https://ursuscode.com/public/netsuitehelp/section_4788674281.html) | Lists the missing dependencies in the SuiteCloud project. |
| [`listobjects`](https://ursuscode.com/public/netsuitehelp/section_4788674302.html) | Lists the custom objects in your NetSuite account. |
| [`preview`](https://ursuscode.com/public/netsuitehelp/section_4788674313.html) | Previews the deployment steps of a folder or zip file that contains the SuiteCloud project. |
| [`project`](https://ursuscode.com/public/netsuitehelp/section_4788674324.html) | Sets the default project folder or zip file for CLI. |
| [`update`](https://ursuscode.com/public/netsuitehelp/section_4788674357.html) | Updates existing custom objects in the SuiteCloud project folder with the custom objects in your NetSuite account. |
| [`updatecustomrecordwithinstances`](https://ursuscode.com/public/netsuitehelp/section_4788674369.html) | Updates the custom record object and its instances in the SuiteCloud project. |
| [`validate`](https://ursuscode.com/public/netsuitehelp/section_4788674371.html) | Validates the folder or zip file that contains the SuiteCloud project. |


## Requirements
- NetSuite account [settings](https://ursuscode.com/public/netsuitehelp/section_1489072297.html) have to be updated for SDF
- This project needs node > 8.

## License
MIT
© mycs 2017

## Maintainer
[jroehl](https://github.com/jroehl "jroehl")

## TODO
- write tests
- documentation

## Whenever editing the repository
Should you update the readme, use npm script `semantic-release` to check if a new version has to be set and to publish it to npm.