/**
 * Static methods to show GUI elements
 */
class GUI {
    /**
     * Display a simple toast message that vanishes after a short time
     *
     * @param {string} msg Text of the message
     * @param {string} className Additional class for the message
     */
    static toast(msg, className) {
        const div = document.createElement('div');
        div.className = 'encryptedpasswords-toast ' + className;
        div.innerText = msg;
        document.body.appendChild(div);

        window.setTimeout(function () {
            document.body.removeChild(div);
        }, 3500);
    }
}
