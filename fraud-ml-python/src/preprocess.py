import pandas as pd
from sklearn.model_selection import train_test_split


def load_data(file_path):
    """
    Load the dataset
    """
    df = pd.read_csv(file_path)
    return df


def preprocess_data(df):
    """
    Separate features and target
    """
    X = df.drop("Class", axis=1)
    y = df["Class"]

    return X, y


def split_data(X, y, test_size=0.2, random_state=42):
    """
    Split the dataset into training and testing sets
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    return X_train, X_test, y_train, y_test