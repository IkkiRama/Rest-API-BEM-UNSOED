"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class UserController {
  constructor() {}

  Select = (req, res) => {
    // Query untuk mendapatkan semua data user
    const userQuery = "SELECT * FROM user";

    // Query untuk mendapatkan data komik dan galeriKomik yang dimiliki oleh setiap user
    const komikQuery = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, galeriKomik.id_galerikomik, galeriKomik.gambar
    FROM komik
    INNER JOIN galeriKomik ON komik.id_komik = galeriKomik.id_komik
  `;

    conn.query(userQuery, (error, userResults) => {
      if (error) throw error;

      conn.query(komikQuery, (error, komikResults) => {
        if (error) throw error;

        const users = [];

        userResults.forEach((user) => {
          const userJSON = {
            nama: user.nama,
            username: user.username,
            email: user.email,
            role: user.role,
            alamat: user.alamat,
            deskripsi: user.deskripsi,
            tanggal_daftar: user.tanggal_daftar,
            komik: [],
          };

          const userKomik = komikResults.filter(
            (komik) => komik.id_user === user.id_user
          );

          let currentKomikId = null;
          let currentKomik = null;

          userKomik.forEach((komik) => {
            if (komik.id_komik !== currentKomikId) {
              currentKomikId = komik.id_komik;

              // Membuat objek baru untuk setiap komik
              currentKomik = {
                id_komik: komik.id_komik,
                id_user: komik.id_user,
                title_komik: komik.title_komik,
                galeri: [],
              };

              userJSON.komik.push(currentKomik);
            }

            // Menambahkan data galeri untuk setiap komik
            const galeri = {
              id_galeriKomik: komik.id_galerikomik,
              id_komik: komik.id_komik,
              gambar: komik.gambar,
            };

            currentKomik.galeri.push(galeri);
          });

          users.push(userJSON);
        });

        response(users, res);
      });
    });
  };

  Detail = (req, res) => {
    let id = req.params.id;

    const userQuery = `SELECT * FROM user WHERE id_user = ${id}`;

    // Query untuk mendapatkan data komik dan galeriKomik yang dimiliki oleh user
    const komikQuery = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, galeriKomik.id_galerikomik, galeriKomik.gambar
    FROM komik
    INNER JOIN galeriKomik ON komik.id_komik = galeriKomik.id_komik
    WHERE komik.id_user = ${id}
  `;

    conn.query(userQuery, (error, userResults) => {
      if (error) throw error;

      conn.query(komikQuery, (error, komikResults) => {
        if (error) throw error;

        const user = userResults[0];

        // Membentuk struktur JSON dengan nested objects
        const userJSON = {
          nama: user.nama,
          username: user.username,
          email: user.email,
          role: user.role,
          alamat: user.alamat,
          deskripsi: user.deskripsi,
          tanggal_daftar: user.tanggal_daftar,
          komik: [],
        };

        let currentKomikId = null;
        let currentKomik = null;

        komikResults.forEach((row) => {
          if (row.id_komik !== currentKomikId) {
            currentKomikId = row.id_komik;

            // Membuat objek baru untuk setiap komik
            currentKomik = {
              id_komik: row.id_komik,
              id_user: row.id_user,
              title_komik: row.title_komik,
              galeri: [],
            };

            userJSON.komik.push(currentKomik);
          }

          // Menambahkan data galeri untuk setiap komik
          const galeri = {
            id_galeriKomik: row.id_galerikomik,
            id_komik: row.id_komik,
            gambar: row.gambar,
          };

          currentKomik.galeri.push(galeri);
        });

        response(userJSON, res);
      });
    });
  };

  Insert = (req, res) => {
    let nama = req.body.nama;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = "user";
    let alamat = req.body.alamat;
    let deskripsi = req.body.deskripsi;
    let tanggal_daftar = req.body.tanggal_daftar;

    // Cek apabila user cuma input spasi
    // Trim itu membuang spasi. Example : Joko Widodo = JokoWidodo
    if (
      nama.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      role.trim() === "" ||
      alamat.trim() === "" ||
      deskripsi.trim() === "" ||
      tanggal_daftar.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `INSERT INTO user (nama,username,email,password,role,alamat,deskripsi,tanggal_daftar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        username,
        email,
        password,
        role,
        alamat,
        deskripsi,
        tanggal_daftar,
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
    let nama = req.body.nama;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = "user";
    let alamat = req.body.alamat;
    let deskripsi = req.body.deskripsi;
    let tanggal_daftar = req.body.tanggal_daftar;

    if (
      nama.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      role.trim() === "" ||
      alamat.trim() === "" ||
      deskripsi.trim() === "" ||
      tanggal_daftar.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    conn.query(
      `UPDATE user SET nama=?, username=?, email=?, password=?, alamat=?, deskripsi=?, tanggal_daftar=? WHERE id_user=?`,
      [nama, username, email, password, alamat, deskripsi, tanggal_daftar, id],
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

    conn.query(`DELETE FROM user WHERE id_user=${id}`, (err, result) => {
      // cek apabila ada orang yang menginput id sembarangan, misal semua data ada 13 dengan id data terakhir 13. Apabila seseorang input parameter id nya 40 maka akan ditolak requesnya.
      // pengecekannya menggunakan sub data yang ada di var result
      if (err || result.affectedRows > 1 || result.affectedRows < 1) {
        response(err, res);
      } else {
        let data = {
          keterangan: "Berhasil menghapus data!",
          result,
        };
        response(data, res);
      }
    });
  };
}

const userController = new UserController();

export default userController;
