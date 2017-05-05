JSON Logger
===============

Description
---
Streaming logger in JSON format with rotator streaming supported

Quick Start
-----------

Install with NPM:

```
npm install my-jslogger --save
```

Use in your code:

```js
// Import dependencies
var JSLogger = require('my-jslogger');

// Create a new logger
var logger = new JSLogger(JSLogger.LOGLEVEL.info);

```

Pipe the log output to any writable stream or built-in rotator stream:

```js
// Make the logs your program's output
logger.pipe(process.stdout);

// Write the logs to a file
logger.pipe(fs.createWriteStream('logfile.txt'));
```

Pipe the log output to a built-in rotator stream:

```js
// Write the logs to a file rotator
var RotatorStream = require('my-jslogger').RotatorStream;

var stream = RotatorStream('logfile.log', {
    size:     '10M', // rotate every 10 MegaBytes written
    interval: '1d',  // rotate daily
    compress: 'gzip' // compress rotated files
});

logger.pipe(stream);
```

Customize Log Rotator Stream
-----------
## [new] RotatorStream(filename, options)
Create a new log rotator stream

## Default Options
```js
const OPTIONS_DEFAULT = {
    size:     '10M', // rotate every 10 MegaBytes written
    maxFiles: 10,    // number of rotated files
    interval: '1d',  // rotate daily
    compress: 'gzip' // compress rotated files
};
```

## Customizable options
### filename {String}
File destination

### options {Object}
* compress: {True} (default: null) Enable compression for rotated file.
* interval: {String} (default: null) Specifies the time interval to rotate the file.
* maxFiles: {Integer} (default: null) Specifies the maximum number of rotated files to keep.
* rotate: {Integer} (default: null) Enables the classical UNIX __logrotate__ behaviour.
* size: {String} (default: null) Specifies the file size to rotate the file.

#### size

Accepts a positive integer followed by one of these possible letters:

* __B__: Bites
* __K__: KiloBites
* __M__: MegaBytes
* __G__: GigaBytes

```javascript
  size: '300B', // rotates the file when size exceeds 300 Bytes
                // useful for tests
```

```javascript
  size: '300K', // rotates the file when size exceeds 300 KiloBytes
```

```javascript
  size: '100M', // rotates the file when size exceeds 100 MegaBytes
```

```javascript
  size: '1G', // rotates the file when size exceeds a GigaByte
```

#### interval

Accepts a positive integer followed by one of these possible letters:

* __s__: seconds. Accepts integer divider of 60.
* __m__: minutes. Accepts integer divider of 60.
* __h__: hours. Accepts integer divider of 24.
* __d__: days

```javascript
  interval: '5s', // rotates at seconds 0, 5, 10, 15 and so on
                  // useful for tests
```

```javascript
  interval: '5m', // rotates at minutes 0, 5, 10, 15 and so on
```

```javascript
  interval: '2h', // rotates at midnight, 02:00, 04:00 and so on
```

```javascript
  interval: '1d', // rotates at every midnight
```

License
-------

MIT

Copyright (c) 2017 dxhome

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
