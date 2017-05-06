'use strict';

const expect = require('chai').expect;
const JSLogger = require('..');
const JSRotator = JSLogger.RotatorStream;
const levels = JSLogger.LOGLEVEL;
const fs = require('fs');

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
        expect(JSON.parse(data).callstack).to.be.a('array');
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
              expect(JSON.parse(data).callstack).to.be.a('array');
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

  describe('#rotating', function() {
    let logfilename = 'test.log';

    before(function(done) {
      try {
        if (fs.existsSync(logfilename)) {
          fs.unlink(logfilename);
        }
      }
      catch (e) {
        done(e);
      }
      done();
    });

    it('should log to rotated file stream', function(done) {
      let stream = new JSRotator(logfilename);
      let logger = new JSLogger();
      logger.pipe(stream);
      logger.error('test1');
      logger.warn('test2');
      logger.info('test3');

      stream.end();
      stream.on('finish', function() {
        let logs = String(fs.readFileSync('test.log')).split('\n').map((item) => {
          let line = item.trim('\n');

          if (item.length !== 0) {
            return JSON.parse(line);
          }

          return {};
        });

        expect(logs[0].message).to.equal('test1');
        expect(logs[0].level).to.equal('error');
        expect(logs[0].callstack).to.be.a('array');
        expect(logs[1].message).to.equal('test2');
        expect(logs[1].level).to.equal('warn');
        expect(logs[2].message).to.equal('test3');
        expect(logs[2].level).to.equal('info');

        done();
      });
    });

    it('should rotate log file successfully', function(done) {
      this.timeout(15000);

      let stream = new JSRotator(logfilename, {
        size:     '10K',
        maxFiles: 10,
        interval: '1d',
      });
      let logger = new JSLogger();
      logger.pipe(stream);

      for (let i=0; i<50; i++) {
        logger.error('test');
      }

      stream.end();
      stream.on('finish', function() {
        done();
      });
    });

  });

});
