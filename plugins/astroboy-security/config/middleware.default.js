module.exports = {

  'astroboy-security-cto': {
    priority: 2,
    enable: true,
    options: 'nosniff'
  },

  'astroboy-security-frameOptions': {
    priority: 2,
    enable: true,
    options: 'SAMEORIGIN'
  },

  'astroboy-security-hsts': {
    priority: 2,
    enable: true,
    options: {
      maxAge: 365 * 24 * 3600
    }
  },

  'astroboy-security-xss': {
    enable: true,
    priority: 10
  },

  'astroboy-security-xssProtection': {
    priority: 2,
    enable: true,
    options: '1; mode=block'
  },

};