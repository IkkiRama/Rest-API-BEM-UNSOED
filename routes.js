"use strict";
import response from "./response.js";
import koneksi from "./koneksi.js";
import HomeController from "./Controller/HomeController.js";
import UserController from "./Controller/UserController.js";
import FakultasController from "./Controller/FakultasController.js";

const homeController = new HomeController();
const userController = new UserController();
const fakultasController = new FakultasController();

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
};

export default routes;
