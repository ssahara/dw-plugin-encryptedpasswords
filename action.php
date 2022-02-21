<?php

/**
 * DokuWiki Plugin encryptedpasswords (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 */
class action_plugin_encryptedpasswords extends \dokuwiki\Extension\ActionPlugin
{

    /** @inheritDoc */
    public function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'handleDokuWikiStarted');

    }

    /**
     * Add timeout parameter to JSINFO
     *
     * @param Doku_Event $event event object by reference
     * @param mixed $param optional parameter passed when event was registered
     * @return void
     */
    public function handleDokuWikiStarted(Doku_Event $event, $param)
    {
        global $JSINFO;
        $JSINFO['plugins']['encryptedpasswords']['timeout'] = $this->getConf('reload_seconds');
    }

}

