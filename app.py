# ==========================================
# MERCHANT UPI - FLASK AI BACKEND
# ==========================================

from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv
import os

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")

print("API KEY FOUND:", bool(api_key))

client = OpenAI(api_key=api_key)


# ==========================================
# MAIN WEBSITE
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# AI CHATBOT
# ==========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_message = data.get("message", "").strip()

        if not user_message:

            return jsonify({
                "reply": "Please type a question."
            })


        # ==========================================
        # AI INSTRUCTIONS
        # ==========================================

        system_prompt = """
You are Merchant AI, the intelligent assistant
inside a hackathon project called Merchant UPI.

Your job is to answer BOTH:

1. Questions about the Merchant UPI website/project.
2. General questions asked by the merchant or judges.

PROJECT INFORMATION:

Merchant UPI is a smart payment and business
assistance platform designed mainly for small
and local merchants.

MAIN FEATURES:

- UPI payment QR code
- Payment recording
- Transaction dashboard
- Automatic fraud-risk detection
- Transaction anomaly detection
- Smart alerts
- Sales analytics
- Average transaction analysis
- Merchant credit-score estimation
- AI chatbot

SOLUTION PATH:

Customer makes or records a payment
        ↓
Transaction is captured
        ↓
Transaction data is analyzed
        ↓
Amount and transaction patterns are checked
        ↓
Risk score is generated
        ↓
Normal / Review / High Risk is shown
        ↓
Smart alert can be generated
        ↓
Dashboard and sales analytics are updated
        ↓
Merchant can ask Merchant AI for help

AUTOMATIC FRAUD-RISK DETECTION:

The prototype can consider signals such as:

- Very large transaction amount
- Transaction much higher than previous average
- Repeated transactions from the same customer
- Large payment from an existing customer
- Unusually high transaction frequency

IMPORTANT:

This is a hackathon prototype and its fraud
detection is a rule-based risk model.

Do NOT claim that it is a production banking
fraud detection system.

CREDIT SCORE:

The website calculates an estimated merchant
credit-readiness score using business activity
such as transaction count, payment success rate
and sales.

It is NOT an official bank or credit-bureau score.

TECHNOLOGY:

- HTML
- CSS
- JavaScript
- Python
- Flask
- OpenAI API

HOW TO ANSWER:

Answer the user's actual question directly.

If a judge asks about the project, explain it
clearly and confidently.

If the question is technical, explain the
technical process.

If the question is general, answer the general
question instead of forcing the answer to be
about Merchant UPI.

If the question is unrelated to the project,
you can still answer it normally.

Do not repeatedly give the same answer.

Keep answers concise but informative.

For presentation questions, use simple language
that a student can explain to judges.

Never invent features that are not listed above.

If something is not implemented, clearly say:
"This is a future enhancement."

You are an assistant, not a salesperson.
Be accurate and honest.
"""


        # ==========================================
        # ASK AI
        # ==========================================

        response = client.responses.create(

            model="gpt-5.6-luna",

            instructions=system_prompt,

            input=user_message

        )


        # ==========================================
        # GET AI ANSWER
        # ==========================================

        answer = response.output_text


        return jsonify({
            "reply": answer
        })


    except Exception as e:

        print("AI ERROR:", str(e))

        return jsonify({

            "reply":
            "⚠️ Sorry, I could not process that question right now."

        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )