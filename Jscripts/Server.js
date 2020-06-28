const express = require('express');
const app = express();

app.get('/',  (req, res) => {
    res.send('muie');
});
console.log("sal");
/*router.get('/about', function (req, res) {
    res.send('About birds')
});*/
