"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class FasilitasKosController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM fasilitas_kos`, (err, result) => {
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
      `SELECT * FROM fasilitas_kos WHERE id_fasilitas_kos = ${id}`,
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
    let nama_fasilitas = req.body.nama_fasilitas;

    if (id_kos.trim() === "" || nama_fasilitas.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO fasilitas_kos (id_kos, nama_fasilitas) VALUES (?, ?)`,
      [id_kos, nama_fasilitas],
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
    let nama_fasilitas = req.body.nama_fasilitas;

    if (
      id.trim() === "" ||
      id_kos.trim() === "" ||
      nama_fasilitas.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE fasilitas_kos SET id_kos=?, nama_fasilitas=? WHERE id_fasilitas_kos=?`,
      [id_kos, nama_fasilitas, id],
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
      `DELETE FROM fasilitas_kos WHERE id_fasilitas_kos=${id}`,
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

const fasilitasKosController = new FasilitasKosController();

export default fasilitasKosController;
