import "dotenv/config";
import mysql from "mysql2";

const conn = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

conn.connect((err) =>
  err
    ? console.log(`Terjadi eror pada koneksi ${err}`)
    : console.log("Koneksi ke database berhasil")
);

export default conn;
