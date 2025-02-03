import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const Register = async (req, res) => {
  const { name, username, email, password, confpassword, role } = req.body;
  if (name == "") return res.status(404).json({ msg: "name is empty" });
  if (username == "") return res.status(404).json({ msg: "username is empty" });
  if (email == "") return res.status(404).json({ msg: "email is empty" });
  if (password == "") return res.status(404).json({ msg: "password is empty" });
  if (password !== confpassword)
    return res
      .status(400)
      .json({ msg: "Password dan ConsfPassword tidak cocok" });

  const datausername = await prisma.administrator.findFirst({
    where: {
      username: req.body.username,
    },
  });
  if (datausername) return res.status(404).json({ msg: "username does exist" });

  const dataemail = await prisma.administrator.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (dataemail) return res.status(404).json({ msg: "email does exist" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const administrator = await prisma.administrator.create({
      data: {
        name: name,
        username: username,
        email: email,
        password: hashPassword,
        role: role,
      },
    });
    res.json({ msg: "Register berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const administrator = await prisma.administrator.findFirst({
      where: { username: req.body.username },
    });

    if (administrator) {
      const match = await bcrypt.compare(
        req.body.password,
        administrator.password
      );
      if (!match) return res.status(400).json({ msg: "Invalid password" });

      // Revoke refresh token lama
      await prisma.administrator.update({
        where: { id: administrator.id },
        data: { refresh_token: null },
      });

      // Generate tokens
      const payload = {
        id: administrator.id,
        name: administrator.name,
        username: administrator.username,
        role: administrator.role,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "12h",
      });

      await prisma.administrator.update({
        where: { id: administrator.id },
        data: { refresh_token: refreshToken },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Hanya aktif di HTTPS
        sameSite: "Strict",
        maxAge: 12 * 60 * 60 * 1000, // 12 jam
      });

      return res.json({ accessToken });
    }

    // Cek di tabel User jika bukan administrator
    const user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });

    if (!user) return res.status(404).json({ msg: "Username tidak ditemukan" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });

    await prisma.user.update({
      where: { uuid: user.uuid },
      data: { refresh_token: null },
    });

    const payload = {
      id: user.uuid,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "12h",
    });

    await prisma.user.update({
      where: { uuid: user.uuid },
      data: { refresh_token: refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 12 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const administrator = await prisma.administrator.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!administrator) {
    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });
    const userId = user.uuid;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: null,
      },
    });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } else {
    const administratorid = administrator.id;
    await prisma.administrator.update({
      where: {
        id: administratorid,
      },
      data: {
        refresh_token: null,
      },
    });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  }
};
