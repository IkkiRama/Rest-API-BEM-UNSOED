"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class LayananController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM layanan`, (err, result) => {
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
      `SELECT * FROM layanan WHERE id_layanan = ${id}`,
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
    let tanggal = req.body.tanggal;
    let jumlah_halaman = req.body.jumlah_halaman;

    if (
      nama.trim() === "" ||
      tanggal.trim() === "" ||
      jumlah_halaman.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO layanan (nama, tanggal, jumlah_halaman) VALUES (?, ?, ?)`,
      [nama, tanggal, jumlah_halaman],
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
    let tanggal = req.body.tanggal;
    let jumlah_halaman = req.body.jumlah_halaman;

    if (
      id.trim() === "" ||
      nama.trim() === "" ||
      tanggal.trim() === "" ||
      jumlah_halaman.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE layanan SET nama=?, tanggal=?, jumlah_halaman=? WHERE id_layanan=?`,
      [nama, tanggal, jumlah_halaman, id],
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
      `DELETE FROM layanan WHERE id_layanan=${id}`,
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

const layananController = new LayananController();

export default layananController;
