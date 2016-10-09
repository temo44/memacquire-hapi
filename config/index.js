const env       = process.env.NODE_ENV || 'development'; 
const config = require(`${__dirname}/${env}.json`); 
module.exports = config;