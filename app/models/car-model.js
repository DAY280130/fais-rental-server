module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nama: {
        type: String,
        required: true,
      },
      tahun: {
        type: Number,
        required: true,
      },
      seat: {
        type: Number,
        required: true,
      },
      gear: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: "Tersedia",
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

  const Car = mongoose.model("cars", schema);
  return Car;
};
