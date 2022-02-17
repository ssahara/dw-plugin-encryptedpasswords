/**
 * Handling of passwords in the displayed page
 *
 * @todo hide password
 * @todo timer to hide all passwords again
 * @todo copy to clipboard
 */
class PageHandling {

    /**
     * Register handlers
     *
     * @param {SubtleAES} aes
     */
    constructor(aes) {
        this.aes = aes;

        jQuery('.encryptedpasswords.crypted svg').on('click', this.showAll.bind(this));
    }

    /**
     * Decrypt and display a single password element in the page
     *
     * @param {jQuery} $element
     * @param {string} passphrase
     */
    async showClear($element, passphrase) {
        const cipher = $element.data('crypted');
        $element.removeClass('error');
        $element.attr('title', '');

        try {
            const clear = await this.aes.aesGcmDecrypt(cipher, passphrase);
            $element.find('span').text(clear);
            $element.toggleClass('crypted clear');
        } catch (e) {
            $element.addClass('error');
            $element.attr('title', 'Failed to decrypt, wrong passphrase?');
        }
    }

    /**
     * Decrypt and show all passwords in the page
     */
    showAll() {
        const self = this;
        const passphrase = window.prompt('Please enter the passphrase');
        if (passphrase === null || passphrase === '') return;

        jQuery('.encryptedpasswords.crypted').each(function (i, e) {
            self.showClear(jQuery(e), passphrase);
        });

        //FIXME register timer here
    }
}
