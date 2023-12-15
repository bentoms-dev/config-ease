const configEase = require('./index');
const Joi = require('joi');
const fs = require('fs');

// Define your configuration schema using Joi
const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  // Add more configuration parameters as needed
});

// Load and validate the configuration
configEase.load('.env', configSchema);

// Optionally, watch for changes in the configuration file
configEase.watch();

// Access the configuration in your application
const appConfig = configEase.getConfig();

console.log('Current configuration:', appConfig);

// Example of dynamic reloading
setTimeout(() => {
  console.log('Updating configuration file...');
  fs.writeFileSync('.env', 'NODE_ENV=production\nPORT=4000\nDATABASE_URL=new-database-url');
}, 5000);
