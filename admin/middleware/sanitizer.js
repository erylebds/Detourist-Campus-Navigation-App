// middleware to sanitize all string inputs in request body
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key]
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/\//g, '&#x2F;');
            }
        });
    }
    next();
};

// escape HTML characters to prevent XSS attacks
const sanitizeHtml = (text) => {
    if (typeof text !== 'string') return text;
    
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// allow only safe HTML tags for formatted text
const allowBasicHtml = (text) => {
    if (typeof text !== 'string') return text;
    
    const allowed = ['<b>', '</b>', '<i>', '</i>', '<br>', '<p>', '</p>'];
    let sanitized = text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    allowed.forEach(tag => {
        const escaped = tag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        sanitized = sanitized.replace(new RegExp(escaped, 'g'), tag);
    });
    
    return sanitized;
};

module.exports = {
    sanitizeInput,
    sanitizeHtml,
    allowBasicHtml
};
