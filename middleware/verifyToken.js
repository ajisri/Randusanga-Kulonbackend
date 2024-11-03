import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.id = decoded.id;
    req.uuid = decoded.uuid;
    req.name = decoded.name;
    req.username = decoded.username;
    req.email = decoded.email;
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
  next();
};
