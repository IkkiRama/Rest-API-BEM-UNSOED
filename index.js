import http from "http";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes.js";

const app = new express();
// parse data json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// memanggil routes.js
routes(app);

const server = http.Server(app);
server.listen(3000, () => {
  console.log(`Server started on http://127.0.0.1:3000/`);
});
