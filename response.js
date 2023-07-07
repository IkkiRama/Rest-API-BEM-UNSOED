"use strict";

const response = (values, res) => {
  console.log(`Values ${values}`);
  let data = {
    status: res.statusCode,
    value: values,
  };

  res.json(data);
  res.end();
};

export default response;
