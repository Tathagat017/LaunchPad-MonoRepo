// routes/investment-offer-routes.js
const express = require("express");
const { InvestmentOffer } = require("../models/investment-offer-model");
const { AuthenticationHandler } = require("../middleware/authentication");

const router = express.Router();

// POST /investment-offers - Create an offer (Investor)
router.post("/", AuthenticationHandler, async (req, res) => {
  try {
    const {
      investorId,
      investorName,
      founderId,
      offeredAmount,
      offeredEquity,
      message,
    } = req.body;

    if (
      !investorId ||
      !investorName ||
      !founderId ||
      !offeredAmount ||
      !offeredEquity
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newOffer = new InvestmentOffer({
      investorId,
      investorName,
      founderId,
      offeredAmount,
      offeredEquity,
      message,
      status: "pending",
      isNewOffer: true,
    });

    await newOffer.save();
    res.status(201).send({ message: "Offer created", offer: newOffer });
  } catch (err) {
    console.error("Error creating offer:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// GET /investment-offers/founder/:founderId - Get all offers received by founder
router.get("/founder/:founderId", AuthenticationHandler, async (req, res) => {
  try {
    const { founderId } = req.params;
    const offers = await InvestmentOffer.find({ founderId }).sort({
      createdAt: -1,
    });
    res.status(200).send(offers);
  } catch (err) {
    console.error("Error getting offers for founder:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// GET /investment-offers/investor/:investorId - Get all offers sent by investor
router.get("/investor/:investorId", AuthenticationHandler, async (req, res) => {
  try {
    const { investorId } = req.params;
    const offers = await InvestmentOffer.find({ investorId }).sort({
      createdAt: -1,
    });
    res.status(200).send(offers);
  } catch (err) {
    console.error("Error getting offers for investor:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// PUT /investment-offers/:offerId/accept - Accept offer
router.put("/:offerId/accept", AuthenticationHandler, async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await InvestmentOffer.findByIdAndUpdate(
      offerId,
      { status: "accepted", isNewOffer: false },
      { new: true }
    );

    if (!offer) return res.status(404).send({ message: "Offer not found" });
    res.status(200).send({ message: "Offer accepted", offer });
  } catch (err) {
    console.error("Error accepting offer:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// PUT /investment-offers/:offerId/reject - Reject offer
router.put("/:offerId/reject", AuthenticationHandler, async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await InvestmentOffer.findByIdAndUpdate(
      offerId,
      { status: "rejected", isNewOffer: false },
      { new: true }
    );

    if (!offer) return res.status(404).send({ message: "Offer not found" });
    res.status(200).send({ message: "Offer rejected", offer });
  } catch (err) {
    console.error("Error rejecting offer:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// PUT /investment-offers/:offerId/negotiate - Negotiate (edit amount/equity)
router.put("/:offerId/negotiate", AuthenticationHandler, async (req, res) => {
  try {
    const { offerId } = req.params;
    const { offeredAmount, offeredEquity, message } = req.body;

    const offer = await InvestmentOffer.findByIdAndUpdate(
      offerId,
      {
        offeredAmount,
        offeredEquity,
        message,
        status: "pending",
        isNewOffer: true,
      },
      { new: true }
    );

    if (!offer) return res.status(404).send({ message: "Offer not found" });
    res.status(200).send({ message: "Offer negotiated", offer });
  } catch (err) {
    console.error("Error negotiating offer:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

module.exports = { investmentOfferRouter: router };
