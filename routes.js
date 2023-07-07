"use strict";
import response from "./response.js";
import koneksi from "./koneksi.js";
import { index } from "./controller.js";

// inisialisasi kelas controller

const routes = function (app) {
  app.route("/").get(index);
};

export default routes;
