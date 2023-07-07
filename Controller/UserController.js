"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class UserController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM user`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };
}

// Menampilkan semua data yang ada di tabel

export default UserController;
