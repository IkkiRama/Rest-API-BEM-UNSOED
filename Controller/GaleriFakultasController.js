"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class GaleriFakultasController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM galeri_fakultas`, (err, result) => {
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
      `SELECT * FROM galeri_fakultas WHERE id_galeri_fakultas = ${id}`,
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
    let id_fakultas = req.body.id_fakultas;
    let galeri = req.body.galeri;

    if (id_fakultas.trim() === "" || galeri.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO galeri_fakultas (id_fakultas, galeri) VALUES (?, ?)`,
      [id_fakultas, galeri],
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
    let id_fakultas = req.body.id_fakultas;
    let galeri = req.body.galeri;

    if (id.trim() === "" || id_fakultas.trim() === "" || galeri.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE galeri_fakultas SET id_fakultas=?, galeri=? WHERE id_galeri_fakultas=?`,
      [id_fakultas, galeri, id],
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
      `DELETE FROM galeri_fakultas WHERE id_galeri_fakultas=${id}`,
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

const galeriFakultasController = new GaleriFakultasController();

export default galeriFakultasController;
