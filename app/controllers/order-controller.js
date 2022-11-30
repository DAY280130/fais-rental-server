const db = require("../models");
const getTimeZoneOffset = require("get-timezone-offset");
const Order = db.orders;
const Account = db.accounts;
const Car = db.cars;

exports.create = async (req, res) => {
  const { car_id, renter_id, duration, price } = req.body;
  // cek input
  if (!(car_id && renter_id && duration && price)) {
    console.log(req.body);
    return res.status(400).send({ create_status: "failed", message: "Input tidak cukup!" });
  }
  // cek keberadaan penyewa
  let renter;
  try {
    renter = await Account.findById(renter_id);
    if (!renter) {
      return res.status(400).send({ create_status: "failed", message: "User tidak ditemukan!" });
    }
  } catch (err) {
    console.log(err);
  }
  // cek keberadaan mobil
  let car;
  try {
    car = await Car.findById(car_id);
    if (!car) {
      return res.status(400).send({ create_status: "failed", message: "Mobil tidak ditemukan!" });
    }
  } catch (err) {
    console.log(err);
  }
  // update status mobil
  await Car.findByIdAndUpdate(car_id, { status: "Tidak Tersedia" });
  // buat id order
  const order_id = renter.nama.split(" ")[0] + Date.now();
  try {
    await Order.create({
      order_id,
      car_id,
      renter_id,
      duration,
      price,
    });
    return res.status(200).send({ create_status: "success", message: "Berhasil membuat order!", order_id });
  } catch (err) {
    return res.status(500).send({ create_status: "failed", message: err });
  }
};

exports.readAll = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: "desc" });
    if (!orders) {
      return res.status(404).send({ read_status: "failed", message: "Pesanan kosong" });
    }
    return res.status(200).send({ read_status: "success", orders });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ read_status: "failed", message: "Gagal mendapatkan data pesanan" });
  }
};

exports.confirm = async (req, res) => {
  let order_id;
  try {
    order_id = req.body.order_id;
    if (!order_id || order_id == "") {
      return res.status(400).send({ update_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).send({ update_status: "failed", message: "Pesanan tidak ditemukan" });
    }
    const now_date = new Date(Date.now() + getTimeZoneOffset() * 60 * 1000).toISOString().split("T")[0];
    await Order.findOneAndUpdate({ order_id }, { confirmed_date: now_date, status: "confirmed" });
    return res.status(200).send({ update_status: "success", message: "Berhasil mengonfirmasi pesanan" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ update_status: "failed", message: "Gagal mengonfirmasi pesanan" });
  }
};

exports.reject = async (req, res) => {
  let order_id;
  try {
    order_id = req.body.order_id;
    if (!order_id || order_id == "") {
      return res.status(400).send({ update_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).send({ update_status: "failed", message: "Pesanan tidak ditemukan" });
    } else {
      await Car.findByIdAndUpdate(order.car_id, { status: "Tersedia" });
    }
    await Order.findOneAndUpdate({ order_id }, { status: "rejected" });
    return res.status(200).send({ update_status: "success", message: "Berhasil menolak pesanan" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ update_status: "failed", message: "Gagal menolak pesanan" });
  }
};

exports.complete = async (req, res) => {
  let order_id;
  try {
    order_id = req.body.order_id;
    if (!order_id || order_id == "") {
      return res.status(400).send({ update_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).send({ update_status: "failed", message: "Pesanan tidak ditemukan" });
    } else {
      await Car.findByIdAndUpdate(order.car_id, { status: "Tersedia" });
    }
    await Order.findOneAndUpdate({ order_id }, { status: "done" });
    return res.status(200).send({ update_status: "success", message: "Berhasil menyelesaikan peminjaman" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ update_status: "failed", message: "Gagal menyelesaikan peminjaman" });
  }
};

exports.readByRenter = async (req, res) => {
  let renter_id;
  let orders = [];
  try {
    renter_id = req.params.renter_id;
    if (!renter_id || renter_id == "") {
      return res.status(400).send({ read_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }
  try {
    const ordersRaw = await Order.find({ renter_id }).sort({ createdAt: "desc" });
    if (!ordersRaw) {
      return res.status(404).send({ read_status: "failed", message: "Pesanan kosong" });
    }
    ordersRaw.forEach((orderRaw) => {
      const order = {};
      order.car_id = orderRaw.car_id;
      order.confirmed_date = orderRaw.confirmed_date;
      order.duration = orderRaw.duration;
      order.order_id = orderRaw.order_id;
      order.price = orderRaw.price;
      order.status = orderRaw.status;
      orders.push(order);
    });
    return res.status(200).send({ read_status: "success", orders });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ read_status: "failed", message: "Gagal mendapatkan data pesanan" });
  }
};

exports.readOne = async (req, res) => {
  let order_id;
  try {
    order_id = req.params.order_id;
    if (!order_id || order_id == "") {
      return res.status(400).send({ read_status: "failed", message: "Input tidak cukup!" });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).send({ read_status: "failed", message: "Pesanan kosong" });
    }
    return res.status(200).send({ read_status: "success", order });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ read_status: "failed", message: "Gagal mendapatkan data pesanan" });
  }
};
