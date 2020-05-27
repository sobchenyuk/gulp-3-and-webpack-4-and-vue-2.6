window.$ = window.jQuery = require('jquery')

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
window.axios.defaults.headers.common.crossDomain = true

if (
  document.querySelector('base') &&
  document.querySelector('base').href.indexOf('//localhost:3000') !== -1
) {
  window.axios.defaults.baseURL = document.querySelector('base').href
} else {
  window.axios.defaults.baseURL = '/'
}

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://github.com/expressjs/csurf')
}
