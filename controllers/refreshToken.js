import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Silakan login kembali" });
    }

    // Cari pengguna berdasarkan refreshToken
    const administrator = await prisma.administrator.findFirst({
      where: { refresh_token: refreshToken },
    });

    const user = !administrator
      ? await prisma.user.findFirst({
          where: { refresh_token: refreshToken },
        })
      : null;

    if (!administrator && !user) {
      return res.status(403).json({ msg: "Refresh token tidak valid" });
    }

    const currentUser = administrator || user;

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ msg: "Token tidak valid" });
    }

    // Generate refresh token baru
    const newRefreshToken = jwt.sign(
      {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        role: currentUser.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Gunakan transaksi database untuk menghapus lalu memperbarui token
    await prisma.$transaction([
      prisma[
        currentUser.role === "administrator" ? "administrator" : "user"
      ].update({
        where: { id: currentUser.id },
        data: { refresh_token: null },
      }),
      prisma[
        currentUser.role === "administrator" ? "administrator" : "user"
      ].update({
        where: { id: currentUser.id },
        data: { refresh_token: newRefreshToken },
      }),
    ]);

    // Simpan refresh token baru di cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    // Buat access token baru
    const accessToken = jwt.sign(
      {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        role: currentUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};
