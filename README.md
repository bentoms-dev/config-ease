# ConfigEase

ConfigEase is a Node.js package that simplifies the management of dynamic configurations in Node.js applications. It provides an easy way to load, validate, and manage configurations, supporting environment-specific settings and dynamic reloading without restarting the application.

## Features

- Load configurations from environment variables and files (JSON, YAML).
- Validate configurations using Joi schema.
- Support for default configurations.
- Customizable environment variable prefix.
- Watch for changes in the configuration file and dynamically reload.
- Informative logging for configuration loading, validation, and reloading.

## Installation

```bash
npm install config-ease
```

## Usage

```bash
// app.js
const configEase = require('config-ease');
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
```

## Configuration File Formats

ConfigEase supports configuration files in JSON and YAML formats.

* For JSON files, use the .json extension.
* For YAML files, use the .yaml or .yml extension.

## Keywords

config, configuration, dotenv, joi, yaml, json, reload

## Contributions

Contributions to this project are welcome! Submit your contributions through Issues or open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/bentoms-dev/config-ease/blob/main/LICENSE) file for details.
