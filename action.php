<?php

use dokuwiki\Form\Form;

/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  */

class action_plugin_encryptedpasswords extends DokuWiki_Action_Plugin
{
    /**
      * Register its handlers with the DokuWiki's event controller
      */
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('TOOLBAR_DEFINE', 'AFTER', $this, 'handleToolbar');
        $controller->register_hook('FORM_EDIT_OUTPUT', 'BEFORE', $this, 'disableAutoDraft');

        // legacy support
        $controller->register_hook('HTML_EDITFORM_OUTPUT', 'BEFORE', $this, 'disableAutoDraft');
     }

    /**
     * Adds toolbar button
     */
    public function handleToolbar(Doku_Event $event, $param)
    {
        $event->data[] = array(
            'type' => 'encryptButtonClick',
            'title' => $this->getLang('toolbar_icon_title'),
            'icon' => DOKU_REL.'lib/plugins/encryptedpasswords/encrypt.png',
        );
    }

    /**
     * Disable auto draft saving
     */
    public function disableAutoDraft(Doku_Event $event, $param)
    {
        global $conf;
        $form =& $event->data;

        if (is_a($form, Form::class) // $event->name is 'FORM_EDIT_OUTPUT'
            && ($pos = $form->findPositionByAttribute('id', 'wiki__text')) !== false
        ) {
            // applicable to DW development snapshot 2020-10-13 or later
            $wikitext = $form->getElementAt($pos)->val();

        } elseif (is_a($form, 'Doku_Form') // $event->name == 'HTML_EDITFORM_OUTPUT'
            && ($pos = $form->findElementByType('wikitext')) !== false
        ) {
            // applicable to DW release 2020-07-29 "Hogfather" and older
            $textarea = $form->getElementAt($pos);
            $wikitext = $textarea['_text'];
        } else {
            return;
        }

        // check <decrypt></decriprt> used in wiki text
        $ptn = '#<decrypt>[\s\S]*?</decrypt>#';
        if (preg_match($ptn, $wikitext) && $conf['usedraft']) {
            $conf['usedraft'] = 0;
            if ($this->getConf('notify')) {
                msg($this->getPluginName().': '.$this->getLang('msg_AutoDraftDisabled'), 2);
            }
        }
    }

}
