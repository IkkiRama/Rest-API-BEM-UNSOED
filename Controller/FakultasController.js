"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class FakultasController {
  constructor() {}
  Select = (req, res) => {
    const queryFakultas = "SELECT * FROM fakultas";
    conn.query(queryFakultas, (error, results) => {
      if (error) {
        response({ error: "Internal Server Error" }, res);
      } else {
        const fakultas = results.map((fakultasResult) => {
          const queryGaleri = `SELECT galeri FROM galeri_fakultas WHERE id_fakultas = ${fakultasResult.id_fakultas}`;
          return new Promise((resolve, reject) => {
            conn.query(queryGaleri, (galeriError, galeriResults) => {
              if (galeriError) {
                reject(galeriError);
              } else {
                const galeri = galeriResults.map(
                  (galeriResult) => galeriResult.galeri
                );
                const queryMedsos = `SELECT jenis, link FROM medsos_fakultas WHERE id_fakultas = ${fakultasResult.id_fakultas}`;
                conn.query(queryMedsos, (medsosError, medsosResults) => {
                  if (medsosError) {
                    reject(medsosError);
                  } else {
                    const medsos = medsosResults.map((medsosResult) => ({
                      jenis: medsosResult.jenis,
                      link: medsosResult.link,
                    }));
                    const fakultasData = {
                      id_fakultas: fakultasResult.id_fakultas,
                      nama: fakultasResult.nama,
                      image: fakultasResult.image,
                      lokasi: fakultasResult.lokasi,
                      deskripsi: fakultasResult.deskripsi,
                      galeri,
                      medsos,
                    };
                    resolve(fakultasData);
                  }
                });
              }
            });
          });
        });

        Promise.all(fakultas)
          .then((formattedResults) => {
            response(formattedResults, res);
          })
          .catch((error) => {
            console.error(error);
            response({ error: "Internal Server Error" }, res);
          });
      }
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;

    // Query untuk mengambil data fakultas berdasarkan ID
    const queryFakultas = `SELECT * FROM fakultas WHERE id_fakultas = ${id}`;

    // Query untuk mengambil data galeri berdasarkan ID fakultas
    const queryGaleri = `SELECT galeri FROM galeri_fakultas WHERE id_fakultas = ${id}`;

    // Query untuk mengambil data media sosial berdasarkan ID fakultas
    const queryMedsos = `SELECT jenis, link FROM medsos_fakultas WHERE id_fakultas = ${id}`;

    // Eksekusi query
    conn.query(queryFakultas, (err, resultFakultas) => {
      if (err) {
        throw err;
      }

      conn.query(queryGaleri, (err, resultGaleri) => {
        if (err) {
          throw err;
        }

        conn.query(queryMedsos, (err, resultMedsos) => {
          if (err) {
            throw err;
          }

          // Mengambil nilai yang diperlukan dari hasil query
          const fakultas = resultFakultas[0];
          const galeri = resultGaleri.map((row) => row.galeri);
          const medsos = resultMedsos.map((row) => ({
            jenis: row.jenis,
            link: row.link,
          }));

          // Membentuk skema JSON nested
          const data = {
            id_fakultas: fakultas.id_fakultas,
            nama: fakultas.nama,
            image: fakultas.image,
            lokasi: fakultas.lokasi,
            deskripsi: fakultas.deskripsi,
            galeri: galeri,
            medsos: medsos,
          };
          response(data, res);
        });
      });
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
