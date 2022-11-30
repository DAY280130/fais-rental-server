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
    return res.status(500).send({ create_status: "failed", message: err });
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
