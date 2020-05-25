const adaptRequest = require('./adaptRequest')

function makeEndpointCallback (controller) {
    return function (req, res) {
      console.log('httpRequest: ' + req.method + ' ' + req.path  )
      const httpRequest = adaptRequest(req)
      controller(httpRequest)
        .then(({ headers, statusCode, data = {} }) => {
          console.log(statusCode)
          console.log(data)
          res
            .set(headers)
            .status(statusCode)
            .send(data)
        })
        .catch(err => res.status(500).end())
    }
  }

  module.exports = makeEndpointCallback