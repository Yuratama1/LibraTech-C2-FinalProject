const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- 1. DASHBOARD (Halaman Utama) ---
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY id DESC LIMIT 5'; // Tampilkan 5 buku terbaru aja di dashboard
    db.query(sql, (err, results) => {
        if (err) { console.error(err); res.send("Error database."); } 
        else { res.render('index', { books: results }); }
    });
});

// --- 2. KOLEKSI BUKU (Semua Buku) ---
app.get('/collection', (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY title ASC';
    db.query(sql, (err, results) => {
        if (err) { console.error(err); res.render('collection', { books: [] }); } 
        else { res.render('collection', { books: results }); }
    });
});

// --- 3. PEMINJAMAN (Borrowings) ---
app.get('/borrowings', (req, res) => {
    // Join tabel borrowings dengan books biar kita tau judul bukunya apa
    const sql = `
        SELECT borrowings.*, books.title as book_title 
        FROM borrowings 
        LEFT JOIN books ON borrowings.book_id = books.id 
        ORDER BY borrowings.borrow_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) { console.error(err); res.render('borrowings', { borrowings: [] }); } 
        else { res.render('borrowings', { borrowings: results }); }
    });
});

// Proses Tambah Peminjaman
app.post('/borrowings/add', (req, res) => {
    const { book_id, borrower_name, borrower_nim, borrow_date, return_date } = req.body;
    const sql = 'INSERT INTO borrowings (book_id, borrower_name, borrower_nim, borrow_date, return_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [book_id, borrower_name, borrower_nim, borrow_date, return_date], (err, result) => {
        if (err) console.error(err);
        res.redirect('/borrowings');
    });
});

// --- 4. CONTACT PERSON (Tim Kelompok) ---
app.get('/contact', (req, res) => {
    res.render('contact');
});

// --- FITUR CRUD BUKU (Create, Update, Delete) ---
app.post('/add', (req, res) => {
    const { title, author, isbn, year_published, category, stock } = req.body;
    const sql = 'INSERT INTO books (title, author, isbn, year_published, category, stock) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, author, isbn, year_published, category, stock], (err, result) => {
        if (err) console.error(err);
        res.redirect('/collection'); // Redirect ke halaman koleksi setelah nambah
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) console.error(err);
        res.redirect('back'); // Kembali ke halaman sebelumnya
    });
});

app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM books WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) { console.error(err); res.redirect('/'); } 
        else { res.render('edit', { book: results[0] }); }
    });
});

app.post('/update/:id', (req, res) => {
    const { title, author, isbn, year_published, category, stock } = req.body;
    const sql = 'UPDATE books SET title=?, author=?, isbn=?, year_published=?, category=?, stock=? WHERE id=?';
    db.query(sql, [title, author, isbn, year_published, category, stock, req.params.id], (err, result) => {
        if (err) console.error(err);
        res.redirect('/collection');
    });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("--> Server LIBRATECH Berhasil Jalan di Port " + PORT);
});