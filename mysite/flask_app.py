
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, request, jsonify
import backend
import model_loader

app = Flask(__name__)

@app.before_first_request
def load_models():
    # Load your machine learning models here
    app.models = model_loader.init()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/classify', methods=['POST'])
def call_python_script():
    files = request.files.getlist('files')

    # Call your Python script with the data
    result = backend.predict(app.models, files)

    # Return a JSON response
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0")