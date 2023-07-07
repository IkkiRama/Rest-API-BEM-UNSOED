import express from "express";
import bodyParser from "body-parser";

// import { createServer } from "http";
// import { Server } from "socket.io";
// import { createClient } from "redis";
// import { createClient as createRedisClient } from "redis-mock";

const app = new express();
// parse data json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log(`Server started on http://127.0.0.1:3000/`);
});
