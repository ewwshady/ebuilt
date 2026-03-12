require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing");

const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    const db = client.db("ebuilt");

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ role: 1 });
    await db.collection("users").createIndex({ tenantId: 1 });

    await db.collection("tenants").createIndex({ subdomain: 1 }, { unique: true });
    await db.collection("tenants").createIndex({ status: 1 });
    await db.collection("tenants").createIndex({ ownerId: 1 });

    await db.collection("products").createIndex({ tenantId: 1 });
    await db.collection("products").createIndex(
      { slug: 1, tenantId: 1 },
      { unique: true }
    );
    await db.collection("products").createIndex({ status: 1 });
    await db.collection("products").createIndex({ category: 1 });

    await db.collection("orders").createIndex({ tenantId: 1 });
    await db.collection("orders").createIndex(
      { orderNumber: 1 },
      { unique: true }
    );
    await db.collection("orders").createIndex({ customerId: 1 });
    await db.collection("orders").createIndex({ status: 1 });
    await db.collection("orders").createIndex({ createdAt: -1 });

    console.log("✅ All indexes created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    process.exit(0);
  }
})();
