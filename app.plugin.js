// Plugin do Expo - o app.config.js já cuida de copiar o .env
// Este plugin existe apenas para manter a estrutura, caso precise de funcionalidades futuras
module.exports = function withEnvPlugin(config) {
  // A cópia do .env é feita no app.config.js antes de carregar as variáveis
  return config;
};
