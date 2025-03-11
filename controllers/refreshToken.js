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
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(403).json({ msg: "Token tidak valid" });
    }

    // Hapus dan perbarui refresh token
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

    await prisma[
      currentUser.role === "admin" ? "administrator" : "user"
    ].update({
      where: { id: currentUser.id },
      data: { refresh_token: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

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
    return res.status(500).json({ msg: "Terjadi kesalahan server anjing" });
  }
};
