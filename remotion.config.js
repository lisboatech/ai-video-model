// Configuração do Remotion
// https://www.remotion.dev/docs/config

const path = require('path');

module.exports = {
  // Configurações gerais
  fps: 30,
  width: 1080,
  height: 1920,

  // Configurações de codificação
  codec: 'h264',

  // Configurações de qualidade
  quality: 80,

  // Configurações de concorrência
  concurrency: 1,

  // Configurações de saída
  outputFormat: 'mp4',

  // Configurações de composição
  defaultComposition: 'MothersDay',

  // Configurações de entrada
  entryPoint: 'remotion/index.jsx',

  // Configurações do webpack
  webpackOverride: require('./remotion/webpack-override.js'),

  // Configurações de publicação
  publicDir: path.join(__dirname, 'public'),
};
