from flask import Flask, request, jsonify
from predict import predict_transaction

app = Flask(__name__)


@app.route("/")
def home():
    return "Credit Card Fraud Detection API is Running"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "Healthy",
        "service": "Fraud Detection API"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        transaction = request.get_json()

        result = predict_transaction(transaction)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)