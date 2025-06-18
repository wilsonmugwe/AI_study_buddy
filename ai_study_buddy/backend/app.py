from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    api_key = os.getenv("OPENAI_API_KEY")
    return jsonify({"message": "AI Study Buddy is live", "api_key_present": bool(api_key)})
    


if __name__ == '__main__':
    app.run(debug=True)
