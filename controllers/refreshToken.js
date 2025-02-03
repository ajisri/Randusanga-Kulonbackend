import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ msg: "Silakan login kembali" });

    // Cari pengguna berdasarkan refreshToken
    const user = await prisma.user.findFirst({
      where: { refresh_token: refreshToken },
    });

    const administrator = await prisma.administrator.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!user && !administrator) {
      return res.status(403).json({ msg: "Refresh token tidak valid" });
    }

    // Verifikasi refreshToken
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).json({ msg: "Refresh token tidak valid" });

        const payload = user
          ? {
              userId: user.uuid,
              name: user.name,
              username: user.username,
              role: user.role,
            }
          : {
              administratorId: administrator.id,
              name: administrator.name,
              username: administrator.username,
              role: administrator.role,
            };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "5m",
        });
        return res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};
