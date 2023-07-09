import http from "http";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes.js";
import morgan from "morgan";
import session from "express-session";
import Config from "./config/secret.js";

const app = new express();
// parse data json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: Config.secret,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 30000 },
  })
);

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  session.cookie.secure = true; // serve secure cookies
}

// memanggil routes.js
routes(app);

// Daftarkan menu routes dari index middleware

const server = http.Server(app);
server.listen(3000, () => {
  console.log(`Server started on http://127.0.0.1:3000/`);
});
