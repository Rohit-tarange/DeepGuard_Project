import os
import numpy as np
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from tensorflow import keras
model = keras.models.load_model("backend/models/model.keras", compile=False)
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)
zeros = np.zeros((1, *model.input_shape[1:]))
pred = model.predict(zeros, verbose=0)
print("Prediction on zeros:", pred)
