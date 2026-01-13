const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import file routes yang baru kita buat
const routes = require('./routes/index'); 

const app = express();

// Konfigurasi View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// GUNAKAN ROUTES DARI FILE TERPISAH
app.use('/', routes);

// Jalankan Server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("--> Server LIBRATECH Berhasil Jalan di Port " + PORT);
});