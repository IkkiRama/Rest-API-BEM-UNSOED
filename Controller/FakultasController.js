"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class FakultasController {
  constructor() {}
  Select = (req, res) => {
    const query = `
      SELECT f.id_fakultas, f.nama, f.image, f.lokasi, f.deskripsi,
        GROUP_CONCAT(g.galeri) AS galeri,
        CONCAT('[', GROUP_CONCAT(JSON_OBJECT('jenis', m.jenis, 'link', m.link)), ']') AS medsos
      FROM fakultas f
      LEFT JOIN galerifakultas g ON g.id_fakultas = f.id_fakultas
      LEFT JOIN medsosfakultas m ON m.id_fakultas = f.id_fakultas
      GROUP BY f.id_fakultas;
    `;
    conn.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const formattedResults = results.map((result) => {
          result.galeri = result.galeri.split(",");
          result.medsos = JSON.parse(result.medsos);
          return result;
        });
        response(formattedResults, res);
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;
    const query = `
    SELECT fakultas.id_fakultas, fakultas.nama, fakultas.image, fakultas.lokasi, fakultas.deskripsi,
           galerifakultas.galeri, medsosfakultas.jenis, medsosfakultas.link
    FROM fakultas
    LEFT JOIN galerifakultas ON fakultas.id_fakultas = galerifakultas.id_fakultas
    LEFT JOIN medsosfakultas ON fakultas.id_fakultas = medsosfakultas.id_fakultas
    WHERE fakultas.id_fakultas = ?
  `;

    // Eksekusi query dengan parameter ID fakultas
    conn.query(query, [id], (error, result) => {
      if (error || result.affectedRows > 1 || result.affectedRows < 1) {
        response(err, res);
      } else {
        if (result.length === 0) {
          response("Fakultas tidak ditemukan.", res.status(404));
        } else {
          // Variabel untuk menyimpan data fakultas
          let fakultasData = {
            id_fakultas: result[0].id_fakultas,
            nama: result[0].nama,
            image: result[0].image,
            lokasi: result[0].lokasi,
            deskripsi: result[0].deskripsi,
            galeri: [],
            medsos: [],
          };

          // Loop untuk mengumpulkan data galeri
          result.forEach((row) => {
            if (row.galeri) {
              fakultasData.galeri.push(row.galeri);
            }
          });

          // Loop untuk mengumpulkan data medsos
          result.forEach((row) => {
            if (row.jenis && row.link) {
              fakultasData.medsos.push({
                jenis: row.jenis,
                link: row.link,
              });
            }
          });

          response(fakultasData, res);
        }
      }
    });
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
          response(data, res);
        }
      }
    );
  };
}

const fakultasController = new FakultasController();

export default fakultasController;
