const qs = require('qs')

const api = (url, options) => {
  return window.fetch(url, options)
    .then(res => {
      if (res.headers.get('Content-Type') === 'application/json') {
        return res.json()
      }

      return res.text()
    })
}

const prepOptions = (data, options = {}) => {
  if (!options.headers) {
    options.headers = {}
  }

  if (!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json'
  }

  const body = options.headers['Content-Type'] === 'application/json' ? JSON.stringify(data) : ''

  options.method = 'POST'
  options.body = body

  return options
}

api.get = (endpoint, data, options = {}) => {
  const queries = data ? '?' + qs.stringify(data) : ''

  return api(process.env.ADMIN_BASE + '/api/' + endpoint + queries, options)
}

api.post = (endpoint, data, options = {}) => {
  options = prepOptions(data, options)

  options.method = 'POST'

  return api(process.env.ADMIN_BASE + '/api/' + endpoint, options)
}

api.put = (endpoint, data, options = {}) => {
  options = prepOptions(data, options)

  options.method = 'PUT'

  return api(process.env.ADMIN_BASE + '/api/' + endpoint, options)
}

api.del = (endpoint, data, options = {}) => {
  options = prepOptions(data, options)

  options.method = 'DELETE'

  return api(process.env.ADMIN_BASE + '/api/' + endpoint, options)
}

export default api
