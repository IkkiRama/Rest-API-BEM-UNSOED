import "dotenv/config";
import http from "http";
import express, { response } from "express";
import bodyParser from "body-parser";
import routes from "./routes.js";
import morgan from "morgan";
import session from "express-session";
import conn from "./koneksi.js";

const app = new express();
// parse data json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    rolling: true, // Menambahkan opsi rolling
    saveUninitialized: false,
    // cookie: { secure: true, maxAge: 3600000 }, // Masa aktif sesi 1 jam (3600000 ms)
    cookie: { secure: true, maxAge: 8000 }, // Masa aktif sesi 1 jam (3600000 ms)
  })
);

// Fungsi untuk menghapus data akses_token kadaluarsa
const hapusAksesTokenKadaluarsa = () => {
  const satuJamSebelumnya = new Date(Date.now() - 3600000); // Satu jam sebelumnya
  conn.query(
    "DELETE FROM akses_token WHERE waktu_dibuat < ?",
    satuJamSebelumnya,
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Data akses_token kadaluarsa telah dihapus");
      }
    }
  );
};

// Menjadwalkan penghapusan data akses_token kadaluarsa setiap 1 jam
setInterval(hapusAksesTokenKadaluarsa, 3600000);

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
