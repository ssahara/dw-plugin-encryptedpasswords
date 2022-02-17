jQuery(function () {
    /* DOKUWIKI:include script/SubtleAES.js */
    /* DOKUWIKI:include script/PageHandling.js */
    /* DOKUWIKI:include script/EditorHandling.js */

    const aes = new SubtleAES();
    new PageHandling(aes);
    new EditorHandling(aes);

});
