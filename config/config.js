module.exports = {
    'port': process.env.PORT || '1337',
    'database': process.env.DATABASE || 'mongodb://gunpowder-dev:1j7d98ko00W@ds021000.mlab.com:21000/gunpowder-dev',
    'secret': process.env.SECRET || 'djufikdjshuyejkopwqmnjuidusijd',
    'tokenExpiration': process.env.TOKEN || 10080 // 1 week  -- Value in # of minutes
};