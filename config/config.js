module.exports = {
    'port': process.env.PORT || '1337',
    'database': process.env.DATABASE || 'mongodb://drillMaster:sandboxMaster@ds027835.mongolab.com:27835/gunpowder_sandbox',
    'secret': 'djufikdjshuyejkopwqmnjuidusijd',
    'tokenExpiration': process.env.TOKEN || 1440 //24 hours
};