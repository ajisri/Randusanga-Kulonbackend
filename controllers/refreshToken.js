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

    if (!administrator)
      return res.status(403).json({ msg: "Token tidak valid" });

    if (administrator) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.status(403).json({ msg: "Token tidak valid" });

          // Hapus refresh token lama dari database sebelum membuat yang baru
          await prisma.administrator.update({
            where: { id: administrator.id },
            data: { refresh_token: null },
          });

          const newRefreshToken = jwt.sign(
            {
              administratorId: administrator.id,
              name: administrator.name,
              administratorname: administrator.username,
              role: administrator.role,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          // Simpan refresh token baru ke database
          await prisma.administrator.update({
            where: { id: administrator.id },
            data: { refresh_token: newRefreshToken },
          });

          // Set cookie baru untuk refresh token
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });

          const administratorId = administrator.id;
          const name = administrator.name;
          const username = administrator.username;
          const role = administrator.role;
          const accessToken = jwt.sign(
            { administratorId, name, username, role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
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

          const userId = user.id;
          const name = user.name;
          const username = user.username;
          const role = user.role;
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
