import express from "express";

import upload from "../middleware/fileUpload.js";
import uploadDemografi from "../middleware/fileUploadDemografi.js";
import uploadLembaga from "../middleware/fileUploadLembaga.js";
import { body, validationResult } from "express-validator";

import {
  getIndexDesaMembangunPengunjung,
  getIndexDesaMembangunAdmin,
  createIndexDesaMembangun,
  updateIndexDesaMembangun,
  deleteIndexDesaMembangun,
  getDesacantikpengunjung,
  getDesacantik,
  createDesacantik,
  getTentangpengunjung,
  getTentang,
  createTentang,
  getSejarahpengunjung,
  getSejarah,
  createSejarah,
  getVisimisipengunjung,
  getVisimisi,
  createVisimisi,
  getStrukturorganisasipengunjung,
  getStrukturorganisasi,
  createStrukturorganisasi,
  getLembagapengunjung,
  getLembaga,
  createLembaga,
  updateLembaga,
  deleteLembaga,
  getJabatanpengunjung,
  getJabatan,
  createJabatan,
  updateJabatan,
  updateKehadiran,
  deleteJabatan,
  getDemografipengunjung,
  getDemografiadmin,
  createDemografi,
  updateDemografi,
  deleteDemografi,
  getEducationOptions,
  getAgama,
  getBatasWilayahPengunjung,
  getBatasWilayahAdmin,
  createBatasWilayah,
  updateBatasWilayah,
  deleteBatasWilayah,
  getOrbitasiPengunjung,
  getOrbitasiAdmin,
  createOrbitasi,
  updateOrbitasi,
  deleteOrbitasi,
  getJenisLahanPengunjung,
  getJenisLahanAdmin,
  createJenisLahan,
  updateJenisLahan,
  deleteJenisLahan,
  getPotensiWisataPengunjung,
  getPotensiWisataAdmin,
  createPotensiWisata,
  updatePotensiWisata,
  deletePotensiWisata,
} from "../controllers/profileController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();
// Mendapatkan opsi pendidikan
router.get("/education-options", getEducationOptions);

// Mendapatkan opsi agama
router.get("/agama", getAgama);

//batas wilayah pengunjung
router.get("/indexdesamembangunpengunjung", getIndexDesaMembangunPengunjung);
//batas wilayah admin
router.get(
  "/indexdesamembangun",
  verifyToken,
  superOnly,
  getIndexDesaMembangunAdmin
);

// POST route for creating batas wilayah data
router.post(
  "/cindexdesamembangun",
  verifyToken,
  superOnly,
  createIndexDesaMembangun
);
router.patch(
  "/indexdesamembangun/:uuid",
  verifyToken,
  superOnly,
  updateIndexDesaMembangun
);
router.delete(
  "/indexdesamembangun/:uuid",
  verifyToken,
  superOnly,
  deleteIndexDesaMembangun
);

router.get("/desacantikpengunjung", getDesacantikpengunjung);
router.get("/desacantik", verifyToken, superOnly, getDesacantik);
router.post(
  "/cdesacantik",
  verifyToken,
  superOnly,
  upload.single("file"),
  createDesacantik
);

router.get("/tentangpengunjung", getTentangpengunjung);
router.get("/tentang", verifyToken, superOnly, getTentang);
router.post(
  "/ctentang",
  verifyToken,
  superOnly,
  upload.single("file"),
  createTentang
);

router.get("/sejarahpengunjung", getSejarahpengunjung);
router.get("/sejarah", verifyToken, superOnly, getSejarah);
router.post(
  "/csejarah",
  verifyToken,
  superOnly,
  upload.single("file"),
  createSejarah
);
router.get("/visimisipengunjung", getVisimisipengunjung);
router.get("/visimisi", verifyToken, superOnly, getVisimisi);
router.post(
  "/cvisimisi",
  verifyToken,
  superOnly,
  upload.single("file"),
  createVisimisi
);
router.get("/strukturorganisasipengunjung", getStrukturorganisasipengunjung);
router.get(
  "/strukturorganisasi",
  verifyToken,
  superOnly,
  getStrukturorganisasi
);
router.post(
  "/cstrukturorganisasi",
  verifyToken,
  superOnly,
  upload.single("file"),
  createStrukturorganisasi
);
router.get("/lembagapengunjung", getLembagapengunjung);
router.get("/lembaga", verifyToken, superOnly, getLembaga);
router.post(
  "/clembaga",
  verifyToken,
  superOnly,
  uploadLembaga.single("file"),
  createLembaga
);
router.put(
  "/ulembaga/:uuid",
  verifyToken,
  superOnly,
  uploadLembaga.single("file"),
  updateLembaga
);
router.delete("/lembaga/:uuid", verifyToken, superOnly, deleteLembaga);

router.get("/demografipengunjung", getDemografipengunjung);
router.get("/demografi", verifyToken, superOnly, getDemografiadmin);
const demographicValidationRules = [
  body("nik")
    .isLength({ min: 16, max: 16 })
    .withMessage("NIK harus 16 karakter"),
  body("name").notEmpty().withMessage("Nama harus diisi"),
  body("gender")
    .isIn(["Laki-Laki", "Perempuan"])
    .withMessage("Gender harus 'Laki-Laki' atau 'Perempuan'"),
  body("birth_date")
    .isISO8601()
    .withMessage("Tanggal lahir harus dalam format YYYY-MM-DD"),
  body("marital_status")
    .isIn([
      "Kawin Tercatat",
      "Kawin Tidak Tercatat",
      "Cerai Hidup",
      "Cerai Mati",
      "Belum Kawin",
    ])
    .withMessage(
      "Status pernikahan harus 'Kawin Tercatat' atau 'Kawin Tidak Tercatat' atau 'Cerai Hidup' atau 'Cerai Mati' atau 'Belum Kawin'"
    ),
  body("education_id").isInt().withMessage("ID pendidikan harus berupa angka"),
  body("job").optional().isString().withMessage("Pekerjaan harus berupa teks"),
  body("rt").optional().isInt().withMessage("RT harus berupa angka"),
  body("rw").optional().isInt().withMessage("RW harus berupa angka"),
  body("hamlet").optional().isString().withMessage("Dusun harus berupa teks"),
  body("religion_id").isInt().withMessage("ID agama harus berupa angka"),
];

// Middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  next();
};

// POST route for creating demographic data
router.post(
  "/cdemografi",
  verifyToken,
  superOnly,
  uploadDemografi.single("file"),
  demographicValidationRules,
  handleValidationErrors,
  createDemografi
);

// PUT route for updating demographic data
router.put(
  "/demografi/:nik",
  verifyToken,
  superOnly,
  uploadDemografi.single("file"),
  demographicValidationRules,
  handleValidationErrors,
  updateDemografi
);

// Route to delete a demographic record
router.delete("/demografi/:nik", verifyToken, superOnly, deleteDemografi);

//batas wilayah pengunjung
router.get("/batawilayahpengunjung", getBatasWilayahPengunjung);
//batas wilayah admin
router.get("/bataswilayah", verifyToken, superOnly, getBatasWilayahAdmin);

// POST route for creating batas wilayah data
router.post("/cbataswilayah", verifyToken, superOnly, createBatasWilayah);
router.patch("/bataswilayah/:uuid", verifyToken, superOnly, updateBatasWilayah);
router.delete(
  "/bataswilayah/:uuid",
  verifyToken,
  superOnly,
  deleteBatasWilayah
);

//orbitasi
//orbitasi pengunjung
router.get("/orbitasipengunjung", getOrbitasiPengunjung);
//orbitasi admin
router.get("/orbitasi", verifyToken, superOnly, getOrbitasiAdmin);

// POST route for creating orbitasi data
router.post("/corbitasi", verifyToken, superOnly, createOrbitasi);
router.patch("/orbitasi/:uuid", verifyToken, superOnly, updateOrbitasi);
router.delete("/orbitasi/:uuid", verifyToken, superOnly, deleteOrbitasi);

//jenislahan
//jenislahan pengunjung
router.get("/jenislahanpengunjung", getJenisLahanPengunjung);
//jenislahan admin
router.get("/jenislahan", verifyToken, superOnly, getJenisLahanAdmin);
// POST route for creating JenisLahan data
router.post("/cjenislahan", verifyToken, superOnly, createJenisLahan);
router.patch("/jenislahan/:uuid", verifyToken, superOnly, updateJenisLahan);
router.delete("/jenislahan/:uuid", verifyToken, superOnly, deleteJenisLahan);

//potensiwisata
//potensiwisata pengunjung
router.get("/potensiwisatapengunjung", getPotensiWisataPengunjung);
//potensiwisata admin
router.get("/potensiwisata", verifyToken, superOnly, getPotensiWisataAdmin);
// POST route for creating potensiwisata data
router.post("/cpotensiwisata", verifyToken, superOnly, createPotensiWisata);
router.patch(
  "/potensiwisata/:uuid",
  verifyToken,
  superOnly,
  updatePotensiWisata
);
router.delete(
  "/potensiwisata/:uuid",
  verifyToken,
  superOnly,
  deletePotensiWisata
);

router.get("/jabatanpengunjung", getJabatanpengunjung);
router.get("/jabatan", verifyToken, superOnly, getJabatan);
router.post("/cjabatan", verifyToken, superOnly, createJabatan);
router.put("/ujabatan/:uuid", verifyToken, superOnly, updateJabatan);
router.put("/ujabatanhadir/:uuid", verifyToken, superOnly, updateKehadiran);
router.delete("/jabatan/:uuid", verifyToken, superOnly, deleteJabatan);

export default router;
