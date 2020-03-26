const config = require("config");
const axios = require("axios");
const moment = require("moment");

exports.dummy = function(req, res, next) {
  return res.status(200).send({
    message: "access fif api"
  });
};

exports.generateAccessToken = function(req, res, next) {
  axios
  .post(
    config.access_token_api_url,
    {
      grant_type: "client_credentials"
    },
    {
      headers: {
        // post: {
        //   "Content-Type": "application/json"
        // },
        Authorization:
          "Basic T3RMdGFhTjVZblUzRnc3WVdLT1VzRWh3QXdtQTZBZDI6ekhjSHRST2d3bng3RDF3Rg=="
      }
    }
  )
  .then(response => {
    const accessToken = response.data.access_token;

    return res.status(200).send({
      accessToken: accessToken
    });
  })
  .catch(error => {
    // console.log(error.request);
    return res.status(error.response.status).send({
      error: error.response.data
    });
  });
}

exports.getBranchInfo = function(req, res, next) {
  const dprn = req.params.dprn;
  const asAtDate = req.query.asAtDate;

  if (!dprn) {
    return res.status(400).send({
      error: "DPRN is required."
    });
  }

  if (dprn.length !== 9 || isNaN(+dprn)) {
    return res.status(400).send({
      error:
        "DPRN not formatted properly - needs to be numerical and 9 digits in length"
    });
  }

  if (asAtDate) {
    const asDate = moment(asAtDate, "YYYY-MM-DD");
    if (!asDate.isValid()) {
      return res.status(400).send({
        error: "asAtDate should be of type date (yyyy-MM-dd)."
      });
    }
  }

  axios
    .post(
      config.access_token_api_url,
      {
        grant_type: "client_credentials"
      },
      {
        headers: {
          // post: {
          //   "Content-Type": "application/json"
          // },
          Authorization:
            "Basic T3RMdGFhTjVZblUzRnc3WVdLT1VzRWh3QXdtQTZBZDI6ekhjSHRST2d3bng3RDF3Rg=="
        }
      }
    )
    .then(response => {
      const accessToken = response.data.access_token;

      let headers = {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      };

      const url =
        config.fif_branch_api_base_url +
        "/branches/" +
        dprn +
        (asAtDate ? "?asAtDate=" + asAtDate : "");

      axios
        .get(url, headers)
        .then(response => {
          return res.status(200).send({
            branch_info: response.data
          });
        })
        .catch(error => {
          if (error.response.status === 404) {
            return res.status(404).send({
              message: "Branch Not Found"
            });
          } else {
            return res.status(error.response.status).send({
              error: error.response.data
            });
          }
        });
    })
    .catch(error => {
      // console.log(error.request);
      return res.status(error.response.status).send({
        error: error.response.data
      });
    });
};

exports.getMasterExtractData = function(req, res, next) {
  const asAtDate = req.query.asAtDate;

  if (asAtDate) {
    const asDate = moment(asAtDate, "YYYY-MM-DD");
    if (!asDate.isValid()) {
      return res.status(400).send({
        error: "asAtDate should be of type date (yyyy-MM-dd)."
      });
    }
  }

  const url =
    config.fif_extracts_api_base_url +
    "/extracts/master" +
    (asAtDate ? "?asAtDate=" + asAtDate : "");
  let headers = {
    headers: { Authorization: "Bearer " + config.fif_extracts_api_access_token }
  };

  axios
    .get(url, headers)
    .then(response => {
      return res.status(200).send({
        master_extract_data: response.data
      });
    })
    .catch(error => {
      if (error.response.status === 404) {
        return res.status(200).send({
          message: "Master extract file is not found"
        });
      } else {
        return res.status(error.response.status).send({
          error: error.response.data
        });
      }
    });
};
