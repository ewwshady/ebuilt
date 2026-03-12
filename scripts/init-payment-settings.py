import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not defined")

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client["multi-tenant-ecommerce"]  # Database name

def init_payment_settings():
    tenants_col = db["tenants"]

    # Default payment settings
    default_payment_settings = {
        "cod": {"enabled": True, "label": "Cash on Delivery"},
        "esewa": {"enabled": False},
        "khalti": {"enabled": False},
        "stripe": {"enabled": False},
    }

    # Update tenants where paymentSettings does not exist
    result = tenants_col.update_many(
        {"paymentSettings": {"$exists": False}},
        {"$set": {"paymentSettings": default_payment_settings}},
    )

    print(f"Updated {result.modified_count} tenants with default payment settings")

if __name__ == "__main__":
    try:
        init_payment_settings()
        print(" Payment settings initialized successfully")
    except Exception as e:
        print(" Error initializing payment settings:", e)
    finally:
        client.close()
