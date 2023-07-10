"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class GaleriKosController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM galeri_kos`, (err, result) => {
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
      `SELECT * FROM galeri_kos WHERE id_galeri_kos = ${id}`,
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
    let id_kos = req.body.id_kos;
    let galeri = req.body.galeri;

    if (id_kos.trim() === "" || galeri.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO galeri_kos (id_kos, galeri) VALUES (?, ?)`,
      [id_kos, galeri],
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
    let id_kos = req.body.id_kos;
    let galeri = req.body.galeri;

    if (id.trim() === "" || id_kos.trim() === "" || galeri.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE galeri_kos SET id_kos=?, galeri=? WHERE id_galeri_kos=?`,
      [id_kos, galeri, id],
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
      `DELETE FROM galeri_kos WHERE id_galeri_kos=${id}`,
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

const galeriKosController = new GaleriKosController();

export default galeriKosController;
