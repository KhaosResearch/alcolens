const mongoose = require('mongoose');
// require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

console.log('Connecting to:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected successfully');
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));

        // Check 'test' database
        const testDb = mongoose.connection.useDb('test');
        const collections = await testDb.db.listCollections().toArray();
        console.log('Collections in test DB:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await testDb.collection(col.name).countDocuments();
            console.log(`Collection ${col.name}: ${count} documents`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
