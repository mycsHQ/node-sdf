const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const zlib = require('zlib');
const { URL } = require('url');
const { execSync } = require('child_process');

const tar = require('tar-fs');
const glob = require('glob');

const { dependencies: { javaClass, supplemental, maven } } = require('../config');

const protocols = { https, http };

/**
 *
 * @param {string} url
 * @param {string} filePath
 */
const downloadFile = (url, filePath) =>
  new Promise((resolve, reject) => {
    const { protocol, pathname } = new URL(url);
    const request = protocols[protocol.replace(':', '')].get(url);
    request.on('response', (response) => {
      const { headers } = response;
      const splitPath = pathname.split('/');
      const generatedFileName = splitPath[splitPath.length - 1];

      const fileName = headers['content-disposition'] ? headers['content-disposition'].match(/filename=(.*)/)[1] || generatedFileName : generatedFileName;

      const output = fs.createWriteStream(path.resolve(filePath,
        fileName));

      if (fileName.endsWith('.gz')) {
        response
          .pipe(zlib.createUnzip())
          .pipe(tar.extract(filePath));
      } else {
        response
          .pipe(output);
      }
      request.on('close', () => {
        resolve({ filePath, fileName });
      });
    });
    request.on('error', reject);
  });

const getFilename = (globString, options) =>
  new Promise((resolve, reject) => {
    glob(globString, options, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });

async function setup() {
  const depsPath = path.resolve(__dirname, '..', '.dependencies');

  if (!fs.existsSync(depsPath)) {
    fs.mkdirSync(depsPath);
  }

  console.log('\n>>> downloading dependencies\n');

  console.log(`>>> downloaded ${ (await downloadFile(javaClass, depsPath)).fileName }`);
  console.log(`>>> downloaded ${ (await downloadFile(supplemental, depsPath)).fileName }`);
  console.log(`>>> downloaded ${ (await downloadFile(maven, depsPath)).fileName }\n`);

  execSync(`cd ${ depsPath } && rm -rf sdfcli-* *.gz`);

  const jrePath = path.resolve(__dirname, '..', 'node_modules', 'node-jre', 'jre');
  const mavenDir = (await getFilename('*maven*', { cwd: depsPath }))[0];
  const javaDir = (await getFilename('jre*', { cwd: jrePath }))[0];

  const sdfcli = path.resolve(depsPath, 'sdfcli');

  const mvn = `${ depsPath }/${ mavenDir }/bin/mvn`;
  const JAVA_HOME = `JAVA_HOME=${ jrePath }/${ javaDir }/Contents/Home `;

  // rewrite sdfcli script
  fs.writeFileSync(sdfcli,
    `#!/bin/bash\n${ JAVA_HOME } ${ mvn } -f ${ path.resolve(depsPath, 'pom.xml') } exec:java -Dexec.args="$*"`
  );

  // install maven dependencies
  execSync(`cd ${ depsPath }; ${ JAVA_HOME } ${ mvn } exec:java -Dexec.args= `, { stdio: 'inherit' });

  execSync(`chmod +x ${ sdfcli }`);
  console.log('\n>>> setup successfully finished\n');
}

setup();
