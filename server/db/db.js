const Sequelize = require('sequelize')
// const pkg = require('../../package.json')

// const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')
if (process.env.NODE_ENV !== 'production') require('../../secrets')

//process.env.DATABASE_URL
if (process.env.NODE_ENV !== 'production') require('../../secrets')

const db = new Sequelize(process.env.DATABASE_URL, {
  logging: false
})
module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
