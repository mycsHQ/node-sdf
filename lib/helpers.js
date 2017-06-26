const readline = require('readline');

/**
 *
 * @param {string} query
 *
 * @returns {promise} user input
 */
const prompt = (query) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(query, (answer) => {
      if (!answer) return reject('please enter value');
      resolve(answer);
      rl.close();
    });
  });
};

module.exports = {
  prompt
};
