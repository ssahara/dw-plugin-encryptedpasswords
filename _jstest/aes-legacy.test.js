QUnit.module('Legacy AES');

QUnit.test('deriveMD5', async assert => {
    const aes = new SubtleAES();
    const passphrase = 'p4$$w0rd';
    const salt = fromHexString('85aa7f93bcf17762');

    const {hash, iv} = await aes.deriveMd5(passphrase, salt);
    assert.equal(toHexString(hash), 'eae92a58ad052919a1b82511f31633b600168b24620728f0d383a5e5fe7c29a0', 'hash');
    assert.equal(toHexString(iv), '8efa1b88db36bc9773184f482c07b217', 'iv');
});


QUnit.test('decode', async assert => {
    const aes = new SubtleAES();
    const cipher = 'U2FsdGVkX1/oynrOig+RoUwMNCHvJH2bcmQeAq2xaLI=';
    const pass = 'test';
    const clear = 'hello world';
    const check = await aes.decrypt(cipher, pass, true);

    assert.equal(check, clear, 'encrypt/decrypt');
});



