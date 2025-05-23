import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
    console.log("File lama dihapus:", filePath);
  } catch (err) {
    console.warn("Gagal menghapus file lama:", err.message);
  }
};

//get agama dan education
export const getEducationOptions = async (req, res) => {
  try {
    const educationOptions = await prisma.education.findMany();
    res.status(200).json(educationOptions);
  } catch (error) {
    console.error("Error fetching education options:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const getAgama = async (req, res) => {
  try {
    const agamaOptions = await prisma.religion.findMany();
    res.status(200).json(agamaOptions);
  } catch (error) {
    console.error("Error fetching agama options:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//IDM
// Get: Ambil semua data idm
export const getIdmPengunjung = async (req, res) => {
  try {
    const IndexDesaMembangun = await prisma.IndexDesaMembangun.findMany();

    if (IndexDesaMembangun.length === 0) {
      return res.status(200).json({ IndexDesaMembangun: [] });
    }

    res.status(200).json({ IndexDesaMembangun });
  } catch (error) {
    console.error("Error saat mengambil data IDM:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data idm dengan autentikasi
export const getIndexDesaMembangunAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const IndexDesaMembangun = await prisma.IndexDesaMembangun.findMany();

    if (IndexDesaMembangun.length === 0) {
      return res.status(200).json({ IndexDesaMembangun: [] });
    }

    res.status(200).json({ IndexDesaMembangun });
  } catch (error) {
    console.error("Error saat mengambil data IDM untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data idm baru (tanpa geographyId)
export const createIndexDesaMembangun = async (req, res) => {
  const { statusidm, nilaiidm, ikl, iks, ike, ket } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!statusidm || !nilaiidm || !ikl || !iks || !ike || !ket) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newIndexDesaMembangun = await prisma.IndexDesaMembangun.create({
      data: {
        statusidm,
        nilaiidm,
        ikl,
        iks,
        ike,
        ket,
        createdbyId: admin.id,
      },
    });

    res.status(201).json({
      msg: "IDM berhasil dibuat",
      IndexDesaMembangun: newIndexDesaMembangun,
    });
  } catch (error) {
    console.error("Error saat membuat IDM:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data IDM sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data idm yang ada
export const updateIndexDesaMembangun = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL
  const { statusidm, nilaiidm, ikl, iks, ike, ket } = req.body;

  try {
    // Validasi data
    if (!statusidm || !nilaiidm || !ikl || !iks || !ike || !ket) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    // Cek autentikasi admin
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Cek apakah data dengan UUID tersebut ada
    const existingIndexDesaMembangun =
      await prisma.IndexDesaMembangun.findUnique({
        where: { uuid },
      });

    if (!existingIndexDesaMembangun) {
      return res.status(404).json({ msg: "Tahun IDM tidak ditemukan" });
    }

    // Update data
    const updatedIndexDesaMembangun = await prisma.IndexDesaMembangun.update({
      where: { uuid },
      data: {
        statusidm,
        nilaiidm,
        ikl,
        iks,
        ike,
        ket,
        updated_at: new Date(),
      },
    });

    // Kirim respons sukses
    res.status(200).json({
      msg: "IDM diperbarui",
      IndexDesaMembangun: updatedIndexDesaMembangun,
    });
  } catch (error) {
    console.error("Error saat memperbarui IDM:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data IDM berdasarkan UUID
export const deleteIndexDesaMembangun = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingIndexDesaMembangun =
      await prisma.IndexDesaMembangun.findUnique({
        where: { uuid },
      });

    if (!existingIndexDesaMembangun) {
      return res.status(404).json({ msg: "IDM tidak ditemukan" });
    }

    await prisma.IndexDesaMembangun.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "IDM dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus IDM:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//desa cantik admin
export const getDesacantik = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Mengambil data profil dengan pname 'desacantik'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "desacantik",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Desa Cantik",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "desacantik",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Desa Cantik",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "desacantik",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createDesacantik = async (req, res) => {
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//desa cantik pengunjung
export const getDesacantikpengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "desacantik",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Desa Cantik",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "desacantik",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data desa cantik:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//tentang admin
export const getTentang = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Mengambil data profil dengan pname 'tentang'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "tentang",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Tentang",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "tentang",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Tentang",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "tentang",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createTentang = async (req, res) => {
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//tentang pengunjung
export const getTentangpengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "tentang",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Tentang",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "tentang",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data tentang:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//sejarah admin
export const getSejarah = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Mengambil data profil dengan pname 'tentang'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "sejarah",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Sejarah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "sejarah",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Sejarah",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "sejarah",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data sejarah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createSejarah = async (req, res) => {
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//sejarah pengunjung
export const getSejarahpengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "sejarah",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Sejarah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "sejarah",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data sejarah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//visi misi pengunjung
export const getVisimisipengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "visimisi",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Visi dan Misi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "visimisi",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//visi misi admin
export const getVisimisi = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Mengambil data profil dengan pname 'visimisi'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "visimisi",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Visi dan Misi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "visimisi",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Visi dan Misi",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "visimisi",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data visi-misi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createVisimisi = async (req, res) => {
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//strukturorganisasi pengunjung
export const getStrukturorganisasipengunjung = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "strukturorganisasi",
        status: "PUBLISH",
      },
    });

    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Struktur Organisasi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "strukturorganisasi",
        },
      });
    }

    const profileData = profiles[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data Struktur organisasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//strukturorganisasi misi admin
export const getStrukturorganisasi = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Mengambil data profil dengan pname 'strukturorganisasi'
    const profiles = await prisma.profile.findMany({
      where: {
        pname: "strukturorganisasi",
      },
    });

    // Jika tidak ada data, kirimkan data kosong
    if (profiles.length === 0) {
      return res.status(200).json({
        profile: {
          uuid: "",
          title: "Judul Struktur Organisasi",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "strukturorganisasi",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const profileData = profiles.map((profile) => ({
      uuid: profile.uuid || "",
      title: profile.title || "Judul Struktur Organisasi",
      content: profile.content || "",
      file_url: profile.file_url || "",
      status: profile.status || "DRAFT",
      pname: profile.pname || "strukturorganisasi",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ profile: profileData });
  } catch (error) {
    console.error("Error saat mengambil data struktur organisasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createStrukturorganisasi = async (req, res) => {
  const { title, visionContent, status, pname } = req.body;
  const file = req.file;

  try {
    if (!["DRAFT", "PUBLISH"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be DRAFT or PUBLISH." });
    }

    // Cek administrator dari token
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const administrator = await prisma.administrator.findUnique({
      where: { id: decoded.administratorId },
    });

    if (!administrator || administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Cek apakah profile dengan pname sudah ada
      const existingProfile = await tx.profile.findFirst({
        where: { pname: pname },
      });

      if (existingProfile) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingProfile.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingProfile.file_url)
            );
          }
        }

        // Update profile jika sudah ada
        const updatedProfile = await tx.profile.update({
          where: { uuid: existingProfile.uuid },
          data: {
            title,
            content: visionContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingProfile.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", profile: updatedProfile };
      } else {
        // Create profile jika belum ada
        const newProfile = await tx.profile.create({
          data: {
            title,
            content: visionContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            createdbyId: administrator.id,
          },
        });
        return { type: "create", profile: newProfile };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Profile updated successfully", profile: result.profile });
    } else {
      res
        .status(201)
        .json({ msg: "Profile created successfully", profile: result.profile });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//demografi pengunjung
export const getDemografipengunjung = async (req, res) => {
  try {
    // Ambil semua data demografi
    const allDemographics = await prisma.demographics.findMany({
      select: {
        id: true,
        gender: true,
        education_id: true,
        job: true,
        religion_id: true,
        marital_status: true,
        birth_date: true,
        rt: true,
        rw: true,
        hamlet: true,
      },
    });

    // Fungsi utilitas untuk mengelompokkan data berdasarkan jenis kelamin
    const groupByGender = (data, key) => {
      return data.reduce((acc, item) => {
        // Normalisasi nilai gender (case-insensitive)
        const gender = (item.gender || "Unknown").trim().toLowerCase();
        const normalizedGender =
          gender === "laki-laki"
            ? "Laki-laki"
            : gender === "perempuan"
            ? "Perempuan"
            : "Unknown";

        const category = item[key] || "Unknown";

        if (!acc[category]) acc[category] = { total: 0, male: 0, female: 0 };
        acc[category].total++;
        if (normalizedGender === "Laki-laki") acc[category].male++;
        if (normalizedGender === "Perempuan") acc[category].female++;

        return acc;
      }, {});
    };

    // Ambil data pendidikan dengan distribusi jenis kelamin
    const educationWithGender = groupByGender(allDemographics, "education_id");
    const educationDetails = await prisma.education.findMany({
      where: { id: { in: Object.keys(educationWithGender).map(Number) } },
    });

    const educationCountsWithGender = educationDetails.map((edu) => ({
      education_id: edu.id,
      level: edu.level,
      total: educationWithGender[edu.id].total,
      male: educationWithGender[edu.id].male,
      female: educationWithGender[edu.id].female,
    }));

    // Ambil data pekerjaan dengan distribusi jenis kelamin
    const jobWithGender = groupByGender(allDemographics, "job");
    const jobCountsWithGender = Object.keys(jobWithGender).map((job) => ({
      job,
      total: jobWithGender[job].total,
      male: jobWithGender[job].male,
      female: jobWithGender[job].female,
    }));

    // Ambil data agama dengan distribusi jenis kelamin
    const religionWithGender = groupByGender(allDemographics, "religion_id");
    const religionDetails = await prisma.religion.findMany({
      where: { id: { in: Object.keys(religionWithGender).map(Number) } },
    });

    const religionCountsWithGender = religionDetails.map((religion) => ({
      religion_id: religion.id,
      name: religion.name,
      total: religionWithGender[religion.id].total,
      male: religionWithGender[religion.id].male,
      female: religionWithGender[religion.id].female,
    }));

    // Ambil data status perkawinan dengan distribusi jenis kelamin
    const maritalStatusWithGender = groupByGender(
      allDemographics,
      "marital_status"
    );
    const maritalStatusCountsWithGender = Object.keys(
      maritalStatusWithGender
    ).map((status) => ({
      marital_status: status,
      total: maritalStatusWithGender[status].total,
      male: maritalStatusWithGender[status].male,
      female: maritalStatusWithGender[status].female,
    }));

    // Hitung umur dari birth_date
    const calculateAge = (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age;
    };

    // Kelompokkan umur dengan distribusi jenis kelamin
    const ageGroupsWithGender = {
      "0-17": { total: 0, male: 0, female: 0 },
      "18-25": { total: 0, male: 0, female: 0 },
      "26-35": { total: 0, male: 0, female: 0 },
      "36-45": { total: 0, male: 0, female: 0 },
      "46-55": { total: 0, male: 0, female: 0 },
      "56-65": { total: 0, male: 0, female: 0 },
      "65+": { total: 0, male: 0, female: 0 },
    };

    allDemographics.forEach((item) => {
      const age = calculateAge(item.birth_date);
      const gender = (item.gender || "Unknown").trim().toLowerCase();
      const normalizedGender =
        gender === "laki-laki"
          ? "Laki-laki"
          : gender === "perempuan"
          ? "Perempuan"
          : "Unknown";

      if (age >= 0 && age <= 17) {
        ageGroupsWithGender["0-17"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["0-17"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["0-17"].female++;
      } else if (age >= 18 && age <= 25) {
        ageGroupsWithGender["18-25"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["18-25"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["18-25"].female++;
      } else if (age >= 26 && age <= 35) {
        ageGroupsWithGender["26-35"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["26-35"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["26-35"].female++;
      } else if (age >= 36 && age <= 45) {
        ageGroupsWithGender["36-45"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["36-45"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["36-45"].female++;
      } else if (age >= 46 && age <= 55) {
        ageGroupsWithGender["46-55"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["46-55"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["46-55"].female++;
      } else if (age >= 56 && age <= 65) {
        ageGroupsWithGender["56-65"].total++;
        if (normalizedGender === "Laki-laki")
          ageGroupsWithGender["56-65"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["56-65"].female++;
      } else {
        ageGroupsWithGender["65+"].total++;
        if (normalizedGender === "Laki-laki") ageGroupsWithGender["65+"].male++;
        if (normalizedGender === "Perempuan")
          ageGroupsWithGender["65+"].female++;
      }
    });

    // Kelompokkan data berdasarkan RT, RW, dan Dusun dengan distribusi jenis kelamin
    const groupByRTWithGender = groupByGender(allDemographics, "rt");
    const groupByRWWithGender = groupByGender(allDemographics, "rw");
    const groupByHamletWithGender = groupByGender(allDemographics, "hamlet");

    const genderCounts = await prisma.demographics.groupBy({
      by: ["gender"],
      _count: { id: true },
    });

    // Kirim respons ke Frontend
    res.json({
      educationCounts: educationCountsWithGender,
      jobCounts: jobCountsWithGender,
      religionCounts: religionCountsWithGender,
      maritalStatusCounts: maritalStatusCountsWithGender,
      ageGroups: ageGroupsWithGender,
      groupedByRT: groupByRTWithGender,
      groupedByRW: groupByRWWithGender,
      groupedByHamlet: groupByHamletWithGender,
      genderCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//demografi admin
export const getDemografiadmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const demographics = await prisma.demographics.findMany({
      include: {
        education: true,
        religion: true,
      },
    });

    if (demographics.length === 0) {
      return res.status(200).json({ demographics: [] });
    }

    res.status(200).json({ demographics });
  } catch (error) {
    console.error("Error saat mengambil data demografi untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const createDemografi = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nik,
    name,
    gender,
    birth_date,
    marital_status,
    education_id,
    job,
    rt,
    rw,
    hamlet,
    religion_id,
    status_aktif,
    tmt_status_aktif,
    keterangan_status,
  } = req.body;

  const file = req.file;
  const parsedEducationId = parseInt(education_id, 10);
  const parsedReligionId = parseInt(religion_id, 10);

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

    // Check for existing demographic by NIK
    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik: nik },
    });

    if (existingDemographic) {
      // If the record already exists, return an error
      return res.status(400).json({
        status: "fail",
        errors: [{ msg: "NIK sudah ada, tidak bisa membuat data baru" }],
      });
    } else {
      // Create new demographic if it doesn't exist
      const newDemographic = await prisma.demographics.create({
        data: {
          nik,
          name,
          gender,
          birth_date: new Date(birth_date),
          marital_status,
          education_id: parsedEducationId,
          job,
          rt,
          rw,
          hamlet,
          status_aktif,
          tmt_status_aktif: status_aktif === "aktif" ? null : tmt_status_aktif,
          keterangan_status:
            status_aktif === "aktif" ? null : keterangan_status,
          religion_id: parsedReligionId,
          file_url: file ? `/uploads/demografi/${file.filename}` : null,
          created_by: administrator.name,
        },
      });

      return res.status(201).json({
        msg: "Demographic created successfully",
        demographic: newDemographic,
      });
    }
  } catch (error) {
    console.error("Error creating demographic:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const updateDemografi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nik,
    name,
    gender,
    birth_date,
    marital_status,
    education_id,
    job,
    rt,
    rw,
    hamlet,
    religion_id,
    status_aktif,
    tmt_status_aktif,
    keterangan_status,
  } = req.body;
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

    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik },
    });
    if (!existingDemographic) {
      return res.status(404).json({ msg: "Demografi tidak ditemukan" });
    }

    let filePathToDelete = null;
    if (file && existingDemographic.file_url) {
      filePathToDelete = path.join(
        __dirname,
        "..",
        "uploads/demografi",
        path.basename(existingDemographic.file_url)
      );
    }

    // Logika untuk menentukan tmt_status_aktif dan keterangan_status
    let newTmtStatusAktif = tmt_status_aktif;
    let newKeteranganStatus = keterangan_status;

    if (status_aktif === "aktif") {
      newTmtStatusAktif = new Date(birth_date); // Mengisi tmt_status_aktif dengan tanggal lahir
      newKeteranganStatus = "lahir"; // Mengisi keterangan_status dengan "lahir"
    }

    const updatedDemographic = await prisma.demographics.update({
      where: { nik },
      data: {
        name,
        gender,
        birth_date: new Date(birth_date),
        marital_status,
        education_id: parseInt(education_id, 10),
        job,
        rt,
        rw,
        hamlet,
        status_aktif,
        tmt_status_aktif: newTmtStatusAktif,
        keterangan_status: newKeteranganStatus,
        religion_id: parseInt(religion_id, 10),
        file_url: file
          ? `/uploads/demografi/${file.filename}`
          : existingDemographic.file_url,
        updated_by: administrator.name,
        updated_at: new Date(),
      },
    });

    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Berhasil menghapus file lama: ${filePathToDelete}`);
    }

    return res.status(200).json({
      msg: "Demografi berhasil diperbarui",
      demographic: updatedDemographic,
    });
  } catch (error) {
    console.error("Error memperbarui demografi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const deleteDemografi = async (req, res) => {
  const { nik } = req.params;

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

    const existingDemographic = await prisma.demographics.findUnique({
      where: { nik },
    });
    if (!existingDemographic) {
      return res.status(404).json({ msg: "Demographic not found" });
    }

    // Delete file if it exists
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/demografi",
      path.basename(existingDemographic.file_url)
    );

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Delete demographic record
    await prisma.demographics.delete({
      where: { nik },
    });

    return res.status(200).json({ msg: "Demographic deleted successfully" });
  } catch (error) {
    console.error("Error deleting demographic:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//batas wilayah
// Get: Ambil semua data batas wilayah (tanpa geography)
export const getBatasWilayahPengunjung = async (req, res) => {
  try {
    const batasWilayah = await prisma.batasWilayah.findMany();

    if (batasWilayah.length === 0) {
      return res.status(200).json({ batasWilayah: [] });
    }

    res.status(200).json({ batasWilayah });
  } catch (error) {
    console.error("Error saat mengambil data batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data batas wilayah dengan autentikasi
export const getBatasWilayahAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const batasWilayah = await prisma.batasWilayah.findMany();

    if (batasWilayah.length === 0) {
      return res.status(200).json({ batasWilayah: [] });
    }

    res.status(200).json({ batasWilayah });
  } catch (error) {
    console.error(
      "Error saat mengambil data batas wilayah untuk admin:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data batas wilayah baru (tanpa geographyId)
export const createBatasWilayah = async (req, res) => {
  const { kategori, nilai } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!kategori || !nilai) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newBatasWilayah = await prisma.batasWilayah.create({
      data: {
        kategori,
        nilai,
      },
    });

    res.status(201).json({
      msg: "Batas wilayah berhasil dibuat",
      batasWilayah: newBatasWilayah,
    });
  } catch (error) {
    console.error("Error saat membuat batas wilayah:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data batas wilayah sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data batas wilayah yang ada
export const updateBatasWilayah = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { kategori, nilai } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingBatasWilayah = await prisma.batasWilayah.findUnique({
      where: { uuid },
    });

    if (!existingBatasWilayah) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    const updatedBatasWilayah = await prisma.batasWilayah.update({
      where: { uuid },
      data: {
        kategori,
        nilai,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Batas wilayah diperbarui",
      batasWilayah: updatedBatasWilayah,
    });
  } catch (error) {
    console.error("Error saat memperbarui batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data batas wilayah berdasarkan UUID
export const deleteBatasWilayah = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingBatasWilayah = await prisma.batasWilayah.findUnique({
      where: { uuid },
    });

    if (!existingBatasWilayah) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    await prisma.batasWilayah.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Batas wilayah dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//Orbitasi
// Get: Ambil semua data Orbitasi (tanpa geography)
export const getOrbitasiPengunjung = async (req, res) => {
  try {
    const orbitasi = await prisma.orbitasiDesa.findMany();

    if (orbitasi.length === 0) {
      return res.status(200).json({ orbitasi: [] });
    }

    res.status(200).json({ orbitasi });
  } catch (error) {
    console.error("Error saat mengambil data Orbitasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data batas wilayah dengan autentikasi
export const getOrbitasiAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const orbitasi = await prisma.orbitasiDesa.findMany();
    console.log("Data Orbitasi:", orbitasi);

    if (orbitasi.length === 0) {
      return res.status(200).json({ orbitasi: [] });
    }

    res.status(200).json({ orbitasi });
  } catch (error) {
    console.error(
      "Error saat mengambil data Orbitasi Desa untuk admin:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data batas wilayah baru (tanpa geographyId)
export const createOrbitasi = async (req, res) => {
  const { kategori, nilai, satuan } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!kategori || !nilai || !satuan) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newOrbitasi = await prisma.orbitasiDesa.create({
      data: {
        kategori,
        nilai,
        satuan,
      },
    });

    res.status(201).json({
      msg: "Orbitasi berhasil dibuat",
      orbitasi: newOrbitasi,
    });
  } catch (error) {
    console.error("Error saat membuat Orbitasi Desa:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data Orbitasi Desa sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data batas wilayah yang ada
export const updateOrbitasi = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { kategori, nilai, satuan } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingOrbitasi = await prisma.orbitasiDesa.findUnique({
      where: { uuid },
    });

    if (!existingOrbitasi) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    const updatedOrbitasi = await prisma.orbitasiDesa.update({
      where: { uuid },
      data: {
        kategori,
        nilai,
        satuan,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Orbitasi Desa diperbarui",
      orbitasi: updatedOrbitasi,
    });
  } catch (error) {
    console.error("Error saat memperbarui batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data batas wilayah berdasarkan UUID
export const deleteOrbitasi = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingOrbitasi = await prisma.orbitasiDesa.findUnique({
      where: { uuid },
    });

    if (!existingOrbitasi) {
      return res.status(404).json({ msg: "Batas wilayah tidak ditemukan" });
    }

    await prisma.orbitasiDesa.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Batas wilayah dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus batas wilayah:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//JenisLahan
export const getJenisLahanPengunjung = async (req, res) => {
  try {
    const jenisLahan = await prisma.jenisLahan.findMany();

    if (jenisLahan.length === 0) {
      return res.status(200).json({ jenisLahan: [] });
    }

    res.status(200).json({ jenisLahan });
  } catch (error) {
    console.error("Error saat mengambil data Jenis Lahan:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data Jenis Lahan dengan autentikasi
export const getJenisLahanAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const jenisLahan = await prisma.jenisLahan.findMany();
    console.log("Jenis Lahan:", jenisLahan);

    if (jenisLahan.length === 0) {
      return res.status(200).json({ jenisLahan: [] });
    }

    res.status(200).json({ jenisLahan });
  } catch (error) {
    console.error("Error saat mengambil data Jenis Lahan untuk admin:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data Jenis Lahan baru (tanpa geographyId)
export const createJenisLahan = async (req, res) => {
  const { jenis, nama, luas } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!jenis || !nama || !luas) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newJenisLahan = await prisma.jenisLahan.create({
      data: {
        jenis,
        nama,
        luas: parseFloat(luas),
      },
    });

    res.status(201).json({
      msg: "Jenis Lahan berhasil dibuat",
      jenisLahan: newJenisLahan,
    });
  } catch (error) {
    console.error("Error saat membuat Jenis Lahan:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data Jenis Lahan sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data Jenis Lahan yang ada
export const updateJenisLahan = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { jenis, nama, luas } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingJenisLahan = await prisma.jenisLahan.findUnique({
      where: { uuid },
    });

    if (!existingJenisLahan) {
      return res.status(404).json({ msg: "Jenis lahan tidak ditemukan" });
    }

    const updatedJenisLahan = await prisma.jenisLahan.update({
      where: { uuid },
      data: {
        jenis,
        nama,
        luas: parseFloat(luas),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Jenis Lahan diperbarui",
      jenisLahan: updatedJenisLahan,
    });
  } catch (error) {
    console.error("Error saat memperbarui jenis lahan:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data Jenis Lahan berdasarkan UUID
export const deleteJenisLahan = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingJenisLahan = await prisma.jenisLahan.findUnique({
      where: { uuid },
    });

    if (!existingJenisLahan) {
      return res.status(404).json({ msg: "Jenis Lahan tidak ditemukan" });
    }

    await prisma.jenisLahan.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Jenis Lahan dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus Jenis Lahan:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//PotensiWisata
export const getPotensiWisataPengunjung = async (req, res) => {
  try {
    const potensiWisata = await prisma.potensiWisata.findMany();

    if (potensiWisata.length === 0) {
      return res.status(200).json({ potensiWisata: [] });
    }

    res.status(200).json({ potensiWisata });
  } catch (error) {
    console.error("Error saat mengambil data Potensi Wisata:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Admin: Ambil semua data Potensi Wisata dengan autentikasi
export const getPotensiWisataAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const potensiWisata = await prisma.potensiWisata.findMany();
    console.log("Potensi Wisata:", potensiWisata);

    if (potensiWisata.length === 0) {
      return res.status(200).json({ potensiWisata: [] });
    }

    res.status(200).json({ potensiWisata });
  } catch (error) {
    console.error(
      "Error saat mengambil data Potensi Wisata untuk admin:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Create: Membuat data Potensi Wisata baru (tanpa geographyId)
export const createPotensiWisata = async (req, res) => {
  const { jenis, luas } = req.body;
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Validasi input
    if (!jenis || !luas) {
      return res.status(400).json({ msg: "Semua field wajib diisi" });
    }

    const newPotensiWisata = await prisma.potensiWisata.create({
      data: {
        jenis,
        luas: parseFloat(luas),
      },
    });

    res.status(201).json({
      msg: "Potensi Wisata berhasil dibuat",
      potensiWisata: newPotensiWisata,
    });
  } catch (error) {
    console.error("Error saat membuat Potensi Wisata:", error);

    // Handling error spesifik dari Prisma
    if (error.code === "P2002") {
      return res.status(409).json({ msg: "Data Potensi Wisata sudah ada" });
    }

    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Update: Memperbarui data Potensi Wisata yang ada
export const updatePotensiWisata = async (req, res) => {
  const { uuid } = req.params; // Mengambil UUID dari URL params
  const { jenis, luas } = req.body;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingPotensiWisata = await prisma.potensiWisata.findUnique({
      where: { uuid },
    });

    if (!existingPotensiWisata) {
      return res.status(404).json({ msg: "Jenis lahan tidak ditemukan" });
    }

    const updatedPotensiWisata = await prisma.jenisLahan.update({
      where: { uuid },
      data: {
        jenis,
        luas: parseFloat(luas),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      msg: "Potensi Wisata diperbarui",
      potensiWisata: updatedPotensiWisata,
    });
  } catch (error) {
    console.error("Error saat memperbarui Potensi Wisata:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Delete: Menghapus data Potensi Wisata berdasarkan UUID
export const deletePotensiWisata = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingPotensiWisata = await prisma.potensiWisata.findUnique({
      where: { uuid },
    });

    if (!existingPotensiWisata) {
      return res.status(404).json({ msg: "Potensi Wisata tidak ditemukan" });
    }

    await prisma.potensiWisata.delete({
      where: { uuid },
    });

    res.status(200).json({ msg: "Potensi Wisata dihapus dengan sukses" });
  } catch (error) {
    console.error("Error saat menghapus Potensi Wisata:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//jabatan
const validateToken = async (refreshToken) => {
  if (!refreshToken) {
    throw { status: 401, msg: "Token tidak ditemukan" };
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const administrator = await prisma.administrator.findUnique({
    where: { id: decoded.administratorId },
  });

  if (!administrator) {
    throw { status: 403, msg: "Akses ditolak" };
  }

  return administrator;
};

// Get all Jabatan
export const getJabatanpengunjung = async (req, res) => {
  try {
    const jabatanList = await prisma.jabatan.findMany({
      include: {
        tugas: true,
        fungsi: true,
        masaJabatan: true,
        pemegang: {
          // Mengambil data dari tabel Demographics
          select: { name: true, file_url: true }, // Hanya ambil nama pemegang
        },
        Kehadiran: {
          select: { id: true, statusHadir: true, createdAt: true },
        },
        createdBy: { select: { name: true } },
      },
    });

    res.status(200).json(jabatanList);
  } catch (error) {
    console.error("Error saat mengambil data jabatan:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

export const getJabatan = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await validateToken(refreshToken);

    const jabatanList = await prisma.jabatan.findMany({
      include: {
        tugas: true,
        fungsi: true,
        masaJabatan: true,
        pemegang: {
          // Mengambil data dari tabel Demographics
          select: { name: true }, // Hanya ambil nama pemegang
        },
        createdBy: { select: { name: true } },
        Kehadiran: {
          select: { id: true, statusHadir: true, createdAt: true },
        },
      },
    });

    res.status(200).json(jabatanList);
  } catch (error) {
    console.error("Error saat mengambil data jabatan:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

// Create Jabatan
export const createJabatan = async (req, res) => {
  const { nama, pemegangId, ringkasan, tugas, fungsi, mulai, selesai } =
    req.body;
  const refreshToken = req.cookies.refreshToken;

  try {
    const administrator = await validateToken(refreshToken);

    const result = await prisma.$transaction(async (tx) => {
      const jabatan = await tx.jabatan.create({
        data: { nama, ringkasan, pemegangId, createdbyId: administrator.id },
      });
      if (tugas) {
        await tx.tugas.create({
          data: { content: tugas, jabatanId: jabatan.uuid },
        });
      }
      if (fungsi) {
        await tx.fungsi.create({
          data: { content: fungsi, jabatanId: jabatan.uuid },
        });
      }
      const masaJabatan = mulai && selesai ? { mulai, selesai } : null;

      if (masaJabatan) {
        await tx.masaJabatan.create({
          data: {
            mulai: masaJabatan.mulai,
            selesai: masaJabatan.selesai,
            jabatan: {
              connect: { uuid: jabatan.uuid }, // Menggunakan connect
            },
            createdBy: {
              connect: { id: administrator.id }, // Menggunakan connect untuk menghubungkan Administrator
            },
          },
        });
      }
      console.log("masa Jabatan berhasil dibuat:", masaJabatan);

      return jabatan;
    });

    res.status(201).json({ message: "Jabatan berhasil dibuat", data: result });
  } catch (error) {
    console.error("Error saat membuat jabatan:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

export const updateJabatan = async (req, res) => {
  const { uuid } = req.params;
  const { nama, pemegangId, ringkasan, tugas, fungsi, mulai, selesai } =
    req.body;
  const refreshToken = req.cookies.refreshToken;

  try {
    const administrator = await validateToken(refreshToken);

    const result = await prisma.$transaction(async (tx) => {
      const existingJabatan = await tx.jabatan.findUnique({ where: { uuid } });
      if (!existingJabatan)
        throw { status: 404, msg: "Jabatan tidak ditemukan" };

      // Update Jabatan
      const updatedJabatan = await tx.jabatan.update({
        where: { uuid },
        data: { nama, ringkasan, pemegangId, createdbyId: administrator.id },
      });

      if (tugas) {
        const existingTugas = await tx.tugas.findFirst({
          where: {
            jabatanId: existingJabatan.uuid,
          },
        });

        if (existingTugas) {
          if (existingTugas.content !== tugas) {
            // Periksa apakah konten berbeda
            await tx.tugas.update({
              where: { id: existingTugas.id },
              data: { content: tugas },
            });
          }
        } else {
          await tx.tugas.create({
            data: { content: tugas, jabatanId: existingJabatan.uuid },
          });
        }
      }

      if (fungsi) {
        const existingFungsi = await tx.fungsi.findFirst({
          where: {
            jabatanId: existingJabatan.uuid,
          },
        });

        if (existingFungsi) {
          if (existingFungsi.content !== fungsi) {
            // Periksa apakah konten berbeda
            await tx.fungsi.update({
              where: { id: existingFungsi.id },
              data: { content: fungsi },
            });
          }
        } else {
          await tx.fungsi.create({
            data: { content: fungsi, jabatanId: existingJabatan.uuid },
          });
        }
      }

      const masaJabatan = mulai && selesai ? { mulai, selesai } : null;

      if (masaJabatan) {
        // Validasi nama jabatan dan tahun mulai
        const duplicateMasaJabatan = await tx.masaJabatan.findFirst({
          where: {
            mulai: masaJabatan.mulai,
            jabatan: {
              nama: nama, // Nama jabatan dari request body
            },
          },
          include: {
            jabatan: true, // Sertakan relasi jabatan untuk memverifikasi nama
          },
        });

        if (
          duplicateMasaJabatan &&
          duplicateMasaJabatan.jabatan.uuid !== existingJabatan.uuid
        ) {
          throw {
            status: 400,
            msg: "Jabatan dengan nama dan tahun mulai tersebut sudah ada",
          };
        }

        // Periksa apakah masa jabatan sudah ada untuk jabatan saat ini
        const existingMasaJabatan = await tx.masaJabatan.findFirst({
          where: { jabatanId: existingJabatan.uuid },
        });

        if (existingMasaJabatan) {
          // Update data jika sudah ada
          await tx.masaJabatan.update({
            where: { id: existingMasaJabatan.id },
            data: {
              mulai: masaJabatan.mulai,
              selesai: masaJabatan.selesai,
            },
          });
        } else {
          // Jika belum ada, buat data baru
          await tx.masaJabatan.create({
            data: {
              mulai: masaJabatan.mulai,
              selesai: masaJabatan.selesai,
              jabatan: {
                connect: { uuid: existingJabatan.uuid },
              },
              createdBy: {
                connect: { id: administrator.id },
              },
            },
          });
        }
      }

      return updatedJabatan;
    });

    res
      .status(200)
      .json({ message: "Jabatan berhasil diperbarui", data: result });
  } catch (error) {
    console.error("Error saat memperbarui jabatan:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

export const updateKehadiran = async (req, res) => {
  const { uuid } = req.params; // UUID jabatan
  const { statusHadir } = req.body; // Status baru ("Hadir" atau "Tidak Hadir")
  const refreshToken = req.cookies.refreshToken;

  try {
    // Validasi token administrator
    const administrator = await validateToken(refreshToken);

    const result = await prisma.$transaction(async (tx) => {
      // Periksa apakah jabatan dengan UUID tersebut ada
      const existingJabatan = await tx.jabatan.findUnique({
        where: { uuid },
      });

      if (!existingJabatan) {
        throw { status: 404, msg: "Jabatan tidak ditemukan" };
      }

      // Periksa apakah data kehadiran sudah ada untuk jabatan ini
      const existingKehadiran = await tx.kehadiran.findFirst({
        where: { jabatanId: uuid },
      });

      if (existingKehadiran) {
        // Update status kehadiran jika sudah ada
        return await tx.kehadiran.update({
          where: { id: existingKehadiran.id },
          data: {
            statusHadir,
            createdbyId: administrator.id,
          },
        });
      } else {
        // Jika belum ada, buat data baru
        return await tx.kehadiran.create({
          data: {
            statusHadir,
            jabatan: {
              connect: { uuid },
            },
            createdBy: {
              connect: { id: administrator.id },
            },
          },
        });
      }
    });

    res
      .status(200)
      .json({ message: "Status kehadiran berhasil diperbarui", data: result });
  } catch (error) {
    console.error("Error saat memperbarui kehadiran:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

export const deleteJabatan = async (req, res) => {
  const { uuid } = req.params;
  const refreshToken = req.cookies.refreshToken;

  try {
    await validateToken(refreshToken);

    await prisma.jabatan.delete({ where: { uuid } }); // Hanya ini yang diperlukan karena onDelete: Cascade

    res.status(200).json({ message: "Jabatan berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus jabatan:", error);
    const status = error.status || 500;
    res
      .status(status)
      .json({ msg: error.msg || "Terjadi kesalahan pada server" });
  }
};

//lembaga
// Mendapatkan data lembaga untuk pengunjung
export const getLembagapengunjung = async (req, res) => {
  try {
    const lembagaList = await prisma.lembaga.findMany({
      include: {
        Anggota: {
          select: {
            uuid: true, // Sertakan uuid anggota
            jabatan: true, // Sertakan jabatan anggota
            demografi: {
              select: {
                uuid: true,
                nik: true,
                name: true,
                education: {
                  select: {
                    level: true, // Menambahkan level pendidikan dari education
                  },
                },
              },
            },
          },
        },
        profil_lembaga: true,
        visi_misi: true,
        tugas_pokok: true,
        createdBy: {
          // Hapus include di sini
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Logika untuk mengembalikan array lembagaList jika ada data, atau objek kosong jika lembagaList kosong
    if (lembagaList.length === 0) {
      return res.status(200).json({ lembaga: {} });
    }

    res.status(200).json({ lembagap: lembagaList });
  } catch (error) {
    console.error("Error saat mengambil data lembaga:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Mendapatkan data lembaga lengkap dengan anggota
export const getLembaga = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const administrator = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!administrator) {
      return res.status(401).json({ msg: "Pengguna tidak ditemukan" });
    }

    if (administrator.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const lembagaList = await prisma.lembaga.findMany({
      include: {
        Anggota: {
          select: {
            uuid: true,
            jabatan: true,
            demografi: {
              select: {
                uuid: true,
                nik: true,
                name: true,
              },
            },
          },
        },
        profil_lembaga: true,
        visi_misi: true,
        tugas_pokok: true,
        createdBy: {
          // Pindahkan relasi createdBy ke tingkat yang sama
          select: {
            name: true, // Hanya mengambil field 'name' dari relasi 'createdBy'
          },
        },
      },
    });

    // Logika untuk mengembalikan array lembagaList jika ada data, atau objek kosong jika lembagaList kosong
    if (lembagaList.length === 0) {
      return res.status(200).json({ lembaga: {} });
    }

    res.status(200).json({ lembaga: lembagaList });
  } catch (error) {
    console.error("Error saat mengambil data lembaga:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

// Membuat atau memperbarui data lembaga, termasuk anggota
export const createLembaga = async (req, res) => {
  const {
    nama,
    singkatan,
    dasar_hukum,
    alamat_kantor,
    profil,
    visimisi,
    tugaspokok,
    jabatans,
  } = req.body;

  // Parsing data jabatans dari JSON string, cek dulu apakah jabatans ada
  let parsedJabatans = [];
  if (jabatans) {
    try {
      parsedJabatans = JSON.parse(jabatans);
    } catch (error) {
      return res.status(400).json({ msg: "Data jabatans tidak valid" });
    }
  }

  let file_url = null;

  // Proses upload file jika ada
  if (req.file) {
    file_url = `uploads/lembaga/${req.file.filename}`;
  }

  // Cek administrator dari token
  const refreshToken = req.cookies.refreshToken;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).json({ msg: "Token tidak valid" });
  }

  const administrator = await prisma.administrator.findUnique({
    where: { id: decoded.administratorId },
  });

  if (!administrator || administrator.role !== "administrator") {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      // Simpan lembaga
      const lembaga = await prisma.lembaga.create({
        data: {
          nama,
          singkatan,
          dasar_hukum,
          alamat_kantor,
          file_url,
          createdbyId: administrator.id,
        },
      });

      // Simpan profil lembaga
      await prisma.profilLembaga.create({
        data: {
          lembagaId: lembaga.uuid,
          content: profil,
        },
      });

      // Simpan visi misi
      await prisma.visiMisi.create({
        data: {
          lembagaId: lembaga.uuid,
          content: visimisi,
        },
      });

      // Simpan tugas pokok
      await prisma.tugasPokok.create({
        data: {
          lembagaId: lembaga.uuid,
          content: tugaspokok,
        },
      });

      // Simpan jabatans dalam lembaga
      for (const jabatan of parsedJabatans) {
        try {
          await prisma.anggota.create({
            data: {
              lembagaDesaid: lembaga.uuid, // Menghubungkan langsung dengan UUID lembaga
              jabatan: jabatan.namaJabatan,
              demografiDesaid: jabatan.demografiId, // Menghubungkan langsung dengan UUID demografi
              createdById: administrator.id,
            },
          });
          console.log(
            `Berhasil menyimpan jabatan: ${jabatan.namaJabatan} dengan demografiId: ${jabatan.demografiId}`
          );
        } catch (error) {
          console.error(
            `Error saat menyimpan jabatan: ${jabatan.namaJabatan}`,
            error
          );
          // Kamu bisa menambahkan rollback jika salah satu penyimpanan jabatan gagal
          throw new Error(`Error menyimpan jabatan: ${jabatan.namaJabatan}`);
        }
      }

      return lembaga;
    });

    return res.status(201).json({
      message: "Lembaga created successfully!",
      lembaga: transaction,
    });
  } catch (error) {
    console.error("Error saat membuat lembaga:", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

//update lembaga
export const updateLembaga = async (req, res) => {
  const { uuid } = req.params;
  const file = req.file;
  const {
    nama,
    singkatan,
    dasar_hukum,
    alamat_kantor,
    profil,
    visimisi,
    tugaspokok,
    jabatans,
  } = req.body;

  // 1. Validasi awal
  let parsedJabatans = [];
  try {
    parsedJabatans = JSON.parse(jabatans || "[]");
    if (!Array.isArray(parsedJabatans)) throw new Error("Jabatans harus array");
  } catch (err) {
    return res.status(400).json({
      message: "Format jabatans tidak valid",
      error: err.message,
    });
  }

  try {
    // 2. Ambil lembaga
    const existingLembaga = await prisma.lembaga.findUnique({
      where: { uuid },
    });
    if (!existingLembaga) {
      return res.status(404).json({ message: "Lembaga tidak ditemukan" });
    }

    const createdById = existingLembaga.createdbyId;
    const oldFilePath =
      file && existingLembaga.file_url
        ? path.join(
            __dirname,
            "..",
            "uploads/lembaga",
            path.basename(existingLembaga.file_url)
          )
        : null;

    // 3. Update lembaga & konten saja dulu
    await prisma.$transaction(
      [
        prisma.lembaga.update({
          where: { uuid },
          data: {
            nama,
            singkatan,
            dasar_hukum,
            alamat_kantor,
            file_url: file
              ? `uploads/lembaga/${file.filename}`
              : existingLembaga.file_url,
          },
        }),
        profil &&
          prisma.profilLembaga.upsert({
            where: { lembagaId: uuid },
            update: { content: profil },
            create: { lembagaId: uuid, content: profil },
          }),
        visimisi &&
          prisma.visiMisi.upsert({
            where: { lembagaId: uuid },
            update: { content: visimisi },
            create: { lembagaId: uuid, content: visimisi },
          }),
        tugaspokok &&
          prisma.tugasPokok.upsert({
            where: { lembagaId: uuid },
            update: { content: tugaspokok },
            create: { lembagaId: uuid, content: tugaspokok },
          }),
      ].filter(Boolean)
    ); // Hilangkan null jika tidak ada konten

    // 4. Tangani anggota (di luar transaksi konten)
    const existingAnggota = await prisma.anggota.findMany({
      where: { lembagaDesaid: uuid },
    });
    const existingUuids = existingAnggota.map((a) => a.uuid);
    const incomingUuids = parsedJabatans.map((j) => j.uuid).filter(Boolean);

    // Hapus yang tidak dikirim ulang
    const toDelete = existingUuids.filter((id) => !incomingUuids.includes(id));
    if (toDelete.length > 0) {
      await prisma.anggota.deleteMany({
        where: { uuid: { in: toDelete } },
      });
    }

    // Upsert anggota baru/yang dikirim
    const upsertAnggota = parsedJabatans.map((j) => {
      const data = {
        lembagaDesaid: uuid,
        jabatan: j.namaJabatan,
        demografiDesaid: j.demografiId,
        createdById,
      };
      return j.uuid
        ? prisma.anggota.upsert({
            where: { uuid: j.uuid },
            update: data,
            create: data,
          })
        : prisma.anggota.create({ data });
    });
    await prisma.$transaction(upsertAnggota);

    // 5. Hapus file lama jika perlu
    if (oldFilePath) {
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn("Gagal hapus file lama:", err.message);
      }
    }

    res.status(200).json({
      message: "Lembaga berhasil diperbarui",
    });
  } catch (err) {
    console.error("Gagal memperbarui lembaga:", err);
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui lembaga",
      error: err.message,
    });
  }
};

export const deleteLembaga = async (req, res) => {
  const { uuid } = req.params;

  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    const admin = await prisma.administrator.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!admin || admin.role !== "administrator") {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    const existingLembaga = await prisma.Lembaga.findUnique({
      where: { uuid },
    });

    if (!existingLembaga) {
      return res.status(404).json({ msg: "Lembaga tidak ditemukan" });
    }

    // Define the path of the file to be deleted
    const filePathToDelete = path.join(
      __dirname,
      "..",
      "uploads/lembaga",
      path.basename(existingLembaga.file_url)
    );

    // Check if the file exists and delete it
    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
      console.log(`Successfully deleted file: ${filePathToDelete}`);
    }

    // Perform deletion of related records and Lembaga in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.ProfilLembaga.deleteMany({ where: { lembagaId: uuid } });
      await tx.VisiMisi.deleteMany({ where: { lembagaId: uuid } });
      await tx.TugasPokok.deleteMany({ where: { lembagaId: uuid } });
      await tx.Anggota.deleteMany({ where: { lembagaDesaid: uuid } });
      await tx.Lembaga.delete({ where: { uuid } });
    });

    res.status(200).json({ msg: "Lembaga dan data terkait berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus Lembaga:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
