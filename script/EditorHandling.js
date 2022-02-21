/**
 * Handle interaction with the DokuWiki editor
 */
class EditorHandling {

    failcount = 0;

    /**
     * Register handlers
     *
     * @param {SubtleAES} aes
     */
    constructor(aes) {
        this.aes = aes;

        jQuery('#edbtn__save, #edbtn__preview').on('click', this.encryptAllSyntax.bind(this));
        jQuery(document).on('EncryptedPasswordsToggleEvent', this.decryptAllSyntax.bind(this));
    }

    /**
     *
     * @param {Event} e
     * @param {string} edid The editor's textarea ID
     * @return {Promise<void>}
     */
    async decryptAllSyntax(e, edid) {
        const form = jQuery(`#${edid}`)[0].form;
        // access the syntax in the editor
        const prefix = form.prefix.value;
        const suffix = form.suffix.value;
        const text = form.wikitext.value;

        // check if syntax contains encrypted passwords
        const re = new RegExp('<decrypt>.*?(<\/decrypt>)');
        if (
            !prefix.match(re) &&
            !suffix.match(re) &&
            !text.match(re)
        ) {
            return;
        }

        // ask for passphrase
        const passphrase = window.prompt(LANG.plugins.encryptedpasswords.enterKey);
        if (passphrase === null || passphrase === '') return;

        // replace
        this.failcount = 0;
        form.prefix.value = await this.decryptSyntax(prefix, passphrase);
        form.suffix.value = await this.decryptSyntax(suffix, passphrase);
        form.wikitext.value = await this.decryptSyntax(text, passphrase);

        if (this.failcount) {
            GUI.toast(LANG.plugins.encryptedpasswords.failcount.replace('%d', this.failcount), 'error');
        }
    }

    /**
     * Encrypt all clear text syntax in the given text
     *
     * @param {string} text
     * @param {string} passphrase
     * @return {Promise<string>}
     */
    async decryptSyntax(text, passphrase) {
        const re = new RegExp('<decrypt>(.*?)(<\/decrypt>)', 'g');

        const matches = [...text.matchAll(re)];

        for (let i = 0; i < matches.length; i++) {
            const cipher = matches[i][1];
            try {
                const clear = await this.aes.aesGcmDecrypt(cipher, passphrase);
                text = text.replace(matches[i][0], `<encrypt>${clear}</encrypt>`);
            } catch (e) {
                this.failcount++;
            }
        }

        return text;
    }

    /**
     * Event handler to encrypt all passwords
     *
     * @param {Event} e
     * @return {Promise<void>}
     */
    async encryptAllSyntax(e) {
        // access the syntax in the editor
        const prefix = e.target.form.prefix.value;
        const suffix = e.target.form.suffix.value;
        const text = e.target.form.wikitext.value;

        // check if syntax contains clear text passwords
        const re = new RegExp('<encrypt>.*?(<\/encrypt>)');
        if (
            !prefix.match(re) &&
            !suffix.match(re) &&
            !text.match(re)
        ) {
            return;
        }

        // stop the event
        e.stopPropagation();
        e.preventDefault();

        // ask for passphrase
        const passphrase = window.prompt(LANG.plugins.encryptedpasswords.enterKey);
        if (passphrase === null || passphrase === '') return;

        // replace
        e.target.form.prefix.value = await this.encryptSyntax(prefix, passphrase);
        e.target.form.suffix.value = await this.encryptSyntax(suffix, passphrase);
        e.target.form.wikitext.value = await this.encryptSyntax(text, passphrase);

        // trigger the event again
        jQuery(e.target).trigger(e.type);
    }

    /**
     * Encrypt all clear text syntax in the given text
     *
     * @param {string} text
     * @param {string} passphrase
     * @return {Promise<string>}
     */
    async encryptSyntax(text, passphrase) {
        const re = new RegExp('<encrypt>(.*?)(<\/encrypt>)', 'g');

        const matches = [...text.matchAll(re)];

        for (let i = 0; i < matches.length; i++) {
            const clear = matches[i][1];
            const cipher = await this.aes.aesGcmEncrypt(clear, passphrase);
            text = text.replace(matches[i][0], `<decrypt>${cipher}</decrypt>`);
        }

        return text;
    }
}
