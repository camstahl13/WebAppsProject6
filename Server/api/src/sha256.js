const createHash = require('crypto').createHash;
/**
 * @param {string} content
 * @returns {string}
 */
function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

exports.sha256 = sha256;