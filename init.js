const mvn = require('maven')
  .create({
    cwd: process.cwd() + '/sdfcli-supplemental'
  });
mvn.execute(['exec:java', '-Dexec.args='], { 'skipTests': true })
  .then(() => {
    console.log('>>> dependencies installed')
    // mvn.execute(['exec:java', '-Dexec.args="validate"']).then(() => {console.log('foo')}).catch(console.log);
    // As mvn.execute(..) returns a promise, you can use this block to continue
    // your stuff, once the execution of the command has been finished successfully.
  }).catch(console.log);

// mvn.execute(['exec:java','-Dexec.args="validate -p "']).then(() => {console.log('foo')}).catch(console.log);


// mvn -f /webdev/sdf/cli/pom.xml exec:java -Dexec.args="$*"
