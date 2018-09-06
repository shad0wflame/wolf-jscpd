const jscpd = require('jscpd');
const path = require('path');
const rootPath = path.join(__dirname, '..', '..');
const {WolfLinter, WolfLinterError} = require(path.join(rootPath, 'bin', 'wolflinter'));

const _private = new WeakMap();
class WolfJSCPD extends WolfLinter {
    constructor() {
        super();
    }
}

module.exports = WolfJSCPD;