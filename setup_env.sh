#!/bin/bash

# Define variables
VENV_NAME="myenv"
VENV_PATH="$HOME/Desktop/$VENV_NAME"
REQUIREMENTS_FILE="requirements.txt"

sudo apt update
sudo apt install nodejs libglib2.0-dev python3 python3-venv python3-pip

echo "Creating $VENV_NAME environment at $VENV_PATH..."
python3 -m venv "$VENV_PATH"

echo "$VENV_NAME created."

# Activate the virtual environment
source "$VENV_PATH/bin/activate"
which python3
which pip

echo "Installing packages..."
pip install uvicorn fastapi llama-cpp-python


#pip install dbus-python

sudo apt install -y fastapi bpfcc-tools llama-cpp-python cupshelpers python3-bcc libbpfcc-dev python3-bcc libbrlapi-dev cloud-init command-not-found  llama_cpp  pkg-config python3-dev

sudo apt install -y libdbus-1-dev


echo "Installing dependencies from $REQUIREMENTS_FILE..."

# Temporarily comment out bcc== in requirements.txt to avoid pip errors
TEMP_REQ=$(mktemp)
grep -vE '^(bcc|Brlapi|cloud-init|command-not-found|cupshelpers|llama_cpp)==.*' "$REQUIREMENTS_FILE" > "$TEMP_REQ"

pip install --upgrade pip
pip install -r "$TEMP_REQ"

rm "$TEMP_REQ"

echo "Environment setup complete. To activate, run: source \"$VENV_PATH/bin/activate\". Then go to the back-end folder with \"cd back-end\", and run \"uvicorn main:app --host 0.0.0.0 --port 8000\". Finally, open a second terminal in this directory, and go to the front-end with \"cd front-end\", and open the browser with \"npx expo start\"."

