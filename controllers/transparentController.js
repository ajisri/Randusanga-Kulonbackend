import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { check, body, validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProdukHukumPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel ProdukHukum
    const produkHukump = await prisma.produkHukum.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (produkHukump.length === 0) {
      return res.status(200).json({ produkHukum: [] });
    }

    // Kirimkan data produk hukum
    res.status(200).json({ produkHukump });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/produk_hukum", filename); // Path file

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "File tidak dapat diunduh.",
        error: err.message,
      });
    }
  });
};

export const getProdukHukumAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Cek keberadaan refresh token
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    // Temukan administrator berdasarkan refresh token
    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    // Cek apakah administrator ditemukan
    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    // Cek peran administrator
    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Ambil data dari tabel ProdukHukum
    const produkHukum = await prisma.produkHukum.findMany({
      include: {
        createdBy: {
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (produkHukum.length === 0) {
      return res.status(200).json({ produkHukum: [] });
    }

    // Kirimkan data produk hukum
    res.status(200).json({ produkHukum });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createProdukHukum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, deskripsi, waktu } = req.body;
  const file = req.file;
  try {
    // Validasi format waktu
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
    if (!dateRegex.test(waktu)) {
      return res.status(400).json({
        msg: "Format waktu tidak valid. Harus dalam format YYYY-MM-DD",
      });
    }

    const parsedWaktu = new Date(waktu);
    if (isNaN(parsedWaktu.getTime())) {
      return res.status(400).json({ msg: "Format waktu tidak valid" });
    }

    // Simpan dalam format Date
    const formattedDate = new Date(parsedWaktu.toISOString().split("T")[0]);

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Cek apakah kombinasi nama dan waktu sudah ada
    const existingProdukHukum = await prisma.produkHukum.findFirst({
      where: {
        name,
        waktu: formattedDate,
      },
    });

    if (existingProdukHukum) {
      return res.status(400).json({
        msg: "Nama dan Tanggal SK sudah ada, tidak bisa membuat data baru",
      });
    }

    const newProdukHukum = await prisma.produkHukum.create({
      data: {
        name,
        deskripsi,
        waktu: formattedDate, // Simpan sebagai objek Date
        file_url: file ? `/uploads/produk_hukum/${file.filename}` : null,
        createdbyId: administrator.id,
      },
    });

    return res.status(201).json({
      msg: "Produk hukum dibuat dengan sukses",
      produkHukum: newProdukHukum,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

export const updateProdukHukum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { name, deskripsi, waktu } = req.body;
  const file = req.file;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingProdukHukum = await prisma.produkHukum.findUnique({
      where: { uuid },
    });

    if (!existingProdukHukum) {
      return res.status(404).json({ msg: "Produk hukum tidak ditemukan" });
    }

    // Cek apakah ada produk hukum lain dengan nama dan waktu yang sama
    const duplicateProdukHukum = await prisma.produkHukum.findFirst({
      where: {
        name,
        waktu: new Date(waktu),
        NOT: { uuid }, // Mengecualikan produk hukum yang sedang di-update
      },
    });

    if (duplicateProdukHukum) {
      return res.status(400).json({
        msg: "Nama dan waktu sudah ada pada produk hukum lain, tidak bisa memperbarui data",
      });
    }

    // Jika ada file baru dan file sebelumnya ada, maka kita akan menghapus file lama
    let filePathToDelete = null;
    if (file && existingProdukHukum.file_url) {
      filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/produk_hukum",
        path.basename(existingProdukHukum.file_url)
      );
    }

    // Update produk hukum dengan data baru
    const updatedProdukHukum = await prisma.produkHukum.update({
      where: { uuid },
      data: {
        name,
        deskripsi,
        waktu: new Date(waktu),
        file_url: file
          ? `/uploads/produk_hukum/${file.filename}` // File URL baru jika ada file baru
          : existingProdukHukum.file_url, // Tetap menggunakan file URL lama jika tidak ada file baru
        updated_at: new Date(),
        createdbyId: administrator.id, // Perbarui id pembuat data
      },
    });

    // Hapus file lama jika ada
    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted old file: ${filePathToDelete}`);
    }

    return res.status(200).json({
      msg: "Produk hukum diperbarui dengan sukses",
      produkHukum: updatedProdukHukum,
    });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteProdukHukum = async (req, res) => {
  const { uuid } = req.params; // Menggunakan uuid

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingProdukHukum = await prisma.produkHukum.findUnique({
      where: { uuid }, // Mencari berdasarkan uuid
    });

    if (!existingProdukHukum) {
      return res.status(404).json({ msg: "Produk hukum tidak ditemukan" });
    }

    // Delete file if it exists
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/produk_hukum",
      path.basename(existingProdukHukum.file_url)
    );

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Delete product hukum record
    await prisma.produkHukum.delete({
      where: { uuid }, // Mencari berdasarkan uuid
    });

    return res.status(200).json({ msg: "Produk hukum dihapus dengan sukses" });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Middleware to check refresh token and administrator role
const verifyAdmin = async (req, res, next) => {
  // Mendapatkan refresh token dari cookies
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Mencari administrator berdasarkan ID yang didekode dari token
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    // Jika administrator tidak ditemukan atau tidak memiliki peran administrator, log peringatan dan kembalikan respons 403
    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }
    req.administratorId = administrator.uuid;
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

//ANKOR
export const getAllDataAnkor = [
  async (req, res) => {
    try {
      const dataAnkor = await prisma.ankor.findMany({
        include: {
          createdBy: {
            select: {
              uuid: true, // Ambil hanya UUID atau tambahkan field lain sesuai kebutuhan
              name: true,
            },
          },
          kategoriankor: {
            include: {
              subkategoriankor: {
                select: {
                  uuid: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Data Ankor berhasil diambil.",
        data: dataAnkor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message, // Tambahkan informasi error
      });
    }
  },
];

export const getAnkorAdmin = [
  verifyAdmin,
  async (req, res) => {
    try {
      // Ambil data dari tabel
      const ankor = await prisma.ankor.findMany({
        include: {
          createdBy: {
            select: {
              name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
            },
          },
        },
      });

      // Cek jika tidak ada data
      if (ankor.length === 0) {
        return res.status(200).json({ ankor: [] });
      }

      res.status(200).json({ ankor });
    } catch (error) {
      res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
  },
];

export const createAnkor = [
  verifyAdmin, // Middleware verifikasi admin
  body("name").notEmpty().withMessage("Name is required"), // Validasi input
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const createdById = req.administratorId;

    try {
      const existingAnkor = await prisma.ankor.findFirst({
        where: { name },
      });

      if (existingAnkor) {
        return res.status(400).json({
          msg: "Parameter Ankor sudah ada, tidak bisa membuat data baru",
        });
      }

      const newAnkor = await prisma.ankor.create({
        data: { name, createdById },
      });

      return res.status(201).json({
        msg: "Parameter Ankor dibuat dengan sukses",
        ankor: newAnkor,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
];

export const updateAnkor = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").notEmpty().withMessage("Name is required"),
  async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Mengambil id dari URL params
    const { name } = req.body;
    const createdById = req.administratorId; // ID admin yang membuat/mengupdate data

    try {
      // Pastikan ID valid
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        return res.status(400).json({ msg: "ID tidak valid" });
      }

      // Cek apakah data dengan ID tersebut ada
      const existingAnkor = await prisma.ankor.findUnique({
        where: { id: parsedId },
      });

      if (!existingAnkor) {
        return res.status(404).json({ msg: "Parameter Ankor tidak ditemukan" });
      }

      // Cek duplikasi nama (dengan pengecualian data yang sedang di-update)
      const duplicateAnkor = await prisma.ankor.findFirst({
        where: {
          name,
          NOT: { id: parsedId },
        },
      });

      if (duplicateAnkor) {
        return res.status(400).json({
          msg: "Nama Parameter Ankor sudah ada pada data lain, tidak bisa memperbarui data",
        });
      }

      // Update data Ankor
      const updatedAnkor = await prisma.ankor.update({
        where: { id: parsedId },
        data: {
          name,
          updated_at: new Date(),
          createdById,
        },
      });

      return res.status(200).json({
        msg: "Parameter Ankor diperbarui dengan sukses",
        ankor: updatedAnkor,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
];

export const deleteAnkor = [
  verifyAdmin, // Middleware untuk verifikasi admin
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingAnkor = await prisma.ankor.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingAnkor) {
        return res.status(404).json({ msg: "Data tidak ditemukan" });
      }

      await prisma.ankor.delete({
        where: { id: parseInt(id, 10) },
      });

      return res
        .status(200)
        .json({ msg: "Parameter Ankor dihapus dengan sukses" });
    } catch (error) {
      res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
  },
];

//KATEGORI ANKOR
export const getKategoriAnkorAdmin = [
  verifyAdmin,
  async (req, res) => {
    try {
      const kategoriankors = await prisma.kategoriankor.findMany();
      res.status(200).json(kategoriankors);
    } catch (error) {
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const createKategoriAnkor = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").notEmpty().withMessage("Name is required"),
  body("ankorId").isInt().withMessage("Ankor must be a valid integer"),
  async (req, res) => {
    handleValidationErrors(req, res);

    const { name, ankorId } = req.body; // Mengambil nama dan ankorId dari body request
    const createdById = req.administratorId; // ID administrator yang membuat entri

    try {
      const ankor = await prisma.ankor.findUnique({
        where: { id: ankorId },
      });

      if (!ankor) {
        return res.status(404).json({ msg: "ankor not found" });
      }

      const existingKategoriankor = await prisma.kategoriankor.findFirst({
        where: { name, ankorId },
      });

      if (existingKategoriankor) {
        return res.status(400).json({
          msg: "Parameter Ankor sudah ada, tidak bisa membuat data baru",
        });
      }

      // Membuat entri
      const kategoriankor = await prisma.kategoriankor.create({
        data: {
          name,
          ankorId, // Menghubungkan kategori dengan ankor yang dipilih
          createdById,
        },
        include: {
          ankor: true, // Menyertakan informasi Paramter ankor dalam respons
        },
      });

      res.status(201).json(kategoriankor);
    } catch (error) {
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateKategoriAnkor = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("ankorId")
    .optional()
    .isInt()
    .withMessage("Ankor ID must be a valid integer"),
  async (req, res) => {
    handleValidationErrors(req, res);

    const { uuid } = req.params; // Mengambil UUID dari parameter
    const { name, ankorId } = req.body; // Mengambil kolom yang akan diupdate dari body request
    const createdById = req.administratorId;
    try {
      // Validasi keberadaan keuangan berdasarkan UUID
      const existingKategoriankor = await prisma.kategoriankor.findUnique({
        where: { uuid },
      });

      if (!existingKategoriankor) {
        return res.status(404).json({ msg: "Kategori Parameter not found" });
      }

      // Jika `Id` disediakan, validasi bahwa ID tersebut valid
      if (ankorId) {
        const ankor = await prisma.ankor.findUnique({
          where: { id: ankorId },
        });

        if (!ankor) {
          return res.status(404).json({ msg: "Parameter Ankor not found" });
        }
      }

      // Update dengan data baru
      const updatedKategoriankor = await prisma.kategoriankor.update({
        where: { uuid },
        data: {
          name,
          ankorId,
          createdById,
          updated_at: new Date(), // Otomatis mengisi waktu update
        },
      });

      return res.status(200).json({
        msg: "Kategoriankor updated successfully",
        data: updatedKategoriankor,
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteKategoriAnkor = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;

    try {
      // Cek keberadaan Kategoriankor berdasarkan UUID
      const existingKategoriankor = await prisma.kategoriankor.findUnique({
        where: { uuid },
      });

      if (!existingKategoriankor) {
        return res.status(404).json({ msg: "Kategoriankor not found" });
      }

      // Hapus Kategoriankor
      await prisma.kategoriankor.delete({
        where: { uuid },
      });

      // Kirim respon sukses
      return res
        .status(200)
        .json({ msg: "Kategoriankor deleted successfully" });
    } catch (error) {
      // Kirim respon error
      return res
        .status(500)
        .json({ msg: "An unexpected server error occurred" });
    }
  },
];

//SUBKATEGORI ANKOR
export const getSubkategoriAnkorByKategoriAnkorId = [
  verifyAdmin,
  async (req, res) => {
    const { kategoriankorId } = req.params;

    if (!kategoriankorId) {
      return res.status(400).json({ msg: "kategoriankorId tidak ditemukan" });
    }

    try {
      const subkategoriankors = await prisma.subkategoriankor.findMany({
        where: { kategoriankorId },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!subkategoriankors || subkategoriankors.length === 0) {
        return res
          .status(404)
          .json({ message: "Data subkategori ankor tidak ditemukan" });
      }

      res.status(200).json(subkategoriankors);
    } catch (error) {
      console.error("Error fetching Subkategoriankor:", error);
      res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
  },
];

export const getSubkategoriAnkorAdmin = [
  verifyAdmin,
  async (req, res) => {
    try {
      const subkategoriankors = await prisma.subkategoriankor.findMany({
        include: {
          poinsubkategoriankor: {
            select: { uuid: true, name: true },
          }, // Menyertakan data poinsubkategoriankor
        },
      });

      // Mengirim array kosong jika tidak ada data
      if (!subkategoriankors || subkategoriankors.length === 0) {
        return res.status(200).json([]); // Array kosong dengan status 200
      }

      res.status(200).json(subkategoriankors);
    } catch (error) {
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const createSubkategoriAnkor = [
  verifyAdmin,
  // check("subkategoriankorData")
  //   .isArray({ min: 1 })
  //   .withMessage("subkategoriData harus berupa array dan tidak boleh kosong"),
  check("subkategoriankorData.*.name")
    .notEmpty()
    .withMessage("Nama subkategori harus diisi"),
  check("subkategoriankorData.*.kategoriankorId")
    .isUUID()
    .withMessage("kategoriankorId harus merupakan UUID yang valid"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, kategoriankorId } = req.body;
    const createdById = req.administratorId;

    try {
      const existingSubkategoriAnkor = await prisma.subkategoriankor.findFirst({
        where: { name },
      });

      if (existingSubkategoriAnkor) {
        return res.status(400).json({
          msg: "Subkategori Parameter Ankor sudah ada, tidak bisa membuat data baru",
        });
      }

      const newSubkategoriAnkor = await prisma.subkategoriankor.create({
        data: { name, kategoriankorId, createdById },
      });

      return res.status(201).json({
        msg: "SubKategori Parameter Ankor dibuat dengan sukses",
        ankor: newSubkategoriAnkor,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
];

export const updateSubkategoriAnkor = [
  // Middleware untuk memastikan pengguna adalah admin
  verifyAdmin,

  // Validasi input menggunakan express-validator
  check("uuid").isUUID().withMessage("UUID harus berupa UUID yang valid"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Nama subkategori harus diisi"),
  check("url")
    .optional()
    .isURL()
    .withMessage("URL harus berupa URL yang valid"),

  async (req, res) => {
    console.log(
      "=== DEBUG: Request Payload ===",
      JSON.stringify(req.body, null, 2)
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("=== DEBUG: Validation Errors ===", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { uuid, name, url } = req.body; // Dapatkan data dari body request

    try {
      // Cek apakah subkategoriAnkor dengan UUID tersebut ada
      const existingSubkategoriAnkor = await prisma.subkategoriankor.findUnique(
        {
          where: { uuid },
        }
      );

      if (!existingSubkategoriAnkor) {
        return res.status(404).json({
          msg: `SubkategoriAnkor dengan UUID ${uuid} tidak ditemukan.`,
        });
      }

      // Update data
      const updatedSubkategoriAnkor = await prisma.subkategoriankor.update({
        where: { uuid },
        data: {
          name: name || existingSubkategoriAnkor.name, // Menggunakan nama lama jika tidak diubah
          url: url || existingSubkategoriAnkor.url, // Menggunakan URL lama jika tidak diubah
          updated_at: new Date(),
        },
      });

      console.log(
        "=== DEBUG: SubkategoriAnkor Updated ===",
        updatedSubkategoriAnkor
      );

      return res.status(200).json({
        message: "SubkategoriAnkor berhasil diperbarui",
        data: updatedSubkategoriAnkor,
      });
    } catch (error) {
      console.error("=== DEBUG: Error managing SubkategoriAnkor ===");
      console.error(error);

      return res.status(500).json({
        msg: "Terjadi kesalahan pada server.",
        detail: error.message,
      });
    }
  },
];

export const deleteSubkategoriAnkor = [
  // Middleware untuk memastikan pengguna adalah admin
  verifyAdmin,

  // Validasi UUID
  check("uuid").isUUID().withMessage("UUID harus berupa UUID yang valid"),

  async (req, res) => {
    console.log(
      "=== DEBUG: Request Payload ===",
      JSON.stringify(req.body, null, 2)
    );
    const { uuid } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("=== DEBUG: Validation Errors ===", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Cek apakah subkategoriAnkor dengan UUID tersebut ada
      const existingSubkategoriAnkor = await prisma.subkategoriankor.findUnique(
        {
          where: { uuid },
        }
      );

      if (!existingSubkategoriAnkor) {
        return res.status(404).json({
          msg: `SubkategoriAnkor dengan UUID ${uuid} tidak ditemukan.`,
        });
      }

      // Hapus data
      await prisma.subkategoriankor.delete({
        where: { uuid },
      });

      console.log(
        `=== DEBUG: SubkategoriAnkor dengan UUID ${uuid} berhasil dihapus ===`
      );

      return res.status(200).json({
        message: "SubkategoriAnkor berhasil dihapus",
      });
    } catch (error) {
      console.error("=== DEBUG: Error managing SubkategoriAnkor ===");
      console.error(error);

      return res.status(500).json({
        msg: "Terjadi kesalahan pada server.",
        detail: error.message,
      });
    }
  },
];

//Poin Subkategori
export const createPoinsubkategoriankor = [
  verifyAdmin,
  check("subkategoriankorId")
    .isUUID()
    .withMessage("subkategoriankorId harus merupakan UUID yang valid"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { administratorId } = req; // Dapatkan administratorId dari middleware
    const { poinsubkategoriankor, subkategoriankorId } = req.body;

    try {
      // Cek apakah subkategoriankorId ada dalam database
      const subkategoriankorExists = await prisma.subkategoriankor.findUnique({
        where: { uuid: subkategoriankorId },
      });

      if (!subkategoriankorExists) {
        return res.status(400).json({
          msg: "Subkategoriankor tidak ditemukan.",
        });
      }
      console.log("🚀 ~ poinsubkategoriankor:", poinsubkategoriankor);

      // const createdPoins = [];
      // if (poinsubkategoriankor && poinsubkategoriankor.length > 0) {
      //   for (const poin of poinsubkategoriankor) {
      const createdPoin = await prisma.poinsubkategoriankor.create({
        data: {
          name: poinsubkategoriankor.name,
          subkategoriankorId, // Menghubungkan dengan subkategoriankor yang sudah ada
          createdById: administratorId,
        },
      });
      // createdPoins.push(createdPoin);
      //   }
      // }

      return res.status(200).json({
        message: "Poinsubkategoriankor berhasil dibuat",
        data: createdPoin,
      });
    } catch (error) {
      console.error("Error mengelola Poinsubkategoriankor:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
  },
];

export const updatePoinsubkategoriankor = [
  verifyAdmin,
  async (req, res) => {
    const { subkategoriankorId, poinsubkategoriankor } = req.body;
    console.log("Data received for update:", req.body);
    const updatedPoint = await prisma.poinsubkategoriankor.update({
      where: { uuid: req.params.uuid },
      data: {
        name: req.body.name,
        subkategoriankorId: req.body.subkategoriankorId,
      },
    });
    console.log("Updated point:", updatedPoint);
    try {
      // Cek subkategoriankor
      const subkategoriExists = await prisma.subkategoriankor.findUnique({
        where: { uuid: subkategoriankorId },
      });

      if (!subkategoriExists) {
        return res
          .status(404)
          .json({ msg: "Subkategoriankor tidak ditemukan." });
      }

      // Data poin saat ini di database
      const existingPoins = await prisma.poinsubkategoriankor.findMany({
        where: { subkategoriankorId },
      });

      // Pisahkan data menjadi create, update, delete
      const incomingUUIDs = poinsubkategoriankor.map((poin) => poin.uuid);
      const newPoins = poinsubkategoriankor.filter((poin) => !poin.uuid); // Data baru
      const updatedPoins = poinsubkategoriankor.filter((poin) => poin.uuid); // Data update
      const deletedUUIDs = existingPoins
        .filter((poin) => !incomingUUIDs.includes(poin.uuid))
        .map((poin) => poin.uuid); // UUID untuk dihapus

      // 1. Tambahkan poin baru
      if (newPoins.length) {
        await prisma.poinsubkategoriankor.createMany({
          data: newPoins.map((poin) => ({
            name: poin.name,
            subkategoriankorId,
          })),
        });
      }

      // 2. Update poin
      const updatePromises = updatedPoins.map((poin) =>
        prisma.poinsubkategoriankor.update({
          where: { uuid: poin.uuid },
          data: { name: poin.name },
        })
      );
      await Promise.all(updatePromises);

      // 3. Hapus poin
      const deletePromises = deletedUUIDs.map((uuid) =>
        prisma.poinsubkategoriankor.delete({
          where: { uuid },
        })
      );
      await Promise.all(deletePromises);

      res
        .status(200)
        .json({ msg: "Poinsubkategoriankor berhasil diperbarui." });
    } catch (error) {
      console.error("Error during updatePoinsubkategoriankor:", error); // Tambahkan logging lengkap error
      res
        .status(500)
        .json({ msg: "Terjadi kesalahan pada server.", error: error.message });
    }
  },
];

//APBD
export const getApbdPengunjung = async (req, res) => {
  try {
    // Ambil data dari tabel ProdukHukum
    const apbdp = await prisma.Apbd.findMany({
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    // Cek jika tidak ada data
    if (apbdp.length === 0) {
      return res.status(200).json({ apbd: [] });
    }

    // Kirimkan data
    res.status(200).json({ apbdp });
  } catch (error) {
    console.error("Error saat mengambil data APBD untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const downloadFileApbd = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/apbd", filename); // Path file

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "File tidak dapat diunduh.",
        error: err.message,
      });
    }
  });
};

export const getApbdAdmin = [
  verifyAdmin,
  async (req, res) => {
    try {
      // Ambil data dari tabel
      const apbd = await prisma.apbd.findMany({
        include: {
          createdBy: {
            select: {
              name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
            },
          },
        },
      });

      // Cek jika tidak ada data
      if (apbd.length === 0) {
        return res.status(200).json({ apbd: [] });
      }

      res.status(200).json({ apbd });
    } catch (error) {
      console.error("Error saat mengambil data apbd untuk admin:", error);
      res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
  },
];

export const getAllApbd = [
  verifyAdmin,
  async (req, res) => {
    try {
      const apbds = await prisma.apbd.findMany();
      res.status(200).json(apbds);
    } catch (error) {
      console.error("Error fetching:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllDataApbd = [
  async (req, res) => {
    try {
      const dataApbd = await prisma.apbd.findMany({
        include: {
          createdBy: true,
          keuangan: {
            include: {
              kategori: {
                include: {
                  subkategori: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({ data: dataApbd });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
  },
];

export const createApbd = [
  verifyAdmin, // Middleware untuk verifikasi admin

  // Validasi input
  body("name").notEmpty().withMessage("Name is required"),
  body("year")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Tahun harus berupa angka antara 1900 dan tahun saat ini"),

  async (req, res) => {
    console.log("Handler createApbd dipanggil.");
    console.log("Body yang diterima:", req.body);

    // Menangani validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const file = req.file; // File akan ada di sini jika middleware multer berhasil
    const createdById = req.administratorId; // UUID dari admin yang terverifikasi
    const year = parseInt(req.body.year, 10);
    if (isNaN(year)) {
      return res.status(400).json({ msg: "Tahun tidak valid." });
    }
    // Debugging: Log data yang diterima
    console.log("Data yang diterima untuk membuat APBD:", {
      name,
      year,
      file,
      createdById,
    });

    try {
      // Cek apakah kombinasi nama dan tahun sudah ada
      console.log("Memeriksa apakah APBD dengan nama dan tahun sudah ada...");
      const existingApbd = await prisma.apbd.findFirst({
        where: {
          name,
          year: year,
        },
      });

      if (existingApbd) {
        console.warn("APBD sudah ada untuk kombinasi nama dan tahun:", {
          name,
          year,
        });
        return res.status(400).json({
          msg: "Nama dan Tahun APBD sudah ada, tidak bisa membuat data baru",
        });
      }

      const parsedYear = Number(year);
      if (isNaN(parsedYear)) {
        return res
          .status(400)
          .json({ msg: "Tahun tidak valid. Harus berupa angka." });
      }

      // Membuat entri baru untuk APBD
      console.log("Membuat APBD baru...");
      const newApbd = await prisma.apbd.create({
        data: {
          name,
          year: parsedYear,
          file_url: req.file ? `/uploads/apbd/${req.file.filename}` : null,
          createdById,
        },
      });

      console.log("APBD berhasil dibuat:", newApbd);
      return res.status(201).json({
        msg: "APBD dibuat dengan sukses",
        apbd: newApbd,
      });
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat APBD:", error.message);
      return res.status(500).json({
        msg: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
];

export const updateApbd = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").notEmpty().withMessage("Name is required"),
  body("year")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Tahun harus berupa angka antara 1900 dan tahun saat ini"),

  async (req, res) => {
    // Menangani validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Mengambil id dari URL params
    const { name } = req.body;
    const file = req.file;
    const createdById = req.administratorId;
    const year = parseInt(req.body.year, 10); // Konversi `year` menjadi integer

    if (isNaN(year)) {
      return res.status(400).json({ msg: "Tahun tidak valid." });
    }

    try {
      // Cek apakah data dengan id tersebut ada
      const existingApbd = await prisma.apbd.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingApbd) {
        return res.status(404).json({ msg: "APBD tidak ditemukan" });
      }

      // Cek apakah ada data APBD lain dengan nama dan tahun yang sama
      const duplicateApbd = await prisma.apbd.findFirst({
        where: {
          name,
          year: year, // Pastikan `year` dalam tipe integer
          NOT: { id: parseInt(id, 10) },
        },
      });

      if (duplicateApbd) {
        return res.status(400).json({
          msg: "Nama dan Tahun APBD sudah ada pada data lain, tidak bisa memperbarui data",
        });
      }

      // Hapus file lama jika ada file baru yang di-upload
      let filePathToDelete = null;
      if (file && existingApbd.file_url) {
        filePathToDelete = path.join(
          __dirname,
          "..",
          "uploads/apbd",
          path.basename(existingApbd.file_url)
        );
      }

      // Update data APBD
      const updatedApbd = await prisma.apbd.update({
        where: { id: parseInt(id, 10) },
        data: {
          name,
          year: year, // Pastikan `year` dalam tipe integer
          file_url: file
            ? `/uploads/apbd/${file.filename}`
            : existingApbd.file_url,
          updated_at: new Date(),
          createdById,
        },
      });

      // Hapus file lama jika ada
      if (filePathToDelete && fs.existsSync(filePathToDelete)) {
        try {
          fs.unlinkSync(filePathToDelete);
          console.log(`File lama berhasil dihapus: ${filePathToDelete}`);
        } catch (error) {
          console.error(
            `Gagal menghapus file lama: ${filePathToDelete}`,
            error
          );
        }
      }

      return res.status(200).json({
        msg: "APBD diperbarui dengan sukses",
        apbd: updatedApbd,
      });
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui APBD:", error.message);
      return res.status(500).json({
        msg: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
];

export const deleteApbd = [
  verifyAdmin, // Middleware untuk verifikasi admin
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Cek apakah data APBD ada
      const existingApbd = await prisma.apbd.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingApbd) {
        return res.status(404).json({ msg: "APBD tidak ditemukan" });
      }

      // Hapus file jika ada
      const filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/apbd",
        path.basename(existingApbd.file_url)
      );

      if (fs.existsSync(filePathToDelete)) {
        fs.unlinkSync(filePathToDelete);
        console.log(`Successfully deleted file: ${filePathToDelete}`);
      }

      // Hapus data APBD dari database
      await prisma.apbd.delete({
        where: { id: parseInt(id, 10) },
      });

      return res.status(200).json({ msg: "APBD dihapus dengan sukses" });
    } catch (error) {
      console.error("Error saat menghapus APBD:", error);
      res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
  },
];

// Keuangan CRUD
export const createKeuangan = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").notEmpty().withMessage("Name is required"),
  body("apbdId").isInt().withMessage("APBD ID must be a valid integer"),
  async (req, res) => {
    handleValidationErrors(req, res);

    const { name, apbdId } = req.body; // Mengambil nama dan apbdId dari body request
    const createdById = req.administratorId; // ID administrator yang membuat entri

    try {
      // Validasi keberadaan APBD
      const apbd = await prisma.apbd.findUnique({
        where: { id: apbdId },
      });

      if (!apbd) {
        return res.status(404).json({ msg: "APBD not found" });
      }

      // Membuat entri Keuangan
      const keuangan = await prisma.keuangan.create({
        data: {
          name,
          apbdId, // Menghubungkan Keuangan dengan APBD yang dipilih
          createdById,
        },
        include: {
          apbd: true, // Menyertakan informasi APBD dalam respons
        },
      });

      res.status(201).json(keuangan);
    } catch (error) {
      console.error("Error creating Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllKeuangan = [
  verifyAdmin,
  async (req, res) => {
    try {
      const keuangans = await prisma.keuangan.findMany();
      res.status(200).json(keuangans);
    } catch (error) {
      console.error("Error fetching Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateKeuangan = [
  verifyAdmin, // Middleware untuk verifikasi admin
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("apbdId")
    .optional()
    .isInt()
    .withMessage("APBD ID must be a valid integer"),
  async (req, res) => {
    handleValidationErrors(req, res);

    const { uuid } = req.params; // Mengambil UUID dari parameter
    const { name, apbdId } = req.body; // Mengambil kolom yang akan diupdate dari body request
    const createdById = req.administratorId;
    try {
      // Validasi keberadaan keuangan berdasarkan UUID
      const existingKeuangan = await prisma.keuangan.findUnique({
        where: { uuid },
      });

      if (!existingKeuangan) {
        return res.status(404).json({ msg: "Keuangan not found" });
      }

      // Jika `apbdId` disediakan, validasi bahwa ID tersebut valid
      if (apbdId) {
        const apbd = await prisma.apbd.findUnique({
          where: { id: apbdId },
        });

        if (!apbd) {
          return res.status(404).json({ msg: "APBD not found" });
        }
      }

      // Update keuangan dengan data baru
      const updatedKeuangan = await prisma.keuangan.update({
        where: { uuid },
        data: {
          name,
          apbdId,
          createdById,
          updated_at: new Date(), // Otomatis mengisi waktu update
        },
      });

      res.status(200).json(updatedKeuangan);
    } catch (error) {
      console.error("Error updating Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteKeuangan = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.keuangan.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Keuangan:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Kategori CRUD
export const createKategori = [
  verifyAdmin,
  body("name").notEmpty().withMessage("Name is required"),
  body("keuanganId").isUUID().withMessage("KeuanganId must be a valid UUID"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const createdById = req.administratorId;
    const { name, keuanganId } = req.body;

    try {
      // Hitung jumlah kategori yang ada dengan keuanganId yang sama
      const count = await prisma.kategori.count({
        where: { keuanganId: keuanganId },
      });

      // Tentukan nilai number berdasarkan jumlah kategori yang ada + 1
      const number = (count + 1).toString();

      // Buat kategori baru dengan number yang otomatis di-generate
      const kategori = await prisma.kategori.create({
        data: {
          name,
          number,
          keuanganId,
          createdById,
        },
      });

      res.status(201).json(kategori);
    } catch (error) {
      console.error("Error creating Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllKategori = [
  verifyAdmin,
  async (req, res) => {
    try {
      const kategoris = await prisma.kategori.findMany({
        include: { subkategori: true },
      });
      res.status(200).json(kategoris);
    } catch (error) {
      console.error("Error fetching Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateKategori = [
  verifyAdmin,
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("number")
    .optional()
    .isNumeric()
    .withMessage("Number must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { name, number } = req.body;
    try {
      const updatedKategori = await prisma.kategori.update({
        where: { uuid },
        data: {
          name,
          number,
          updated_at: new Date(),
        },
      });
      res.status(200).json(updatedKategori);
    } catch (error) {
      console.error("Error updating Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteKategori = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.kategori.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Kategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Subkategori CRUD
export const createSubkategori = [
  verifyAdmin,
  // Validasi input menggunakan express-validator
  check("subkategoriData")
    .isArray({ min: 1 })
    .withMessage("subkategoriData harus berupa array dan tidak boleh kosong"),
  check("subkategoriData.*.name")
    .notEmpty()
    .withMessage("Nama subkategori harus diisi"),
  check("subkategoriData.*.kategoriId")
    .isUUID()
    .withMessage("KategoriId harus merupakan UUID yang valid"),
  check("subkategoriData.*.totalBudget")
    .isDecimal()
    .withMessage("Total Budget harus berupa angka yang valid"),
  check("subkategoriData.*.totalRealization")
    .isDecimal()
    .withMessage("Total Realization harus berupa angka yang valid"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const createdById = req.administratorId;
    const subkategoriData = req.body.subkategoriData;
    const kategoriId = subkategoriData[0].kategoriId;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const createdSubkategoris = [];
        const uuidsToKeepSubkategori = new Set();

        const existingSubkategoris = await prisma.subkategori.findMany({
          where: { kategoriId },
        });
        const existingUuidsSubkategori = new Set(
          existingSubkategoris.map((s) => s.uuid)
        );

        for (const subkategori of subkategoriData) {
          const { uuid, name, totalBudget, totalRealization } = subkategori;
          let createdSubkategori;

          const remaining =
            parseFloat(totalBudget) - parseFloat(totalRealization);

          if (uuid) {
            const existingSubkategori = existingSubkategoris.find(
              (s) => s.uuid === uuid
            );
            if (existingSubkategori) {
              createdSubkategori = await prisma.subkategori.update({
                where: { uuid },
                data: {
                  name,
                  kategoriId,
                  totalBudget,
                  totalRealization,
                  remaining,
                },
              });
              uuidsToKeepSubkategori.add(uuid);
            } else {
              throw new Error("Subkategori tidak ditemukan untuk update");
            }
          } else {
            const count = await prisma.subkategori.count({
              where: { kategoriId },
            });
            const number = (count + 1).toString();

            createdSubkategori = await prisma.subkategori.create({
              data: {
                name,
                number,
                kategoriId,
                createdById,
                totalBudget,
                totalRealization,
                remaining,
              },
            });
          }

          createdSubkategoris.push(createdSubkategori);
        }

        // Hapus subkategori yang tidak ada di `subkategoriData`
        const uuidsToDeleteSubkategori = [...existingUuidsSubkategori].filter(
          (uuid) => !uuidsToKeepSubkategori.has(uuid)
        );
        if (uuidsToDeleteSubkategori.length > 0) {
          await prisma.subkategori.deleteMany({
            where: {
              uuid: { in: uuidsToDeleteSubkategori },
            },
          });
        }

        return { createdSubkategoris };
      });

      return res.status(200).json({
        message: "Subkategori berhasil diatur",
        count: result.createdSubkategoris.length,
        createdSubkategoris: result.createdSubkategoris,
      });
    } catch (error) {
      console.error("Error managing Subkategori:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
  },
];

// Controller untuk mengambil subkategori berdasarkan kategoriId
export const getSubkategoriByKategoriId = [
  verifyAdmin,
  async (req, res) => {
    const { kategoriId } = req.params;

    if (!kategoriId) {
      return res.status(400).json({ msg: "kategoriId tidak ditemukan" });
    }

    try {
      const subkategoris = await prisma.subkategori.findMany({
        where: { kategoriId },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!subkategoris || subkategoris.length === 0) {
        return res
          .status(404)
          .json({ message: "Data subkategori tidak ditemukan" });
      }

      res.status(200).json(subkategoris);
    } catch (error) {
      console.error("Error fetching Subkategori:", error);
      res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
  },
];

export const getSubkategoriAdmin = [
  verifyAdmin,
  async (req, res) => {
    try {
      const subkategoris = await prisma.subkategori.findMany({
        include: { budgetItems: true },
      });
      res.status(200).json(subkategoris);
    } catch (error) {
      console.error("Error fetching Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateSubkategori = [
  verifyAdmin,
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("budgetItems")
    .optional()
    .isArray()
    .withMessage("Budget items must be an array"),
  body("budgetItems.*.budget")
    .optional()
    .isDecimal()
    .withMessage("Budget must be a valid number"),
  body("budgetItems.*.realization")
    .optional()
    .isDecimal()
    .withMessage("Realization must be a valid number"),
  body("budgetItems.*.remaining")
    .optional()
    .isDecimal()
    .withMessage("Remaining must be a valid number"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uuid, name, budgetItems } = req.body;

    if (!uuid) {
      return res.status(400).json({ msg: "UUID subkategori tidak ditemukan" });
    }

    const prismaTransaction = await prisma.$transaction; // Mulai transaksi

    try {
      // Mengupdate subkategori
      const subkategori = await prisma.subkategori.update({
        where: { uuid },
        data: { name },
      });

      // Jika ada budgetItems, perbarui data budgetItems
      if (Array.isArray(budgetItems) && budgetItems.length > 0) {
        const updatedBudgetItems = [];
        for (const budgetItem of budgetItems) {
          const {
            uuid: budgetItemUuid,
            budget,
            realization,
            remaining,
          } = budgetItem;

          const updatedBudgetItem = await prisma.budgetItem.update({
            where: { uuid: budgetItemUuid },
            data: { budget, realization, remaining },
          });
          updatedBudgetItems.push(updatedBudgetItem);
        }

        // Commit transaksi setelah semua berhasil
        await prismaTransaction.commit();

        return res.status(200).json({
          message: "Subkategori dan budget items berhasil diperbarui",
          subkategori,
          updatedBudgetItems,
        });
      }

      // Commit transaksi jika hanya subkategori yang diperbarui
      await prismaTransaction.commit();

      return res.status(200).json({
        message: "Subkategori berhasil diperbarui",
        subkategori,
      });
    } catch (error) {
      // Jika terjadi error, rollback transaksi
      await prismaTransaction.rollback();

      console.error("Error updating Subkategori:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
  },
];

export const deleteSubkategori = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    const prismaTransaction = await prisma.$transaction; // Mulai transaksi

    try {
      await prisma.subkategori.delete({
        where: { uuid },
      });

      // Commit transaksi setelah berhasil
      await prismaTransaction.commit();

      res.status(204).send();
    } catch (error) {
      // Jika terjadi error, rollback transaksi
      await prismaTransaction.rollback();

      console.error("Error deleting Subkategori:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// BudgetItem CRUD
export const createBudgetItem = [
  verifyAdmin,
  check("budgetItemsData")
    .isArray()
    .withMessage("budgetItemsData harus berupa array"),
  check("budgetItemsData.*.budget")
    .notEmpty()
    .withMessage("Budget is required"),
  check("budgetItemsData.*.realization")
    .notEmpty()
    .withMessage("Realization is required"),
  check("budgetItemsData.*.subkategoriId")
    .notEmpty()
    .withMessage("SubkategoriId is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { budgetItemsData } = req.body;
    const createdById = req.administratorId;
    const subkategoriId = budgetItemsData[0].subkategoriId;

    try {
      const createdOrUpdatedItems = [];
      const uuidsToKeep = new Set();

      // Ambil semua budget item pada subkategoriId yang bersangkutan
      const existingItems = await prisma.budgetItem.findMany({
        where: { subkategoriId },
      });
      const existingUuids = new Set(existingItems.map((item) => item.uuid));

      for (const item of budgetItemsData) {
        const { uuid, budget, realization } = item;
        const budgetValue = parseFloat(budget);
        const realizationValue = parseFloat(realization);
        const remaining = budgetValue - realizationValue;

        if (uuid) {
          const existingItem = existingItems.find((b) => b.uuid === uuid);
          if (existingItem) {
            // Update jika UUID ditemukan
            const updatedItem = await prisma.budgetItem.update({
              where: { uuid },
              data: {
                budget: budgetValue,
                realization: realizationValue,
                remaining,
                createdById,
              },
            });
            createdOrUpdatedItems.push(updatedItem);
            uuidsToKeep.add(uuid);
          } else {
            console.error("BudgetItem dengan UUID ini tidak ditemukan:", uuid);
          }
        } else {
          // Buat baru jika tidak ada UUID
          const newItem = await prisma.budgetItem.create({
            data: {
              budget: budgetValue,
              realization: realizationValue,
              remaining,
              subkategoriId,
              createdById,
            },
          });
          createdOrUpdatedItems.push(newItem);
        }
      }

      // Hapus budget item yang tidak ada di uuidsToKeep untuk subkategoriId ini
      const uuidsToDelete = [...existingUuids].filter(
        (uuid) => !uuidsToKeep.has(uuid)
      );
      if (uuidsToDelete.length > 0) {
        await prisma.budgetItem.deleteMany({
          where: {
            uuid: { in: uuidsToDelete },
            subkategoriId,
          },
        });
      }

      return res.status(200).json({
        message: "Budget items managed successfully",
        count: createdOrUpdatedItems.length,
        createdOrUpdatedItems,
      });
    } catch (error) {
      console.error("Error managing BudgetItems:", error.message || error);
      return res
        .status(500)
        .json({ msg: "Server error occurred", error: error.message || error });
    }
  },
];

export const getBudgetBySubkategoriId = [
  verifyAdmin,
  async (req, res) => {
    const { subkategoriId } = req.params; // Mengambil kategoriId dari parameter
    try {
      const budgetitems = await prisma.budgetItem.findMany({
        where: { subkategoriId: subkategoriId }, // Mencari berdasarkan subkategoriId
        include: { budgetItems: true },
      });
      res.status(200).json(budgetitems);
    } catch (error) {
      console.error("Error fetching Data:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const getAllBudgetItems = [
  verifyAdmin,
  async (req, res) => {
    try {
      const budgetItems = await prisma.budgetItem.findMany({
        include: { subkategori: true },
      });
      res.status(200).json(budgetItems);
    } catch (error) {
      console.error("Error fetching BudgetItems:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const updateBudgetItem = [
  verifyAdmin,
  body("budget")
    .optional()
    .isNumeric()
    .withMessage("Budget must be a numeric value"),
  body("realization")
    .optional()
    .isNumeric()
    .withMessage("Realization must be a numeric value"),
  async (req, res) => {
    handleValidationErrors(req, res);
    const { uuid } = req.params;
    const { budget, realization } = req.body;

    try {
      await prisma.$transaction(async (tx) => {
        const currentBudgetItem = await tx.budgetItem.findUnique({
          where: { uuid },
        });

        const updatedBudgetItem = await tx.budgetItem.update({
          where: { uuid },
          data: {
            budget,
            realization,
            remaining: budget - realization,
            updated_at: new Date(),
          },
        });

        await recalculateSubkategoriBudget(currentBudgetItem.subkategoriId, tx);
      });

      res.status(200).json({ msg: "Budget item updated successfully" });
    } catch (error) {
      console.error("Error updating budget item:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

export const deleteBudgetItem = [
  verifyAdmin,
  async (req, res) => {
    const { uuid } = req.params;
    try {
      await prisma.budgetItem.delete({
        where: { uuid },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting BudgetItem:", error);
      res.status(500).json({ msg: "Server error occurred" });
    }
  },
];

// Helper function to recalculate Subkategori budget
async function recalculateSubkategoriBudget(subkategoriId, tx) {
  const budgetItems = await tx.budgetItem.findMany({
    where: { subkategoriId },
  });

  let totalBudget = 0;
  let totalRealization = 0;

  budgetItems.forEach((item) => {
    totalBudget += item.budget;
    totalRealization += item.realization;
  });

  await tx.subkategori.update({
    where: { id: subkategoriId },
    data: {
      totalBudget,
      totalRealization,
      remaining: totalBudget - totalRealization,
    },
  });
}
