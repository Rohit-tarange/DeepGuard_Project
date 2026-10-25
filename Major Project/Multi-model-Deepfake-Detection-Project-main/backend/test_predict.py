import requests
with open("test.mp4", "wb") as f:
    f.write(b"fake video content")
files = {'file': open('test.mp4', 'rb')}
r = requests.post("http://localhost:8000/predict", files=files)
print(r.json())
