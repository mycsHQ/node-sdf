const readline = require('readline');

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

module.exports = {
  prompt,
  required
};
