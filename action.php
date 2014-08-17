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
      * Register its handlers with the DokuWiki's event controller
      */
    public function register(Doku_Event_Handler $controller) {
        $controller->register_hook('DOKUWIKI_STARTED', 'BEFORE', $this, '_exportToJSINFO');
        $controller->register_hook('TOOLBAR_DEFINE', 'AFTER', $this, '_handleToolbar');
    }

    /**
     * export to JSINFO
     */
    public function _exportToJSINFO(&$event) {
        global $JSINFO;
        $JSINFO['encryptedpasswords']['enc_enter']    = $this->getLang('enterKey');
        $JSINFO['encryptedpasswords']['enc_ok']       = $this->getLang('ok');
        $JSINFO['encryptedpasswords']['enc_ok2']      = $this->getLang('ok2');
        $JSINFO['encryptedpasswords']['enc_cancel']   = $this->getLang('cancel');
        $JSINFO['encryptedpasswords']['enc_invalid']  = $this->getLang('invalidKey');
        $JSINFO['encryptedpasswords']['enc_nosel']    = $this->getLang('noSelection');
        $JSINFO['encryptedpasswords']['enc_enckey']   = $this->getLang('encryptKey');
        $JSINFO['encryptedpasswords']['enc_keyerr']   = $this->getLang('keyErr');
        $JSINFO['encryptedpasswords']['enc_emptykey'] = $this->getLang('emptykey');
        $JSINFO['encryptedpasswords']['enc_recrypt']  = $this->getLang('recrypt');
        //$JSINFO['encryptedpasswords']['enc_encb']     = $this->getLang('encryptbutton');
    }

    /**
     * Adds toolbar button
     */
    public function _handleToolbar(&$event, $param) {
        $event->data[] = array (
            'type' => 'encryptButtonClick',
            'title' => $this->getLang('encryptbutton'),
            'icon' => DOKU_BASE.'lib/plugins/encryptedpasswords/encrypt.png',
        );
    }
}
