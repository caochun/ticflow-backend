# ticflow-backend

This is the backend implented by express / node.js for ticflow. The frontend is in [ticflow-ionic](https://github.com/caochun/ticflow-ionic).

## To start server

Clone this repository and run

```
$ cd ticflow-backend && npm install
```

Make sure you have node.js and mongodb installed in your computer. Start mongo process by

```
$ mongod
```

Then run

```
$ nodemon bin/www
```

The server will be started on port 3001.

To deploy your server with docker, refer to [dockerfile](https://github.com/Luziling/dockerfile).

