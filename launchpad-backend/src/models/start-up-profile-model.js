const startUpProfileSchema = new mongoose.Schema(
  {
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Founder",
      required: true,
    },
    startUpName: {
      type: String,
      required: true,
    },
    companyVision: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    marketSize: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },
    businessModel: {
      type: String,
      required: true,
    },
    pitchPdf: {
      type: String,
      required: true,
    },
    requestAmount: {
      type: Number,
      default: 0,
    },
    requestedEquity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
