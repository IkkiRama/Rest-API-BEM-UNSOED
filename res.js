"use strict";
const ready = (values, res) => {
  let data = {
    status: 200,
    value: values,
  };

  res.json(data);
  res.end();
};

export default ready;
