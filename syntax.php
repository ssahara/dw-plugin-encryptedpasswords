<?php
/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  */

if (!defined('DOKU_INC')) die();

class syntax_plugin_encryptedpasswords extends DokuWiki_Syntax_Plugin
{
    public function getType()
    {   // Syntax Type
        return 'protected';
    }

    /**
      * Connect pattern to lexer
      */
    protected $mode, $pattern;

    public function preConnect()
    {
        // syntax mode, drop 'syntax_' from class name
        $this->mode = substr(get_class($this), 7);
        // syntax pattern
        $this->pattern = array(
            1 => '<decrypt>(?=.*?</decrypt>)',  // DOKU_LEXER_ENTER
            4 => '</decrypt>',                  // DOKU_LEXER_EXIT
        );
    }

    public function connectTo($mode)
    {
        $this->Lexer->addEntryPattern($this->pattern[1], $mode, $this->mode);
    }

    public function postConnect()
    {
        $this->Lexer->addExitPattern($this->pattern[4], $this->mode);
    }

    public function getSort()
    {   // sort number used to determine priority of this mode
        return 65;
    }

    /**
      * Handle the match
      */
    public function handle($match, $state, $pos, Doku_Handler $handler)
    {
        switch ($state) {
            case DOKU_LEXER_ENTER :
                return $data = array($state, '');
                break;
            case DOKU_LEXER_UNMATCHED :
                return $data = array($state, $match);
                break;
            case DOKU_LEXER_EXIT :
                return $data = array($state, '');
                break;
        }
        return $data = false;
    }

    /**
      * Create output
      */
    public function render($format, Doku_Renderer $renderer, $data)
    {
        if ($format == 'xhtml') {

            list($state, $match) = $data;
            switch ($state) {
                case DOKU_LEXER_ENTER :
                    $renderer->doc.= '';
                    break;
                case DOKU_LEXER_UNMATCHED :
                    $id = uniqid();
                    $script = "decryptText(jQuery('.encryptedpasswords'));";
                    if ($this->getConf('reload_seconds') > 0) {
                        $script.= "window.setTimeout('location.reload()',"
                                 .$this->getConf('reload_seconds')."000);";
                    }
                    $renderer->doc.= '<span class="encryptedpasswords" title="'.$match.'">';
                    $renderer->doc.= '<a title="'.$this->getLang('decrypt').'" onclick="'
                                    .$script.'">••••••••••</a>';
                    $renderer->doc.= '</span>';
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
