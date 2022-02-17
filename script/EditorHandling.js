class EditorHandling {
    /**
     * Register handlers
     *
     * @param {SubtleAES} aes
     */
    constructor(aes) {
        this.aes = aes;

        jQuery('#edbtn__save, #edbtn__preview').on('click', this.encryptAllSyntax.bind(this));
    }

    /**
     *
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
        const passphrase = window.prompt("There are clear text passwords.\nPlease enter the passphrase");
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
