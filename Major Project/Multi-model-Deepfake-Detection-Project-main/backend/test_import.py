try:
    from tensorflow import keras
    print("Keras loaded successfully")
except Exception as e:
    print(f"Error loading keras: {repr(e)}")
