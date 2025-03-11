import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  try {
    if (!req.cookies.refreshToken)
      return res.status(401).json({ msg: "Silakan login kembali" });

    const refreshToken = req.cookies.refreshToken;
    const administrator = await prisma.administrator.findUnique({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (administrator) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) return res.status(403).json({ msg: "Token tidak valid" });

          const { uuid: administratorId, name, username, role } = administrator;
          const accessToken = jwt.sign(
            { administratorId, name, username, role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15s" }
          );
          return res.json({ accessToken });
        }
      );
    } else {
      const user = await prisma.user.findUnique({
        where: {
          refresh_token: refreshToken,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) return res.status(403).json({ msg: "Token tidak valid" });

          const { id: userId, name, username, role } = user;
          const accessToken = jwt.sign(
            { userId, name, username, role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15s" }
          );
          return res.json({ accessToken });
        }
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};
