# Flask Server README

This README provides essential information for setting up and running the Flask server for your project.

## Prerequisites

Before you can start the Flask server, ensure that you have the following prerequisites installed:

- Python 3.11
- [Flask](https://flask.palletsprojects.com/en/2.1.x/): You can install Flask and its dependencies using pip by running:

    ```bash
    pip install -r requirements.txt
    ```

## Configuration

To run the Flask server successfully, you need to add a `secrets.json` file to the "backend" directory. This JSON file should contain any sensitive information or configuration settings needed by your application. PLEASE DO NOT COMMIT IT TO THE REPO!

## Starting the Flask Server

To start the Flask server, navigate to the project's root directory and execute the following command:

```bash
python app.py
