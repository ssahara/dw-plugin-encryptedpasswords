// register toolbar button
if (typeof window.toolbar !== 'undefined') {
    toolbar[toolbar.length] = {
        type: 'encryptedPasswordsToggle',
        title: 'FIXME button title',
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
    /* DOKUWIKI:include script/SubtleAES.js */
    /* DOKUWIKI:include script/PageHandling.js */
    /* DOKUWIKI:include script/EditorHandling.js */

    const aes = new SubtleAES();
    new PageHandling(aes);
    new EditorHandling(aes);

});
