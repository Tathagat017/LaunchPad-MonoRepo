const mongoose = require("mongoose");

const investmentOfferSchema = new mongoose.Schema(
  {
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },
    investorName: {
      type: String,
      required: true,
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Founder",
      required: true,
    },
    offeredAmount: {
      type: Number,
      required: true,
    },
    offeredEquity: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isNewOffer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const InvestmentOffer = mongoose.model(
  "InvestmentOffer",
  investmentOfferSchema
);
module.exports = { InvestmentOffer };
