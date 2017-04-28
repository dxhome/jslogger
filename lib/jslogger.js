'use strict';

const inherits = require('util').inherits;
const printf = require('util').format;
const ReadableStream = require('readable-stream');
const levels = require('./consts').LOGLEVEL;

/**
 * JSON format logger with readable stream and rotation
 * @constructor
 * @extends {ReadableStream}
 * @param {Number} allowedLevel - 0: none, 1: error, 2: warn, 3: info, 4: debug
 */
function JSLogger(allowedLevel) {
  if (!(this instanceof JSLogger)) {
    return new JSLogger(allowedLevel);
  }

  this._level = typeof allowedLevel === 'undefined' ? levels.info : allowedLevel;

  ReadableStream.call(this);

  this.pause();
}

inherits(JSLogger, ReadableStream);

/**
 * Implements ReadableStream#_read
 * @private
 */
JSLogger.prototype._read = function() {
  this.resume();
};

/**
 * Adds a log message to the read stream
 * @param {String} type - ['error', 'warn', 'info', 'debug', 'trace']
 * @param {String} format - log format in printf style
 */
JSLogger.prototype._log = function(type, format) {
  if (levels[type] > this._level) {
    return;
  }

  let args = Array.prototype.slice.call(arguments, 2);
  let message = printf.apply(printf, [format].concat(args));

  let log = {
    level: type,
    message: message,
    timestamp: new Date()
  };

  this.push(JSON.stringify(log) + '\n');

  this.emit('log', log);
};

/**
 * Trace log
 * @param {String} message
 */
JSLogger.prototype.trace = function() {
    this._log.apply(this, ['trace'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Debug log
 * @param {String} message
 */
JSLogger.prototype.debug = function() {
    this._log.apply(this, ['debug'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Information log
 * @param {String} message
 */
JSLogger.prototype.info = function() {
    this._log.apply(this, ['info'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Warning log
 * @param {String} message
 */
JSLogger.prototype.warn = function() {
    this._log.apply(this, ['warn'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Error log
 * @param {String} message
 */
JSLogger.prototype.error = function() {
    this._log.apply(this, ['error'].concat(Array.prototype.slice.call(arguments)));
};

module.exports = JSLogger;
