const express = require('express');
const app = express();

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static('dist'));
app.listen(5000, () => console.log('Express server running at http://127.0.0.1:5000'));
