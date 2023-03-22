# _Winter Internship 2023_

## 🧑🏽‍🤝‍🧑🏼 Creators

Deployed Application: [https://super-pacart.netlify.app/](https://super-pacart.netlify.app/)

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
  - [Database Seeding](#database-seeding)
  - [Required Files](#required-files)
  - [Running The App Locally](#running-the-app-locally)
- [Super Pacart API Reference](#super-pacart-api-reference)
- [Bugs](#bugs)
- [License](#license)

## 📝 Summary <a id="summary"></a>

_This is a full-stack application that uses Prisma/PostgreSQL for the database, Node.js/Express for the server, and React for the front-end. It is written in Typescript and utilizes Socket.io for real-time game play with mutliple players from different computers._

## ✅ Description <a id="description"></a>

#### General Instructions:
_Get ready for an exciting gaming experience with our web application inspired by Pac-Man and Mario Kart! This multiplayer game allows a group of up to 8 users to control Pac-Man and Ghost 'PaCarts', with each PaCart controlled by two players. One teammate controls up and down using the "W" and "S" keys, while the other controls left and right using "A" and "D" keys. Control of the PaCart switches between teammates after each move, requiring strategic planning and seamless coordination.

If you are a Pac-Man, your objective is to collect all pellets scattered across the map. But be warned! If you're a Ghost, your goal is to take down the Pac-Man. When a Ghost catches a Pac-Man, the Ghost transforms into a Pac-Man and begins collecting pellets. The captured Pac-Man becomes a Ghost and must try to catch a Pac-Man.

However, Ghosts do not collect pellets but receive points for catching a Pac-Man. The game continues until all pellets on the map have been collected, and the team with the highest score at the end is declared the winner!

Are you ready to take on the challenge and compete against your friends in this fast-paced multiplayer game? Join us and experience the thrill of the race as you maneuver through the map and outsmart your opponents!_

## 🎯 MVP <a id="mvp"></a>

✅ Users can login via Google Auth

✅ Clicking "Join a Public Game" button will send users to game rooms until they are filled, and then create new games as needed.

✅ Game can accomodate 4 players on 2 teams.

✅ The map will be hard coded and not randomly generated, with 2 spawn points.

✅ When Pacarts eat pellets, they gain points and the pellets disappear.

✅ All Pacarts are Pac-Mans.

✅ Players control Pacarts with WASD keys.

✅ Pacarts cannot move backwards and have inertia.

✅ When a player disconnects, the game will end.

✅ When pellets run out, the game is over.

✅ When a game is over, all players will see the final scores and be able to click a button to return to the home screen.

### ⭐ Stretch Goals <a id="stretch-goals"></a>

✅ Game can accomodate 8 players on 4 teams.

✅ Maps are randomly generated

✅ Camera focused on the player

✅ Multiple games can happen simultaneously

✅ Smart respawn: Characters respawn based on the location of capture

❌ One-player/demo mode

❌ Chat/messenger

❌ Customizable colors for PaCarts

❌ Power-ups are viable based on different factors

❌ Choose size on the map

❌ Rounds

❌ Waiting Room with setting, sharable game links

❌ PaCarts have different stats: top speed, handling

❌ Leader-boards

❌ Option the rematch with the same players

## 🖥️ Technologies Used <a id="technologies-used"></a>

- _[React](https://reactjs.org/)_
- _[React Router](https://reactrouter.com/)_
- _[Typescript](https://www.typescriptlang.org/)_
- _[Socket.IO](https://socket.io/)_
- _[Prisma](https://www.prisma.io/)_
- _[PostgreSQL](https://www.postgresql.org/)_
- _[ExpressJs](https://expressjs.com/)_
- _[ViteJS](https://vitejs.dev/)_
- _[Nodemon](https://www.npmjs.com/package/nodemon)_
- _[Fly.IO](https://fly.io/)_
- _[Netlify](https://www.netlify.com/)_

## ⚙️ Installation, Setup, and Running The App <a id="installation-setup-and-running-the-app"></a>

### Setup/Installation Requirements <a id="installation"></a>

- _Please ensure you have the latest version of NodeJs and PostgreSQL_
- _Clone this repository <https://github.com/eyecuelab/winter-internship-2023/tree/main> locally_
- _Navigate to the root folder `winter-internship-2023` and then `cd server` and run `npm install` and then `cd client` and run `npm install`_.
- See below for required .env files
- You will also need to have your database setup in PostgreSQL
- To ensure the prisma schema has been updated to PostgreSQL, run a migration to create your database tables with Prisma Migrate:
  - `npx prisma migrate dev --name init`
- Also, Prisma Studio is a visual editor for the data in your database.
  - Run `npx prisma studio` in your terminal.

### Database Seeding <a id="database-seeding"></a>
- Using _[Postman](https://www.postman.com/)_, make a post request to http://localhost:3000/seed to seed the database with default data. 

### Required .env Files <a id="required-files"></a>

- In the `/server` directory, create an .env file and insert the following: `DATABASE_URL="postgresql://postgres:yourPasswordGoesHere@localhost:5432/yourDatabaseNameGoesHere?schema=yourSchemaNameGoesHere"`
- Then save

### Running the App Locally <a id="running-the-app-locally"></a>

- Split your terminal into two separate consoles
- Navigate one terminal into the `/server` directory and run `npm start`
- Navigate the second terminal into the `/client` directory and run `npm run dev`. If your browser does not automatically load, type `http://localhost:3000/` manually in the browser
- For locally testing this particular game, you will need to open 2 browser windows to have 2 unique users enter the game, as the game will not run or be playable until at least 2 people have entered.

## Super Pacart API Reference <a id="super-pacart-api-reference"></a>

- Everything you need to interact with our API.

### Making Requests

- All requests should be made to the base URL: `http://localhost:3000/` and use Postman/Thunderclient and requests should be made using the HTTP verbs `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- All request bodies should be in JSON format.

- Game:
  - GET `/game/:id` retrieves a single game by id.
      parameters:
        - in: body
            required: id
              properties:
                id:
                  type: number
  - GET `/game/lastpost/desc` retrieves the last game that was created
  - PATCH `/game/:id` updates an existing game by id.
       parameters:
        - in: body
            required: id, pellets, isActive
              properties:
                id:
                  type: number
                pellets:
                  type: JSON[]
                isActive:
                  type: Boolean
  - POST `/game` creates a new game.
       parameters:
        - in: body
            required: map, boundaries, pellets, spawnPoints, isActive
              properties:
                map:
                  type: JSON
                boundaries:
                  type: JSON[]
                pellets:
                  type: JSON[]
                map:
                  type: JSON
                isActive:
                  type: Boolean
- User:
  - GET `/user/:email` retrieves a user by email.
       parameters:
        - in: body
            required: email
              properties:
                email:
                  type: string
  - POST `/user` creates a new user.
       parameters:
            - in: body
                required: email
                  properties:
                    name:
                      type: string
                    email:
                      type: string
  - PUT `/user/:userId/deactivate-last-game` deactivates an existing game associated with a user id.
       parameters:
        - in: body
            required: id
              properties:
                id:
                  type: number
  
- GameUser:
  - POST `/gameUser` creates a new gameUser.
      parameters:
            - in: body
                required: game id, user id
                  properties:
                    gameId:
                      type: number
                    userId:
                      type: number
  - GET `/game/:gameId/gameUser` retrieves all gameUsers that that have a specific game id.
       parameters:
        - in: body
            required: id
              properties:
                id:
                  type: number

- Role:
  - GET `/round/:id` retrieves specific role by id.
       parameters:
        - in: body
            required: id
              properties:
                id:
                  type: number
  - POST `/role` creates a new role.
       parameters:
          - in: body
              required: name
                properties:
                  name:
                    type: string
- Team:
  - POST `/team` creates a new team.
     parameters:
          - in: body
              required: color, score, position, velocity, angle, characterId, gameId, kartId
                properties:
                  color:
                    type: string
                  score:
                    type: number
                  position:
                    type: JSON
                  velocity:
                    type: JSON
                  angle:
                    type: JSON
                  characterId:
                    type: number
                  gameId:
                    type: number
                  kartId:
                    type: number
  - PATCH `/team/:id` updates an existing team by id.
       parameters:
        - in: body
            required: id
              properties:
                id:
                  type: number
                color:
                    type: string
                score:
                  type: number
                position:
                  type: JSON
                velocity:
                  type: JSON
                angle:
                  type: JSON
                characterId:
                  type: number
                gameId:
                  type: number
                kartId:
                  type: number
- TeamUser:
  - POST `/teamUser` creates a new teamUser.
     parameters:
              - in: body
                  required: teamId, userId, axisControl
                    properties:
                      teamId:
                        type: number
                      userId:
                        type: number
                      axisControl:
                        type: string
- GoogleRoutes:
  - GET `/userData` retrieves Google Auth user data.
  
- Seed:
  - POST `/seed` seeds the database.

## Known 🐛 Bugs <a id="bugs"></a>

- _No Known Issues_

## 🎫License <a id="license"></a>

[MIT](LICENSE) 👈

_If you run into any issues or have questions, ideas, or concerns;  please email us!_

Copyright (c) 2022 Joseph Jackson - Helen Lehrer - Patty Otero - Spencer Dennis
