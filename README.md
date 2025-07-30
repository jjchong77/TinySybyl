# TinySybyl
prototype app connecting a backend API running llama 3.2 3b Instruct to a simple front end chat application

## Setup Environment
1. Enable permissions to run the environment setup script. 
`chmod +x setup_env.sh`
2. Run the setup script to create the environment. By default, it creates the virtual environment on the desktop. (Change the path if needed.)
`./setup_env.sh`
3. Be sure to switch to and activate the VENV.

## download models
1. Download the LLAMA3.2 models in the .GGUF format, and save them into the models folder. They can be found at `https://huggingface.co/unsloth/Llama-3.2-1B-Instruct-GGUF`. (As of now, the back-end is hardcoded to use  `Llama-3.2-3B-Instruct-Q3_K_XL.gguf`. Be sure to have the model named and located correctly in the back-end/models directory.)


## Running App

1. Use `cd back-end` to move your terminal to the back-end folder. (Be sure that you activated the virtual environment. By default, it's located on desktop.)
2. Start back-end with ```uvicorn main:app --host 0.0.0.0 --port 8000```
4. Open second terminal, go to /front-end 
5. start app with ```npx expo start```
6. Hit 'w' to launch in web browser.
