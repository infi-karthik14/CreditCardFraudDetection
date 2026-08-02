import joblib
import pandas as pd

# Load trained model
model = joblib.load("../models/fraud_model.pkl")


def predict_transaction(transaction_data):
    """
    Predict whether a transaction is Fraud or Genuine.
    """

    # Convert dictionary to DataFrame
    df = pd.DataFrame([transaction_data])

    # Predict   
    prediction = model.predict(df)[0]

    # Probability of fraud
    probability = model.predict_proba(df)[0][1]

    result = "Fraud" if prediction == 1 else "Genuine"

    return {
        "prediction": result,
        "probability": round(float(probability), 4)
    }