import "dotenv/config";
import mysql from "mysql2";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rest-api-bem-unsoed",
});

conn.connect((err) =>
  err
    ? console.log(`Terjadi eror pada koneksi ${err}`)
    : console.log("Koneksi ke database berhasil")
);

export default conn;
