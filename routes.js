"use strict";
import response from "./response.js";
import koneksi from "./koneksi.js";
import HomeController from "./Controller/HomeController.js";
import UserController from "./Controller/UserController.js";

const homeController = new HomeController();
const userController = new UserController();

const routes = function (app) {
  app.route("/").get(homeController.Index);
  app.route("/user").get(userController.Select);
};

export default routes;
