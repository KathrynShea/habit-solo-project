# Habicon

## Description

Duration: 2 weeks

Application that allows users to view a list of movies, click on one, and get extra information about that specific movie.

## Prerequisites
Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)
Node.js
React, Redux, Express, Passport, and PostgreSQL

## Installation
1. Create a database named "habits".
2. The queries in the database.sql file are set up to create all the necessary tables and populate the needed data to allow the application to run correctly.
3. Open up your editor of choice and run an npm install.

## Usage
1. Click on movie image.
2. You are then taken to a detailed view of that movie's information.
3. Click on "back to list" to go back to see all the movies.

## Built With
HTML, JavaScript, React, Postgres, Redux, Saga

## Production Build

Before pushing to Heroku, run `npm run build` in terminal. This will create a build folder that contains the code Heroku will be pointed at. You can test this build by typing `npm start`. Keep in mind that `npm start` will let you preview the production build but will **not** auto update.

- Start postgres if not running already by using `brew services start postgresql`
- Run `npm start`
- Navigate to `localhost:5000`

## Deployment

1. Create a new Heroku project
1. Link the Heroku project to the project GitHub Repo
1. Create an Heroku Postgres database
1. Connect to the Heroku Postgres database from Postico
1. Create the necessary tables
1. Add an environment variable for `SERVER_SESSION_SECRET` with a nice random string for security
1. In the deploy section, select manual deploy

## Acknowledgement
Thanks to Emerging Digital Academy who equipped and helped me to make this application a reality.

## Support
If you have suggestions or issues, please email me at kathrynszombatfalvy@gmail.com

