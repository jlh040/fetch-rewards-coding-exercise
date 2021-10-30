# Fetch Rewards Coding Exercise - Backend Software Engineering

This repository is my solution to the Fetch Rewards Backend Software Engineering exercise. It is a web service that has three endpoints. These endpoints act as an interface which allows a user to see more detailed information on which companies are paying for rewards points when a user spends these points. 

## Setup

- First of all, type `git clone https://github.com/jlh040/fetch-rewards-coding-exercise.git` to get this code onto your machine.
- Then `cd` into the project directory.
- Next, if you don't have Node installed, make sure you install [Node.js](https://nodejs.org/en/).
- Once you have Node installed, type `npm install` to download all of the project dependencies.
- The application runs on a server, to start the server on port 3000, type `node server.js`.
- You will need to be able to make HTTP requests to the server, you can do this in the browser at `http://localhost:3000`, or you can download a tool like [Insomnia](https://insomnia.rest/) which makes it easy to make requests.
- Please see below for the available endpoints.

## Testing
- The tests are located in **routes.test.js**
- To execute these tests, run the command: `jest`

## Routes

### POST /transactions
- Requires `{ payer, points, timestamp }`
  - Example: `{payer: 'DANNON' points: 350, timestamp: '2017-05-13T08:30:45Z'}`
- Returns `{ payer, points, timestamp }`
- This route allows a user to create a transaction

### GET /points
- No requirements
- Returns `{ payer1Name: points, payer2Name: points, ... }`
- This route allows a user to see the points for each payer

### POST /points
- Requires `{ points }`
  - Example: `{ points: 3500 }`
- Returns `[{ payer1Name: deductedPoints }, { payer2Name: deductedPoints }, ...]`
- This route allows a user to spend points

## Technology used
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Moment.js](https://momentjs.com/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [jsonschema](https://www.npmjs.com/package/jsonschema)
- [morgan](https://www.npmjs.com/package/morgan)