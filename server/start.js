const app = require('./server')

//split off the listen() function so the server can be loaded for testing

app.listen(3000)
console.log(`Listening on Port 3000`);
