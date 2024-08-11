const zlib = require('zlib');

function gzipResponseMiddleware(req, res, next) {
    const originalSend = res.send.bind(res);
    res.send = (body) => {
        if (typeof body === 'object') {
            const json = JSON.stringify(body);

            zlib.gzip(json, (err, compressed) => {
                if (err) {
                    return next(err);
                }

                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Length', compressed.length.toString());

                originalSend(compressed);
            });
            return res;
        } else {
            return originalSend(body);
        }
    };
    next();
}

module.exports = gzipResponseMiddleware;