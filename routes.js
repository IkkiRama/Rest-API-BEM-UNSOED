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
import galeriKomikController from "./Controller/GaleriKomikController.js";
import authController from "./Controller/AuthController.js";

const RouteGroup = (app, routeUrl, isVerification, controller) => {
  app
    .route(`${routeUrl}`)
    .get(
      authController.Verifikasi(routeUrl, isVerification),
      controller.Select
    );
  app
    .route(`${routeUrl}/:id`)
    .get(
      authController.Verifikasi(routeUrl, isVerification),
      controller.Detail
    );
  app
    .route(`${routeUrl}/tambah`)
    .post(
      authController.Verifikasi(routeUrl, isVerification),
      controller.Insert
    );
  app
    .route(`${routeUrl}/ubah/:id`)
    .put(
      authController.Verifikasi(routeUrl, isVerification),
      controller.Update
    );
  app
    .route(`${routeUrl}/hapus/:id`)
    .delete(
      authController.Verifikasi(routeUrl, isVerification),
      controller.Delete
    );
};

const routes = function (app) {
  // AUTH ROUTE
  app.route(`/auth/register`).post(authController.Registrasi);
  app.route(`/auth/login`).post(authController.Login);
  app.route(`/auth/logout`).get(authController.Logout);
  app
    .route(`/auth/verifikasi`)
    .post(authController.Verifikasi("/auth/verifikasi", true));

  app.route(`/`).get(homeController.Index);
  RouteGroup(app, "/user", false, userController);
  RouteGroup(app, "/fakultas", false, fakultasController);
  RouteGroup(app, "/galeri/fakultas", true, galeriFakultasController);
  RouteGroup(app, "/medsos", true, medsosFakultasController);
  RouteGroup(app, "/ukm", true, ukmController);
  RouteGroup(app, "/layanan", true, layananController);
  RouteGroup(app, "/komik", true, komikController);
  RouteGroup(app, "/galeri/komik", true, galeriKomikController);
};

export default routes;
