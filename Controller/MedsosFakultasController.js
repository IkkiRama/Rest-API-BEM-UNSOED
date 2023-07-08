"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class MedsosFakultasController {
  constructor() {}
  Select = (req, res) => {
    conn.query(`SELECT * FROM medsosfakultas`, (err, result) => {
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
      `SELECT * FROM medsosfakultas WHERE id_medsosFakultas = ${id}`,
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
    let jenis = req.body.jenis;
    let link = req.body.link;

    if (
      id_fakultas.trim() === "" ||
      jenis.trim() === "" ||
      link.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO medsosfakultas (id_fakultas, jenis, link) VALUES (?, ?, ?)`,
      [id_fakultas, jenis, link],
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
    let jenis = req.body.jenis;
    let link = req.body.link;

    if (
      id.trim() === "" ||
      id_fakultas.trim() === "" ||
      jenis.trim() === "" ||
      link.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE medsosfakultas SET id_fakultas=?, jenis=?, link=? WHERE id_medsosFakultas=?`,
      [id_fakultas, jenis, link, id],
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
      `DELETE FROM medsosfakultas WHERE id_medsosFakultas=${id}`,
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

const medsosFakultasController = new MedsosFakultasController();

export default medsosFakultasController;
