"use strict";
import response from "./response.js";
import koneksi from "./koneksi.js";
import homeController from "./Controller/HomeController.js";
import userController from "./Controller/UserController.js";
import fakultasController from "./Controller/FakultasController.js";
import galeriFakultasController from "./Controller/GaleriFakultasController.js";
import medsosFakultasController from "./Controller/MedsosFakultasController.js";
import ukmController from "./Controller/UkmController.js";
import layananController from "./Controller/LayananController.js";
import komikController from "./Controller/KomikController.js";

const RouteGroup = (app, routeUrl, controller) => {
  app.route(`${routeUrl}`).get(controller.Select);
  app.route(`${routeUrl}/:id`).get(controller.Detail);
  app.route(`${routeUrl}/tambah`).post(controller.Insert);
  app.route(`${routeUrl}/ubah/:id`).put(controller.Update);
  app.route(`${routeUrl}/hapus/:id`).delete(controller.Delete);
};

const routes = function (app) {
  app.route(`/`).get(homeController.Index);
  RouteGroup(app, "/user", userController);
  RouteGroup(app, "/fakultas", fakultasController);
  RouteGroup(app, "/galeri", galeriFakultasController);
  RouteGroup(app, "/medsos", medsosFakultasController);
  RouteGroup(app, "/ukm", ukmController);
  RouteGroup(app, "/layanan", layananController);
  RouteGroup(app, "/komik", komikController);
};

export default routes;
