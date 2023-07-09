import http from "http";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes.js";
import morgan from "morgan";
import session from "express-session";

const app = new express();
// parse data json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 30000 },
  })
);

// memanggil routes.js
routes(app);

// Daftarkan menu routes dari index middleware

const server = http.Server(app);
server.listen(3000, () => {
  console.log(`Server started on http://127.0.0.1:3000/`);
});
