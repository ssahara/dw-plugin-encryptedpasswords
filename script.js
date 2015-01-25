/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  */

/* DOKUWIKI:include gibberish-aes.js */
/* DOKUWIKI:include jsencryption.js */

// Add a toolbar button to insert a encrypted password
function addBtnActionEncryptButtonClick(btn, props, edid) {

    jQuery(btn).click(function(){
        var sample = '';
        if (typeof DWgetSelection == 'function') {
            var selection = DWgetSelection(document.getElementById('wiki__text'));
        } else {
            var selection = getSelection(document.getElementById('wiki__text'));
        }
        if (selection.getLength()) {
            sample = selection.getText();
        }
        if (sample=='') {
            alert(LANG.plugins.encryptedpasswords['noSelection']);
            return false;
        }
        if (sample.indexOf('<decrypt>') == 0 && sample.indexOf('</decrypt>') == sample.length-10) {
            vcPrompt(LANG.plugins.encryptedpasswords['enterKey'], LANG.plugins.encryptedpasswords['decrypt'], 1, vcFunc = function(a) {
                if (a) {
                    document.getElementById('wiki__text').focus();
                    try {
                        decText = GibberishAES.dec((sample.substr(9,sample.length-19)),passElt.value);
                    } catch(err) { decText = null }
                    if (decText) {
                        pasteText(selection, decText);
                        vcClick_func(0);
                        decText = null;
                    } else {
                        alert(LANG.plugins.encryptedpasswords['invalidKey'])
                    }
                } else { 
                    vcClick_func(0);
                    document.getElementById('wiki__text').focus();
                };
            });
        } else {
            vcPrompt(LANG.plugins.encryptedpasswords['encryptKey'], LANG.plugins.encryptedpasswords['encrypt'], 2, vcFunc = function(a) {
                if (a) {
                    if (passElt.value !== passElt2.value) {
                        alert(LANG.plugins.encryptedpasswords['keyErr']);
                        return false;
                    }
                    if (passElt.value == '') {
                        alert(LANG.plugins.encryptedpasswords['emptyKey']);
                        return false;
                    }
                    document.getElementById('wiki__text').focus();
                    pasteText(selection,'<decrypt>'+GibberishAES.enc(sample,passElt.value).replace(/\n$|\r$|\r\n$/g,'')+'</decrypt>');
                    vcClick_func(0);
                } else { 
                    vcClick_func(0);
                    document.getElementById('wiki__text').focus();
                };
            });

        }
        return false;
    });
    return true;
}
