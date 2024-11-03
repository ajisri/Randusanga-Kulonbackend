import express from "express";

import upload from "../middleware/fileUpload.js";

import {
  getAktakelahiranpengunjung,
  getAktakelahiran,
  createAktakelahiran,
  getKartukeluargapengunjung,
  getKartukeluarga,
  createKartukeluarga,
  getKartutandapendudukpengunjung,
  getKartutandapenduduk,
  createKartutandapenduduk,
  getPendaftarannikahpengunjung,
  getPendaftarannikah,
  createPendaftarannikah,
  getAktifasibpjspengunjung,
  getAktifasibpjs,
  createAktifasibpjs,
  getPembuatansktmpengunjung,
  getPembuatansktm,
  createPembuatansktm,
} from "../controllers/serviceController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();

//akta
router.get("/aktakelahiranpengunjung", getAktakelahiranpengunjung);
router.get("/aktakelahiran", verifyToken, superOnly, getAktakelahiran);
router.post(
  "/caktakelahiran",
  verifyToken,
  superOnly,
  upload.single("file"),
  createAktakelahiran
);
//kk
router.get("/kartukeluargapengunjung", getKartukeluargapengunjung);
router.get("/kartukeluarga", verifyToken, superOnly, getKartukeluarga);
router.post(
  "/ckartukeluarga",
  verifyToken,
  superOnly,
  upload.single("file"),
  createKartukeluarga
);
//ktp
router.get("/kartutandapendudukpengunjung", getKartutandapendudukpengunjung);
router.get(
  "/kartutandapenduduk",
  verifyToken,
  superOnly,
  getKartutandapenduduk
);
router.post(
  "/ckartutandapenduduk",
  verifyToken,
  superOnly,
  upload.single("file"),
  createKartutandapenduduk
);
//pendaftaran nikah
router.get("/pendaftarannikahpengunjung", getPendaftarannikahpengunjung);
router.get("/pendaftarannikah", verifyToken, superOnly, getPendaftarannikah);
router.post(
  "/cpendaftarannikah",
  verifyToken,
  superOnly,
  upload.single("file"),
  createPendaftarannikah
);
//aktifasi bpjs
router.get("/aktifasibpjspengunjung", getAktifasibpjspengunjung);
router.get("/aktifasibpjs", verifyToken, superOnly, getAktifasibpjs);
router.post(
  "/caktifasibpjs",
  verifyToken,
  superOnly,
  upload.single("file"),
  createAktifasibpjs
);
//pembuatan sktm
router.get("/pembuatansktmpengunjung", getPembuatansktmpengunjung);
router.get("/pembuatansktm", verifyToken, superOnly, getPembuatansktm);
router.post(
  "/cpembuatansktm",
  verifyToken,
  superOnly,
  upload.single("file"),
  createPembuatansktm
);

export default router;
