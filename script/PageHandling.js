/**
 * Handling of passwords in the displayed page
 */
class PageHandling {

    timer = null;

    /**
     * Register handlers
     *
     * @param {SubtleAES} aes
     */
    constructor(aes) {
        this.aes = aes;

        jQuery('.encryptedpasswords svg:first').on('click', this.showAll.bind(this));
        jQuery('.encryptedpasswords svg:last').on('click', this.hideAll.bind(this));
        jQuery('.encryptedpasswords span').on('click', this.copyHandler.bind(this));
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
            $element.removeClass('crypted');
            $element.addClass('clear');
        } catch (e) {
            $element.addClass('error');
            $element.attr('title', 'Failed to decrypt, wrong passphrase?');
        }
    }

    /**
     * Copy a clicked password to clipboard
     *
     * @param {Event} e
     */
    async copyHandler(e) {
        const $element = jQuery(e.target).parent();
        let clear = $element.find('span').text(); // get early, timer may interfere
        const cipher = $element.data('crypted');

        if ($element.hasClass('crypted')) {
            const passphrase = window.prompt('Please enter the passphrase');
            if (passphrase === null || passphrase === '') return;
            try {
                clear = await this.aes.aesGcmDecrypt(cipher, passphrase);
            } catch (e) {
                GUI.toast('Failed to decrypt, wrong passphrase?', 'error');
                return;
            }
        }

        try {
            await navigator.clipboard.writeText(clear);
            GUI.toast('copied to clipboard', 'success');
        } catch (e) {
            GUI.toast('clipboard access failed', 'error');
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

        this.setTimer();
    }

    /**
     * Hide all passwords in the page
     */
    hideAll() {
        jQuery('.encryptedpasswords.clear')
            .removeClass('clear')
            .addClass('crypted')
            .find('span').text('••••••••••');
        this.clearTimer();
    }

    /**
     * Set the timer to hide all passwords again
     */
    setTimer() {
        const timeout = JSINFO.plugins.encryptedpasswords.timeout;
        if (!timeout) return;
        this.clearTimer();
        this.timer = window.setTimeout(this.hideAll.bind(this), timeout * 1000);
    }

    /**
     * Clear any timer that might be set
     */
    clearTimer() {
        if (this.timer !== null) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
