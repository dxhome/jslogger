Kad JSON Logger
===============

---
Streaming log-rotated built-in logger in JSON format.

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

Pipe the log output to any writable stream:

```js
// Make the logs your program's output
logger.pipe(process.stdout);
// Write the logs to a file
logger.pipe(fs.createWriteStream('logfile.txt'));
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
