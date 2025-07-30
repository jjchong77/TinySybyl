# TinySybyl
prototype app connecting a backend API running llama 3.2 3b Instruct to a simple front end chat application

#setup environment
1. Enable permissions to run the environment setup script. 
`chmod +x setup_env.sh`
2. Run the setup script to create the environment. By default, it creates the virtual environment on the desktop. (Change the path if needed.)
`./setup_env.sh`
3. Be sure to switch to and activate the VENV.

##Running App
1. Go to /back-end.
2. Start back-end with ```uvicorn main:app --host 0.0.0.0 --port 8000```
4. Open second terminal, go to /front-end 
5. start app with ```npx expo start```
6. Hit 'w' to launch in web browser.
