import io
from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams
import numpy as np


def predict(models, files):
    try:
        result = {}
        if files:
            for file in files:
                filename = file.filename
                result[filename] = {}
                content = get_file_content(file)
                result[filename]["content"] = content
                relevance, relevance_probability = predict_relevance(
                    models["relevance"]["model"], models["relevance"]["tokenizer"], models["relevance"]["selector"], content)
                result[filename]["relevance"] = relevance
                result[filename]["relevance_probability"] = float(
                    relevance_probability)

                if(relevance == 1):
                    group, group_probability = predict_group(
                        models["group"]["model"], models["group"]["tokenizer"], models["group"]["selector"], content)
                    result[filename]["group"] = group
                    result[filename]["group_probability"] = float(
                        group_probability)
                    method, method_probability = predict_method(
                        models["method"][group]["model"], models["method"][group]["tokenizer"], models["method"][group]["selector"], content, group)
                    result[filename]["method"] = method
                    result[filename]["method_probability"] = float(
                        method_probability)
            return result
        else:
            return {"error": "No files uploaded."}
    except Exception as e:
        return {"error": str(e)}


def get_file_content(file):
    text = ''
    # Create a stream object to hold the extracted text
    text_stream = io.StringIO()
    # Set the parameters for analysis
    laparams = LAParams()
    # Extract the text from the PDF file and write it to the stream object
    extract_text_to_fp(file, text_stream, laparams=laparams)
    # Get the extracted text from the stream object
    text = text_stream.getvalue()

    return text


def predict_relevance(model, tokenizer, selector, text):
    # Tokenize the new text for the relevance
    relevance_sequence = tokenizer.transform([text])
    relevance_encoded = selector.transform(
        relevance_sequence).astype('float32')

    # Make relevance predictions
    prediction = model.predict(relevance_encoded)
    predicted_probability = prediction[0]
    threshold = 0.5  # Adjust the threshold based on your specific task

    if predicted_probability >= threshold:
        predicted_class = 1  # Positive class
    else:
        predicted_class = 0  # Negative class

    return predicted_class, predicted_probability


def predict_group(model, tokenizer, selector, text):
    # Tokenize the new text for the method
    group_sequence = tokenizer.transform([text])
    group_encoded = selector.transform(group_sequence).astype('float32')

    # Make method predictions
    '''
        Position 0: Class A
        Position 1: Class D
        Position 2: Class E
        Position 3: Class F
        '''
    classes = ["A", "D", "E", "F"]
    prediction = model.predict(group_encoded)
    predicted_class = np.argmax(prediction[0])
    print(f"Predicted Class: {classes[predicted_class]}")
    print(f"Probabilities: {prediction[0][predicted_class]}")

    return classes[predicted_class], prediction[0][predicted_class]


def predict_method(model, tokenizer, selector, text, group):
    # Tokenize the new text for the method
    method_sequence = tokenizer.transform([text])
    method_encoded = selector.transform(method_sequence).astype('float32')

    # Make method predictions
    '''
        Group C:
        Position 0: Class CM
        Position 1: Class L
        Position 2: Class O
        Position 3: Class V

        Group D:
        Position 0: Class G
        Position 1: Class M
        Position 2: Class SW

        Group E:
        Position 0: Class CA
        Position 1: Class CS
        Position 2: Class EO
        Position 3: Class FE
        Position 4: Class GT
        Position 5: Class I
        Position 6: Class LE
        Position 7: Class OE
        Position 8: Class S
        Position 9: Class SD

        Group F:
        Position 0: Class MMS
        Position 1: Class SNA
        '''
    classes = {
        "A": ["CM", "L", "O", "V"],
        "D": ["G", "M", "SW"],
        "E": ["CA", "CS", "EO", "FE", "GT", "I", "LE", "OE", "S", "SD"],
        "F": ["MMS", "SNA"],
    }
    prediction = model.predict(method_encoded)
    predicted_class = np.argmax(prediction[0])

    return classes[group][predicted_class], prediction[0][predicted_class]
