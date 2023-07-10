"use strict";
import response from "../response.js";
import conn from "../koneksi.js";
class KosController {
  constructor() {}

  Select = (req, res) => {
    const query = `SELECT * FROM kos`;
    conn.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Failed to retrieve data from database" });
      } else {
        const kosData = [];
        results.forEach((kos) => {
          const queryGaleri = `SELECT * FROM galeri_kos WHERE id_kos = ${kos.id_kos}`;
          conn.query(queryGaleri, (err, galeriResults) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                error: "Failed to retrieve galeri data from database",
              });
            } else {
              kos.galeri = galeriResults;
              const queryFasilitas = `SELECT * FROM fasilitas_kos WHERE id_kos = ${kos.id_kos}`;
              conn.query(queryFasilitas, (err, fasilitasResults) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({
                    error: "Failed to retrieve fasilitas data from database",
                  });
                } else {
                  kos.fasilitas = fasilitasResults;
                  kosData.push(kos);
                  if (kosData.length === results.length) {
                    response(kosData, res);
                  }
                }
              });
            }
          });
        });
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;
    const query = `SELECT * FROM kos WHERE id_kos=${id}`;
    conn.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Failed to retrieve data from database" });
      } else {
        const kosData = results[0];
        const queryGaleri = `SELECT * FROM galeri_kos WHERE id_kos = ${id}`;
        conn.query(queryGaleri, (err, galeriResults) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              error: "Failed to retrieve galeri data from database",
            });
          } else {
            kosData.galeri = galeriResults;
            const queryFasilitas = `SELECT * FROM fasilitas_kos WHERE id_kos = ${id}`;
            conn.query(queryFasilitas, (err, fasilitasResults) => {
              if (err) {
                console.error(err);
                res.status(500).json({
                  error: "Failed to retrieve fasilitas data from database",
                });
              } else {
                kosData.fasilitas = fasilitasResults;
                response(kosData, res);
              }
            });
          }
        });
      }
    });
  };

  Insert = (req, res) => {
    let nama_kos = req.body.nama_kos;
    let type_kos = req.body.type_kos;
    let region_kos = req.body.region_kos;
    let alamat_kos = req.body.alamat_kos;
    let lokasi_kos = req.body.lokasi_kos;
    let price_start = req.body.price_start;
    let no_hp_owner = req.body.no_hp_owner;

    if (
      nama_kos.trim() === "" ||
      type_kos.trim() === "" ||
      region_kos.trim() === "" ||
      alamat_kos.trim() === "" ||
      lokasi_kos.trim() === "" ||
      price_start.trim() === "" ||
      no_hp_owner.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO kos (nama_kos, type_kos,region_kos,alamat_kos,lokasi_kos,price_start,no_hp_owner) VALUES (?, ?,?,?,?,?,?)`,
      [
        nama_kos,
        type_kos,
        region_kos,
        alamat_kos,
        lokasi_kos,
        price_start,
        no_hp_owner,
      ],
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
    let nama_kos = req.body.nama_kos;
    let type_kos = req.body.type_kos;
    let region_kos = req.body.region_kos;
    let alamat_kos = req.body.alamat_kos;
    let lokasi_kos = req.body.lokasi_kos;
    let price_start = req.body.price_start;
    let no_hp_owner = req.body.no_hp_owner;

    if (
      nama_kos.trim() === "" ||
      type_kos.trim() === "" ||
      region_kos.trim() === "" ||
      alamat_kos.trim() === "" ||
      lokasi_kos.trim() === "" ||
      price_start.trim() === "" ||
      no_hp_owner.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE kos SET nama_kos=?, type_kos=?,region_kos=?,alamat_kos=?, lokasi_kos=?, price_start=?, no_hp_owner=? WHERE id_kos=?`,
      [
        nama_kos,
        type_kos,
        region_kos,
        alamat_kos,
        lokasi_kos,
        price_start,
        no_hp_owner,
        id,
      ],
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
      `DELETE FROM kos WHERE id_kos=${id}`,
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

const kosController = new KosController();

export default kosController;
