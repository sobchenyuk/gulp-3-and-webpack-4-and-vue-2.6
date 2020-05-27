require('./bootstrap')

// Disable Devtools on Production
if (process.env.NODE_ENV == 'production') {
  Vue.config.devtools = false
  Vue.config.debug = false
  Vue.config.silent = true
}
