const winston = require('winston');

function jsonPayload(req) {
    const payload = {
        'IP':           req.connection.remoteAddress,
        'URL':          req.originalUrl,
        'query':        req.query,
        'method':       req.method,
        'headers':      req.headers
    };
    return payload;
}

const logger = () => {
    return (req, res, next) => {
        if (req.method !== 'OPTIONS' && req.originalUrl.indexOf('keepalive/dirty') > 0) {
            const _logger = winston.createLogger({
                level: 'info'
            });
            
            if (req.header('X-User-Name')) {
                _logger.add(new winston.transports.File({
                    format: winston.format.combine(winston.format.prettyPrint()),
                    filename: `logs/${req.header('X-User-Name')}.${new Date().toISOString().substring(0, 10)}.log`,
                    handleExceptions: true,
                }));
            }
            
            _logger.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.prettyPrint())
            }));

            _logger.info('API call', jsonPayload(req));
        }
        next();
    }
};

module.exports = logger;