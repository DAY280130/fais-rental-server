module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      order_id: {
        type: String,
        required: true,
      },
      car_id: {
        type: String,
        required: true,
      },
      renter_id: {
        type: String,
        required: true,
      },
      confirmed_date: {
        type: String,
        default: "",
      },
      duration: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "processing",
      },
    },
    {
      timestamps: true,
    }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Order = mongoose.model("orders", schema);
  return Order;
};
