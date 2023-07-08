"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class GaleriKomikController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM galerikomik`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;
    conn.query(
      `SELECT * FROM galerikomik WHERE id_galeriKomik = ${id}`,
      (err, result) => {
        if (err) {
          response(err, res);
        } else {
          response(result, res);
        }
      }
    );
  };

  Insert = (req, res) => {
    let id_komik = req.body.id_komik;
    let gambar = req.body.gambar;

    if (id_komik.trim() === "" || gambar.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO galerikomik (id_komik, gambar) VALUES (?, ?)`,
      [id_komik, gambar],
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
    let id_komik = req.body.id_komik;
    let gambar = req.body.gambar;

    if (id.trim() === "" || id_komik.trim() === "" || gambar.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE galerikomik SET id_komik=?, gambar=? WHERE id_galeriKomik=?`,
      [id_komik, gambar, id],
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

  Delete = (req, res) => {
    let id = req.params.id;

    if (id.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `DELETE FROM galerikomik WHERE id_galeriKomik=${id}`,
      // cek apabila ada orang yang menginput id sembarangan, misal semua data ada 13 dengan id data terakhir 13. Apabila seseorang input parameter id nya 40 maka akan ditolak requesnya.
      // pengecekannya menggunakan sub data yang ada di var result
      (err, result) => {
        if (err || result.affectedRows > 1 || result.affectedRows < 1) {
          response(err, res);
        } else {
          let data = {
            keterangan: "Berhasil menghapus data!",
            result,
          };
          response(data, res);
        }
      }
    );
  };
}

const galeriKomikController = new GaleriKomikController();

export default galeriKomikController;
