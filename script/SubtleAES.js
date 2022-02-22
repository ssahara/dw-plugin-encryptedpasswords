/**
 * Encaspsulates AES-CBC encryption using SubtleCrypto
 *
 * @link https://gist.github.com/chrisveness/43bcda93af9f646d083fad678071b90a
 */
class SubtleAES {

    iterations = 10000; // OpenSSL default

    /**
     * Encrypts plaintext using AES-CBC with Pkdf2 derived key
     *
     * @param   {String} plaintext Plaintext to be encrypted
     * @param   {String} password Password to use to encrypt plaintext
     * @returns {Promise<String>} Encrypted ciphertext base64 encoded
     */
    async encrypt(plaintext, password) {

        const salt = this.randomSalt();
        const {hash, iv} = await this.derivePkdf2(password, salt, 'SHA-256', this.iterations);

        const alg = {name: 'AES-CBC', iv: iv};
        const key = await crypto.subtle.importKey('raw', hash, alg, false, ['encrypt']);

        const cipher = await crypto.subtle.encrypt(alg, key, new TextEncoder().encode(plaintext));

        return this.createOpenSSLCryptString(salt, new Uint8Array(cipher));
    }

    /**
     * Decrypts OpenSSL ciphertext
     *
     * @param {String} ciphertext Base64 encoded ciphertext to be decrypted.
     * @param {String} password Password to use to decrypt ciphertext
     * @param {boolean} legacy
     * @returns {Promise<String>} Decrypted plaintext.
     */
    async decrypt(ciphertext, password, legacy = false) {
        const {salt, cipher} = this.parseOpenSSLCryptString(ciphertext);

        let hash, iv;
        if (legacy) {
            ({hash, iv} = this.deriveMd5(password, salt));
        } else {
            ({hash, iv} = await this.derivePkdf2(password, salt, 'SHA-256', this.iterations));
        }

        const alg = {name: 'AES-CBC', iv: iv};
        const key = await crypto.subtle.importKey('raw', hash, alg, false, ['decrypt']);

        try {
            const plainBuffer = await crypto.subtle.decrypt(alg, key, cipher);
            return new TextDecoder().decode(plainBuffer);
        } catch (e) {
            throw new Error('Decrypt failed');
        }
    }

    /**
     * Decrypt trying modern and legacy variants
     *
     * @param {String} ciphertext Base64 encoded ciphertext to be decrypted.
     * @param {String} password Password to use to decrypt ciphertext
     * @returns {Promise<String>} Decrypted plaintext.
     */
    async autodecrypt(ciphertext, password) {
        try {
            return await this.decrypt(ciphertext, password);
        } catch (e) {
            //ignore
        }
        return await this.decrypt(ciphertext, password, true);
    }

    /**
     * Generate a random salt
     *
     * @return {Uint8Array}
     */
    randomSalt() {
        return crypto.getRandomValues(new Uint8Array(8));
    }

    /**
     * Parse a base64 string created by openssl enc
     *
     * @param str
     * @return {{cipher: Uint8Array, salt: Uint8Array}}
     */
    parseOpenSSLCryptString(str) {
        const ostring = atob(str);

        if (ostring.slice(0, 8) !== 'Salted__') {
            throw new Error('Input seems not to be created by OpenSSL compatible enc mechanism');
        }

        return {
            salt: new Uint8Array(Array.from(ostring.slice(8, 16)).map(ch => ch.charCodeAt(0))),
            cipher: new Uint8Array(Array.from(ostring.slice(16)).map(ch => ch.charCodeAt(0))),
        }
    }

    /**
     * Create the openssl enc compatible string
     *
     * @param {Uint8Array} salt
     * @param {Uint8Array} cipher
     * @return {string}
     */
    createOpenSSLCryptString(salt, cipher) {
        const concat = new Uint8Array([
            0x53, 0x61, 0x6c, 0x74, 0x65, 0x64, 0x5f, 0x5f, // Salted__
            ...salt,
            ...cipher,
        ]);

        // base64 string
        return btoa(String.fromCharCode.apply(null, concat));
    }

    /**
     * Use PKDF2 to derive the IV and key
     *
     * @param {string} strPassword The clear text password
     * @param {Uint8Array} salt    The salt
     * @param {string} hash        The Hash model, e.g. ["SHA-256" | "SHA-512"]
     * @param {int} iterations     Number of iterations
     * @return {Promise<{hash: Uint8Array, iv: Uint8Array}>}
     * @link https://stackoverflow.com/q/67993979
     */
    async derivePkdf2(strPassword, salt, hash, iterations) {
        const password = new TextEncoder().encode(strPassword);

        const ik = await window.crypto.subtle.importKey("raw", password, {name: "PBKDF2"}, false, ["deriveBits"]);
        const dk = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                hash: hash,
                salt: salt,
                iterations: iterations
            },
            ik,
            48 * 8
        );  // Bytes to bits
        const buffer = new Uint8Array(dk);

        return {
            hash: buffer.slice(0, 32),
            iv: buffer.slice(32, 48),
        }
    }

    /**
     * The old, legacy method to derive key and IV from the password
     *
     * @param {string} strPassword The clear text password
     * @param {Uint8Array} salt The salt
     * @return {{iv: Uint8Array, hash: Uint8Array}}
     * @link https://security.stackexchange.com/a/242567
     */
    deriveMd5(strPassword, salt) {
        const password = new TextEncoder().encode(strPassword);

        const D1 = md5.array(new Uint8Array([...password, ...salt]));
        const D2 = md5.array(new Uint8Array([...D1, ...password, ...salt]));
        const D3 = md5.array(new Uint8Array([...D2, ...password, ...salt]));

        return {
            hash: new Uint8Array([...D1, ...D2]),
            iv: new Uint8Array(D3),
        }
    }
}
