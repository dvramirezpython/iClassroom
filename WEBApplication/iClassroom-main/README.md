First draft obtained from the official MERN tutorial by [MongoDB](https://www.mongodb.com/languages/mern-stack-tutorial)

Standards:
 - Node version v18.15.0.
 - Create your own database for local development (supervised by David Garcia)
 - Tabsize of 2 spaces

Database:
1. Download and install [MongoDB Community Edition ver 6.0.4](https://www.mongodb.com/try/download/community), select complete installation to include the **Compass** tool. It will be useful to connect to production and local data.
2. Download and install [MongoDB Shell (mongosh) ver 1.8.0](https://www.mongodb.com/try/download/shell), this will be useful only for local environment.
3. Make sure you have everything correct entering Compass and trying to access your local database.

For the first time:
Go to both folders (server, client) and inside each one make a `npm install` to install the packages. On the `server` folder be sure to add a file called `config.env` and add inside it the following:

```
ATLAS_URI=mongodb://127.0.0.1:27017
PORT=5000
```

To start the app:
1. Open two terminals
2. On the first terminal, go inside the `server` folder and execute `node server.js`
3. On the second terminal, go inside the `client` folder and execute `npm start`
4. Go to your browser and write `localhost:3000` (it shall start automatically nonetheless)

