const fs = require("fs");
const timeOffset = require("get-timezone-offset");
const db = require("../models");
const Car = db.cars;

exports.create = async (req, res) => {
  const { nama, tahun, seat, gear, color, price, image } = req.body;
  if (!(nama && tahun && seat && gear && color && price && image)) {
    return res.status(400).send({ create_status: "failed", message: "Input tidak cukup!" });
  }
  const gearLowered = gear.toLowerCase();
  const colorLowered = color.toLowerCase();
  try {
    Car.create({
      nama,
      tahun,
      seat,
      gear: gearLowered,
      color: colorLowered,
      price,
      image,
    });
    return res.status(200).send({ create_status: "success", message: "Berhasil menambah mobil!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ create_status: "failed", message: "Gagal menambah mobil!" });
  }
};

exports.update = async (req, res) => {
  const { id, nama, tahun, seat, gear, color, price, image } = req.body;
  if (!(id && nama && tahun && seat && gear && color && price && image)) {
    return res.status(400).send({ update_status: "failed", message: "Input tidak cukup!" });
  }
  const gearLowered = gear.toLowerCase();
  const colorLowered = color.toLowerCase();
  try {
    await Car.findByIdAndUpdate(id, { nama, tahun, seat, gear: gearLowered, color: colorLowered, price, image });
    return res.status(200).send({ update_status: "success", message: "Input tidak cukup!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ update_status: "failed", message: "Gagal mengedit mobil!" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send({ delete_status: "failed", message: "Input tidak cukup!" });
  } else {
    try {
      await Car.findByIdAndDelete(id);
      res.status(200).send({ delete_status: "success", message: "Hapus mobil sukses" });
    } catch (err) {
      return res.status(500).send({ delete_status: "failed", message: err });
    }
  }
};

exports.readAll = async (req, res) => {
  try {
    const carsRaw = await Car.find();
    if (!carsRaw) {
      return res.status(404).send({ read_status: "failed", message: "Tidak ada mobil" });
    }
    let cars = [];
    carsRaw.forEach((carRaw) => {
      const car = {};
      car.id = carRaw.id;
      car.nama = carRaw.nama;
      car.tahun = carRaw.tahun;
      car.seat = carRaw.seat;
      car.gear = carRaw.gear;
      car.color = carRaw.color;
      car.price = carRaw.price;
      car.image = carRaw.image;
      car.status = carRaw.status;
      cars.push(car);
    });
    // console.log(cars);
    return res.status(200).send({ read_status: "success", cars });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ read_status: "failed", message: "Gagal mendapatkan data mobil" });
  }
};

exports.readOne = async (req, res) => {
  let id;
  try {
    id = req.params.id;
    if (!id || id == "") {
      return res.status(400).send({ read_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const carRaw = await Car.findById(id);
    if (!carRaw) {
      return res.status(404).send({ read_status: "failed", message: "Mobil tidak ditemukan" });
    }
    const car = {};
    car.id = carRaw.id;
    car.nama = carRaw.nama;
    car.tahun = carRaw.tahun;
    car.seat = carRaw.seat;
    car.gear = carRaw.gear;
    car.color = carRaw.color;
    car.price = carRaw.price;
    car.image = carRaw.image;
    car.status = carRaw.status;
    // console.log(car);
    return res.status(200).send({ read_status: "success", car });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ read_status: "failed", message: "Gagal mendapatkan data mobil" });
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
    if (fs.existsSync(`images/cars/${filename}`)) {
      fs.rmSync(`images/cars/${filename}`);
    }
    res.status(200).send({ delimg_status: "success", message: "Hapus file sukses" });
  } catch (err) {
    return res.status(500).send({ delimg_status: "failed", message: err });
  }
};

exports.viewImage = async (req, res) => {
  const filename = req.params.image;

  res.setHeader("Content-Type", "image/jpeg");
  try {
    if (fs.existsSync(`images/cars/${filename}`)) {
      fs.createReadStream(`images/cars/${filename}`).pipe(res);
    } else {
      return res.status(404).send({ read_status: "failed", message: "File tidak ditemukan" });
    }
  } catch (err) {
    return res.status(500).send({ read_status: "failed", message: err });
  }
};
