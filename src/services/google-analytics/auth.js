const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile:  path.join(__dirname, '.keys/oauth.key.json'),
  scopes: ['https://www.googleapis.com/auth/analytics'],
});

module.exports = auth;