import mysql from "mysql";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "res-api-bem-unsoed",
});

conn.connect((err) =>
  err
    ? console.log(`Terjadi eror pada koneksi ${err}`)
    : console.log("Koneksi ke database berhasil")
);

export default conn;
