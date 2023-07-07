"use strict";
import response from "../response.js";
import conn from "../koneksi.js";

class HomeController {
  constructor() {}
  Index = (req, res) => {
    response("Aplikasi Rest API berhasil berjalan!", res);
  };
}

export default HomeController;
