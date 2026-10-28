const { gunzipSync } = require('fflate');
module.exports = { gunzipSync: (buf) => Buffer.from(gunzipSync(new Uint8Array(buf))) };
