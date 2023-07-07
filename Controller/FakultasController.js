"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class FakultasController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM fakultas`, (err, result) => {
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
      `SELECT * FROM fakultas WHERE id_fakultas = ${id}`,
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
    let nama = req.body.nama;
    let image = req.body.image;
    let lokasi = req.body.lokasi;
    let deskripsi = req.body.deskripsi;

    if (
      nama.trim() === "" ||
      image.trim() === "" ||
      lokasi.trim() === "" ||
      deskripsi.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO fakultas (nama,image, lokasi, deskripsi) VALUES (?, ?, ?, ?)`,
      [nama, image, lokasi, deskripsi],
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
    let image = req.body.image;
    let lokasi = req.body.lokasi;
    let deskripsi = req.body.deskripsi;

    if (
      id.trim() === "" ||
      nama.trim() === "" ||
      image.trim() === "" ||
      lokasi.trim() === "" ||
      deskripsi.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE fakultas SET nama=?, image=?, lokasi=?, deskripsi=? WHERE id_fakultas=?`,
      [nama, image, lokasi, deskripsi, id],
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
      `DELETE FROM fakultas WHERE id_fakultas=${id}`,
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
          console.log(result.affectedRows);
          response(data, res);
        }
      }
    );
  };
}

export default FakultasController;
