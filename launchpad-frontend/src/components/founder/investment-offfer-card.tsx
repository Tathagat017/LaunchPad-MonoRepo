import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Card, Flex, Group, Text } from "@mantine/core";
import { useState } from "react";

type InvestmentOfferCardProps = {
  investorName: string;
  offeredAmount: number;
  offeredEquity: number;
  message?: string;
};

const InvestmentOfferCard = ({
  investorName,
  offeredAmount,
  offeredEquity,
  message,
}: InvestmentOfferCardProps) => {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">(
    "pending"
  );

  const handleAccept = () => {
    setStatus("accepted");
  };

  const handleReject = () => {
    setStatus("rejected");
  };

  return (
    <Card shadow="sm" p="lg" radius="md" mb="sm">
      <Flex justify="space-between" mb="sm">
        <Group>
          <FontAwesomeIcon icon={faHandshake} />
          <Text weight={500}>{investorName}</Text>
        </Group>
        <Badge
          color={
            status === "accepted"
              ? "green"
              : status === "rejected"
              ? "red"
              : "gray"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </Flex>

      <Text size="lg" weight={500}>
        ${offeredAmount} for {offeredEquity}% equity
      </Text>
      {message && (
        <Text size="sm" color="dimmed" mt="xs">
          {message}
        </Text>
      )}

      <Group mt="md" position="apart">
        {status === "pending" ? (
          <>
            <Button
              variant="light"
              color="blue"
              size="xs"
              onClick={() => alert("Negotiating offer...")} // Simulate negotiation logic
            >
              Negotiate Offer
            </Button>
            <Group>
              <Button
                variant="outline"
                color="green"
                size="xs"
                onClick={handleAccept}
              >
                Accept Offer
              </Button>
              <Button
                variant="outline"
                color="red"
                size="xs"
                onClick={handleReject}
              >
                Reject Offer
              </Button>
            </Group>
          </>
        ) : status === "accepted" ? (
          <Button
            variant="light"
            color="green"
            size="xs"
            onClick={() => alert("Finalizing offer...")}
          >
            Finalize Offer
          </Button>
        ) : (
          <Text size="sm" color="dimmed">
            Offer Rejected
          </Text>
        )}
      </Group>
    </Card>
  );
};

export default InvestmentOfferCard;
