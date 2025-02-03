import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ msg: "Silakan login kembali" });

    const user =
      (await prisma.administrator.findFirst({
        where: { refresh_token: refreshToken },
      })) ||
      (await prisma.user.findFirst({
        where: { refresh_token: refreshToken },
      }));

    if (!user)
      return res
        .status(403)
        .json({ msg: "Token tidak valid atau sudah logout" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          await prisma.administrator.updateMany({
            where: { refresh_token: refreshToken },
            data: { refresh_token: null },
          });
          await prisma.user.updateMany({
            where: { refresh_token: refreshToken },
            data: { refresh_token: null },
          });
          return res
            .status(403)
            .json({ msg: "Token tidak valid, silakan login ulang" });
        }

        const payload = {
          id: user.id || user.uuid,
          name: user.name,
          username: user.username,
          role: user.role,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });

        return res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};
