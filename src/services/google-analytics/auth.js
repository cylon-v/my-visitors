const {google} = require('googleapis');

/**
 * Initialized {GoogleAuth} object.
 * Requires specific authentication file - keyFile. Please refer to README.md file for the details.
 * @type {GoogleAuth}
 */
const auth = new google.auth.GoogleAuth({
  keyFile:  '.keys/oauth.key.json',
  scopes: ['https://www.googleapis.com/auth/analytics'],
});

module.exports = auth;