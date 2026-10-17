import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Connects on first use, not when this file is imported: `next build`
// imports every route while collecting page data, so a missing MONGODB_URI
// (or an unreachable database) used to fail the build. A missing URI now
// fails the request that needs the database instead.
//
// One shared connection per server process; in development it's kept on
// `global` so hot reloads don't open a new one each time.
let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development" && global._mongoClientPromise) {
    return global._mongoClientPromise;
  }
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Missing MONGODB_URI environment variable");
    }
    clientPromise = new MongoClient(uri).connect();
    if (process.env.NODE_ENV === "development") {
      global._mongoClientPromise = clientPromise;
    }
  }
  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB);
}
