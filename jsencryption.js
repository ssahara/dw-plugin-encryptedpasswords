/**
  * JavaScript Encryption and Decryption 2.0
  * http://www.vincentcheung.ca/jsencryption/
  *
  * The backend is Gibberish AES by Mark Percival (https://github.com/mdp/gibberish-aes)
  *
  * Copyright 2008 Vincent Cheung
  * Dec. 16, 2008
  *
  * + Modified for full localization by Wolfgang Reszel on Mai 6, 2010
  * + Compatibility with Dokuwiki Weatherwax RC1 (Mar 13, 2013)
  * 
  */

var decryptElementId;

function decryptText(a, b, c) {
    decryptElementId = a;
    if (b == null) {
        b = LANG.plugins.encryptedpasswords['enterKey']
    }
    if (c != null && c) {
        var d = prompt(b, "");
        decrypt(d)
    } else {
        vcPrompt(b)
    }
}

function decrypt(a) {
    if (a != "" && a != null) {
        // if (decryptElementId.constructor != Array) {
        //     decryptElementId = [decryptElementId]
        // }
        var b = false;
        for (var i = 0; i < decryptElementId.length; i++) {
            if (typeof decryptElementId[i] == 'object') {
                c = decryptElementId[i]
            } else {
                var c = document.getElementById(decryptElementId[i])
            }
            var d = c.title;
            try {
                var e = GibberishAES.dec(d, a);
                b = true;
                jQuery(c).text(e).after(' <span class="recrypt"><a href="." onclick="location.reload(); return false;">['+LANG.plugins.encryptedpasswords['recrypt']+']</a></span>');
                c.title = "";
            } catch(err) {}
        }
        if (!b) {
            alert(LANG.plugins.encryptedpasswords['invalidKey'])
        }
    }
}

var overlayElt = null;
var winElt = null;
var passElt = null;
var promptElt = null;

function vcPrompt(a,a2,a3,vcClick) {
    if (overlayElt == null || winElt == null || passElt == null || promptElt == null) {
        vcCreateDialog(a,a2,a3,vcClick)
    }
    promptElt.innerHTML = a != null ? a : "Enter password:";
    pageSize = getPageSize();
    winElt.style.marginTop = Math.round(pageSize[3] * 0.3) + "px";
    winElt.style.marginLeft = Math.round((pageSize[2] - 400) / 2) + "px";
    isIE6 = /msie|MSIE 6/.test(navigator.userAgent);
    if (isIE6) {
        pageScroll = getPageScroll();
        overlayElt.style.position = "absolute";
        overlayElt.style.width = pageSize[0] + "px";
        overlayElt.style.height = pageSize[1] + "px";
        winElt.style.position = "absolute";
        winElt.style.top = pageScroll[1] + "px";
        winElt.style.left = pageScroll[0] + "px"
    }
    passElt.value = "";
    overlayElt.style.display = "block";
    winElt.style.display = "block";
    passElt.focus();
    passElt.select()
}

function vcCreateDialog(a,a2,a3,vcClick) {
    if (vcClick == undefined) vcClick = vcClick_func;
    overlayElt = document.createElement("div");
    overlayElt.setAttribute("id", "vcOverlay");
    var s = overlayElt.style;
    s.backgroundColor = "black";
    s.MozOpacity = 0.1;
    s.opacity = 0.1;
    s.filter = "alpha(opacity=10)";
    s.position = "fixed";
    s.top = 0;
    s.left = 0;
    s.width = "100%";
    s.height = "100%";
    s.zIndex = 254;
    s.textAlign = "left";
    s.margin = 0;
    s.padding = 0;
    var a = document.getElementsByTagName("body").item(0);
    a.insertBefore(overlayElt, a.firstChild);
    winElt = document.createElement("div");
    winElt.setAttribute("id", "vcWin");
    s = winElt.style;
    s.position = "fixed";
    s.top = 0;
    s.left = 0;
    s.width = "400px";
    s.zIndex = 255;
    s.border = "1px solid black";
    s.backgroundColor = "#fbfcfd";
    s.textAlign = "left";
    s.margin = 0;
    s.padding = 0;
    a.insertBefore(winElt, a.firstChild);
    var b = document.createElement("div");
    b.setAttribute("id", "vcInWin");
    s = b.style;
    s.border = "5px solid #808080";
    s.padding = "15px";
    s.margin = 0;
    winElt.appendChild(b);
    promptElt = document.createElement("p");
    promptElt.setAttribute("id", "vcPrompt");
    s = promptElt.style;
    s.padding = 0;
    s.margin = 0;
    s.fontFamily = "Arial, sans-serif";
    s.fontSize = "14px";
    s.textAlign = "left";
    s.color = "black";
    b.appendChild(promptElt);
    passElt = document.createElement("input");
    passElt.setAttribute("id", "vcPass");
    passElt.setAttribute("tabindex", "1001");
    passElt.type = "password";
    passElt.onkeyup = function(c) {
        if (c == null) {
            c = window.event
        }
        if ((c.keyCode == 10) || (c.keyCode == 13)) {
            vcClick(1)
        }
        if (c.keyCode == 27) {
            vcClick(0)
        }
    };
    s = passElt.style;
    s.position = "relative";
    s.width = "345px";
    s.padding = "5px";
    s.margin = "5px 0 10px 0";
    s.fontFamily = "monospace";
    s.fontSize = "14px";
    s.textAlign = "left";
    s.color = "black";
    s.border = "2px solid #808080";
    s.backgroundColor = "white";
    b.appendChild(passElt);

    if (a3 == 2) {
        passElt2 = document.createElement("input");
        passElt2.setAttribute("id", "vcPass2");
        passElt2.setAttribute("tabindex", "1002");
        passElt2.type = "password";
        passElt2.onkeyup = function(c) {
            if (c == null) {
                c = window.event
            }
            if ((c.keyCode == 10) || (c.keyCode == 13)) {
                vcClick(1)
            }
            if (c.keyCode == 27) {
                vcClick(0)
            }
        };
        s = passElt2.style;
        s.position = "relative";
        s.width = "345px";
        s.padding = "5px";
        s.margin = "5px 0 10px 0";
        s.fontFamily = "monospace";
        s.fontSize = "14px";
        s.textAlign = "left";
        s.color = "black";
        s.border = "2px solid #808080";
        s.backgroundColor = "white";
        b.appendChild(passElt2);
    }
    
    var c = document.createElement("div");
    c.style.textAlign = "right";
    c.style.fontFamily = "Arial, sans-serif";
    c.style.fontSize = "14px";
    b.appendChild(c);
    var d = document.createElement("input");
    d.setAttribute("tabindex", "1003");
    d.type = "button";
    d.value = LANG.plugins.encryptedpasswords['cancel'];
    d.onclick = function() {
        vcClick(0)
    };
    d.style.margin = "0 0 0 0.5em";
    d.style.padding = "5px";
    d.style.color = "black";
    c.appendChild(d);
    d = document.createElement("input");
    d.setAttribute("tabindex", "1004");
    d.type = "button";
    d.value = a2 != null ? a2 : LANG.plugins.encryptedpasswords['decrypt'];
    d.onclick = function() {
        vcClick(1)
    };
    d.style.margin = "0 0 0 0.5em";
    d.style.padding = "5px";
    d.style.color = "black";
    c.appendChild(d)
}

function vcClick_func(a) {
    overlayElt.style.display = "none";
    winElt.style.display = "none";
    if (a) {
        decrypt(passElt.value)
    } else {}
    overlayElt.parentNode.removeChild(overlayElt);
    winElt.parentNode.removeChild(winElt);
    passElt.parentNode.removeChild(passElt);
    promptElt.parentNode.removeChild(promptElt);
    overlayElt = null;
    winElt = null;
    passElt = null;
    promptElt = null;
}

function getPageScroll() {
    var a;
    if (self.pageYOffset) {
        a = self.pageYOffset
    } else {
        if (document.documentElement && document.documentElement.scrollTop) {
            a = document.documentElement.scrollTop
        } else {
            if (document.body) {
                a = document.body.scrollTop
            }
        }
    }
    var b;
    if (self.pageXOffset) {
        b = self.pageXOffset
    } else {
        if (document.documentElement && document.documentElement.scrollLeft) {
            b = document.documentElement.scrollLeft
        } else {
            if (document.body) {
                b = document.body.scrollLeft
            }
        }
    }
    arrayPageScroll = new Array(b, a);
    return arrayPageScroll
}

function getPageSize() {
    var a, b;
    if (window.innerHeight && window.scrollMaxY) {
        a = document.body.scrollWidth;
        b = window.innerHeight + window.scrollMaxY
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) {
            a = document.body.scrollWidth;
            b = document.body.scrollHeight
        } else {
            a = document.body.offsetWidth;
            b = document.body.offsetHeight
        }
    }
    var c, d;
    if (self.innerHeight) {
        c = self.innerWidth;
        d = self.innerHeight
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            c = document.documentElement.clientWidth;
            d = document.documentElement.clientHeight
        } else {
            if (document.body) {
                c = document.body.clientWidth;
                d = document.body.clientHeight
            }
        }
    }
    if (b < d) {
        pageHeight = d
    } else {
        pageHeight = b
    }
    if (a < c) {
        pageWidth = c
    } else {
        pageWidth = a
    }
    arrayPageSize = new Array(pageWidth, pageHeight, c, d);
    return arrayPageSize
}
