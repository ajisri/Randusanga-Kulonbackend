import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "Token tidak tersedia, silakan login" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token kedaluwarsa" });
      }
      return res.status(403).json({ msg: "Token tidak valid" });
    }
    req.id = decoded.id;
    req.name = decoded.name;
    req.username = decoded.username;
    req.role = decoded.role;
    next();
  });
};

export const superOnly = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const administrator = await prisma.administrator.findUnique({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!administrator) return res.status(403).json({ msg: "no access" });
  if (req.role !== "superadmin")
    return res.status(403).json({ msg: "Akses ditolak" });
  next();
};
