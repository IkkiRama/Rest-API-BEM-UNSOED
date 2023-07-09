import ip from "ip";
import md5 from "md5";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import conn from "./../koneksi.js";
import response from "../response.js";
import Config from "./../config/secret.js";
import session from "express-session";

class AuthController {
  constructor() {}
  Registrasi = (req, res) => {
    const { nama, username, email, password } = req.body;
    const salt = ";L9j*1W/";

    // Enkripsi password menggunakan MD5
    const hashedPassword = md5(salt + password + salt);

    // Generate tanggal daftar menggunakan waktu sekarang
    const tanggalDaftar = new Date();

    // Cek apakah email atau username sudah ada di database
    conn.query(
      "SELECT * FROM user WHERE email = ? OR username = ?",
      [email, username],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: "Terjadi kesalahan saat mengecek email dan username",
          });
        } else if (results.length > 0) {
          // Jika email atau username sudah ada, kirim respon error
          res
            .status(409)
            .json({ error: "Email atau username sudah digunakan" });
        } else {
          // Buat data user baru
          const newUser = {
            nama,
            username,
            email,
            password: hashedPassword,
            role: "user",
            alamat: "",
            deskripsi: "",
            tanggal_daftar: tanggalDaftar,
          };

          // Simpan data user ke database
          conn.query("INSERT INTO user SET ?", newUser, (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ error: "Gagal menambahkan data user baru" });
            } else {
              res.status(200).json({
                status: 200,
                values: {
                  keterangan: "Berhasil menambahkan data user baru!",
                },
              });
            }
          });
        }
      }
    );

    // let post = {
    //   nama: req.body.nama,
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: md5(req.body.password),
    //   role: "user",
    //   alamat: "",
    //   deksripsi: "",
    //   tanggal_daftar: new Date(),
    // };

    // let query = "SELECT email, username FROM ?? WHERE username=?? OR email=??";
    // let table = ["user", post.username, post.email];
    // query = mysql.format(query, table);
    // conn.createQuery(query, (err, result) => {
    //   if (err) throw err;

    //   if (result.length == 1) {
    //     let query = "INSERT INTO ?? SET ??";
    //     let table = ["user"];
    //     query = mysql.format(query, table);
    //   }
    // });
  };

  Login = (req, res) => {
    const { email, password } = req.body;
    const salt = ";L9j*1W/";

    // Enkripsi password menggunakan MD5
    const hashedPassword = md5(salt + password + salt);

    // Cek apakah email dan password sesuai dengan data user di database
    conn.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Terjadi kesalahan saat login" });
        } else if (results.length === 0) {
          res.status(401).json({ error: "Email atau password salah" });
        } else {
          const user = results[0];
          const token = jwt.sign({ user }, Config.secret, { expiresIn: "1h" });

          // Menyimpan data user dalam session
          // req.session.user = [];
          req.session.user = user;

          // Mendapatkan alamat IP pengguna yang sedang login
          const ipAddress = ip.address();

          // Menyimpan data akses token dan alamat IP ke tabel akses_token
          const newAccessToken = {
            id_user: user.id_user,
            akses_token: token,
            ip_address: ipAddress,
          };

          conn.query(
            "INSERT INTO akses_token SET ?",
            newAccessToken,
            (err, result) => {
              if (err) {
                console.error(err);
                res
                  .status(500)
                  .json({ error: "Gagal menyimpan data akses token" });
              } else {
                res.status(200).json({
                  status: 200,
                  success: true,
                  message: "Token JWT tergenerate",
                  token: token,
                  user: {
                    id_user: user.id_user,
                    nama: user.nama,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    alamat: user.alamat,
                    deskripsi: user.deskripsi,
                    tanggal_daftar: user.tanggal_daftar,
                  },
                  result,
                });
              }
            }
          );
        }
      }
    );
  };

  Logout = (req, res) => {
    // Hapus data user dari session
    req.session.user = null;
    res.status(200).json({ message: "Logout berhasil" });
  };

  Verifikasi = (routeURL, isVerification) =>
    function (req, res, next) {
      if (!isVerification) {
        next();
      } else {
        //cek autorizzation header
        const tokenWithBarer = req.headers.authorization;
        if (tokenWithBarer) {
          const token = tokenWithBarer.split(" ")[1];
          // Verifikasi token JWT yang dikirim dalam header Authorization
          jwt.verify(token, Config.secret, (err, decoded) => {
            if (err || req.session.user === null) {
              return res.status(401).json({ error: "Token JWT tidak valid" });
            } else {
              if (
                req.session.user.role == "dewa" ||
                req.session.user.role == "super admin" ||
                req.session.user.role == "admin"
              ) {
                const user = decoded;
                next();
              } else if (req.session.user.role == "user") {
                if (routeURL == "/komik" || routeURL == "/layanan") {
                  console.log("hanya untuk user");
                  const user = decoded;
                  next();
                }
              }
              // res.status(200).json({
              //   status: 200,
              //   user: {
              //     id_user: user.id_user,
              //     nama: user.nama,
              //     username: user.username,
              //     email: user.email,
              //     role: user.role,
              //     alamat: user.alamat,
              //     deskripsi: user.deskripsi,
              //     tanggal_daftar: user.tanggal_daftar,
              //   },
              // });
            }
          });
        } else {
          return res.status(401).json({ error: "Token tidak tersedia" });
        }
      }
    };
}

const authController = new AuthController();
export default authController;
