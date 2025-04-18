import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
    throw new Error('addn uri to env')
}

if (process.env.NODE_ENV === 'development') {
    //in dev mode use global variable so its preserved and doesnt stop/start when refreshed
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

//exporting this in a seperate module so it can be shared across functions. 
export default clientPromise