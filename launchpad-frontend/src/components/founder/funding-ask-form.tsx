import React, { useState } from "react";
import { Card, NumberInput, Title, Group, Text } from "@mantine/core";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4dabf7", "#82ca9d"];

export const FundingAskForm = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [equity, setEquity] = useState<number | "">("");

  const valuation =
    amount && equity ? (amount / (equity / 100)).toFixed(2) : null;

  const founderPercent = equity ? 100 - equity : 100;

  const data = [
    { name: "Investor", value: equity || 0 },
    { name: "Founder", value: founderPercent || 100 },
  ];

  return (
    <Card shadow="md" p="lg" radius="md" mb="lg">
      <Title order={3} mb="md">
        Funding Ask
      </Title>
      <Group grow mb="md">
        <NumberInput
          label="Funding Amount (USD)"
          value={amount}
          onChange={(val) => setAmount(val === "" ? "" : Number(val))}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          formatter={(val) => (!Number.isNaN(Number(val)) ? `$ ${val}` : "")}
        />
        <NumberInput
          label="Equity Offered (%)"
          value={equity}
          onChange={(val) => setEquity(val === "" ? "" : Number(val))}
          min={0}
          max={100}
          precision={2}
          step={0.1}
        />
      </Group>

      {valuation && (
        <Text size="sm" mt="xs">
          <strong>Post-Money Valuation:</strong> ${valuation}
        </Text>
      )}

      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Card>
  );
};

export default FundingAskForm;
