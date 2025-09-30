const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limpiar caché automáticamente
config.resetCache = true;

module.exports = config;