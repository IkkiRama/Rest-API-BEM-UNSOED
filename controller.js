"use strict";
import response from "./res";
import koneksi from "./koneksi";

const index = (req, res) => {
  response.ready("Aplikasi REST berjalan!");
};

export default index;
