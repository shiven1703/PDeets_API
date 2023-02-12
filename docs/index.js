const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('swagger.yaml')
const apiSpecSwaggerDocument = YAML.load('docs/api_spec_swagger.yaml')

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      requestInterceptor: (request) => {
        request.header.origin = `http://localhost:${process.env.PORT}`
        return request
      }
    }
  }))

  app.use('/api-spec', swaggerUi.serveFiles(apiSpecSwaggerDocument), swaggerUi.setup(apiSpecSwaggerDocument, {
    swaggerOptions: {
      requestInterceptor: (request) => {
        request.header.origin = `http://localhost:${process.env.PORT}`
        return request
      }
    }
  }))
}
