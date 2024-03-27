# syntax=docker/dockerfile:1

FROM python:3.8.10

WORKDIR /isrc

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT  ["python"]
CMD ["mysite/flask_app.py"]