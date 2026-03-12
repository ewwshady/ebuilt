import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

if (!process.env.MONGODB_DB) {
  throw new Error("Please add your MongoDB_DB to .env.local")
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Log connection errors but don't throw (allows app to start for testing)
clientPromise.catch((error) => {
  console.error("MongoDB connection failed:", error.message)
})

/**
 * Get database instance (no hardcoded db name anywhere else)
 */
export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

export default clientPromise
