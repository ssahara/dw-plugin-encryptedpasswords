jQuery(function () {
    /* DOKUWIKI:include script/SubtleAES.js */
    /* DOKUWIKI:include script/PageHandling.js */

    const aes = new SubtleAES();
    new PageHandling(aes);

});
