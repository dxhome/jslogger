'use strict';

const inherits = require('util').inherits;
const merge = require('merge');
const RStream = require('rotating-file-stream');

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

    RStream.call(this, filepath, this._options);
}

const OPTIONS_DEFAULT = {
    size:     '10M', // rotate every 10 MegaBytes written
    maxFiles: 10,    // number of rotated files
    interval: '1d',  // rotate daily
    compress: 'gzip' // compress rotated files
};

inherits(RotatorStream, RStream);

module.exports = RotatorStream;
