import express from "express";
import uploadProdukHukum from "../middleware/fileUploadProdukHukum.js";
import uploadBudget from "../middleware/fileUploadBudget.js";

import {
  getProdukHukumPengunjung,
  downloadFile,
  getProdukHukumAdmin,
  createProdukHukum,
  updateProdukHukum,
  deleteProdukHukum,
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

//pengunjung
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
router.post("/cbudget-item", createBudgetItem);
router.patch("/budget-item/:uuid", updateBudgetItem);
router.delete("/budget-item/:uuid", deleteBudgetItem);

export default router;
