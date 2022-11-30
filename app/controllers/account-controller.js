const fs = require("fs");
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("../utils/jwt");
const Account = db.accounts;

exports.getToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check input
    if (!(email && password)) {
      return res.status(400).send({ login_status: "failed", message: "Email dan password tidak boleh kosong!" });
    }
    // check account existence
    const account = await Account.findOne({ email });
    if (!(account && (await bcrypt.compare(password, account.password)))) {
      return res.status(400).send({ login_status: "failed", message: "Email atau password salah!" });
    }
    // create JWT
    const token = jwt.makeToken(account);
    // send response
    return res.status(200).send({
      login_status: "success",
      nama: account.nama,
      role: account.role,
      // profile: account.profile,
      profile: "",
      token,
    });
  } catch (err) {
    return res.status(500).send({ login_status: "failed", message: err });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // check request token
    validated = jwt.checkToken(req.body);
    if (!validated.id) {
      res.status(400).send({ verify_status: "failed", validated });
    } else {
      res.status(200).send({
        verify_status: "success",
        name: "JsonWebToken",
        message: "Token verified",
        id: validated.id,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ verify_status: "failed", message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, email, password, profile } = req.body;
    // check input
    if (!(nama && email && password)) {
      return res.status(400).send({ register_status: "failed", message: "Nama, email, dan password tidak boleh kosong!" });
    }
    // check old Account
    const oldAccount = await Account.findOne({ email });
    if (oldAccount) {
      return res.status(409).send({ register_status: "failed", message: "Email sudah digunakan!" });
    }
    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // create account
    const account = await Account.create({
      nama,
      email,
      password: encryptedPassword,
      profile,
    });
    return res.status(200).send({ register_status: "success" });
  } catch (err) {
    return res.status(500).send({ register_status: "failed", message: err });
  }
};

exports.getDetails = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ get_status: "failed", message: "id diperlukan!" });
  }
  try {
    const account = await Account.findById(id);
    return res.status(200).send({
      get_status: "success",
      nama: account.nama,
      email: account.email,
      role: account.role,
      profile: account.profile,
    });
  } catch (err) {
    return res.status(500).send({ get_status: "failed", message: err });
  }
};

exports.update = async (req, res) => {
  const { id, nama } = req.body;
  let newProfile;
  try {
    newProfile = req.body.profile;
  } catch (err) {}
  // check input
  if (!(id && nama)) {
    return res.status(400).send({ edit_status: "failed", message: "Input tidak cukup!" });
  }
  if (!newProfile) {
    newProfile = "";
  }
  try {
    // update
    const account = await Account.findByIdAndUpdate(id, { nama, profile: newProfile });
    // console.log(account);
    // send respond
    res.status(200).send({ edit_status: "success", message: "Edit data sukses" });
  } catch (err) {
    return res.status(500).send({ update_status: "failed", message: err });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send({ delete_status: "failed", message: "Input tidak cukup!" });
  } else {
    try {
      await Account.findByIdAndDelete(id);
      res.status(200).send({ delete_status: "success", message: "Hapus akun sukses" });
    } catch (err) {
      return res.status(500).send({ update_status: "failed", message: err });
    }
  }
};

exports.uploadImage = async (req, res) => {
  console.log(req.file);
  // res.header()
  res.status(200).send({
    upload_status: "success",
    message: "Upload file sukses",
    filename: req.file.filename,
  });
};

exports.deleteImage = async (req, res) => {
  console.log(req);
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).send({ delimg_status: "failed", message: "Input tidak cukup!" });
  }
  try {
    if (fs.existsSync(`images/profiles/${filename}`)) {
      fs.rmSync(`images/profiles/${filename}`);
    }
    res.status(200).send({ delimg_status: "success", message: "Hapus file sukses" });
  } catch (err) {
    return res.status(500).send({ delimg_status: "failed", message: err });
  }
};

exports.viewImage = async (req, res) => {
  const filename = req.params.profile;

  res.setHeader("Content-Type", "image/jpeg");
  try {
    if (fs.existsSync(`images/profiles/${filename}`)) {
      fs.createReadStream(`images/profiles/${filename}`).pipe(res);
    } else {
      return res.status(404).send({ read_status: "failed", message: "File tidak ditemukan" });
    }
  } catch (err) {
    return res.status(500).send({ read_status: "failed", message: err });
  }
};
