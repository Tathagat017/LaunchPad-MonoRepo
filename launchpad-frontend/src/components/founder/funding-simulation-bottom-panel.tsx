import React from "react";
import { SimpleGrid, Container } from "@mantine/core";
import InvestmentOfferCard from "./investment-offfer-card";

const investmentOffers = [
  {
    investorName: "Investor A",
    offeredAmount: 500000,
    offeredEquity: 10,
    message: "Looking forward to partnering with you.",
  },
  {
    investorName: "Investor B",
    offeredAmount: 300000,
    offeredEquity: 7,
    message: "Impressive pitch, but I'd like to see more data.",
  },
  {
    investorName: "Investor C",
    offeredAmount: 1000000,
    offeredEquity: 15,
  },
];

export const FundingSimulationBottomPanel = () => {
  return (
    <Container>
      <SimpleGrid cols={1} spacing="lg">
        {investmentOffers.map((offer, idx) => (
          <InvestmentOfferCard
            key={idx}
            investorName={offer.investorName}
            offeredAmount={offer.offeredAmount}
            offeredEquity={offer.offeredEquity}
            message={offer.message}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FundingSimulationBottomPanel;
