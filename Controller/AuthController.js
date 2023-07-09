import ip from "ip";
import md5 from "md5";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import conn from "./../koneksi.js";
import response from "../response.js";
import session from "express-session";

class AuthController {
  constructor() {}
  Registrasi = (req, res) => {
    if (session.login !== undefined) {
      return response("Silahkan logout terlebih dahulu!", res);
    } else {
      const { nama, username, email, password } = req.body;

      // Enkripsi password menggunakan MD5
      const hashedPassword = md5(
        process.env.SALT + password + process.env.SALT
      );

      // Generate tanggal daftar menggunakan waktu sekarang
      const tanggalDaftar = new Date();

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
              password: hashedPassword,
              role: "user",
              alamat: "",
              deskripsi: "",
              tanggal_daftar: tanggalDaftar,
            };

            // Simpan data user ke database
            conn.query("INSERT INTO user SET ?", newUser, (err, result) => {
              if (err) {
                response(
                  { error: "Gagal menambahkan data user baru", err },
                  res
                );
              } else {
                response("Berhasil menambahkan data user baru!", res);
              }
            });
          }
        }
      );
    }
  };

  Login = (req, res) => {
    if (session.login !== undefined) {
      throw response("Anda sudah login", res);
    } else {
      const { email, password } = req.body;

      // Enkripsi password menggunakan MD5
      const hashedPassword = md5(
        process.env.SALT + password + process.env.SALT
      );

      // Cek apakah email dan password sesuai dengan data user di database
      conn.query(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, hashedPassword],
        (err, results) => {
          if (err) {
            response({ error: "Terjadi kesalahan saat login", err }, res);
          } else if (results.length === 0) {
            response({ error: "Email atau password salah" });
          } else {
            const user = results[0];
            const token = jwt.sign({ user }, process.env.SECRET_KEY, {
              expiresIn: "1h",
            });

            // Mendapatkan alamat IP pengguna yang sedang login
            const ipAddress = ip.address();
            const waktu_dibuat = new Date();

            // Menyimpan data akses token dan alamat IP ke tabel akses_token
            const newAccessToken = {
              id_user: user.id_user,
              akses_token: token,
              ip_address: ipAddress,
              waktu_dibuat,
            };

            // Menyimpan data user dalam session
            session.authenticated = true;
            session.login = {
              token: newAccessToken,
              user,
            };

            conn.query(
              "INSERT INTO akses_token SET ?",
              newAccessToken,
              (err, result) => {
                if (err) {
                  response(
                    { error: "Gagal menyimpan data akses token", err },
                    res
                  );
                } else {
                  response(
                    {
                      status: 200,
                      success: true,
                      message: "Token JWT tergenerate",
                      token: token,
                      user: {
                        nama: user.nama,
                        username: user.username,
                        email: user.email,
                        alamat: user.alamat,
                        deskripsi: user.deskripsi,
                        tanggal_daftar: user.tanggal_daftar,
                      },
                      result,
                    },
                    res
                  );
                }
              }
            );
          }
        }
      );
    }
  };

  Logout = (req, res) => {
    if (session.login === undefined) {
      response("Anda belum login. Silahkan login terlebih dahulu!", res);
    } else {
      // Fungsi untuk menghapus data akses_token kadaluarsa
      conn.query(
        "DELETE FROM akses_token WHERE id_user=? AND akses_token=?",
        [session.login.user.id_user, session.login.token.akses_token],
        (err, result) => {
          if (err) {
            response(err, res);
          } else {
            session.login.user = null;
            response("Logout berhasil", res);
          }
        }
      );
    }
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
          jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (
              err ||
              session.authenticated === undefined ||
              session.login.user === undefined
            ) {
              return response("Silahkan login terlebih dahulu", res);
            } else {
              console.log(routeURL);
              if (routeURL === "/auth/verifikasi") {
                response(
                  {
                    nama: session.login.user.nama,
                    username: session.login.user.username,
                    email: session.login.user.email,
                    alamat: session.login.user.alamat,
                    deskripsi: session.login.user.deskripsi,
                    tanggal_daftar: session.login.user.tanggal_daftar,
                  },
                  res
                );
              } else {
                if (
                  session.login.user.role == "dewa" ||
                  session.login.user.role == "super admin" ||
                  session.login.user.role == "admin"
                ) {
                  const user = decoded;
                  next();
                } else if (session.login.user.role == "user") {
                  if (routeURL == "/komik" || routeURL == "/layanan") {
                    const user = decoded;
                    next();
                  }
                }
              }
            }
          });
        } else {
          return response("Token tidak tersedia", res);
        }
      }
    };
}

const authController = new AuthController();
export default authController;
