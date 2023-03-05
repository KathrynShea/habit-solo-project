# Habicon

## Description

Duration: 2 weeks

Application that allows users to create habits that they can mark off as completed each day.

## Prerequisites
- Node.js
- Nodemon
- React
- Redux
- Express
- Passport
- PostgreSQL
- FontAwesome
- Bootstrap
- React-bootstrap
- Moment.js
- Sweetalerts

## Installation
1. Create a database named "habits".
2. The queries in the database.sql file are set up to create all the necessary tables to allow the application to run correctly.
3. Open up your editor of choice and run an npm install.

## Usage
1. Login or Register new account
2. You will then be taken to overview page that lists all currently tracked habits and each day for the month
3. Click on plus button at the bottom of the screen to go to the add new habit page
4. Enter new habit name, start/end date, and create a habicon. Click complete bottom
5. You will be taken back to the overview page with the new habit listed
6. Click on the icon each day to mark the habit as completed
7. Click on the name of the habit to go to the edit habit page
8. Edit any original settings of the habit. You can also delete and pause habits
9. After edits are completed, you will be taken back to the overview page
10. Click the trophy on the left of the habit name to mark it as mastered
11. Click on the navigation bar to customize the background color randomly
12. Click on the tabs, "paused" and "awards" to view habits that have been marked as paused and mastered

## Built With
HTML, JavaScript, React, Postgres, Redux, Saga, FontAwesome, Bootstrap, React-bootstrap, Moment.js, and Sweetalerts

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

