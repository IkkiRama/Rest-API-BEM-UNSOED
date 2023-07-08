"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class KomikController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM komik`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;
    conn.query(`SELECT * FROM komik WHERE id_komik = ${id}`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Insert = (req, res) => {
    let title_komik = req.body.title_komik;
    let id_user = req.body.id_user;

    if (title_komik.trim() === "" || id_user.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO komik (title_komik, id_user) VALUES (?, ?)`,
      [title_komik, id_user],
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
    let title_komik = req.body.title_komik;
    let id_user = req.body.id_user;

    if (
      id.trim() === "" ||
      title_komik.trim() === "" ||
      id_user.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE komik SET title_komik=?, id_user=? WHERE id_komik=?`,
      [title_komik, id_user, id],
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
      `DELETE FROM komik WHERE id_komik=${id}`,
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

const komikController = new KomikController();

export default komikController;
