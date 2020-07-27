const {google} = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile:  '.keys/oauth.key.json',
  scopes: ['https://www.googleapis.com/auth/analytics'],
});

module.exports = auth;