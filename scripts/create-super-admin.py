import os
import bcrypt
from pymongo import MongoClient
from datetime import datetime

# Load environment variables (if using .env file)
from dotenv import load_dotenv
load_dotenv()

# MongoDB connection string from environment
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not defined")

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client["ebuilt"]  # Database name

def create_super_admin():
    try:
        users_col = db["users"]

        # Check if super admin exists
        existing_admin = users_col.find_one({"role": "super_admin"})
        if existing_admin:
            print("Super admin already exists")
            return

        # Hash password
        password = "ckboss"
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12))

        super_admin = {
            "email": "admin@ck.com",
            "password": hashed_password.decode("utf-8"),
            "name": "Super Admin",
            "role": "super_admin",
            "tenantId": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Insert super admin
        users_col.insert_one(super_admin)

        print("Super admin created successfully")
        print("Email: admin@ck.com")
        print("Password: ckboss")
        print("Please change the password after first login")

    except Exception as e:
        print("Error creating super admin:", e)
    finally:
        client.close()

if __name__ == "__main__":
    create_super_admin()
