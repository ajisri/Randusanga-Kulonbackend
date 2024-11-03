import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//aktakelahiran admin
export const getAktakelahiran = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'aktakelahiran'
    const services = await prisma.service.findMany({
      where: {
        pname: "aktakelahiran",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'aktakelahiran'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Akta Kelahiran",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "aktakelahiran",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "aktakelahiran",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan akta kelahiran:", error);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createAktakelahiran = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, aktakelahiranContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: aktakelahiranContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: aktakelahiranContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//aktakelahiran pengunjung
export const getAktakelahiranpengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "aktakelahiran",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Akta Kelahiran",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "aktakelahiran",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan akta kelahiran:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//kartukeluarga admin
export const getKartukeluarga = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'aktakelahiran'
    const services = await prisma.service.findMany({
      where: {
        pname: "kartukeluarga",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'kartukeluarga'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Kartu Keluarga",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "kartukeluarga",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "kartukeluarga",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan akta kelahiran:", error);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createKartukeluarga = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, kartukeluargaContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: kartukeluargaContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: kartukeluargaContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//kartukeluarga pengunjung
export const getKartukeluargapengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "kartukeluarga",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Akta Kartu Keluarga",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "kartukeluarga",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan kartukeluarga:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//kartutandapenduduk admin
export const getKartutandapenduduk = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'aktakelahiran'
    const services = await prisma.service.findMany({
      where: {
        pname: "kartutandapenduduk",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'kartutandapenduduk'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Kartu Tanda Penduduk",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "kartutandapenduduk",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "kartutandapenduduk",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error(
      "Error saat mengambil data layanan kartu tanda penduduk:",
      error
    );
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createKartutandapenduduk = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, kartutandapendudukContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: kartutandapendudukContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: kartutandapendudukContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//kartutandapenduduk pengunjung
export const getKartutandapendudukpengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "kartutandapenduduk",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Kartu Tanda Penduduk",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "kartutandapenduduk",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error(
      "Error saat mengambil data layanan kartu tanda penduduk:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//pendaftarannikah admin
export const getPendaftarannikah = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'aktakelahiran'
    const services = await prisma.service.findMany({
      where: {
        pname: "pendaftarannikah",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'pendaftarannikah'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Pendaftaran Nikah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "pendaftarannikah",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "pendaftarannikah",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error(
      "Error saat mengambil data layanan pendaftaran nikah:",
      error
    );
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createPendaftarannikah = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, pendaftarannikahContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: pendaftarannikahContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: pendaftarannikahContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//pendaftaran nikah pengunjung
export const getPendaftarannikahpengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "pendaftarannikah",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Pendaftaran Nikah",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "pendaftarannikah",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error(
      "Error saat mengambil data layanan kartu tanda penduduk:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//aktifasibpjs admin
export const getAktifasibpjs = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'aktifasibpjs'
    const services = await prisma.service.findMany({
      where: {
        pname: "aktifasibpjs",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'aktifasibpjs'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Aktifasi BPJS",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "aktifasibpjs",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "aktifasibpjs",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan aktifasi bpjs:", error);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createAktifasibpjs = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, aktifasibpjsContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: aktifasibpjsContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: aktifasibpjsContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//aktifasi bpjs pengunjung
export const getAktifasibpjspengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "aktifasibpjs",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul AKtifasi BPJS",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "aktifasibpjs",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error(
      "Error saat mengambil data layanan kartu tanda penduduk:",
      error
    );
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

//pembuatansktm admin
export const getPembuatansktm = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

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

    // Mengambil data service dengan pname 'pembuatansktm'
    const services = await prisma.service.findMany({
      where: {
        pname: "pembuatansktm",
      },
    });

    if (!services || services.length === 0) {
      console.log("No service found for 'pembuatansktm'");

      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Pembuatan SKTM",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "pembuatansktm",
        },
      });
    }

    // Kirimkan data dengan menggunakan map untuk memastikan struktur data
    const serviceData = services.map((service) => ({
      uuid: service.uuid || "",
      title: service.title || "Judul Service",
      content: service.content || "",
      file_url: service.file_url || "",
      status: service.status || "DRAFT",
      pname: service.pname || "pembuatansktm",
    }))[0]; // Mengambil elemen pertama jika data array

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan aktifasi bpjs:", error);
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const createPembuatansktm = async (req, res) => {
  console.log("Uploaded File:", req.file);
  const { title, pembuatansktmContent, status, pname } = req.body;
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
      // Cek apakah service dengan pname sudah ada
      const existingService = await tx.service.findFirst({
        where: { pname: pname },
      });

      if (existingService) {
        let filePathToDelete = null;

        // Jika ada file baru, tentukan path file lama untuk dihapus
        if (file) {
          if (existingService.file_url) {
            filePathToDelete = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(existingService.file_url)
            );
          }
        }

        // Update service jika sudah ada
        const updatedService = await tx.service.update({
          where: { uuid: existingService.uuid },
          data: {
            title,
            content: pembuatansktmContent,
            file_url: file
              ? `/uploads/${file.filename}`
              : existingService.file_url, // Update file URL jika ada file baru
            status,
            updated_at: new Date(), // Update waktu
          },
        });

        // Hapus file lama jika ada file baru dan file lama ditemukan
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
          console.log(`Successfully deleted old file: ${filePathToDelete}`);
        }

        return { type: "update", service: updatedService };
      } else {
        // Create service jika belum ada
        const newService = await tx.service.create({
          data: {
            title,
            content: pembuatansktmContent,
            file_url: file ? `/uploads/${file.filename}` : null, // Simpan URL file dengan path yang benar
            pname: pname,
            status,
            created_by: String(administrator.id),
          },
        });
        return { type: "create", service: newService };
      }
    });

    // Mengirimkan response sesuai hasil transaksi
    if (result.type === "update") {
      res
        .status(200)
        .json({ msg: "Service updated successfully", service: result.service });
    } else {
      res
        .status(201)
        .json({ msg: "Service created successfully", service: result.service });
    }
  } catch (error) {
    console.error("Error:", error.message); // Log error untuk debugging
    res.status(500).json({ msg: error.message });
  }
};

//pembuatan sktm pengunjung
export const getPembuatansktmpengunjung = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        pname: "pembuatansktm",
        status: "PUBLISH",
      },
    });

    if (services.length === 0) {
      return res.status(200).json({
        service: {
          uuid: "",
          title: "Judul Pembuatan SKTM",
          content: "",
          file_url: "",
          status: "DRAFT",
          pname: "pembuatansktm",
        },
      });
    }

    const serviceData = services[0]; // Ambil elemen pertama dari array jika data ada

    res.status(200).json({ service: serviceData });
  } catch (error) {
    console.error("Error saat mengambil data layanan pembuatan sktm:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
