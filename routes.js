"use strict";
import response from "./response.js";
import koneksi from "./koneksi.js";
import HomeController from "./Controller/HomeController.js";
import UserController from "./Controller/UserController.js";
import FakultasController from "./Controller/FakultasController.js";

const homeController = new HomeController();
const userController = new UserController();
const fakultasController = new FakultasController();

const RouteGroup = (app, tabel, controller) => {
  app.route(`/${tabel}`).get(controller.Select);
  app.route(`/${tabel}/:id`).get(controller.Detail);
  app.route(`/${tabel}/tambah`).post(controller.Insert);
  app.route(`/${tabel}/ubah/:id`).put(controller.Update);
  app.route(`/${tabel}/hapus/:id`).delete(controller.Delete);
};

const routes = function (app) {
  app.route(`/`).get(homeController.Index);
  RouteGroup(app, "user", userController);
  RouteGroup(app, "fakultas", fakultasController);
};

export default routes;
