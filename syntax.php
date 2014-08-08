<?php
/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  */

if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'syntax.php');

/**
  * All DokuWiki plugins to extend the parser/rendering mechanism
  * need to inherit from this class
  */
class syntax_plugin_encryptedpasswords extends DokuWiki_Syntax_Plugin {

    /**
      * What kind of syntax are we?
      */
    function getType(){
        return 'protected';
    }

    /**
      * Where to sort in?
      */
    function getSort(){
        return 65;
    }

    /**
      * Connect pattern to lexer
      */
    function connectTo($mode) {
        $this->Lexer->addEntryPattern('<decrypt>(?=.*?</decrypt>)',$mode,'plugin_encryptedpasswords');
    }

    function postConnect() {
        $this->Lexer->addExitPattern('</decrypt>','plugin_encryptedpasswords');
    }

    /**
      * Handle the match
      */
    function handle($match, $state, $pos, &$handler){
        switch ($state) {
            case DOKU_LEXER_ENTER :
                return array($state, $match);
            break;
            case DOKU_LEXER_UNMATCHED :
                return array($state, $match);
            break;
            case DOKU_LEXER_EXIT :
                return array($state, '');
            break;
        }
        return array();
    }

    /**
      * Create output
      */
    function render($mode, &$renderer, $data) {
        if($mode == 'xhtml'){

            list($state, $match) = $data;
            switch ($state) {
                case DOKU_LEXER_ENTER :
                    $renderer->doc.= '';
                    break;
                case DOKU_LEXER_UNMATCHED :
                    $id = uniqid();
                    $renderer->doc.= '<span class="encryptedpasswords" title="'.$match.'"><a title="'.$this->getLang('ok').'" href="#" onclick="decryptText(jQuery(\'.encryptedpasswords\'));window.setTimeout(\'location.reload()\',120000);">••••••••••</a></span>';
                    break;
                case DOKU_LEXER_EXIT :
                    $renderer->doc .= '';
                    break;
            }
            return true;
        }
        return false;
    }
}
