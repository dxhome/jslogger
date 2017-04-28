'use strict';

const expect = require('chai').expect;
const JSLogger = require('../lib/jslogger');
const levels = require('../lib/consts').LOGLEVEL;

describe('JSLogger', function() {

  describe('@constructor', function() {

    it('should create a new logger with default allowed level', function () {
        let logger = new JSLogger();
        expect(logger).to.be.instanceOf(JSLogger);
        expect(logger._level).to.equal(levels.info);
    });

    it('should create a new logger without the new', function () {
        expect(JSLogger()).to.be.instanceOf(JSLogger);
    });

  });

  describe('#basic', function() {

    it('should queue logs until stream is consumed in sequence', function(done) {
      let counter = 0;
      let logger = new JSLogger();
      logger.info('test1');
      logger.info('test2');
      logger.info('test3');
      logger.on('data', function(data) {
          counter++;
          expect(JSON.parse(data).level).to.equal('info');
          expect(JSON.parse(data).message).to.equal('test' + counter.toString());
        if (counter === 3) {
          done();
        }
      });
    });

  });

  describe('#error', function() {

    it('should log if the allowed level is set properly', function(done) {
      let logger = new JSLogger(levels.error);
      logger.once('data', function(data) {
        expect(JSON.parse(data).message).to.equal('error');
        expect(JSON.parse(data).level).to.equal('error');
        done();
      });
      logger.error('error');
    });

    it('should not log if allowed level is lower than the logging level', function(done) {
      let logger = new JSLogger(levels.nothing);
      logger.once('data', function(data) {
        done(new Error('Incorrectly logging beyond allowed level'));
      });
      logger.error('error');
      setImmediate(done);
    });

  });

  describe('#warn', function() {

    it('should log if the verbosity is set properly', function(done) {
      var logger = new JSLogger(levels.warn);
      logger.once('data', function(data) {
        expect(JSON.parse(data).message).to.equal('warn');
        expect(JSON.parse(data).level).to.equal('warn');
        done();
      });
      logger.warn('warn');
    });

    it('should not log if allowed level is lower than the logging level', function(done) {
      var logger = new JSLogger(levels.error);
      logger.once('data', function(data) {
        done(new Error('Incorrectly logging beyond allowed level'));
      });
      logger.warn('warn');
      setImmediate(done);
    });

  });

  describe('#info', function() {

    it('should log if the verbosity is set properly', function(done) {
      var logger = new JSLogger(levels.info);
      logger.once('data', function(data) {
        expect(JSON.parse(data).message).to.equal('info');
        expect(JSON.parse(data).level).to.equal('info');
        done();
      });
      logger.info('info');
    });

    it('should not log if allowed level is lower than the logging level', function(done) {
      var logger = new JSLogger(levels.warn);
      logger.once('data', function(data) {
        done(new Error('Incorrectly logging beyond allowed level'));
      });
      logger.info('info');
      setImmediate(done);
    });

  });

  describe('#debug', function() {

    it('should log if the verbosity is set properly', function(done) {
      var logger = new JSLogger(levels.debug);
      logger.once('data', function(data) {
        expect(JSON.parse(data).message).to.equal('debug');
        expect(JSON.parse(data).level).to.equal('debug');
        done();
      });
      logger.debug('debug');
    });

    it('should not log if allowed level is lower than the logging level', function(done) {
      var logger = new JSLogger(levels.info);
      logger.once('data', function(data) {
        done(new Error('Incorrectly logging beyond allowed level'));
      });
      logger.debug('debug');
      setImmediate(done);
    });

  });

    describe('#trace', function() {

      it('should log if the verbosity is set properly', function(done) {
          var logger = new JSLogger(levels.trace);
          logger.once('data', function(data) {
              expect(JSON.parse(data).message).to.equal('trace');
              expect(JSON.parse(data).level).to.equal('trace');
              done();
          });
          logger.trace('trace');
      });

      it('should not log if allowed level is lower than the logging level', function(done) {
          var logger = new JSLogger(levels.debug);
          logger.once('data', function(data) {
              done(new Error('Incorrectly logging beyond allowed level'));
          });
          logger.trace('trace');
          setImmediate(done);
      });

    });

});
