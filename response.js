"use strict";

const response = (values, res) => {
  console.log(`Values ${values}`);
  let data = {
    status: 200,
    value: values,
  };

  res.json(data);
  res.end();
};

export default response;
