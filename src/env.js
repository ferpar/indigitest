/**
 * Load environment variables:
 * This code is separated and placed in a different script to make sure
 * nodejs loads the environment variables before starting the server.
 * This fix prevents the weird behaviour whereby nodejs loads cached modules before enviroment variables,
 * which is a usual problem of dotenv.
 * 
 * This solution and further information may be found at:
 * https://github.com/motdotla/dotenv/issues/133  
 */

const result = require('dotenv').config()
if (result.error){
  throw result.error;
} else {
  console.log('Environment variables successfully loaded');
}
