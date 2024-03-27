import pickle

from keras.models import load_model


def init():
    models = {}
    models["relevance"] = load_relevance_model()
    models["group"] = load_group_model()
    models["method"] = load_method_models()

    return models

# Function to load the required relevance model and its preprocesing functions


def load_relevance_model():
    relevance_model = {}

    path = "./mysite/models/relevance/"
    # Initialize preprocessing objects
    tokenizer, selector = None, None

    # Load the model
    model = load_model(path + "model.h5")
    # Load the saved tokenizer
    with open(path + "tokenizer.pkl", 'rb') as f:
        tokenizer = pickle.load(f)
        # Load the saved selecotor
    with open(path + "selector.pkl", 'rb') as f:
        selector = pickle.load(f)

    relevance_model = {}
    relevance_model["model"] = model
    relevance_model["tokenizer"] = tokenizer
    relevance_model["selector"] = selector

    return relevance_model

# Function to load the required group model and its preprocesing functions


def load_group_model():
    group_model = {}

    path = "./mysite/models/group/"
    # Initialize preprocessing objects
    tokenizer, selector = None, None

    # Load the model
    model = load_model(path + "model.h5")
    # Load the saved tokenizer
    with open(path + "tokenizer.pkl", 'rb') as f:
        tokenizer = pickle.load(f)
        # Load the saved selecotor
    with open(path + "selector.pkl", 'rb') as f:
        selector = pickle.load(f)

    group_model = {}
    group_model["model"] = model
    group_model["tokenizer"] = tokenizer
    group_model["selector"] = selector

    return group_model


def load_method_models():
    groups = ["A", "D", "E", "F"]
    method_models = {}
    for group in groups:
        method_models[group] = {}
        basePath = "./mysite/models/method/" + group + "/"
        method_models[group]["model"] = load_model(basePath + "model.h5")
        # Load the saved tokenizers
        with open(basePath + "tokenizer.pkl", 'rb') as f:
            method_models[group]["tokenizer"] = pickle.load(f)
            # Load the saved SelectKBest object
        with open(basePath + "selector.pkl", 'rb') as f:
            method_models[group]["selector"] = pickle.load(f)

    return method_models
