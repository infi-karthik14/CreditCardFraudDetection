from preprocess import load_data, preprocess_data, split_data

df = load_data("fraud-ml-python/dataset/creditcard.csv")

X, y = preprocess_data(df)

X_train, X_test, y_train, y_test = split_data(X, y)

print("Training Data :", X_train.shape)
print("Testing Data :", X_test.shape)