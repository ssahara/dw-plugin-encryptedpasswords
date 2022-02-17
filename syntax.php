<?php

/**
 * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 */
class syntax_plugin_encryptedpasswords extends \dokuwiki\Extension\SyntaxPlugin
{
    /** @inheritDoc */
    public function getType()
    {
        return 'substition';
    }

    /** @inheritDoc */
    public function getSort()
    {
        return 65;
    }

    /** @inheritDoc */
    public function connectTo($mode)
    {
        $this->Lexer->addSpecialPattern('<decrypt>(?:.*?<\/decrypt>)', $mode, 'plugin_encryptedpasswords');
    }

    /** @inheritDoc */
    public function handle($match, $state, $pos, Doku_Handler $handler)
    {
        $crypt = substr($match, 9, -10); // remove tags
        return [$crypt];
    }

    /** @inheritDoc */
    public function render($mode, Doku_Renderer $renderer, $data)
    {
        if ($mode !== 'xhtml') {
            return false;
        }

        $crypt = hsc($data[0]);
        $renderer->doc .= '<span class="encryptedpasswords crypted" data-crypted="' . $crypt . '">';
        $renderer->doc .= '<span>••••••••••</span>';
        $renderer->doc .= inlineSVG(__DIR__ . '/lock.svg');
        $renderer->doc .= inlineSVG(__DIR__ . '/lock-open.svg');
        $renderer->doc .= '</span>';
        return true;
    }
}

