const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Konfigurasi koneksi database MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "nama_database",
});

// Mengambil data fakultas beserta galeri dan media sosial dari database
app.get("/fakultas", (req, res) => {
  const queryFakultas = "SELECT * FROM fakultas";
  connection.query(queryFakultas, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const fakultas = results.map((fakultasResult) => {
        const queryGaleri = `SELECT galeri FROM galerifakultas WHERE id_fakultas = ${fakultasResult.id_fakultas}`;
        return new Promise((resolve, reject) => {
          connection.query(queryGaleri, (galeriError, galeriResults) => {
            if (galeriError) {
              reject(galeriError);
            } else {
              const galeri = galeriResults.map(
                (galeriResult) => galeriResult.galeri
              );
              const queryMedsos = `SELECT jenis, link FROM medsosfakultas WHERE id_fakultas = ${fakultasResult.id_fakultas}`;
              connection.query(queryMedsos, (medsosError, medsosResults) => {
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
          res.json(formattedResults);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    }
  });
});

// Menghubungkan ke database dan menjalankan server pada port tertentu
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to database:", error);
  } else {
    console.log("Connected to database.");
    app.listen(3000, () => {
      console.log("Server is running on port 3000.");
    });
  }
});
