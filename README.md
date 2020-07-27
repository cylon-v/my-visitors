# My Visitors
"My Visitors" is a simple application that queries Google Analytics API to
return the results of the number of unique visitors to a website.
 
## Pre-requisites
* Node.js 14
* MongoDB 4

## Prepare Google Analytics credentials
Since we create simple backend application then we can use "Service Accounts".
You can find information about how to prepare your account and authentication file 
[here](https://developers.google.com/analytics/devguides/reporting/core/v4/authorization#service_accounts).
Put your GA authorization file to `.keys` folder. Please rename it to "oauth.key.json".

### Important
Please don't forget to bind your service account with Google Analitics profile using the email.
You can do it here Google Analytics -> Admin -> View User Management.

## Run the application
To get the application running locally run the following commands:

```npm install```
To install all required packages.

Prepare .env file, please use .env.example as an example of it. Also you can export the variables 
directly to your environment using unix-command "export".  

Then ```npm start``` to start the app.

## Development
The infrastructure provides an ability to run tests. You can use command
```npm test``` 
in order to check correctness of your changes. "coverage" folder stores the results of tests. 
 
