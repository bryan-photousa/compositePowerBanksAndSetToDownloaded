const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
const baseUrl = `${process.env.OPENPRINT_URL}`;

changeCompositeToDownloaded = (compositeId) => {
  const config = {
    method: "POST",
    headers,
    data: compositeId,
  };
  return axios(`${baseUrl}/change_composite_to_downloaded`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

const responseSuccessHandler = (response) => {
  return response.data;
};

const responseErrorHandler = (error) => {
  console.log(error);
  return Promise.reject(error);
};

module.exports = {
  changeCompositeToDownloaded: changeCompositeToDownloaded,
};
