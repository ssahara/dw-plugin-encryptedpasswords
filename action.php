<?php
/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  */

if(!defined('DOKU_INC')) die();
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'action.php');

class action_plugin_encryptedpasswords extends DokuWiki_Action_Plugin {

    /**
      * return some info
      */
    function getInfo(){
        return array(
            'author' => 'Wolfgang Reszel',
            'email'  => 'reszel@werbeagentur-willers.de',
            'date'   => '2013-03-13',
            'name'   => 'Encrypted Passwords Plugin',
            'desc'   => 'This plugin let you store 256 bit AES encrypted passwords in your DokuWiki pages. The password can be decrypted by clicking them (Javascript must be enabled). Based on the encryption library by Vincent Cheung (http://www.vincentcheung.ca/jsencryption) which incorporates the Gibberish AES library by Mark Percival (https://github.com/mdp/gibberish-aes).',
            'url'    => 'http://www.dokuwiki.org/plugin:encryptedpasswords',
        );
    }

    /**
      * Register its handlers with the DokuWiki's event controller
      */
    function register(&$controller) {
        $controller->register_hook('TPL_METAHEADER_OUTPUT', 'BEFORE',  $this, '_hookjs');
    }

    /**
      * Hook js script into page headers.
      *
      * @author Wolfgang Reszel <reszel@werbeagentur-willers.de>
      */
    function _hookjs(&$event, $param) {
        $event->data["script"][] = array (	"type" => "text/javascript",
            "charset" => "utf-8",
            "_data" => "var enc_enter='".$this->getLang('enterKey')."';var enc_ok='".$this->getLang('ok')."';var enc_ok2='".$this->getLang('ok2')."';var enc_cancel='".$this->getLang('cancel')."';var enc_encb='".$this->getLang('encryptbutton')."';var enc_cancel='".$this->getLang('cancel')."';var enc_invalid='".$this->getLang('invalidKey')."';var enc_nosel='".$this->getLang('noSelection')."';var enc_enckey='".$this->getLang('encryptKey')."';var enc_keyerr='".$this->getLang('keyErr')."';var enc_emptykey='".$this->getLang('emptyKey')."';var enc_recrypt='".$this->getLang('recrypt')."';"
            );
        $event->data["script"][] = array ("type" => "text/javascript",
            "charset" => "utf-8",
            "_data" => "",
            "src" => DOKU_BASE."lib/plugins/encryptedpasswords/jsencryption.js"
            );
    }
}
