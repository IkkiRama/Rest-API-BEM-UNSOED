"use strict";
import md5 from "md5";
import "dotenv/config";
import response from "../response.js";
import conn from "../koneksi.js";
import session from "express-session";

class UserController {
  constructor() {}

  Select = (req, res) => {
    // Query untuk mendapatkan semua data user
    const userQuery = "SELECT * FROM user";

    // Query untuk mendapatkan data komik dan galeri_komik yang dimiliki oleh setiap user
    const komikQuery = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, galeri_komik.id_galeri_komik, galeri_komik.gambar
    FROM komik
    INNER JOIN galeri_komik ON komik.id_komik = galeri_komik.id_komik
  `;

    conn.query(userQuery, (error, userResults) => {
      if (error) throw response(error, res);

      conn.query(komikQuery, (error, komikResults) => {
        if (error) throw response(error, res);

        const users = [];
        let userJSON = {};

        userResults.forEach((user) => {
          if (
            session.login !== undefined &&
            session.login.user.role === "super admin"
          ) {
            userJSON = {
              id: user.id,
              nama: user.nama,
              username: user.username,
              email: user.email,
              password: user.password,
              alamat: user.alamat,
              role: user.role,
              deskripsi: user.deskripsi,
              tanggal_daftar: user.tanggal_daftar,
              komik: [],
            };
          } else {
            userJSON = {
              id: user.id,
              nama: user.nama,
              username: user.username,
              email: user.email,
              alamat: user.alamat,
              deskripsi: user.deskripsi,
              tanggal_daftar: user.tanggal_daftar,
              komik: [],
            };
          }

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
              id_galeri_komik: komik.id_galeri_komik,
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

    // Query untuk mendapatkan data komik dan galeri_komik yang dimiliki oleh user
    const komikQuery = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, galeri_komik.id_galeri_komik, galeri_komik.gambar
    FROM komik
    INNER JOIN galeri_komik ON komik.id_komik = galeri_komik.id_komik
    WHERE komik.id_user = ${id}
  `;

    conn.query(userQuery, (error, userResults) => {
      if (error) throw error;

      conn.query(komikQuery, (error, komikResults) => {
        if (error) throw error;

        const user = userResults[0];

        let userJSON = {};

        // Membentuk struktur JSON dengan nested objects
        if (
          session.login !== undefined &&
          session.login.user.role === "super admin"
        ) {
          userJSON = {
            id: user.id,
            nama: user.nama,
            username: user.username,
            email: user.email,
            password: user.password,
            alamat: user.alamat,
            role: user.role,
            deskripsi: user.deskripsi,
            tanggal_daftar: user.tanggal_daftar,
            komik: [],
          };
        } else {
          userJSON = {
            id: user.id,
            nama: user.nama,
            username: user.username,
            email: user.email,
            alamat: user.alamat,
            deskripsi: user.deskripsi,
            tanggal_daftar: user.tanggal_daftar,
            komik: [],
          };
        }

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
            id_galeri_komik: row.id_galeri_komik,
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
    let password = md5(process.env.SALT + req.body.password + process.env.SALT);
    let role =
      session.login !== undefined && session.login.user.role === "super admin"
        ? req.body.role
        : "user";

    // Generate tanggal daftar menggunakan waktu sekarang
    const tanggalDaftar = new Date();

    if (
      nama.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    if (
      session.login !== undefined &&
      session.login.user.role === "super admin"
    ) {
      if (role.trim() === "") {
        response("Harap isi data dengan benar", res);
        return false;
      }
    }

    // Cek apakah email atau username sudah ada di database
    conn.query(
      "SELECT * FROM user WHERE email = ? OR username = ?",
      [email, username],
      (err, results) => {
        if (err) {
          response(
            {
              error: "Terjadi kesalahan saat mengecek email dan username",
              err,
            },
            res
          );
        } else if (results.length > 0) {
          // Jika email atau username sudah ada, kirim respon error
          response({ error: "Email atau username sudah digunakan" }, res);
        } else {
          // Buat data user baru
          const newUser = {
            nama,
            username,
            email,
            password,
            role,
            alamat: "",
            deskripsi: "",
            tanggal_daftar: tanggalDaftar,
          };

          // Simpan data user ke database
          conn.query("INSERT INTO user SET ?", newUser, (err, result) => {
            if (err) {
              response({ error: "Gagal menambahkan data user baru", err }, res);
            } else {
              response("Berhasil menambahkan data user baru!", res);
            }
          });
        }
      }
    );
  };

  Update = (req, res) => {
    let id = req.params.id;
    let nama = req.body.nama;
    let username = req.body.username;
    let email = req.body.email;
    let password = md5(process.env.SALT + req.body.password + process.env.SALT);
    let role =
      session.login !== undefined && session.login.user.role === "super admin"
        ? req.body.role
        : "";
    let alamat = req.body.alamat ? req.body.alamat : "";
    let deskripsi = req.body.deskripsi ? req.body.deskripsi : "";

    if (
      nama.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      response("Harap isi data dengan benar", res);
      return false;
    }

    if (req.body.alamat || req.body.deskripsi) {
      if (alamat.trim() === "" || deskripsi.trim() === "") {
        response("Harap isi data dengan benar", res);
        return false;
      }
    }

    if (
      session.login !== undefined &&
      session.login.user.role === "super admin"
    ) {
      if (role.trim() === "") {
        response("Harap isi data dengan benar", res);
        return false;
      }
    }

    if (
      session.login !== undefined &&
      session.login.user.role === "super admin"
    ) {
      conn.query(
        `UPDATE user SET nama=?, username=?, email=?, password=?, role=?, alamat=?, deskripsi=? WHERE id_user=?`,
        [nama, username, email, password, role, alamat, deskripsi, id],
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
    } else {
      conn.query(
        `UPDATE user SET nama=?, username=?, email=?, password=?, alamat=?, deskripsi=? WHERE id_user=?`,
        [nama, username, email, password, alamat, deskripsi, id],
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
    }
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
