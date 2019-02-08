if (process.env.NODE_ENV === 'production') {
  // We are in production envcironment
  module.exports = require('./prod');
} else {
  // We are in dev environment
  module.exports = require('./dev');
}
