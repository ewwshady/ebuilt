import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ebuilt")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db.system_configs

updated_categories = [
    {
        "key": "beauty",
        "label": "Beauty & Cosmetics",
        "image": "https://orane.com/wp-content/uploads/2020/04/99.-Best-Beauty-Academy-scaled-1.jpg"
    },
    {
        "key": "electronics",
        "label": "Electronics",
        "image": "https://app.dropinblog.com/uploaded/blogs/34241141/files/Electronics.png"
    },
    {
        "key": "pharmacy",
        "label": "Pharmacy",
        "image": "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1024-512,f_auto,q_auto:best/newscms/2017_33/2120896/170815-pharmacy-mn-1340.jpg"
    },
    {
        "key": "clothes",
        "label": "Clothing & Fashion",
        "image": "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg"
    },
    {
        "key": "books",
        "label": "Books",
        "image": "https://i0.wp.com/travellingmandala.com/wp-content/uploads/2023/11/books_prefect-books-scaled.jpg"
    },
    {
        "key": "general",
        "label": "General Store",
        "image": "https://thumbs.dreamstime.com/b/western-wild-west-beauty-test-town-building-vector-old-american-architecture-cartoon-house-texas-retail-shop-grocery-275369851.jpg"
    }
]

result = collection.update_one(
    {"key": "tenant_categories"},
    {
        "$set": {
            "values": updated_categories,
            "updatedAt": datetime.utcnow()
        }
    }
)

if result.matched_count == 0:
    print("tenant_categories config not found")
else:
    print("tenant_categories updated with images")
