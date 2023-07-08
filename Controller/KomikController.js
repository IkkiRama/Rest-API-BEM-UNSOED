"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class KomikController {
  constructor() {}
  Select = (req, res) => {
    const query = `
      SELECT komik.id_komik, komik.id_user, komik.title_komik, user.id_user, user.nama, user.username, user.alamat, user.deskripsi, user.tanggal_daftar, galeriKomik.id_galerikomik, galeriKomik.gambar
      FROM komik
      INNER JOIN user ON komik.id_user = user.id_user
      INNER JOIN galeriKomik ON komik.id_komik = galeriKomik.id_komik
    `;

    conn.query(query, (error, results) => {
      if (error) throw error;

      // Mengonversi hasil query menjadi skema JSON yang diinginkan
      const komiks = results.reduce((acc, row) => {
        const existingKomik = acc.find(
          (komik) => komik.id_komik === row.id_komik
        );

        if (existingKomik) {
          existingKomik.galeri.push({
            id_galeriKomik: row.id_galerikomik,
            id_komik: row.id_komik,
            gambar: row.gambar,
          });
        } else {
          const newKomik = {
            id_komik: row.id_komik,
            id_user: row.id_user,
            title_komik: row.title_komik,
            author: {
              id_user: row.id_user,
              nama: row.nama,
              username: row.username,
              alamat: row.alamat,
              deskripsi: row.deskripsi,
              tanggal_daftar: row.tanggal_daftar,
            },
            galeri: [
              {
                id_galeriKomik: row.id_galerikomik,
                id_komik: row.id_komik,
                gambar: row.gambar,
              },
            ],
          };

          acc.push(newKomik);
        }

        return acc;
      }, []);

      response(komiks, res);
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;

    const query = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, user.id_user, user.nama, user.username, user.alamat, user.deskripsi, user.tanggal_daftar, galeriKomik.id_galerikomik, galeriKomik.gambar
    FROM komik
    INNER JOIN user ON komik.id_user = user.id_user
    INNER JOIN galeriKomik ON komik.id_komik = galeriKomik.id_komik
    WHERE komik.id_komik=${id}
  `;

    conn.query(query, (error, results) => {
      if (error) throw error;

      const dataQuery = results[0];

      // Mengonversi hasil query menjadi skema JSON yang diinginkan
      const komik = {
        id_komik: dataQuery.id_komik,
        id_user: dataQuery.id_user,
        title_komik: dataQuery.title_komik,
        author: {
          id_user: dataQuery.id_user,
          nama: dataQuery.nama,
          username: dataQuery.username,
          alamat: dataQuery.alamat,
          deskripsi: dataQuery.deskripsi,
          tanggal_daftar: dataQuery.tanggal_daftar,
        },
        galeri: results.map((row) => ({
          id_galeriKomik: row.id_galerikomik,
          id_komik: row.id_komik,
          gambar: row.gambar,
        })),
      };

      response(komik, res);
    });
  };

  Insert = (req, res) => {
    let title_komik = req.body.title_komik;
    let id_user = req.body.id_user;

    if (title_komik.trim() === "" || id_user.trim() === "") {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO komik (title_komik, id_user) VALUES (?, ?)`,
      [title_komik, id_user],
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
    let title_komik = req.body.title_komik;
    let id_user = req.body.id_user;

    if (
      id.trim() === "" ||
      title_komik.trim() === "" ||
      id_user.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE komik SET title_komik=?, id_user=? WHERE id_komik=?`,
      [title_komik, id_user, id],
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
      `DELETE FROM komik WHERE id_komik=${id}`,
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

const komikController = new KomikController();

export default komikController;
