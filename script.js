// register toolbar button
if (typeof window.toolbar !== 'undefined') {
    toolbar[toolbar.length] = {
        type: 'format',
        title: LANG.plugins.encryptedpasswords.addpass,
        icon: DOKU_BASE + 'lib/plugins/encryptedpasswords/password.png',
        open: '<encrypt>',
        close: '</encrypt>',
        sample: 'password',
    };
    toolbar[toolbar.length] = {
        type: 'encryptedPasswordsToggle',
        title: LANG.plugins.encryptedpasswords.decryptAll,
        icon: DOKU_BASE + 'lib/plugins/encryptedpasswords/encrypt.png',
    };

    // actual click handler is defined in the EditorHandling class later
    function addBtnActionEncryptedPasswordsToggle($btn, props, edid) {
        $btn.on('click', function () {
            $btn.trigger('EncryptedPasswordsToggleEvent', [edid]);
        })
    }
}

jQuery(function () {
    /* DOKUWIKI:include script/GUI.js */
    /* DOKUWIKI:include script/md5.min.js */
    /* DOKUWIKI:include script/SubtleAES.js */
    /* DOKUWIKI:include script/PageHandling.js */
    /* DOKUWIKI:include script/EditorHandling.js */

    const aes = new SubtleAES();
    new PageHandling(aes);
    new EditorHandling(aes);

});
