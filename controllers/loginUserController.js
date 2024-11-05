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
    // Cek terlebih dahulu di tabel Administrator
    const administrator = await prisma.administrator.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (administrator) {
      const match = await bcrypt.compare(
        req.body.password,
        administrator.password
      );
      if (!match) return res.status(400).json({ msg: "Invalid password" });

      const administratorId = administrator.id;
      const name = administrator.name;
      const username = administrator.username;
      const role = administrator.role;

      const accessToken = jwt.sign(
        { administratorId, name, username, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      const refreshToken = jwt.sign(
        { administratorId, name, username, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await prisma.administrator.update({
        where: { id: administratorId },
        data: { refresh_token: refreshToken },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true, // Untuk HTTPS
      });

      return res.json({ accessToken });
    }

    // Jika tidak ditemukan di tabel Administrator, cek di tabel User
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    // Jika user tidak ditemukan, kirim pesan error
    if (!user) {
      return res.status(404).json({ msg: "Username tidak ditemukan" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });

    const userId = user.uuid;
    const name = user.name;
    const username = user.username;
    const role = user.role;

    const accessToken = jwt.sign(
      { userId, name, username, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
      { userId, name, username, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await prisma.user.update({
      where: { uuid: userId },
      data: { refresh_token: refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, // Untuk HTTPS
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
