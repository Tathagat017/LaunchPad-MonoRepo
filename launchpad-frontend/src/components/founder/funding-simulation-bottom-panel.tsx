import React, { useState } from "react";
import { SimpleGrid, Container, Loader } from "@mantine/core";
import InvestmentOfferCard from "./investment-offfer-card";
import CapSimulationModal, {
  CapSimulationModalHandle,
} from "../shared/cap-simulation-modal";
import NegotiateOfferModal, {
  NegotiateOfferModalHandle,
} from "../shared/negotiation-modal";
import { InvestmentOffer } from "../../types/funding";
import { useStore } from "../../hooks/use-store";
import { useQuery } from "@tanstack/react-query";

export const FundingSimulationBottomPanel = () => {
  const capSimulationModalRef = React.useRef<CapSimulationModalHandle>(null);
  const NegotiateOfferModalRef = React.useRef<NegotiateOfferModalHandle>(null);

  const [investmentOffers, setInvestmentOffers] = useState<InvestmentOffer[]>(
    []
  );

  const { investmentOfferStore } = useStore();

  const { isLoading } = useQuery({
    queryKey: ["investment-offers"],
    queryFn: async () => {
      const result = await investmentOfferStore.fetchOffersForCurrentUser();
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setInvestmentOffers(data);
    },
  });

  const handleSimulateOfferClick = (
    offeredAmount: number,
    offeredEquity: number
  ) => {
    if (capSimulationModalRef.current) {
      capSimulationModalRef.current.showModal(offeredAmount, offeredEquity);
    }
  };

  const handleNegotiateOfferClick = (
    offeredAmount: number,
    offeredEquuity: number,
    offerId: string
  ) => {
    if (NegotiateOfferModalRef.current) {
      NegotiateOfferModalRef.current.showModal(
        offeredAmount,
        offeredEquuity,
        offerId
      );
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <Container w={"100%"} p="lg" style={{ overflowX: "hidden" }}>
      <CapSimulationModal ref={capSimulationModalRef} />
      <NegotiateOfferModal ref={NegotiateOfferModalRef} />
      <SimpleGrid cols={1} spacing="lg">
        {investmentOffers.map((offer, idx) => (
          <InvestmentOfferCard
            key={idx}
            founderId={offer.founderId}
            investorId={offer.investorId}
            status={offer.status}
            _id={offer._id}
            createdAt={offer.createdAt}
            isNewOffer={offer.isNewOffer}
            lastUpdatedBy={offer.lastUpdatedBy}
            updatedAt={offer.updatedAt}
            investorName={offer.investorName}
            offeredAmount={offer.offeredAmount}
            offeredEquity={offer.offeredEquity}
            offerId={offer._id}
            message={offer.message}
            onSimulateOfferClick={handleSimulateOfferClick}
            onNegotiateOfferClick={handleNegotiateOfferClick}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FundingSimulationBottomPanel;
