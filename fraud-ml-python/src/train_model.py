import os
import joblib
from evaluate import evaluate_model

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from preprocess import load_data, preprocess_data, split_data


# Load dataset
df = load_data("../dataset/creditcard.csv")

# Preprocess
X, y = preprocess_data(df)

# Split data
X_train, X_test, y_train, y_test = split_data(X, y)

# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight="balanced"
)

# Train model
print("Training model...")
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
evaluate_model(model, X_test, y_test)

# Save model
os.makedirs("../models", exist_ok=True)

joblib.dump(model, "../models/fraud_model.pkl")

print("\nModel saved successfully!")