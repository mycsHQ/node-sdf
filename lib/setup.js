const path = require('path');
const fs = require('fs');
const https = require('https');
const zlib = require('zlib');
const { exec } = require('child_process');

const tar = require('tar-fs');
const maven = require('maven');

const { dependencies: { javaClass, supplemental } } = require('../config');

/**
 *
 * @param {string} url
 * @param {string} filePath
 */
const downloadFile = (url, filePath) =>
  new Promise((resolve, reject) => {
    const request = https.get(url);
    request.on('response', (response) => {
      const { headers } = response;
      const fileName = headers['content-disposition'].match(/filename=(.*)/)[1] || url;

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

const depsPath = path.resolve(__dirname, '..', '.dependencies');

if (!fs.existsSync(depsPath)) {
  fs.mkdirSync(depsPath);
}

console.log('\n>>> downloading dependencies\n');

Promise.all([
  downloadFile(javaClass, depsPath),
  downloadFile(supplemental, depsPath)
])
  .then((res) => {
    console.log(`>>> downloaded ${ res.map(({ fileName }) => fileName).join(', ') }\n`);

    const sdfcli = path.resolve(depsPath, 'sdfcli');

    fs.writeFileSync(sdfcli,
      `#!/bin/bash\nmvn -f ${ path.resolve(depsPath, 'pom.xml') } exec:java -Dexec.args="$*"`
    );

    exec(`chmod +x ${ sdfcli }`);
    exec(`rm -rf ${ sdfcli }-*`);

    maven.create({ cwd: depsPath })
      .execute([ 'clean', 'install' ], { skipTests: true })
      .then(() => {
        console.log('\n>>> dependencies installed\n');
      })
      .catch(console.log);
  });
