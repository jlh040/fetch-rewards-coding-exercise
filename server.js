// put the app.listen in this file so that we don't get an error when testing
const app = require('./app');

app.listen(3000, () => {
  console.log('Server started on port 3000');
});