import developmentConfig from './development';
import productionConfig from './production';

const env = process.env.NODE_ENV || 'development';
const configs = {
  development: developmentConfig,
  production: productionConfig,
};

const defaults = {};

export default Object.assign(defaults, configs[env]);
