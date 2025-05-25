// Configuração do webpack para o Remotion
// https://www.remotion.dev/docs/webpack

const path = require('path');

module.exports = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...currentConfiguration.module.rules,
        // Regra para arquivos MP3
        {
          test: /\.(mp3)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...currentConfiguration.resolve.alias,
        // Adicionar alias para a pasta public
        '@public': path.join(process.cwd(), 'public'),
      },
    },
  };
};
