"use strict";
import response from "./response.js";
import conn from "./koneksi.js";

const index = (req, res) => {
  response("Aplikasi Rest API berhasil berjalan!", res);
};

export { index };
