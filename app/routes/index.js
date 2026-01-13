// TODO: Definisikan semua jalur (Route) aplikasi kalian disini (GET, POST, PUT, DELETE)const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Mundur satu folder untuk cari config

// --- 1. DASHBOARD (Halaman Utama) ---
router.get('/', (req, res) => {
    // Tampilkan 5 buku terbaru
    const sql = 'SELECT * FROM books ORDER BY id DESC LIMIT 5'; 
    db.query(sql, (err, results) => {
        if (err) { console.error(err); res.send("Error database connection."); } 
        else { res.render('index', { books: results }); }
    });
});

// --- 2. KOLEKSI BUKU (Semua Buku) ---
router.get('/collection', (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY title ASC';
    db.query(sql, (err, results) => {
        if (err) { console.error(err); res.render('collection', { books: [] }); } 
        else { res.render('collection', { books: results }); }
    });
});

// --- 3. PEMINJAMAN (Borrowings) ---
router.get('/borrowings', (req, res) => {
    const sqlBorrowings = `
        SELECT borrowings.*, books.title as book_title 
        FROM borrowings 
        LEFT JOIN books ON borrowings.book_id = books.id 
        ORDER BY borrowings.id DESC
    `;
    const sqlBooks = 'SELECT * FROM books WHERE stock > 0 ORDER BY title ASC';

    db.query(sqlBorrowings, (err, borrowingsResult) => {
        if (err) { console.error(err); res.send("Error Database."); return; }
        
        db.query(sqlBooks, (err, booksResult) => {
            if (err) { console.error(err); res.send("Error Database."); return; }
            res.render('borrowings', { 
                borrowings: borrowingsResult, 
                books: booksResult 
            });
        });
    });
});

// Proses Tambah Peminjaman
router.post('/borrowings/add', (req, res) => {
    const { book_id, borrower_name, borrower_nim, borrow_date, return_date } = req.body;
    
    // Default status 'Dipinjam'
    const sqlInsert = 'INSERT INTO borrowings (book_id, borrower_name, borrower_nim, borrow_date, return_date, status) VALUES (?, ?, ?, ?, ?, "Dipinjam")';
    
    db.query(sqlInsert, [book_id, borrower_name, borrower_nim, borrow_date, return_date], (err, result) => {
        if (err) { console.error(err); res.redirect('/borrowings'); return; }

        // Kurangi Stok Buku (-1)
        const sqlUpdateStock = 'UPDATE books SET stock = stock - 1 WHERE id = ?';
        db.query(sqlUpdateStock, [book_id], (err) => {
            res.redirect('/borrowings');
        });
    });
});

// Proses Pengembalian
router.post('/borrowings/return/:id', (req, res) => {
    const borrowingId = req.params.id;
    const bookId = req.body.book_id; 

    // Update Status
    const sqlUpdateStatus = 'UPDATE borrowings SET status = "Dikembalikan" WHERE id = ?';
    db.query(sqlUpdateStatus, [borrowingId], (err, result) => {
        if (err) { console.error(err); res.redirect('/borrowings'); return; }

        // Kembalikan Stok Buku (+1)
        const sqlUpdateStock = 'UPDATE books SET stock = stock + 1 WHERE id = ?';
        db.query(sqlUpdateStock, [bookId], (err) => {
            res.redirect('/borrowings');
        });
    });
});

// --- 4. CONTACT PERSON ---
router.get('/contact', (req, res) => {
    res.render('contact');
});

// --- FITUR CRUD BUKU ---
router.post('/add', (req, res) => {
    const { title, author, isbn, year_published, category, stock } = req.body;
    const sql = 'INSERT INTO books (title, author, isbn, year_published, category, stock) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, author, isbn, year_published, category, stock], (err, result) => {
        if (err) console.error(err);
        res.redirect('/'); 
    });
});

router.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) console.error(err);
        res.redirect('back');
    });
});

router.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM books WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) { console.error(err); res.redirect('/'); } 
        else { res.render('edit', { book: results[0] }); }
    });
});

router.post('/update/:id', (req, res) => {
    const { title, author, isbn, year_published, category, stock } = req.body;
    const sql = 'UPDATE books SET title=?, author=?, isbn=?, year_published=?, category=?, stock=? WHERE id=?';
    db.query(sql, [title, author, isbn, year_published, category, stock, req.params.id], (err, result) => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

// Wajib export router agar bisa dipakai di app.js
module.exports = router;