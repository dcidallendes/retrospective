const fs =  require('fs');
require('dotenv').config();

const apiUrl = process.env.API_URL;
const messagesUrl = process.env.MESSAGES_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;

const targetPath = `./src/environments/environment.prod.ts`;
const envConfigFile = `
export const environment = {
    production: true,
    apiUrl: '${apiUrl}'},
    messagesUrl: '${messagesUrl}',
    googleClientId: '${googleClientId}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
       console.log(err);
  }
});
