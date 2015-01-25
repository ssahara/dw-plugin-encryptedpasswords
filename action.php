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
        $controller->register_hook('TOOLBAR_DEFINE', 'AFTER', $this, '_handleToolbar');
    }

    /**
     * Adds toolbar button
     */
    public function _handleToolbar(&$event, $param) {
        $event->data[] = array (
            'type' => 'encryptButtonClick',
            'title' => $this->getLang('toolbar_icon_title'),
            'icon' => DOKU_BASE.'lib/plugins/encryptedpasswords/encrypt.png',
        );
    }
}
