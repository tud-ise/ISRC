# Information Systems Research Classifier (ISRC) 

*Please cite as* Schmidt, Jan-Hendrik; Goutier, Marc; Koch, Ludwig; Schwinghammer, Ronja; and Benlian, Alexander, “Automatic Classification of IS Research Papers: A Design Science Approach” (2024). ECIS 2024 Proceedings.

## Introduction
Scientometric studies play a crucial role in revealing trends in scientific research. The IS discipline also has a rich history of using scientometric studies to understand its own development. However, conducting scientometric studies and identifying trends is often hampered by the time-consuming and labor-intensive manual classification of large volumes of research papers. To overcome these challenges, we take a design science approach and propose the development of a text classification-based assistance system that can support IS scholars in classifying the relevance, research paradigms, and research methods of research papers. 

The artifact we have developed, the ISRC, helps IS scholars to 
1. assess the relevance of a research paper to the IS discipline (depending on the research objective of the research paper, which must focus on the study of social phenomena such as the appropriate adoption and use of information systems in organizations or public administration)
2. identify the research paradigm pursued by the IS-related research papers (design-oriented, empirical, formal-analytical, or other)
3. Identify the research method of an IS-related research paper (in multi/mixed method studies, the first mentioned research method).

The ISRC is based on a hierarchical model structure of six MLP models (one model each for identifying relevance and research paradigm, plus four models for classifying research methods (one for each paradigm))

![Alt text](/mysite/static/images/ISRC_GUI.png?raw=true "GUI of ISRC")

More information about the objectives and development process of the ISRC can be found in the conference publication. Installation instructions can be found below.

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
8. Acces the Flask App via (http://127.0.0.1:5000)
