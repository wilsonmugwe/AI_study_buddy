from flask import render_template
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import openai
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI
from models import db, User, Session


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Home route
@app.route('/')
def home():
    return render_template("index.html")




@app.route('/ask', methods=['POST'])
def ask_ai():
    data = request.get_json()
    question = data.get("question")
    user_id = data.get("user_id", 1)

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful study assistant. Only answer academic questions."},
                {"role": "user", "content": question}
            ]
        )
        answer = response.choices[0].message.content.strip()

        session_entry = Session(user_id=user_id, question=question, answer=answer)
        db.session.add(session_entry)
        db.session.commit()

        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    try:
        sessions = Session.query.filter_by(user_id=user_id).order_by(Session.created_at.desc()).limit(10).all()

        history = [
            {
                "question": s.question,
                "answer": s.answer,
                "timestamp": s.created_at.strftime("%Y-%m-%d %H:%M:%S")
            } for s in sessions
        ]

        return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
