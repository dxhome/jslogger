'use strict';

const JSLogger = require('../');

let logger = new JSLogger();

logger.pipe(process.stdout);

logger.info('info log');

logger.error('error log');

