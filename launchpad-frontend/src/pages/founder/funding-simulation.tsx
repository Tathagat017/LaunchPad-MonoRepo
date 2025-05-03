import React from "react";
import { Container, Title, Divider } from "@mantine/core";
import { FundingAskForm } from "../../components/founder/funding-ask-form";
import { FundingSimulationBottomPanel } from "../../components/founder/funding-simulation-bottom-panel";

const FundingSimulationPage = () => {
  return (
    <Container>
      <Title order={2} mb="lg">
        Funding Simulation
      </Title>
      <FundingAskForm />
      <Divider my="lg" />
      <FundingSimulationBottomPanel />
    </Container>
  );
};

export default FundingSimulationPage;
