# ISRC
Information Systems Research Classifier

*Please cite as* Schmidt, Jan-Hendrik; Goutier, Marc; Koch, Ludwig; Schwinghammer, Ronja; and Benlian, Alexander, “Automatic Classification of IS Research Papers: A Design Science Approach” (2024). ECIS 2024 Proceedings.

## Installation

__Recommended Approach: Docker Hub__
- Install [Docker](https://www.docker.com/) on your machine if you haven't already.
- pull the latest image from Docker hub:`docker pull isetud/isrc`
- run docker: `docker run -d -p 5000:5000 isetud/isrc`
- Acces the Flask App via (http://localhost:5000)

__Alternative Approach: Python Environment__
_Pre Requirements: Python version 3.8.10_
1. Clone the ISRC repository
2. Navigate to the project directory
3. Create a virtual environment: 
   `pip install virtualenv`
   `py -3.8 -m venv env`
4. Activate the virtual environment:
   - For Windows: `.\env\Scripts\activate`
   - For macOS/Linux: `source env/bin/activate`
5. Make sure to use Python 3.8.10 otherwise change interpreter:
   `python --version`
6. Install the required dependencies: `pip install -r requirements.txt`
7. Run the application: `python mysite/flask_app.py`
8. Acces the Flask App via (http://localhost:5000)
