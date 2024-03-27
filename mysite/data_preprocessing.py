from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.feature_extraction.text import TfidfVectorizer

import pickle


def ngram_vectorize(text_train, labels_train, textval, text_test, save_model, split, save_path):
    kwargs = {
        'ngram_range': (1, 2),  # Use 1-grams + 2-grams.
        'dtype': 'int32',
        'strip_accents': 'unicode',
        'decode_error': 'replace',
        'analyzer': 'word',  # Split text into word tokens.
        'min_df': 2,
    }
    vectorizer = TfidfVectorizer(**kwargs)

    # Learn vocabulary from training texts and vectorize training texts.
    train_encoded = vectorizer.fit_transform(text_train)

    # Vectorize validation texts.
    validation_encoded = vectorizer.transform(textval)

     # Vectorize test texts.
    test_encoded = vectorizer.transform(text_test)

    # Select top 'k' of the vectorized features.
    selector = SelectKBest(f_classif, k=min(20000, train_encoded.shape[1]))
    selector.fit(train_encoded, labels_train)
    text_encoded_train = selector.transform(train_encoded).astype('float32')
    text_encoded_val = selector.transform(validation_encoded).astype('float32')
    text_encoded_test = selector.transform(test_encoded).astype('float32')

    if save_model:
        with open(save_path + "_Tokenizer_split_" + str(split) + '.pkl', 'wb') as f:
            pickle.dump(vectorizer, f)

        with open(save_path + "_Selector_split_" + str(split) + '.pkl', 'wb') as f:
            pickle.dump(selector, f)

    return text_encoded_train, text_encoded_val, text_encoded_test

def one_hot_encode(train_labels, val_labels, test_labels):
    encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
    y_train = encoder.fit_transform(train_labels)
    # Get the class labels from the encoder
    class_labels = encoder.categories_[0]

    # Print the class labels and their corresponding positions
    for i, label in enumerate(class_labels):
        print(f"Position {i}: Class {label}")
    y_val = encoder.transform(val_labels)
    y_test = encoder.transform(test_labels)
    return y_train, y_val, y_test