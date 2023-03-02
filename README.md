# _Winter Internship 2023_

## 🧑🏽‍🤝‍🧑🏼 Creators

- Joseph Jackson
- Helen Lehrer
- Patty Otero
- Spencer Dennis

## 📂 Table Of Contents

- [Description](#description)
  - [Summary](#summary)
  - [MVP](#mvp)
  - [Stretch Goals](#stretch-goals)

- [Technologies Used](#technologies-used)
- [Installation, Setup, and Running The App](#installation-setup-and-running-the-app)
  - [Installation](#installation)
  - [Required Files](#required-files)
  - [Running The App Locally](#running-the-app-locally)
- [The Nameless Terror API Reference](#the-mafia-api-reference)
- [Bugs](#bugs)
- [License](#license)

## 📝 Summary <a id="summary"></a>

_This is a full stack application that uses prisma and postgresql for the backend, node/express for the server, and react for the front-end and is written using typescript._

## ✅ Description <a id="description"></a>

_This is a web application that will allow a group of users to play a PacMan/Mario Cart inspired game. The objective of the game is for PacMan controlled carts is to collect all pellets on the map. If you are playing as a Ghost on spawn, your objective is to take down the PacMan cart. When a Ghost catches a PacMan, The Ghost then becomes a PacMan cart allowing them to start collecting pellets. The caught PacMan now becomes a ghost and has to try and get it's body back. The game ends when all of the pellets on the map have been collected.._

## 🎯 MVP/MVP Rules <a id="mvp"></a>

### Authentication

- Login Screen
- Users can login via Google Auth, have the email and name field in the database be fille, have user persistence throughout the application, have game data stored in the user table at game end.
- API create endpoint (Models, Controllers, Routes) for creating new user entries

### Lobby

- Input for nickname
- Join a public game button

### Game Instance

- Canvas element surrounded by a UI wrapper
- Database connection to the players that keeps track of player locations & scores
- Four players on two teams

### Hard-coded Map

- Populated by pellets
- Spawning mechanics
- Spawning logic: Two spawn points

### Game Play

- Pellets ingested gives points to teams
- Pellets disappear
- Two teams of pacarts
- When pacarts collide, they switch directions
- When pellets = 0 the game ends
- Players can interact with their pacarts via key inputs (WASD)
- Disconnect error handling
- Game-over handling

### Rules

- There are four players per game playing on teams of two
- Games are 2.5 minutes long
- Players are randomly assigned character and steering roles (players can control either up/down or left/right). Players cannot reverse directions.
- The database saves the last input from a player and will act upon the last input
- The character will pause when it hits a wall if the next direction move has not been inputted.
- Map is randomly generated each game
- Each character (teams of 2) has a score
- Ghost scores points for catching pacart
- Game ends when time runs out or pellets run out
- Whoever has the most points at the end of the game wins!!!
- After game ends player scores are displayed and option to play again appears.


### ⭐ Stretch Goals <a id="stretch-goals"></a>

[] One-player/demo mode
[] Chat/messenger
[] Customizable colors for Pacarts/Ghosts
[] Power-ups are viable based on different factors
[] Camera focused on the player and can move around 
[] Choose size on the map
[] Rounds
[] Collection of maps
[] Waiting Room with setting, sharable game links
[] Multiple games happening simultaneously
[] Multiple cart stats
[] Having up to eight players in one game
[] Leader-boards
[] Smart respawn: Characters respawn based on the location of capture
[] Option the rematch with the same players

## 🖥️ Technologies Used <a id="technologies-used"></a>

- _[React](https://reactjs.org/)_
- _[React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)_
- _[React Router](https://reactrouter.com/)_
- _[Typescript](https://www.typescriptlang.org/)_
- _[Socket.IO](https://socket.io/)_
- _[Prisma](https://www.prisma.io/)_
- _[PostgreSQL](https://www.postgresql.org/)_
- _[ExpressJs](https://expressjs.com/)_
- _[Express-Session](https://www.npmjs.com/package/express-session/v/1.17.3)_
- _[Prisma-session-store](https://www.npmjs.com/package/@quixo3/prisma-session-store)_
- _[ViteJS](https://vitejs.dev/)_
- _[Nodemon](https://www.npmjs.com/package/nodemon)_
- _[Fly.IO](https://fly.io/)_

## ⚙️ Installation, Setup, and Running The App <a id="installation-setup-and-running-the-app"></a>

### Setup/Installation Requirements <a id="installation"></a>

- _Please ensure you have the latest version of NodeJs and PostgreSQL_
- _Clone this repository <https://github.com/eyecuelab/winter-internship-2023/tree/main> locally_
- _Navigate to the root folder `winter-internship-2023` and then `cd server` and run `npm install` and then `cd client` and run `npm install`_.
- See below for required .env files
- You will also need to have your database setup in PostgreSQL
- To ensure the prisma schema has been updated to PostgreSQL, Run a migration to create your database tables with Prisma Migrate:
  - `npx prisma migrate dev --name init`
  - `npm run seed` to seed the database with the default roles
- Also, Prisma Studio is a visual editor for the data in your database.
  - Run `npx prisma studio` in your terminal.

### Required .env Files <a id="required-files"></a>

- In the `/server` directory, create an .env file and insert the following: `DATABASE_URL="postgresql://postgres:yourPasswordGoesHere@localhost:5432/yourDatabaseNameGoesHere?schema=yourSchemaNameGoesHere"` & `SESSION_SECRET="yourSecretGoesHere"`
- Then save
- In the `/client` directory, create an .env file (separate from the previous), and insert the following: `VITE_API_ENDPOINT=http://localhost:3000`
- Then save

### Running the App Locally <a id="running-the-app-locally"></a>

- Split your terminal into two separate consoles
- Navigate one terminal into the `/server` directory and run `npm start`
- Navigate the second terminal into the `/client` directory and run `npm run dev` as well. If your browser does not automatically load, type `http://localhost:3000/` manually in the browser

## Super Pacart API Reference <a id="the-mafia-api-reference"></a>

- Everything you need to interact with our API.
- If you want to access our API directly, you can use the following base URL: `http://localhost:3000/` after running the app locally.

### Making Requests

- All requests should be made to the base URL: `http://localhost:3000/` and use Postman/Thunderclient and requests should be made using the HTTP verbs `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

- Player:
  - GET `/player` retrieves a single player by Id.
  - GET `/player/:gameId` retrieves all players by gameId.
  - POST `/player/` creates a new player.
  - PUT `/player/:id` updates a single player by Id.

- Game:
  - GET `/games` retrieves all games.
  - GET `/game/:id` retrieves a single game by Id.
  - POST `/game/:id` creates a new game.

- Round:
  - GET `/round/:id` retrieves specific round from game.
  - GET `/rounds/:gameID` retrieves all rounds from game.

- Role:
  - GET `/roles` retrieves all roles.
  - GET `/role/:id` retrieves a single role by Id.
  - POST `/role/` creates a new role.

- Vote:
  - GET `/vote/:id` retrieves a single vote by Id.
  - GET `/votes/:gameId` retrieves all votes by gameId.
  - POST `/vote/` creates a new vote.
  - POST `/tallyVote` Counts casted votes and tally them.
  - POST `/vote/` casted votes are collected.

## Known 🐛 Bugs <a id="bugs"></a>

- _No Known Issues_

## 🎫License <a id="license"></a>

[MIT](LICENSE) 👈

_If you run into any issues or have questions, ideas, or concerns;  please email us!_

Copyright (c) 2022 Joseph Jackson - Helen Lehrer - Patty Otero - Spencer Dennis
