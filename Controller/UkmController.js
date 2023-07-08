"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class UkmController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM ukm`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;
    conn.query(`SELECT * FROM ukm WHERE id_ukm = ${id}`, (err, result) => {
      if (err) {
        response(err, res);
      } else {
        response(result, res);
      }
    });
  };

  Insert = (req, res) => {
    let nama = req.body.nama;
    let deskripsi = req.body.deskripsi;
    let image = req.body.image;
    let keterangan = req.body.keterangan;

    if (
      nama.trim() === "" ||
      deskripsi.trim() === "" ||
      image.trim() === "" ||
      keterangan.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO ukm (nama, deskripsi, image, keterangan) VALUES (?, ?, ?, ?)`,
      [nama, deskripsi, image, keterangan],
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
    let deskripsi = req.body.deskripsi;
    let image = req.body.image;
    let keterangan = req.body.keterangan;

    if (
      id.trim() === "" ||
      nama.trim() === "" ||
      deskripsi.trim() === "" ||
      image.trim() === "" ||
      keterangan.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE ukm SET nama=?, deskripsi=?, image=?, keterangan=? WHERE id_ukm=?`,
      [nama, deskripsi, image, keterangan, id],
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
      `DELETE FROM ukm WHERE id_ukm=${id}`,
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

const ukmController = new UkmController();

export default ukmController;
