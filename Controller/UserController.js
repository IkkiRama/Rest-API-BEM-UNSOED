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

  Detail = (req, res) => {
    let id = req.params.id;
    conn.query(`SELECT * FROM user WHERE id_user = ${id}`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Insert = (req, res) => {
    let nama = req.body.nama;
    let username = req.body.username;
    let alamat = req.body.alamat;
    let deskripsi = req.body.deskripsi;

    conn.query(
      `INSERT INTO user (nama,username,alamat,deskripsi) VALUES (?, ?, ?, ?)`,
      [nama, username, alamat, deskripsi],
      (err, result) => {
        if (err) {
          response(err, res);
        } else {
          let data = {
            keterangan: "Berhasil menambahkan data!",
            result,
          };
          response(data, res);
        }
      }
    );
  };

  Update = (req, res) => {
    let id = req.params.id;
    let nama = req.body.nama;
    let username = req.body.username;
    let alamat = req.body.alamat;
    let deskripsi = req.body.deskripsi;

    conn.query(
      `UPDATE user SET nama=?, username=?, alamat=?, deskripsi=? WHERE id_user=?`,
      [nama, username, alamat, deskripsi, id],
      (err, result) => {
        if (err) {
          response(err, res);
        } else {
          let data = {
            keterangan: "Berhasil merubah data!",
            result,
          };
          response(data, res);
        }
      }
    );
  };
}

// Menampilkan semua data yang ada di tabel

export default UserController;
