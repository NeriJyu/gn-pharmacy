import dynamoose from "dynamoose";

const StockSchema = new dynamoose.Schema(
  {
    pharmacyId: {
      type: String,
      hashKey: true,
    },
    medicineId: {
      type: String,
      rangeKey: true,
      index: {
        name: "medicineIdIndex",
        type: "global",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StockModel = dynamoose.model("Stock", StockSchema, {
  create: true,
  waitForActive: true,
});

export default StockModel;
