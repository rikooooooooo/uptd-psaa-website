const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const multer = require("multer");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const upload = multer({ dest: "uploads/" });
const bcrypt = require("bcrypt");
const fs = require("fs");


app.use(cors());
app.use(express.json());

// Cloudinary credentials
const cloudName = "df4qrohsq";
const apiKey = "796925765498812";
const apiSecret = "nORZFifGu2Y_oIBRNtdAWRqfFAE";

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "uptd",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

// Function to generate the correct signature
const generateSignature = (publicId, timestamp) => {
  const signatureString = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha1").update(signatureString).digest("hex");
};

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Received login request for:", email);
    console.log("Received password:", password);

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      console.log("User not found");
      return res.status(400).json({ error: "Admin not found" });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    if (!password || !user.password_hash) {
      console.log("Password or hash missing");
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Checking password...");

    const fixedHash = user.password_hash.replace("$2y$", "$2b$"); // Fix bcrypt hash format
    const isMatch = await bcrypt.compare(password, fixedHash);

    if (!isMatch) {
      console.log("Password incorrect");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = "your_token_here"; // Replace with JWT if needed

    console.log("Login successful");

    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// User Login endpoint
app.post("/loginUsers", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a single user by ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a new user
app.post("/api/users", async (req, res) => {
  const { username, password, nik, nama } = req.body;

  if (!username || !password || !nik || !nama) {
    return res.status(400).json({ error: "Username, password, nik and nama are required" });
  }

  try {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await pool.query(
      "INSERT INTO users (username, password, nik, nama) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, hashedPassword, nik || null, nama || null]
    );
    
    // Remove password from the response for security
    const { password: removedPassword, ...userResponse } = rows[0];
    
    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update a user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, nik, nama } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    let updateQuery = "UPDATE users SET username = $1";
    const queryParams = [username];
    let paramCount = 2;

    // Add nik to update if provided
    if (nik !== undefined) {
      updateQuery += `, nik = $${paramCount}`;
      queryParams.push(nik);
      paramCount++;
    }

    // Add nama to update if provided
    if (nama !== undefined) {
      updateQuery += `, nama = $${paramCount}`;
      queryParams.push(nama);
      paramCount++;
    }

    // Handle password update with hashing if provided
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateQuery += `, password = $${paramCount}`;
      queryParams.push(hashedPassword);
      paramCount++;
    }

    // Add WHERE clause and RETURNING
    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
    queryParams.push(id);

    const { rows } = await pool.query(updateQuery, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password from the response for security
    const { password: removedPassword, ...userResponse } = rows[0];
    
    res.status(200).json(userResponse);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});


// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 3. Get User by NIK
// Fetch user by NIK
app.get("/api/users/nik/:nik", async (req, res) => {
  try {
    const { nik } = req.params;

    // Query to fetch user by NIK
    const query = `
      SELECT 
        id, 
        username, 
        nik, 
        nama, 
        created_at
      FROM users 
      WHERE nik = $1
    `;

    const result = await pool.query(query, [nik]);

    // If no user found, return 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the first (and should be only) user
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user by NIK:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// form1  endpoint 
// data anak endpoint
//fetch all data
app.get("/api/data_anak", async (req, res) => {
  try {
    // Query to fetch all data from the `data_anak` table
    const result = await pool.query("SELECT * FROM data_anak");
    res.status(200).json(result.rows); // Return all rows as JSON
  } catch (error) {
    console.error("Error fetching data anak:", error);
    res.status(500).json({ error: "Failed to fetch data anak" });
  }
});
//fetch single data
app.get("/api/data_anak/:nik", async (req, res) => {
  try {
    const { nik } = req.params;

    // Query to fetch a single record from the `data_anak` table using `nik`
    const userQuery = "SELECT * FROM data_anak WHERE nik = $1";
    const userResult = await pool.query(userQuery, [nik]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Data anak not found" });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error("Error fetching data anak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// delete data_anak
app.delete("/api/data_anak/:nik", async (req, res) => {
  try {
    const { nik } = req.params;

    const deleteQuery = "DELETE FROM data_anak WHERE nik = $1 RETURNING *";
    const deletedDataAnak = await pool.query(deleteQuery, [nik]);

    if (deletedDataAnak.rows.length === 0) {
      return res.status(404).json({ message: "Data anak not found" });
    }

    res.json({ message: "Data anak deleted successfully", deletedDataAnak: deletedDataAnak.rows[0] });
  } catch (error) {
    console.error("Error deleting data anak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// create data_anak
app.post("/api/data_anak", async (req, res) => {   
  try {     
    const {       
      nama,       
      nik,       
      tempat_lahir,       
      tanggal_lahir,       
      pendidikan_terakhir,       
      ranking,       
      total_siswa,       
      tinggal_kelas,       
      jumlah_saudara,       
      anak_ke,       
      tinggi_badan,       
      berat_badan,       
      kebiasaan,       
      alamat,     
    } = req.body;      

    // Step 1: Check if user exists
    const userQuery = "SELECT id FROM users WHERE nik = $1";
    const userResult = await pool.query(userQuery, [nik]);

    if (userResult.rows.length === 0) {
      // If no user exists, return an error
      return res.status(400).json({ 
        message: "User dengan NIK tersebut tidak ditemukan. Silakan buat user terlebih dahulu." 
      });
    }

    // User exists, get userId
    const userId = userResult.rows[0].id;

    // Step 2: Insert into data_anak using the retrieved userId
    const insertQuery = `
      INSERT INTO data_anak (
        id, nama, nik, tempat_lahir, tanggal_lahir, pendidikan_terakhir,
        ranking, total_siswa, tinggal_kelas, jumlah_saudara, anak_ke,
        tinggi_badan, berat_badan, kebiasaan, alamat, created_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
      )
      RETURNING *;
    `;

    const newDataAnak = await pool.query(insertQuery, [
      userId, // Use the retrieved user ID
      nama,
      nik,
      tempat_lahir,
      tanggal_lahir,
      pendidikan_terakhir,
      ranking,
      total_siswa,
      tinggal_kelas,
      jumlah_saudara,
      anak_ke,
      tinggi_badan,
      berat_badan,
      kebiasaan,
      alamat,
    ]);

    res.status(201).json(newDataAnak.rows[0]);
  } catch (error) {
    console.error("Error creating data anak:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
});

// update data_anak
app.put("/api/data_anak/:nik", async (req, res) => {
  try {
    const { nik } = req.params;
    const {
      id,
      nama,
      tempat_lahir,
      tanggal_lahir,
      pendidikan_terakhir,
      ranking,
      total_siswa,
      tinggal_kelas,
      jumlah_saudara,
      anak_ke,
      tinggi_badan,
      berat_badan,
      kebiasaan,
      alamat,
    } = req.body;

    const updateQuery = `
      UPDATE data_anak
      SET
        id = $1,
        nama = $2,
        tempat_lahir = $3,
        tanggal_lahir = $4,
        pendidikan_terakhir = $5,
        ranking = $6,
        total_siswa = $7,
        tinggal_kelas = $8,
        jumlah_saudara = $9,
        anak_ke = $10,
        tinggi_badan = $11,
        berat_badan = $12,
        kebiasaan = $13,
        alamat = $14
      WHERE nik = $15
      RETURNING *;
    `;

    const updatedDataAnak = await pool.query(updateQuery, [
      id,
      nama,
      tempat_lahir,
      tanggal_lahir,
      pendidikan_terakhir,
      ranking,
      total_siswa,
      tinggal_kelas,
      jumlah_saudara,
      anak_ke,
      tinggi_badan,
      berat_badan,
      kebiasaan,
      alamat,
      nik,
    ]);

    if (updatedDataAnak.rows.length === 0) {
      return res.status(404).json({ message: "Data anak not found" });
    }

    res.json(updatedDataAnak.rows[0]);
  } catch (error) {
    console.error("Error updating data anak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// orang tua endpoint
// create
app.post("/api/orang_tua", async (req, res) => {
  console.log("Received Orang Tua Data:", req.body); // Debugging
  const {
    user_id,
    jenis,
    nama,
    nik,
    nama_kecil,
    jumlah_saudara,
    pendidikan,
    pekerjaan,
    alamat,
    no_hp,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO orang_tua (
        user_id, jenis, nama, nik, nama_kecil, jumlah_saudara, pendidikan, pekerjaan, alamat, no_hp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const newOrangTua = await pool.query(insertQuery, [
      user_id,
      jenis,
      nama,
      nik,
      nama_kecil,
      jumlah_saudara,
      pendidikan,
      pekerjaan,
      alamat,
      no_hp,
    ]);

    res.status(201).json(newOrangTua.rows[0]);
  } catch (error) {
    console.error("Error creating orang tua:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// update 
app.put("/api/orang_tua/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, jenis, nama, nik, nama_kecil, jumlah_saudara, pendidikan, pekerjaan, alamat, no_hp } = req.body;

    await pool.query(
      "UPDATE orang_tua SET user_id=$1, jenis=$2, nama=$3, nik=$4, nama_kecil=$5, jumlah_saudara=$6, pendidikan=$7, pekerjaan=$8, alamat=$9, no_hp=$10 WHERE id=$11",
      [user_id, jenis, nama, nik, nama_kecil, jumlah_saudara, pendidikan, pekerjaan, alamat, no_hp, id]
    );

    res.status(200).json({ message: "Data Orang Tua diperbarui" });
  } catch (error) {
    console.error("Error updating orang_tua:", error);
    res.status(500).json({ error: "Gagal memperbarui data orang tua" });
  }
});
//fetch one
app.get("/api/orang_tua/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query("SELECT * FROM orang_tua WHERE user_id = $1", [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orang_tua:", error);
    res.status(500).json({ error: "Gagal mengambil data orang tua" });
  }
});

// delete
app.delete("/api/orang_tua/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { jenis } = req.body; // "ayah" or "ibu"

  try {
    const deleteQuery = `
      DELETE FROM orang_tua
      WHERE user_id = $1 AND jenis = $2
      RETURNING *;
    `;

    const deletedOrangTua = await pool.query(deleteQuery, [user_id, jenis]);

    if (deletedOrangTua.rows.length === 0) {
      return res.status(404).json({ message: "Orang tua not found" });
    }

    res.json({ message: "Orang tua deleted successfully", deletedOrangTua: deletedOrangTua.rows[0] });
  } catch (error) {
    console.error("Error deleting orang tua:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// form 2 endpoints 
//fetch all
app.get("/api/kondisi_ekonomi", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kondisi_ekonomi");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Data by user_id
app.get("/api/kondisi_ekonomi/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM kondisi_ekonomi WHERE user_id = $1", [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json(null); // Return null if no data is found
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Upload Data
app.post("/api/kondisi_ekonomi", async (req, res) => {
  const {
    user_id,
    gambaran_rumah,
    status_rumah,
    penghasilan_bulanan,
    pengeluaran_bulanan,
    perabotan,
    tempat_bekerja,
    sumber_pendapatan,
    jarak_sd,
    jarak_sltp,
    jarak_slta,
    jarak_pusat_keramaian,
    kunjungan_pasar_orang_tua,
    kunjungan_pasar_anak,
    sanitasi,
    makanan_suka,
    makanan_tidak_suka,
    dukungan_pendidikan_orang_tua,
    dukungan_pendidikan_mamak,
    dukungan_pendidikan_saudara_ibu,
    dukungan_pendidikan_saudara_bapak,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO kondisi_ekonomi (
        user_id, gambaran_rumah, status_rumah, penghasilan_bulanan, pengeluaran_bulanan,
        perabotan, tempat_bekerja, sumber_pendapatan, jarak_sd, jarak_sltp,
        jarak_slta, jarak_pusat_keramaian, kunjungan_pasar_orang_tua,
        kunjungan_pasar_anak, sanitasi, makanan_suka, makanan_tidak_suka,
        dukungan_pendidikan_orang_tua, dukungan_pendidikan_mamak,
        dukungan_pendidikan_saudara_ibu, dukungan_pendidikan_saudara_bapak
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
      [
        user_id,
        gambaran_rumah,
        status_rumah,
        penghasilan_bulanan,
        pengeluaran_bulanan,
        perabotan,
        tempat_bekerja,
        sumber_pendapatan,
        jarak_sd,
        jarak_sltp,
        jarak_slta,
        jarak_pusat_keramaian,
        kunjungan_pasar_orang_tua,
        kunjungan_pasar_anak,
        sanitasi,
        makanan_suka,
        makanan_tidak_suka,
        dukungan_pendidikan_orang_tua,
        dukungan_pendidikan_mamak,
        dukungan_pendidikan_saudara_ibu,
        dukungan_pendidikan_saudara_bapak,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Data
app.put("/api/kondisi_ekonomi/:id", async (req, res) => {
  const { id } = req.params;
  const {
    gambaran_rumah,
    status_rumah,
    penghasilan_bulanan,
    pengeluaran_bulanan,
    perabotan,
    tempat_bekerja,
    sumber_pendapatan,
    jarak_sd,
    jarak_sltp,
    jarak_slta,
    jarak_pusat_keramaian,
    kunjungan_pasar_orang_tua,
    kunjungan_pasar_anak,
    sanitasi,
    makanan_suka,
    makanan_tidak_suka,
    dukungan_pendidikan_orang_tua,
    dukungan_pendidikan_mamak,
    dukungan_pendidikan_saudara_ibu,
    dukungan_pendidikan_saudara_bapak,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE kondisi_ekonomi SET
        gambaran_rumah = $1, status_rumah = $2, penghasilan_bulanan = $3, pengeluaran_bulanan = $4,
        perabotan = $5, tempat_bekerja = $6, sumber_pendapatan = $7, jarak_sd = $8,
        jarak_sltp = $9, jarak_slta = $10, jarak_pusat_keramaian = $11,
        kunjungan_pasar_orang_tua = $12, kunjungan_pasar_anak = $13, sanitasi = $14,
        makanan_suka = $15, makanan_tidak_suka = $16, dukungan_pendidikan_orang_tua = $17,
        dukungan_pendidikan_mamak = $18, dukungan_pendidikan_saudara_ibu = $19,
        dukungan_pendidikan_saudara_bapak = $20
      WHERE id = $21 RETURNING *`,
      [
        gambaran_rumah,
        status_rumah,
        penghasilan_bulanan,
        pengeluaran_bulanan,
        perabotan,
        tempat_bekerja,
        sumber_pendapatan,
        jarak_sd,
        jarak_sltp,
        jarak_slta,
        jarak_pusat_keramaian,
        kunjungan_pasar_orang_tua,
        kunjungan_pasar_anak,
        sanitasi,
        makanan_suka,
        makanan_tidak_suka,
        dukungan_pendidikan_orang_tua,
        dukungan_pendidikan_mamak,
        dukungan_pendidikan_saudara_ibu,
        dukungan_pendidikan_saudara_bapak,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Data by ID
app.delete("/api/kondisi_ekonomi/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM kondisi_ekonomi WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// form 3
//fetch all
app.get("/api/hubungan_sosial_ibadah", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hubungan_sosial_ibadah");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//fetch 1 data
app.get("/api/hubungan_sosial_ibadah/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM hubungan_sosial_ibadah WHERE user_id = $1", [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json(null); // Return null if no data is found
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//upload data
app.post("/api/hubungan_sosial_ibadah", async (req, res) => {
  const {
    user_id,
    hubungan_masyarakat,
    semangat_kegiatan_sosial,
    ibadah_anak,
    ibadah_bapak,
    ibadah_ibu,
    anak_ibadah_sering,
    bapak_ibadah_sering,
    ibu_ibadah_sering,
    baca_quran_anak,
    baca_quran_bapak,
    baca_quran_ibu,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO hubungan_sosial_ibadah (
        user_id, hubungan_masyarakat, semangat_kegiatan_sosial, ibadah_anak, ibadah_bapak,
        ibadah_ibu, anak_ibadah_sering, bapak_ibadah_sering, ibu_ibadah_sering,
        baca_quran_anak, baca_quran_bapak, baca_quran_ibu
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        user_id,
        hubungan_masyarakat,
        semangat_kegiatan_sosial,
        ibadah_anak,
        ibadah_bapak,
        ibadah_ibu,
        anak_ibadah_sering,
        bapak_ibadah_sering,
        ibu_ibadah_sering,
        baca_quran_anak,
        baca_quran_bapak,
        baca_quran_ibu,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//update data
app.put("/api/hubungan_sosial_ibadah/:id", async (req, res) => {
  const { id } = req.params;
  const {
    hubungan_masyarakat,
    semangat_kegiatan_sosial,
    ibadah_anak,
    ibadah_bapak,
    ibadah_ibu,
    anak_ibadah_sering,
    bapak_ibadah_sering,
    ibu_ibadah_sering,
    baca_quran_anak,
    baca_quran_bapak,
    baca_quran_ibu,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE hubungan_sosial_ibadah SET
        hubungan_masyarakat = $1, semangat_kegiatan_sosial = $2, ibadah_anak = $3, ibadah_bapak = $4,
        ibadah_ibu = $5, anak_ibadah_sering = $6, bapak_ibadah_sering = $7, ibu_ibadah_sering = $8,
        baca_quran_anak = $9, baca_quran_bapak = $10, baca_quran_ibu = $11
      WHERE id = $12 RETURNING *`,
      [
        hubungan_masyarakat,
        semangat_kegiatan_sosial,
        ibadah_anak,
        ibadah_bapak,
        ibadah_ibu,
        anak_ibadah_sering,
        bapak_ibadah_sering,
        ibu_ibadah_sering,
        baca_quran_anak,
        baca_quran_bapak,
        baca_quran_ibu,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete data
app.delete("/api/hubungan_sosial_ibadah/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM hubungan_sosial_ibadah WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//form4
// fetch all
app.get("/api/data_pendaftaran", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM data_pendaftaran");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// fetch 1
app.get("/api/data_pendaftaran/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        user_id, 
        nomor_kk, 
        nomor_pendaftaran, 
        nisn, 
        nama, 
        tempat_tanggal_lahir, 
        nik::text,  
        agama, 
        berat_badan, 
        tinggi_badan, 
        pendidikan_masuk_panti, 
        nomor_bpjs, 
        status, 
        daerah_asal_kabupaten, 
        nama_ayah, 
        nik_ayah::text,  
        agama_ayah, 
        pendidikan_ayah, 
        pekerjaan_ayah, 
        status_ayah, 
        nama_ibu, 
        nik_ibu::text,  
        agama_ibu, 
        pendidikan_ibu, 
        pekerjaan_ibu, 
        nomor_hp, 
        sdn, 
        sltp, 
        slta, 
        khatam_quran, 
        prestasi_1, 
        prestasi_2 
      FROM data_pendaftaran 
      WHERE user_id = $1`,
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(null); // Return null if no data is found
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// upload
app.post("/api/data_pendaftaran", async (req, res) => {
  const {
    user_id,
    nomorKK,
    nomorPendaftaran,
    nisn,
    nama,
    tempatTanggalLahir,
    nik,
    agama,
    beratBadan,
    tinggiBadan,
    pendidikanMasukPanti,
    nomorBPJS,
    status,
    daerahAsal,
    namaAyah,
    nikAyah,
    agamaAyah,
    pendidikanAyah,
    pekerjaanAyah,
    statusAyah,
    namaIbu,
    nikIbu,
    agamaIbu,
    pendidikanIbu,
    pekerjaanIbu,
    nomorHP,
    sdn,
    sltp,
    slta,
    khatam_quran,
    prestasi_1,
    prestasi_2,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO data_pendaftaran (
        user_id, nomor_kk, nomor_pendaftaran, nisn, nama, tempat_tanggal_lahir, nik, agama,
        berat_badan, tinggi_badan, pendidikan_masuk_panti, nomor_bpjs, status, daerah_asal_kabupaten,
        nama_ayah, nik_ayah, agama_ayah, pendidikan_ayah, pekerjaan_ayah, status_ayah,
        nama_ibu, nik_ibu, agama_ibu, pendidikan_ibu, pekerjaan_ibu, nomor_hp,
        sdn, sltp, slta, khatam_quran, prestasi_1, prestasi_2
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *`,
      [
        user_id,
        nomorKK,
        nomorPendaftaran,
        nisn,
        nama,
        tempatTanggalLahir,
        nik,
        agama,
        beratBadan,
        tinggiBadan,
        pendidikanMasukPanti,
        nomorBPJS,
        status,
        daerahAsal,
        namaAyah,
        nikAyah,
        agamaAyah,
        pendidikanAyah,
        pekerjaanAyah,
        statusAyah,
        namaIbu,
        nikIbu,
        agamaIbu,
        pendidikanIbu,
        pekerjaanIbu,
        nomorHP,
        sdn,
        sltp,
        slta,
        khatam_quran,
        prestasi_1,
        prestasi_2,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//update
app.put("/api/data_pendaftaran/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nomor_kk,
    nomor_pendaftaran,
    nisn,
    nama,
    tempat_tanggal_lahir,
    nik,
    agama,
    berat_badan,
    tinggi_badan,
    pendidikan_masuk_panti,
    nomor_bpjs,
    status,
    daerah_asal_kabupaten,
    nama_ayah,
    nik_ayah,
    agama_ayah,
    pendidikan_ayah,
    pekerjaan_ayah,
    status_ayah,
    nama_ibu,
    nik_ibu,
    agama_ibu,
    pendidikan_ibu,
    pekerjaan_ibu,
    nomor_hp,
    sdn,
    sltp,
    slta,
    khatam_quran,
    prestasi_1,
    prestasi_2,
  } = req.body;

  try {
    // Ambil data lama dari database
    const oldData = await pool.query("SELECT * FROM data_pendaftaran WHERE id = $1", [id]);

    if (oldData.rows.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    // Gunakan nilai baru jika ada, jika tidak pakai nilai lama
    const updatedData = {
      nomor_kk: nomor_kk || oldData.rows[0].nomor_kk,
      nomor_pendaftaran: nomor_pendaftaran || oldData.rows[0].nomor_pendaftaran,
      nisn: nisn || oldData.rows[0].nisn,
      nama: nama || oldData.rows[0].nama,
      tempat_tanggal_lahir: tempat_tanggal_lahir || oldData.rows[0].tempat_tanggal_lahir,
      nik: nik || oldData.rows[0].nik,
      agama: agama || oldData.rows[0].agama,
      berat_badan: berat_badan || oldData.rows[0].berat_badan,
      tinggi_badan: tinggi_badan || oldData.rows[0].tinggi_badan,
      pendidikan_masuk_panti: pendidikan_masuk_panti || oldData.rows[0].pendidikan_masuk_panti,
      nomor_bpjs: nomor_bpjs || oldData.rows[0].nomor_bpjs,
      status: status || oldData.rows[0].status,
      daerah_asal_kabupaten: daerah_asal_kabupaten || oldData.rows[0].daerah_asal_kabupaten,
      nama_ayah: nama_ayah || oldData.rows[0].nama_ayah,
      nik_ayah: nik_ayah || oldData.rows[0].nik_ayah,
      agama_ayah: agama_ayah || oldData.rows[0].agama_ayah,
      pendidikan_ayah: pendidikan_ayah || oldData.rows[0].pendidikan_ayah,
      pekerjaan_ayah: pekerjaan_ayah || oldData.rows[0].pekerjaan_ayah,
      status_ayah: status_ayah || oldData.rows[0].status_ayah,
      nama_ibu: nama_ibu || oldData.rows[0].nama_ibu,
      nik_ibu: nik_ibu || oldData.rows[0].nik_ibu,
      agama_ibu: agama_ibu || oldData.rows[0].agama_ibu,
      pendidikan_ibu: pendidikan_ibu || oldData.rows[0].pendidikan_ibu,
      pekerjaan_ibu: pekerjaan_ibu || oldData.rows[0].pekerjaan_ibu,
      nomor_hp: nomor_hp || oldData.rows[0].nomor_hp,
      sdn: sdn || oldData.rows[0].sdn,
      sltp: sltp || oldData.rows[0].sltp,
      slta: slta || oldData.rows[0].slta,
      khatam_quran: khatam_quran || oldData.rows[0].khatam_quran,
      prestasi_1: prestasi_1 || oldData.rows[0].prestasi_1,
      prestasi_2: prestasi_2 || oldData.rows[0].prestasi_2,
    };

    const result = await pool.query(
      `UPDATE data_pendaftaran SET 
        nomor_kk = $1, 
        nomor_pendaftaran = $2, 
        nisn = $3, 
        nama = $4, 
        tempat_tanggal_lahir = $5, 
        nik = $6, 
        agama = $7, 
        berat_badan = $8, 
        tinggi_badan = $9, 
        pendidikan_masuk_panti = $10, 
        nomor_bpjs = $11, 
        status = $12, 
        daerah_asal_kabupaten = $13, 
        nama_ayah = $14, 
        nik_ayah = $15, 
        agama_ayah = $16, 
        pendidikan_ayah = $17, 
        pekerjaan_ayah = $18, 
        status_ayah = $19, 
        nama_ibu = $20, 
        nik_ibu = $21, 
        agama_ibu = $22, 
        pendidikan_ibu = $23, 
        pekerjaan_ibu = $24, 
        nomor_hp = $25, 
        sdn = $26, 
        sltp = $27, 
        slta = $28, 
        khatam_quran = $29, 
        prestasi_1 = $30, 
        prestasi_2 = $31
      WHERE id = $32 RETURNING *`,
      [
        updatedData.nomor_kk,
        updatedData.nomor_pendaftaran,
        updatedData.nisn,
        updatedData.nama,
        updatedData.tempat_tanggal_lahir,
        updatedData.nik,
        updatedData.agama,
        updatedData.berat_badan,
        updatedData.tinggi_badan,
        updatedData.pendidikan_masuk_panti,
        updatedData.nomor_bpjs,
        updatedData.status,
        updatedData.daerah_asal_kabupaten,
        updatedData.nama_ayah,
        updatedData.nik_ayah,
        updatedData.agama_ayah,
        updatedData.pendidikan_ayah,
        updatedData.pekerjaan_ayah,
        updatedData.status_ayah,
        updatedData.nama_ibu,
        updatedData.nik_ibu,
        updatedData.agama_ibu,
        updatedData.pendidikan_ibu,
        updatedData.pekerjaan_ibu,
        updatedData.nomor_hp,
        updatedData.sdn,
        updatedData.sltp,
        updatedData.slta,
        updatedData.khatam_quran,
        updatedData.prestasi_1,
        updatedData.prestasi_2,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete
app.delete("/api/data_pendaftaran/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM data_pendaftaran WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete
// app.delete("/api/data_pendaftaran/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("DELETE FROM data_pendaftaran WHERE id = $1 RETURNING *", [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Data not found" });
//     }
//     res.status(200).json({ message: "Data deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//form 5
app.get("/api/syarat_administrasi", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM syarat_administrasi");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching Syarat Administrasi:", error);
    res.status(500).json({ error: "Failed to fetch Syarat Administrasi" });
  }
});

// Fetch single Syarat Administrasi by ID
app.get("/api/syarat_administrasi/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params; // Correctly access `user_id`
    const result = await pool.query("SELECT * FROM syarat_administrasi WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Syarat Administrasi not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching Syarat Administrasi:", error);
    res.status(500).json({ error: "Failed to fetch Syarat Administrasi" });
  }
});

// Add new Syarat Administrasi
app.post("/api/syarat_administrasi", async (req, res) => {
  const { userId, no_hp, ukuran_seragam_sepatu, ...fileUrls } = req.body;

  try {
    // Insert new Syarat Administrasi with provided URLs
    const result = await pool.query(
      `INSERT INTO syarat_administrasi (
        user_id, surat_rekomendasi, surat_permohonan, surat_keterangan_miskin, nisn,
        surat_keterangan_sehat, fotocopy_rapor_skhu_sttb, fotocopy_akte_kelahiran,
        ijazah_khatam, fotocopy_kartu_keluarga, fotocopy_ijazah_terakhir, no_hp,
        rapor_surat_pindah, kartu_kis_bpjs, surat_dtks, ukuran_seragam_sepatu,
        pas_foto, pakaian_harian, pakaian_seragam_sekolah
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        userId,
        fileUrls.surat_rekomendasi, // surat_rekomendasi
        fileUrls.surat_permohonan, // surat_permohonan
        fileUrls.surat_keterangan_miskin, // surat_keterangan_miskin
        fileUrls.nisn, // nisn
        fileUrls.surat_keterangan_sehat, // surat_keterangan_sehat
        fileUrls.fotocopy_rapor_skhu_sttb, // fotocopy_rapor_skhu_sttb
        fileUrls.fotocopy_akte_kelahiran, // fotocopy_akte_kelahiran
        fileUrls.ijazah_khatam, // ijazah_khatam
        fileUrls.fotocopy_kartu_keluarga, // fotocopy_kartu_keluarga
        fileUrls.fotocopy_ijazah_terakhir, // fotocopy_ijazah_terakhir
        no_hp, // no_hp
        fileUrls.rapor_surat_pindah, // rapor_surat_pindah
        fileUrls.kartu_kis_bpjs, // kartu_kis_bpjs
        fileUrls.surat_dtks, // surat_dtks
        ukuran_seragam_sepatu, // ukuran_seragam_sepatu
        fileUrls.pas_foto, // pas_foto
        fileUrls.pakaian_harian, // pakaian_harian
        fileUrls.pakaian_seragam_sekolah, // pakaian_seragam_sekolah
      ]
    );

    res.status(201).json({ message: "Syarat Administrasi berhasil disimpan" });
  } catch (error) {
    console.error("Error saving Syarat Administrasi:", error);
    res.status(500).json({ error: "Failed to save Syarat Administrasi" });
  }
});

// Update Syarat Administrasi
app.put("/api/syarat_administrasi/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { userId, no_hp, ukuran_seragam_sepatu, ...fileUrls } = req.body;

  try {
    // Update Syarat Administrasi with provided URLs
    await pool.query(
      `UPDATE syarat_administrasi SET
        surat_rekomendasi = $1, surat_permohonan = $2, surat_keterangan_miskin = $3, nisn = $4,
        surat_keterangan_sehat = $5, fotocopy_rapor_skhu_sttb = $6, fotocopy_akte_kelahiran = $7,
        ijazah_khatam = $8, fotocopy_kartu_keluarga = $9, fotocopy_ijazah_terakhir = $10, no_hp = $11,
        rapor_surat_pindah = $12, kartu_kis_bpjs = $13, surat_dtks = $14, ukuran_seragam_sepatu = $15,
        pas_foto = $16, pakaian_harian = $17, pakaian_seragam_sekolah = $18
      WHERE user_id = $19`,
      [
        fileUrls.surat_rekomendasi, // surat_rekomendasi
        fileUrls.surat_permohonan, // surat_permohonan
        fileUrls.surat_keterangan_miskin, // surat_keterangan_miskin
        fileUrls.nisn, // nisn
        fileUrls.surat_keterangan_sehat, // surat_keterangan_sehat
        fileUrls.fotocopy_rapor_skhu_sttb, // fotocopy_rapor_skhu_sttb
        fileUrls.fotocopy_akte_kelahiran, // fotocopy_akte_kelahiran
        fileUrls.ijazah_khatam, // ijazah_khatam
        fileUrls.fotocopy_kartu_keluarga, // fotocopy_kartu_keluarga
        fileUrls.fotocopy_ijazah_terakhir, // fotocopy_ijazah_terakhir
        no_hp, // no_hp
        fileUrls.rapor_surat_pindah, // rapor_surat_pindah
        fileUrls.kartu_kis_bpjs, // kartu_kis_bpjs
        fileUrls.surat_dtks, // surat_dtks
        ukuran_seragam_sepatu, // ukuran_seragam_sepatu
        fileUrls.pas_foto, // pas_foto
        fileUrls.pakaian_harian, // pakaian_harian
        fileUrls.pakaian_seragam_sekolah, // pakaian_seragam_sekolah
        userId, // id
      ]
    );

    res.status(200).json({ message: "Syarat Administrasi berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating Syarat Administrasi:", error);
    res.status(500).json({ error: "Failed to update Syarat Administrasi" });
  }
});

// Delete Syarat Administrasi
app.delete("/api/syarat_administrasi/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the Syarat Administrasi to get the public_id for Cloudinary
    const existingSyarat = await pool.query("SELECT * FROM syarat_administrasi WHERE id = $1", [id]);

    if (existingSyarat.rows.length === 0) {
      return res.status(404).json({ error: "Syarat Administrasi not found" });
    }

    const existingItem = existingSyarat.rows[0];

    // Delete the file from Cloudinary if it exists
    if (existingItem.public_id) {
      await axios.post("http://localhost:5000/api/delete-media", {
        publicId: existingItem.public_id,
        resourceType: "raw",
      });
    }

    // Delete the Syarat Administrasi from PostgreSQL
    await pool.query("DELETE FROM syarat_administrasi WHERE id = $1", [id]);

    res.status(200).json({ message: "Syarat Administrasi deleted successfully" });
  } catch (error) {
    console.error("Error deleting Syarat Administrasi:", error);
    res.status(500).json({ error: "Failed to delete Syarat Administrasi" });
  }
});


//form 6
// Fetch all Persyaratan Sekolah
app.get("/api/persyaratan_sekolah", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM persyaratan_sekolah");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching Persyaratan Sekolah:", error);
    res.status(500).json({ error: "Failed to fetch Persyaratan Sekolah" });
  }
});

// Fetch single Persyaratan Sekolah by user_id
app.get("/api/persyaratan_sekolah/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query("SELECT * FROM persyaratan_sekolah WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persyaratan Sekolah not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching Persyaratan Sekolah:", error);
    res.status(500).json({ error: "Failed to fetch Persyaratan Sekolah" });
  }
});

// Add new Persyaratan Sekolah
app.post("/api/persyaratan_sekolah", async (req, res) => {
  const { userId, ...fileUrls } = req.body;

  try {
    // Insert new Persyaratan Sekolah with provided URLs
    const result = await pool.query(
      `INSERT INTO persyaratan_sekolah (
        user_id, fotocopy_akte_kelahiran_sekolah, fotocopy_nisn_sekolah, fotocopy_rapor_5_semester,
        pas_foto_sekolah, fotocopy_kartu_keluarga_sekolah, fotocopy_ijazah_sementara,
        fotocopy_surat_tanda_kelulusan, fotocopy_sktm, fotocopy_sertifikat_prestasi,
        fotocopy_sertifikat_akreditasi, fotocopy_user_password_ppdb
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        userId,
        fileUrls.fotocopy_akte_kelahiran_sekolah,
        fileUrls.fotocopy_nisn_sekolah,
        fileUrls.fotocopy_rapor_5_semester,
        fileUrls.pas_foto_sekolah,
        fileUrls.fotocopy_kartu_keluarga_sekolah,
        fileUrls.fotocopy_ijazah_sementara,
        fileUrls.fotocopy_surat_tanda_kelulusan,
        fileUrls.fotocopy_sktm,
        fileUrls.fotocopy_sertifikat_prestasi,
        fileUrls.fotocopy_sertifikat_akreditasi,
        fileUrls.fotocopy_user_password_ppdb,
      ]
    );

    res.status(201).json({ message: "Persyaratan Sekolah berhasil disimpan" });
  } catch (error) {
    console.error("Error saving Persyaratan Sekolah:", error);
    res.status(500).json({ error: "Failed to save Persyaratan Sekolah" });
  }
});

// Update Persyaratan Sekolah
app.put("/api/persyaratan_sekolah/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { userId, ...fileUrls } = req.body;

  try {
    // Update Persyaratan Sekolah with provided URLs
    await pool.query(
      `UPDATE persyaratan_sekolah SET
        fotocopy_akte_kelahiran_sekolah = $1, fotocopy_nisn_sekolah = $2, fotocopy_rapor_5_semester = $3,
        pas_foto_sekolah = $4, fotocopy_kartu_keluarga_sekolah = $5, fotocopy_ijazah_sementara = $6,
        fotocopy_surat_tanda_kelulusan = $7, fotocopy_sktm = $8, fotocopy_sertifikat_prestasi = $9,
        fotocopy_sertifikat_akreditasi = $10, fotocopy_user_password_ppdb = $11
      WHERE user_id = $12`,
      [
        fileUrls.fotocopy_akte_kelahiran_sekolah,
        fileUrls.fotocopy_nisn_sekolah,
        fileUrls.fotocopy_rapor_5_semester,
        fileUrls.pas_foto_sekolah,
        fileUrls.fotocopy_kartu_keluarga_sekolah,
        fileUrls.fotocopy_ijazah_sementara,
        fileUrls.fotocopy_surat_tanda_kelulusan,
        fileUrls.fotocopy_sktm,
        fileUrls.fotocopy_sertifikat_prestasi,
        fileUrls.fotocopy_sertifikat_akreditasi,
        fileUrls.fotocopy_user_password_ppdb,
        user_id,
      ]
    );

    res.status(200).json({ message: "Persyaratan Sekolah berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating Persyaratan Sekolah:", error);
    res.status(500).json({ error: "Failed to update Persyaratan Sekolah" });
  }
});

// Delete Persyaratan Sekolah
app.delete("/api/persyaratan_sekolah/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the Persyaratan Sekolah to get the public_id for Cloudinary
    const existingPersyaratan = await pool.query("SELECT * FROM persyaratan_sekolah WHERE id = $1", [id]);

    if (existingPersyaratan.rows.length === 0) {
      return res.status(404).json({ error: "Persyaratan Sekolah not found" });
    }

    const existingItem = existingPersyaratan.rows[0];

    // Delete the file from Cloudinary if it exists
    if (existingItem.public_id) {
      await axios.post("http://localhost:5000/api/delete-media", {
        publicId: existingItem.public_id,
        resourceType: "raw",
      });
    }

    // Delete the Persyaratan Sekolah from PostgreSQL
    await pool.query("DELETE FROM persyaratan_sekolah WHERE id = $1", [id]);

    res.status(200).json({ message: "Persyaratan Sekolah deleted successfully" });
  } catch (error) {
    console.error("Error deleting Persyaratan Sekolah:", error);
    res.status(500).json({ error: "Failed to delete Persyaratan Sekolah" });
  }
});

// admin stuff
// media  endpoints
// Upload media to Cloudinary and save to PostgreSQL
app.post("/api/upload-media", async (req, res) => {
  console.log("Received Data from Frontend:", req.body);

  const { title, description, author, media_type, url, public_id } = req.body;

  // Validate required fields
  if (!title || !author || !media_type) {
    return res.status(400).json({ error: "Title, author, and media_type are required" });
  }

  // Ensure url and public_id are provided
  if (!url || !public_id) {
    return res.status(400).json({ error: "File URL and Public ID are required" });
  }

  try {
    // Generate current timestamp
    const timestamp = new Date().toISOString();

    // Save metadata to PostgreSQL
    const dbResponse = await pool.query(
      "INSERT INTO media_items (url, public_id, title, description, author, media_type, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [url, public_id, title, description, author, media_type, timestamp]
    );

    console.log("Database Result:", dbResponse.rows[0]);

    // Send success response
    res.status(201).json(dbResponse.rows[0]);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ error: "Failed to upload media" });
  }
});

// Delete media from Cloudinary and PostgreSQL
app.post("/api/delete-media", async (req, res) => {
  const { publicId, resourceType, id } = req.body;

  if (!publicId || !resourceType) {
    return res.status(400).json({ message: "Missing publicId or resourceType" });
  }

  try {
    // Delete from Cloudinary
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(publicId, timestamp);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      new URLSearchParams({
        public_id: publicId,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature,
        invalidate: "true",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Delete from PostgreSQL (only if id is provided)
    if (id) {
      await pool.query("DELETE FROM media_items WHERE id = $1", [id]);
    }

    res.status(200).json({
      message: `${resourceType} deleted successfully`,
      data: response.data,
    });
  } catch (error) {
    console.error(`Failed to delete ${resourceType}:`, error.response ? error.response.data : error);
    res.status(500).json({
      message: `Failed to delete ${resourceType}`,
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Fetch all media items from PostgreSQL
app.get("/api/media", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM media_items");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching media items:", error);
    res.status(500).json({ error: "Failed to fetch media items" });
  }
});

// Fetch a single media item by ID from PostgreSQL
app.get("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM media_items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Media item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching media item:", error);
    res.status(500).json({ error: "Failed to fetch media item" });
  }
});

// Update a media item in PostgreSQL
app.put("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, author, media_type, url, public_id } = req.body; // Expect `url` instead of `media_url`

  console.log("Incoming Payload:", { title, description, author, media_type, url, public_id });

  if (!title || !author || !media_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch existing media item
    const existingMedia = await pool.query("SELECT * FROM media_items WHERE id = $1", [id]);
    if (existingMedia.rows.length === 0) {
      return res.status(404).json({ error: "Media item not found" });
    }

    const existingItem = existingMedia.rows[0];
    let updatedUrl = existingItem.url;
    let updatedPublicId = existingItem.public_id;

    // If a new media URL is provided, delete the old media from Cloudinary
    if (url && url !== existingItem.url) {
      if (existingItem.public_id) {
        try {
          await axios.post("http://localhost:5000/api/delete-media", {
            publicId: existingItem.public_id,
            resourceType: existingItem.media_type === "video" ? "video" : "image",
          });
          console.log("Old media deleted from Cloudinary");
        } catch (deleteError) {
          console.error("Error deleting old media:", deleteError);
        }
      }
      updatedUrl = url;
      updatedPublicId = public_id;
    }

    // Update in PostgreSQL (use `url`, not `media_url`)
    const result = await pool.query(
      "UPDATE media_items SET title = $1, description = $2, author = $3, media_type = $4, url = $5, public_id = $6 WHERE id = $7 RETURNING *",
      [title, description, author, media_type, updatedUrl, updatedPublicId, id]
    );

    console.log("Updated Media Item:", result.rows[0]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error updating media item:", error);
    res.status(500).json({ error: "Failed to update media item", details: error.message });
  }
});

// News endpoints 
// Fetch all news items
app.get("/api/news", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM news ORDER BY timestamp DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

//fetch a single news item
app.get("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Add a new news item
app.post("/api/upload-news", upload.single("file"), async (req, res) => {
  console.log("Received Data from Frontend:", req.body);

  const { title, content, writer, date, image_url: frontendImageUrl, public_id: frontendPublicId } = req.body;
  const file = req.file;

  // Validate required fields
  if (!title || !writer || !content || !date) {
    return res.status(400).json({ error: "Title, writer, content, and date are required" });
  }

  let image_url = frontendImageUrl || null; // Use frontend-provided URL if no file is uploaded
  let public_id = frontendPublicId || null; // Use frontend-provided public_id if no file is uploaded

  // Check if a file is provided
  if (file) {
    try {
      console.log("Uploading file to Cloudinary...");

      // Upload to Cloudinary
      const resourceType = file.mimetype.startsWith("video") ? "video" : "image";
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          file: fs.createReadStream(file.path),
          upload_preset: "test_preset",
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Cloudinary Response:", cloudinaryResponse.data);

      // Extract URL and public_id from Cloudinary response
      image_url = cloudinaryResponse.data.secure_url;
      public_id = cloudinaryResponse.data.public_id;

      // Delete the temporary file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);

      // Delete the temporary file if an error occurs
      if (file) {
        fs.unlinkSync(file.path);
      }

      return res.status(500).json({ error: "Failed to upload file" });
    }
  }

  try {
    // Generate current timestamp
    const timestamp = new Date().toISOString();

    // Log the data before saving
    console.log("Saving to database:", { title, content, writer, image_url, public_id, date, timestamp });

    // Save news to PostgreSQL
    const dbResponse = await pool.query(
      "INSERT INTO news (title, content, writer, image_url, public_id, date, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, content, writer, image_url, public_id, date, timestamp]
    );

    console.log("Database Result:", dbResponse.rows[0]);

    // Send success response
    res.status(200).json(dbResponse.rows[0]);
  } catch (error) {
    console.error("Error saving news:", error);

    // Send error response
    res.status(500).json({ error: "Failed to save news" });
  }
});
// Update a news item
app.put("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, writer, image_url, public_id } = req.body; // Expect image_url in JSON

  console.log("Incoming Payload:", { title, content, writer, image_url, public_id });

  if (!title || !content || !writer) {
    return res.status(400).json({ error: "Title, content, and writer are required" });
  }

  try {
    const existingNews = await pool.query("SELECT * FROM news WHERE id = $1", [id]);
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: "News item not found" });
    }

    const existingItem = existingNews.rows[0];
    let updatedImageUrl = existingItem.image_url;
    let updatedPublicId = existingItem.public_id;

    // If a new image URL is provided, delete the old image from Cloudinary
    if (image_url && image_url !== existingItem.image_url) {
      if (existingItem.public_id) {
        try {
          await axios.post("http://localhost:5000/api/delete-media", {
            publicId: existingItem.public_id,
            resourceType: "image",
          });
          console.log("Old image deleted from Cloudinary");
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
      updatedImageUrl = image_url;
      updatedPublicId = public_id;
    }

    // Update in PostgreSQL
    const timestamp = new Date().toISOString();
    const result = await pool.query(
      "UPDATE news SET image_url = $1, public_id = $2, title = $3, content = $4, writer = $5, timestamp = $6 WHERE id = $7 RETURNING *",
      [updatedImageUrl, updatedPublicId, title, content, writer, timestamp, id]
    );

    console.log("Updated News Item:", result.rows[0]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ error: "Failed to update news", details: error.message });
  }
});
// Delete a news item
app.delete("/api/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the news item to get the public_id for Cloudinary
    const existingNews = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: "News item not found" });
    }

    const existingItem = existingNews.rows[0];

    // Delete the image from Cloudinary if it exists
    if (existingItem.public_id) {
      await axios.post("http://localhost:5000/api/delete-media", {
        publicId: existingItem.public_id,
        resourceType: "image",
      });
    }

    // Delete the news item from PostgreSQL
    await pool.query("DELETE FROM news WHERE id = $1", [id]);

    res.status(200).json({ message: "News item deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Failed to delete news" });
  }
});

// Announcements endpoints
// Fetch all announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM announcements");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});
// Fetch single announcement
app.get("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM announcements WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

// update an announcement
app.put("/api/announcements/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, file_url, public_id } = req.body; // Receive as JSON

  console.log("Incoming Payload:", { title, description, file_url, public_id });

  try {
      // Fetch existing announcement
      const existingAnnouncement = await pool.query("SELECT * FROM announcements WHERE id = $1", [id]);

      if (existingAnnouncement.rows.length === 0) {
          return res.status(404).json({ error: "Announcement not found" });
      }

      const existingItem = existingAnnouncement.rows[0];

      // Build the update query dynamically based on provided values
      const fieldsToUpdate = [];
      const values = [];
      let index = 1;

      if (title !== undefined) {
          fieldsToUpdate.push(`title = $${index++}`);
          values.push(title);
      }

      if (description !== undefined) {
          fieldsToUpdate.push(`description = $${index++}`);
          values.push(description);
      }

      if (file_url !== undefined) {
          fieldsToUpdate.push(`file_url = $${index++}, public_id = $${index++}`);
          values.push(file_url, public_id);
      }

      if (fieldsToUpdate.length === 0) {
          return res.status(400).json({ error: "No fields provided for update" });
      }

      values.push(id);
      const query = `UPDATE announcements SET ${fieldsToUpdate.join(", ")} WHERE id = $${index} RETURNING *`;

      const result = await pool.query(query, values);
      console.log("Updated Announcement:", result.rows[0]);

      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(500).json({ error: "Failed to update announcement", details: error.message });
  }
});

// add a new announcement ak
app.post("/api/announcements", async (req, res) => {
  console.log("Received Data from Frontend:", req.body);

  const { title, description, file_url, public_id, date, timestamp } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    // Use the provided file_url and public_id directly (no file upload required)
    const newFileUrl = file_url || "";
    const newPublicId = public_id || "";

    // Get current date if not provided
    const currentDate = date || new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Insert new announcement
    const result = await pool.query(
      `INSERT INTO announcements (title, description, file_url, public_id, date, timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, newFileUrl, newPublicId, currentDate, timestamp || new Date().toISOString()]
    );

    console.log("Announcement saved to database:", result.rows[0]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error processing announcement:", error);
    return res.status(500).json({ error: "Failed to process announcement" });
  }
});

// Delete an announcement
app.delete("/api/announcements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the announcement to get the public_id for Cloudinary
    const existingAnnouncement = await pool.query("SELECT * FROM announcements WHERE id = $1", [id]);

    if (existingAnnouncement.rows.length === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const existingItem = existingAnnouncement.rows[0];

    // Delete the file from Cloudinary if it exists
    if (existingItem.public_id) {
      await axios.post("http://localhost:5000/api/delete-media", {
        publicId: existingItem.public_id,
        resourceType: "raw",
      });
    }

    // Delete the announcement from PostgreSQL
    await pool.query("DELETE FROM announcements WHERE id = $1", [id]);

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});