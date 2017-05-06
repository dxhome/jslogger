'use strict';

const path = require("path");
const inherits = require('util').inherits;
const merge = require('merge');
const RStream = require('rotating-file-stream');
const utils = require('./utils');

/**
 * Writable rotation stream
 * @param filepath path to write things
 * @param options rotation options
 * @returns {RotatorStream}
 * @constructor
 */
function RotatorStream(filepath, options) {
    if (!(this instanceof RotatorStream)) {
        return new RotatorStream(filepath, options);
    }

    this._options = merge(OPTIONS_DEFAULT, options);

    let tmp = path.parse(filepath);

    this._options.path = tmp.dir.length === 0 ? './' : tmp.dir;

    function _filename(filename) {
        return function(time, index) {
            if(! time)
                return filename;

            return filename + '.' + utils.pad(index) + '.' + utils.toISOString(time);
        };
    }

    RStream.call(this, _filename(tmp.base), this._options);
}

const OPTIONS_DEFAULT = {
    size:     '10M', // rotate every 10 MegaBytes written
    maxFiles: 10,    // number of rotated files
    rotationTime: true  // use rotation time
    // compress: 'gzip' // compress rotated files
};

inherits(RotatorStream, RStream);

module.exports = RotatorStream;
