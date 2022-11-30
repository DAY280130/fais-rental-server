module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nama: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      profile: {
        type: String,
        // required: true,
      },
      role: {
        type: String,
        default: "customer",
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

  const Account = mongoose.model("accounts", schema);
  return Account;
};
