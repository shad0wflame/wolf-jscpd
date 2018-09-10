const jscpd = require('jscpd');
const path = require('path');
const { WolfLinter } = require(path.join(binPath, 'wolflinter'));

class WolfDupeError {

    constructor(lines, tokens, firstFile, secondFile, fragment) {
        this.lines = lines;
        this.tokens = tokens;
        this.firstFile = firstFile;
        this.secondFile = secondFile;
        this.fragment = fragment;
    }
}

const _private = new WeakMap();
class WolfJSCPD extends WolfLinter {

    constructor() {
        super();

        this.options = {
            path: rootPath,
            files: '**/*.ts',
            exclude: ['**/node_modules/**'],
            reporter: 'json',
            silent: true
        };

        _private.set(this, {
            /**
             * @desc {Function} _processDupeCheckResults
             * @param lines
             * @param tokens
             * @param firstFile
             * @param secondFile
             * @param fragment
             * @private
             */
            _processDupeCheckResults: ({lines, tokens, firstFile, secondFile, fragment}) => {
                return new WolfDupeError(lines, tokens, firstFile, secondFile, fragment);
            },
            /** @private
             *  @override
             *  {Array<WolfDupeError>>} _errors
             **/
            _errors: []
        })
    }

    track() {
        const result = new jscpd().run(this.options);
        result.report.duplicates.map(_private.get(this)._processDupeCheckResults)
                                .forEach((dupeErr) => this.addErrors(dupeErr));
    }

    addErrors(err) {
        const _errors = _private.get(this)._errors;
        _errors.push(err);
    }

    getErrors() {
        return _private.get(this)._errors;
    }
}

module.exports = WolfJSCPD;