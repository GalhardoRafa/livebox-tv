// Pedaço de "crypto" do Node que o app usa (md5 para ids de canais, UUID).
const md5 = require('js-md5');
function createHash(alg) {
  if (alg !== 'md5') throw new Error('hash não suportado: ' + alg);
  let data = '';
  return {
    update(s) {
      data += String(s);
      return this;
    },
    digest() {
      return md5(data);
    },
  };
}
function randomUUID() {
  const c = globalThis.crypto;
  if (c && c.randomUUID) return c.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === 'x' ? r : (r & 3) | 8).toString(16);
  });
}
module.exports = { createHash, randomUUID };
