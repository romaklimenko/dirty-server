const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

const _logger = winston.createLogger({
    level: 'info'
});

if (process.env.NODE_ENV !== 'production') {
    _logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.prettyPrint())
    }));
}
else {
    _logger.add(new LoggingWinston())
}

function jsonPayload(req) {
    const payload = {
        'URL':          req.originalUrl,
        'query':        req.query,
        'method':       req.method,
        'useragent':    req.header('User-Agent'),
        'client':       req.header('X-Client-Key'),
        'session':      req.header('X-Session-Key'),
        'login':        req.header('X-User-Name'),
        'headers':      req.headers
    };
    return payload;
}

const logger = () => {
    return (req, res, next) => {
        if (req.method !== 'OPTIONS') {
            _logger.info('API call', jsonPayload(req));
        }
        next();
    }
};

module.exports = logger;