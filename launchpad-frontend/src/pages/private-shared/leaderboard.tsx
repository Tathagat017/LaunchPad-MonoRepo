import React, { useState } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Select,
  SimpleGrid,
  Group,
  Badge,
} from "@mantine/core";

type StartupProfile = {
  name: string;
  founder: string;
  vision: string;
  valuation: number;
  fundingReceived: number;
  feedbackRating: number;
};

const sortOptions = [
  { label: "Valuation", value: "valuation" },
  { label: "Funding Received", value: "fundingReceived" },
  { label: "Feedback Rating", value: "feedbackRating" },
];

const LeaderBoardPage = () => {
  const [sortBy, setSortBy] = useState<keyof StartupProfile>("valuation");

  const sortedStartups = [...dummyStartups].sort(
    (a, b) => Number(b[sortBy]) - Number(a[sortBy])
  );

  return (
    <Container>
      <Group position="apart" mt="lg" mb="md">
        <Title order={2}>🏆 Startup Leaderboard</Title>
        <Select
          label="Sort by"
          value={sortBy}
          onChange={(value) => setSortBy(value as keyof StartupProfile)}
          data={sortOptions}
        />
      </Group>

      <SimpleGrid cols={1} spacing="lg">
        {sortedStartups.map((startup, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mb="sm">
              <Title order={4}>
                #{index + 1} - {startup.name}
              </Title>
              <Badge color="blue" variant="light">
                {sortBy === "valuation"
                  ? `$${startup.valuation}M Valuation`
                  : sortBy === "fundingReceived"
                  ? `$${startup.fundingReceived}M Funding`
                  : `${startup.feedbackRating}/5 Rating`}
              </Badge>
            </Group>
            <Text weight={500}>Founder: {startup.founder}</Text>
            <Text size="sm" mt="xs" color="dimmed">
              {startup.vision}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default LeaderBoardPage;
