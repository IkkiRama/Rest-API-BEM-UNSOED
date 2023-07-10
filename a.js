const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database_name",
});

app.get("/kos", (req, res) => {
  const query = `SELECT * FROM kos`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve data from database" });
    } else {
      const kosData = [];
      results.forEach((kos) => {
        const queryGaleri = `SELECT * FROM galeri_kos
                             WHERE id_kos = ${kos.id_kos}`;
        connection.query(queryGaleri, (err, galeriResults) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "Failed to retrieve galeri data from database" });
          } else {
            kos.galeri = galeriResults;
            const queryFasilitas = `SELECT * FROM fasilitas_kos
                                    WHERE id_kos = ${kos.id_kos}`;
            connection.query(queryFasilitas, (err, fasilitasResults) => {
              if (err) {
                console.error(err);
                res.status(500).json({
                  error: "Failed to retrieve fasilitas data from database",
                });
              } else {
                kos.fasilitas = fasilitasResults;
                kosData.push(kos);
                if (kosData.length === results.length) {
                  res.json(kosData);
                }
              }
            });
          }
        });
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
