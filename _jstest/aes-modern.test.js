QUnit.module('Modern AES');

QUnit.test('parseOpenSSLCryptString', assert => {
    const aes = new SubtleAES();
    const openssl = 'U2FsdGVkX1/Kf8Yo6JjBh+qELWhirAXr78+bbPQjlxE=';

    const {salt, cipher} = aes.parseOpenSSLCryptString(openssl);
    assert.equal(toHexString(salt), 'ca7fc628e898c187', 'salt');
    assert.equal(toHexString(cipher), 'ea842d6862ac05ebefcf9b6cf4239711', 'cipher');
});

QUnit.test('derivePkdf2', async assert => {
    const aes = new SubtleAES();
    const passphrase = 'p4$$w0rd';
    const salt = fromHexString('ca7fc628e898c187');

    const {hash, iv} = await aes.derivePkdf2(passphrase, salt, 'SHA-256', 10000);
    assert.equal(toHexString(hash), '444ab886d5721fc87e58f86f3e7734659007bea7fbe790541d9e73c481d9d983', 'hash');
    assert.equal(toHexString(iv), '7f4597a18096715d7f9830f0125be8fd', 'iv');
});

QUnit.test('dogfood', async assert => {
    const aes = new SubtleAES();
    const clear = 'hello world 😀';
    const pass = 'heh 😅';
    const cipher = await aes.encrypt(clear, pass);
    const check = await aes.decrypt(cipher, pass);

    assert.equal(check, clear, 'encrypt/decrypt');
});



