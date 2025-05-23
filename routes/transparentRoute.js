import express from "express";
import uploadProdukHukum from "../middleware/fileUploadProdukHukum.js";
import uploadApbd from "../middleware/fileUploadApbd.js";
import uploadBudget from "../middleware/fileUploadBudget.js";

import {
  getProdukHukumPengunjung,
  downloadFile,
  getProdukHukumAdmin,
  createProdukHukum,
  updateProdukHukum,
  deleteProdukHukum,
  getPoinSubkategoriAnkorBySubKategoriAnkorId,
  createPoinsubkategoriankor,
  getSubkategoriAnkorByKategoriAnkorId,
  createSubkategoriAnkor,
  getSubkategoriAnkorAdmin,
  updateSubkategoriAnkor,
  deleteSubkategoriAnkor,
  getKategoriAnkorAdmin,
  createKategoriAnkor,
  updateKategoriAnkor,
  deleteKategoriAnkor,
  getAllDataAnkor,
  getAnkorAdmin,
  createAnkor,
  updateAnkor,
  deleteAnkor,
  getApbdPengunjung,
  downloadFileApbd,
  getApbdAdmin,
  getAllApbd,
  getAllDataApbd,
  createApbd,
  updateApbd,
  deleteApbd,
  createKeuangan,
  getAllKeuangan,
  updateKeuangan,
  deleteKeuangan,
  createKategori,
  getAllKategori,
  updateKategori,
  deleteKategori,
  createSubkategori,
  getSubkategoriAdmin,
  getSubkategoriByKategoriId,
  updateSubkategori,
  deleteSubkategori,
  createBudgetItem,
  getBudgetBySubkategoriId,
  getAllBudgetItems,
  updateBudgetItem,
  deleteBudgetItem,
} from "../controllers/transparentController.js";
import { verifyToken, superOnly } from "../middleware/verifyToken.js";

const router = express.Router();

//Ankor
router.get("/ankorp", getAllDataAnkor);
router.get("/ankor", verifyToken, superOnly, getAnkorAdmin);
router.post("/cankor", verifyToken, superOnly, createAnkor);
router.patch("/ankor/:id", verifyToken, superOnly, updateAnkor);
router.delete("/ankor/:id", verifyToken, superOnly, deleteAnkor);

//Kategori Ankor
router.get("/kategoriankor", verifyToken, superOnly, getKategoriAnkorAdmin);
router.post("/ckategoriankor", verifyToken, superOnly, createKategoriAnkor);
router.patch(
  "/kategoriankor/:uuid",
  verifyToken,
  superOnly,
  updateKategoriAnkor
);
router.delete(
  "/kategoriankor/:uuid",
  verifyToken,
  superOnly,
  deleteKategoriAnkor
);

//subkategori ankor
router.get(
  "/subkategoriankor",
  verifyToken,
  superOnly,
  getSubkategoriAnkorAdmin
);
router.get(
  "/subkategoriankorbykategoriankor/:kategoriankorId",
  verifyToken,
  superOnly,
  getSubkategoriAnkorByKategoriAnkorId
);
router.post(
  "/csubkategoriankor",
  verifyToken,
  superOnly,
  createSubkategoriAnkor
);

router.patch(
  "/subkategoriankor/:uuid",
  verifyToken,
  superOnly,
  updateSubkategoriAnkor
);
router.delete(
  "/subkategoriankor/:uuid",
  verifyToken,
  superOnly,
  deleteSubkategoriAnkor
);

//Poinsubkategori
router.get(
  "/poinbysubkategoriankor/:subkategoriankorId",
  verifyToken,
  superOnly,
  getPoinSubkategoriAnkorBySubKategoriAnkorId
);

router.post(
  "/cpoinsubkategoriankor",
  verifyToken,
  superOnly,
  createPoinsubkategoriankor
);

//pengunjung produk hukum
router.get("/produk_hukump", getProdukHukumPengunjung);
router.get("/download/:filename", downloadFile);

//admin
router.get("/produk_hukum", verifyToken, superOnly, getProdukHukumAdmin);
router.post(
  "/cprodukhukum",
  verifyToken,
  superOnly,
  uploadProdukHukum.single("file"),
  createProdukHukum
);
router.patch(
  "/produk_hukum/:uuid",
  verifyToken,
  superOnly,
  uploadProdukHukum.single("file"),
  updateProdukHukum
);
router.delete("/produk_hukum/:uuid", verifyToken, superOnly, deleteProdukHukum);

//apbd
//pengunjung
router.get("/apbdp", getApbdPengunjung);
router.get("/allapbdp", getAllDataApbd);
router.get("/downloadapbd/:filename", downloadFileApbd);

//admin
router.get("/apbd", verifyToken, superOnly, getApbdAdmin);
router.get("/allapbd", verifyToken, superOnly, getAllApbd);
router.post(
  "/capbd",
  verifyToken,
  superOnly,
  uploadApbd.single("file"),
  createApbd
);
router.patch(
  "/apbd/:id",
  verifyToken,
  superOnly,
  uploadApbd.single("file"),
  updateApbd
);
router.delete("/apbd/:id", verifyToken, superOnly, deleteApbd);

//keuangan
router.get("/keuangan", verifyToken, superOnly, getAllKeuangan);
router.post("/ckeuangan", verifyToken, superOnly, createKeuangan);
router.patch("/keuangan/:uuid", verifyToken, superOnly, updateKeuangan);
router.delete("/keuangan/:uuid", verifyToken, superOnly, deleteKeuangan);

// Rute Kategori
router.get("/kategori", verifyToken, superOnly, getAllKategori);
router.post("/ckategori", verifyToken, superOnly, createKategori);
router.patch("/kategori/:uuid", verifyToken, superOnly, updateKategori);
router.delete("/kategori/:uuid", verifyToken, superOnly, deleteKategori);

// Rute Subkategori
router.get("/subkategori", verifyToken, superOnly, getSubkategoriAdmin);
router.get(
  "/subkategoribykategori/:kategoriId",
  verifyToken,
  superOnly,
  getSubkategoriByKategoriId
);
router.post("/csubkategori", verifyToken, superOnly, createSubkategori);
router.patch("/subkategori/:uuid", verifyToken, superOnly, updateSubkategori);
router.delete("/subkategori/:uuid", verifyToken, superOnly, deleteSubkategori);

// Rute BudgetItem
router.get(
  "/budget-items",
  verifyToken,
  superOnly,
  uploadBudget.single("file"),
  getAllBudgetItems
);
router.get(
  "/budgetbysubkategori/:subkategoriId",
  verifyToken,
  superOnly,
  uploadBudget.single("file"),
  getBudgetBySubkategoriId
);
router.post("/cbudget-item", verifyToken, superOnly, createBudgetItem);
router.patch("/budget-item/:uuid", verifyToken, superOnly, updateBudgetItem);
router.delete("/budget-item/:uuid", verifyToken, superOnly, deleteBudgetItem);

export default router;
