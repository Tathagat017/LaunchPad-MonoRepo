import { useStore } from "../../hooks/use-store";
import {
  Card,
  Grid,
  Text,
  Button,
  Group,
  Title,
  ScrollArea,
} from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import { faFilePdf, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InvestorBrowse() {
  const { investerStore } = useStore();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["startup-profiles"],
    queryFn: async () => {
      const result = await investerStore.getAllProfiles();
      return result;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await investerStore.getAllUsers();
      return result;
    },
  });

  if (isLoading) return <Text>Loading startups...</Text>;

  return (
    <ScrollArea>
      <Title order={2} mb="md">
        Browse Startups
      </Title>
      <Grid>
        {profiles?.map((profile) => (
          <Grid.Col xs={12} sm={6} md={4} key={profile._id}>
            <Card shadow="md" radius="lg" withBorder p="lg">
              <Group position="apart" mb="sm">
                <Title order={4}>{profile.startUpName}</Title>
                <FontAwesomeIcon icon={faRocket} />
              </Group>

              <Text size="sm" c="dimmed">
                <strong>Founder:</strong>{" "}
                {
                  users?.find((user) => user._id === profile.founderId)
                    ?.fullName
                }
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Founder email:</strong>{" "}
                {users?.find((user) => user._id === profile.founderId)?.email}
              </Text>
              <Text size="sm" mt="xs">
                <strong>Business Model:</strong> {profile.businessModel}
              </Text>
              <Text size="sm" mt="xs">
                <strong>Company Vision:</strong> {profile.companyVision}
              </Text>

              <Group mt="md" position="apart">
                <Button
                  variant="light"
                  rightIcon={<FontAwesomeIcon icon={faFilePdf} />}
                  component="a"
                  href={profile.pitchPdf}
                  download
                  target="_blank"
                >
                  Download Pitch
                </Button>
                <Button
                  onClick={() => {
                    //
                  }}
                >
                  Send Investment Offer
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </ScrollArea>
  );
}
