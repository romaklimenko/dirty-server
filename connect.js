const MongoClient = require('mongodb').MongoClient

const mongoClientOptions = {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connect = (connectionString) => {
    return new Promise(resolve => {
        MongoClient.connect(connectionString, mongoClientOptions, (error, db) => {
            if (error) throw error
            resolve(db)
        })
    })
}

module.exports = connect