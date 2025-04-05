# README

Follow the instructions below to get things running for this system.

## INSTRUCTIONS

You will need to have Node.js and Python installed for today's activity.
Open the project in VSCode.
Open a terminal in the project folder and type: `npm install`
Go into the service-c folder and run: `pip install -r requirements.txt`

Discuss with those around you (or with yourself if you are completing this individually):
The code for the registry service
The code for the api-gateway service
The code for service-a, service-b, and service-c
Open a terminal for each of the 5 services and run them (see scripts in package.json to see how to run)
Optionally, use Postman to send messages to each of the services (I recommend this to really understand things)
Kill all the individual services. Then run them all again using the start:all script.
Run the requests.ts script (see the script in package.json)
Run the autocannon.ts script (see the script in package.json)

Task: Submit your (brief) answers the following questions 

## 🔍 What To Observe Today

- Does each service start up correctly?
- What happens if the registry is down?
- You will need to run the services individually to kill the registry
- What gets logged to the console when you send a request?
- Which services log their results to the `logs/` directory?
- Why are the other services not logging to a file?
- What’s the shape of the response (i.e., what does the JSON look like)?
- What are the results from running the `requests.ts` test script?
- What are the results from running the `autocannon.ts` test script?
- How does latency behave with `autocannon`?
