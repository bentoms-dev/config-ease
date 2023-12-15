const dotenv = require('dotenv');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chokidar = require('chokidar');

class ConfigEase {
  constructor() {
    this.config = {};
    this.configPath = '.env';
    this.envVariablePrefix = '';
  }

  load(configPath = '.env', schema = {}, defaultConfig = {}, envVariablePrefix = '') {
    this.configPath = configPath;
    this.envVariablePrefix = envVariablePrefix;

    try {
      this.loadEnvConfig();
      this.loadFileConfig(this.configPath);
      this.mergeWithDefault(defaultConfig);
      this.validate(schema);
    } catch (error) {
      throw new Error(`Error loading configuration: ${error.message}`);
    }
  }

  loadEnvConfig() {
    dotenv.config({ path: this.configPath });
    const envVars = Object.keys(process.env)
      .filter((key) => key.startsWith(this.envVariablePrefix))
      .reduce((acc, key) => {
        const newKey = key.slice(this.envVariablePrefix.length);
        acc[newKey] = process.env[key];
        return acc;
      }, {});
    this.config = { ...this.config, ...envVars };
  }

  loadFileConfig(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const fileContents = fs.readFileSync(filePath, 'utf-8');

    switch (extname) {
      case '.json':
        this.config = { ...this.config, ...JSON.parse(fileContents) };
        break;
      case '.yaml':
      case '.yml':
        this.config = { ...this.config, ...yaml.safeLoad(fileContents) };
        break;
      default:
        throw new Error(`Unsupported file format: ${extname}`);
    }
  }

  mergeWithDefault(defaultConfig) {
    this.config = { ...defaultConfig, ...this.config };
  }

  validate(schema) {
    const { error, value } = Joi.object(schema).validate(this.config, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.details.map((d) => d.message).join(', ')}`);
    }
    this.config = { ...this.config, ...value };
  }

  reload() {
    try {
      this.loadEnvConfig();
      this.loadFileConfig(this.configPath);
      this.validate({});
      console.log('Configuration reloaded successfully');
    } catch (error) {
      console.error(`Error reloading configuration: ${error.message}`);
    }
  }

  watch() {
    const watcher = chokidar.watch(this.configPath, { ignoreInitial: true });
    watcher.on('all', (event, filePath) => {
      console.log(`Reloading configuration due to ${event} on ${filePath}`);
      this.reload();
    });
  }

  getConfig() {
    return this.config;
  }
}

module.exports = new ConfigEase();
