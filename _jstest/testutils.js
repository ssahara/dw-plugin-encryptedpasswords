/**
 * @param {String} hexString
 * @return {Uint8Array}
 *
 * @link https://stackoverflow.com/a/50868276
 */
const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

/**
 * @param {Uint8Array} bytes
 * @return {String} hexString
 *
 * @link https://stackoverflow.com/a/50868276
 */
const toHexString = bytes =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
