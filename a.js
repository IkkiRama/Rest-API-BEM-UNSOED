const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "database_name",
});

// Mengambil data semua komik
app.get("/komik", (req, res) => {
  const query = `
    SELECT komik.id_komik, komik.id_user, komik.title_komik, user.id_user, user.nama, user.username, user.alamat, user.deskripsi, galeriKomik.id_galerikomik, galeriKomik.gambar
    FROM komik
    INNER JOIN user ON komik.id_user = user.id_user
    INNER JOIN galeriKomik ON komik.id_komik = galeriKomik.id_komik
  `;

  db.query(query, (error, results) => {
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

    const response = { values: komiks };

    res.json(response);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
