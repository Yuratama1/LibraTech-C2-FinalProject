-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
-- Membuat Tabel Buku (Books)
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    year_published INT,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat Tabel Peminjaman (Borrowings)
CREATE TABLE IF NOT EXISTS borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    borrower_name VARCHAR(255),
    borrower_nim VARCHAR(20),
    borrow_date DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'Dipinjam',  -- KOLOM BARU
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Data Dummy Awal (Agar pas di-run tidak kosong)
INSERT INTO books (title, author, category, stock) VALUES 
('Laskar Pelangi', 'Andrea Hirata', 'Novel', 5),
('Clean Code', 'Robert C. Martin', 'Teknologi', 3);