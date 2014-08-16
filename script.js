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
            alert(JSINFO['encryptedpasswords']['enc_nosel']);
            return false;
        }
        if (sample.indexOf('<decrypt>') == 0 && sample.indexOf('</decrypt>') == sample.length-10) {
            vcPrompt(JSINFO['encryptedpasswords']['enc_enter'], JSINFO['encryptedpasswords']['enc_ok'], 1, vcFunc = function(a) {
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
                        alert(JSINFO['encryptedpasswords']['enc_invalid'])
                    }
                } else { 
                    vcClick_func(0);
                    document.getElementById('wiki__text').focus();
                };
            });
        } else {
            vcPrompt(JSINFO['encryptedpasswords']['enc_enckey'], JSINFO['encryptedpasswords']['enc_ok2'], 2, vcFunc = function(a) {
                if (a) {
                    if (passElt.value !== passElt2.value) {
                        alert(JSINFO['encryptedpasswords']['enc_keyerr']);
                        return false;
                    }
                    if (passElt.value == '') {
                        alert(JSINFO['encryptedpasswords']['enc_emptykey']);
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

/*
function installEncryptButton() {
    // but first check if there is a toolbar
    if (window.toolbar != undefined) {
        window.toolbar[window.toolbar.length] = {
                "type":"EncryptButtonClick", // we have a new type that links to the function
                "title":JSINFO['encryptedpasswords']['enc_encb'],
                "icon":"../../plugins/encryptedpasswords/encrypt.png"
        }
    }
}

jQuery(installEncryptButton());
*/
