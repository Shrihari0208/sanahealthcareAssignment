import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Loader,
  Alert,
  Title,
  Text,
  Paper,
  Group,
  Image,
  Badge,
  SimpleGrid,
  List,
  ThemeIcon,
  Button,
  Stack,
  Divider,
  AspectRatio,
  Card,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconRocket,
  IconCalendarEvent,
  IconInfoCircle,
  IconLink,
  IconArrowLeft,
  IconBuildingFortress,
  IconDimensions,
  IconWeight,
  IconUsers,
  IconFlag,
} from "@tabler/icons-react";

// Re-using the Launch interface, assuming detail endpoint returns a single Launch object
// If the structure is significantly different, we might need a new interface.
interface Launch {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  date_local: string;
  success: boolean | null;
  details: string | null;
  rocket: string; // Rocket ID
  launchpad: string; // Launchpad ID
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
  failures: {
    time: number;
    altitude: number | null;
    reason: string;
  }[];
  // Add other fields as needed from the API response for a single launch
}

interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: { meters: number; feet: number };
  diameter: { meters: number; feet: number };
  mass: { kg: number; lb: number };
  flickr_images: string[];
  wikipedia: string;
  description: string;
}

interface Launchpad {
  id: string;
  name: string; // Full name
  full_name: string; // Official full name
  status: string;
  locality: string;
  region: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[]; // IDs of rockets that launch from here
  timezone: string;
  details: string;
  images: { large: string[] }; // Assuming similar structure to flickr images
}

const fetchLaunchById = async (id: string): Promise<Launch> => {
  const response = await fetch(`https://api.spacexdata.com/v5/launches/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok for fetching launch details");
  }
  return response.json();
};

const fetchRocketById = async (
  id: string | undefined
): Promise<Rocket | null> => {
  if (!id) return null;
  const response = await fetch(`https://api.spacexdata.com/v5/rockets/${id}`);
  if (!response.ok)
    throw new Error("Network response was not ok for fetching rocket details");
  return response.json();
};

const fetchLaunchpadById = async (
  id: string | undefined
): Promise<Launchpad | null> => {
  if (!id) return null;
  const response = await fetch(
    `https://api.spacexdata.com/v5/launchpads/${id}`
  );
  if (!response.ok)
    throw new Error(
      "Network response was not ok for fetching launchpad details"
    );
  return response.json();
};

export function LaunchDetailPage() {
  const { launchId } = useParams<{ launchId: string }>();

  const {
    data: launch,
    isLoading: isLoadingLaunch,
    error: launchError,
  } = useQuery<Launch, Error>(
    ["launch", launchId],
    () => fetchLaunchById(launchId!),
    { enabled: !!launchId } // Only run query if launchId is available
  );

  const {
    data: rocket,
    isLoading: isLoadingRocket,
    error: rocketError,
  } = useQuery<Rocket | null, Error>(
    ["rocket", launch?.rocket],
    () => fetchRocketById(launch?.rocket),
    { enabled: !!launch?.rocket } // Only run if launch data and rocket ID are available
  );

  const {
    data: launchpad,
    isLoading: isLoadingLaunchpad,
    error: launchpadError,
  } = useQuery<Launchpad | null, Error>(
    ["launchpad", launch?.launchpad],
    () => fetchLaunchpadById(launch?.launchpad),
    { enabled: !!launch?.launchpad } // Only run if launch data and launchpad ID are available
  );

  if (isLoadingLaunch) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Loader />
      </Container>
    );
  }

  if (launchError) {
    return (
      <Container mt="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error Fetching Launch Details"
          color="red"
        >
          {launchError.message}
        </Alert>
        <Button
          component={RouterLink}
          to="/launches"
          mt="md"
          leftIcon={<IconArrowLeft size={14} />}
        >
          Back to Launches
        </Button>
      </Container>
    );
  }

  if (!launch) {
    return (
      <Container mt="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Not Found"
          color="orange"
        >
          Launch details not found.
        </Alert>
        <Button
          component={RouterLink}
          to="/launches"
          mt="md"
          leftIcon={<IconArrowLeft size={14} />}
        >
          Back to Launches
        </Button>
      </Container>
    );
  }

  // Helper to display loading/error for enriched data
  const renderEnrichedData = (
    data: any,
    isLoading: boolean,
    error: Error | null,
    title: string,
    renderContent: () => React.ReactNode
  ) => {
    if (isLoading)
      return (
        <Group>
          <Loader size="xs" mr="xs" />
          <Text size="sm">Loading {title}...</Text>
        </Group>
      );
    if (error)
      return (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          title={`Error loading ${title}`}
        >
          <Text size="xs">{error.message}</Text>
        </Alert>
      );
    if (!data) return <Text size="sm">{title} details not available.</Text>;
    return <>{renderContent()}</>;
  };

  return (
    <Container fluid mt="lg" mb="lg">
      <Button
        component={RouterLink}
        to="/launches"
        mb="md"
        variant="outline"
        leftIcon={<IconArrowLeft size={14} />}
      >
        Back to Launches
      </Button>

      <Paper shadow="md" p="lg" radius="md">
        <Group position="apart" mb="md">
          <Title order={2}>
            {launch.name} (Flight {launch.flight_number})
          </Title>
          {launch.links.patch.large && (
            <Image
              src={launch.links.patch.large}
              alt={`${launch.name} patch`}
              width={100}
              height={100}
              fit="contain"
            />
          )}
        </Group>

        <Divider my="md" />

        <SimpleGrid
          cols={2}
          spacing="lg"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <Stack spacing="xs">
            <Title order={4}>Mission Details</Title>
            <Text>
              <ThemeIcon size="sm" variant="light" color="blue" mr={5}>
                <IconCalendarEvent size={14} />
              </ThemeIcon>
              <strong>Date (UTC):</strong>{" "}
              {new Date(launch.date_utc).toLocaleString()}
            </Text>
            <Text>
              <ThemeIcon size="sm" variant="light" color="blue" mr={5}>
                <IconCalendarEvent size={14} />
              </ThemeIcon>
              <strong>Date (Local):</strong>{" "}
              {new Date(launch.date_local).toLocaleString()}
            </Text>
            <Group spacing="xs">
              <ThemeIcon
                size="sm"
                variant="light"
                color={
                  launch.success
                    ? "green"
                    : launch.success === false
                    ? "red"
                    : "gray"
                }
                mr={5}
              >
                {launch.success ? (
                  <IconCircleCheck size={14} />
                ) : launch.success === false ? (
                  <IconCircleX size={14} />
                ) : (
                  <IconInfoCircle size={14} />
                )}
              </ThemeIcon>
              <strong>Status:</strong>
              {launch.success === null ? (
                <Badge color="gray" variant="filled">
                  Unknown
                </Badge>
              ) : launch.success ? (
                <Badge color="green" variant="filled">
                  Success
                </Badge>
              ) : (
                <Badge color="red" variant="filled">
                  Failure
                </Badge>
              )}
            </Group>
            {launch.details && (
              <Text>
                <ThemeIcon size="sm" variant="light" mr={5}>
                  <IconInfoCircle size={14} />
                </ThemeIcon>
                <strong>Details:</strong> {launch.details}
              </Text>
            )}
            {!launch.success &&
              launch.failures &&
              launch.failures.length > 0 && (
                <Paper withBorder p="xs" radius="sm" mt="xs">
                  <Text size="sm" weight={500}>
                    Failure Reasons:
                  </Text>
                  <List size="sm" spacing="xs" mt="xs">
                    {launch.failures.map((f, index) => (
                      <List.Item key={index}>
                        At {f.time}s (alt: {f.altitude ?? "N/A"}m): {f.reason}
                      </List.Item>
                    ))}
                  </List>
                </Paper>
              )}
          </Stack>

          <Stack spacing="xs">
            <Title order={4}>Links & Media</Title>
            {launch.links.webcast && (
              <Button
                component="a"
                href={launch.links.webcast}
                target="_blank"
                variant="light"
                leftIcon={<IconLink size={14} />}
              >
                Watch Webcast
              </Button>
            )}
            {launch.links.article && (
              <Button
                component="a"
                href={launch.links.article}
                target="_blank"
                variant="light"
                leftIcon={<IconLink size={14} />}
              >
                Read Article
              </Button>
            )}
            {launch.links.wikipedia && (
              <Button
                component="a"
                href={launch.links.wikipedia}
                target="_blank"
                variant="light"
                leftIcon={<IconLink size={14} />}
              >
                Wikipedia Page
              </Button>
            )}
            {launch.links.presskit && (
              <Button
                component="a"
                href={launch.links.presskit}
                target="_blank"
                variant="light"
                leftIcon={<IconLink size={14} />}
              >
                Press Kit
              </Button>
            )}
          </Stack>
        </SimpleGrid>

        {launch.links.flickr.original &&
          launch.links.flickr.original.length > 0 && (
            <>
              <Divider my="lg" />
              <Title order={4} mb="md">
                Flickr Images
              </Title>
              <SimpleGrid
                cols={3}
                spacing="md"
                breakpoints={[
                  { maxWidth: "md", cols: 2 },
                  { maxWidth: "xs", cols: 1 },
                ]}
              >
                {launch.links.flickr.original
                  .slice(0, 6)
                  .map((imgUrl, index) => (
                    <Paper key={index} shadow="xs" radius="md" withBorder>
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={imgUrl}
                          alt={`Flickr image ${index + 1} for ${launch.name}`}
                          fit="cover"
                        />
                      </AspectRatio>
                    </Paper>
                  ))}
              </SimpleGrid>
            </>
          )}

        <Divider my="lg" />
        <Title order={4} mb="md">
          Enriched Information
        </Title>

        <SimpleGrid
          cols={2}
          spacing="xl"
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Title order={5}>Rocket Details</Title>
              <IconRocket size={24} />
            </Group>
            {renderEnrichedData(
              rocket,
              isLoadingRocket,
              rocketError,
              "Rocket",
              () => (
                <Stack spacing="xs">
                  <Text>
                    <strong>Name:</strong> {rocket!.name} ({rocket!.type})
                  </Text>
                  <Text>
                    <strong>Company:</strong> {rocket!.company}
                  </Text>
                  <Text>
                    <strong>Country:</strong> {rocket!.country}
                  </Text>
                  <Text>
                    <strong>Active:</strong> {rocket!.active ? "Yes" : "No"}
                  </Text>
                  <Text>
                    <strong>Stages:</strong> {rocket!.stages}
                  </Text>
                  <Text>
                    <strong>Boosters:</strong> {rocket!.boosters}
                  </Text>
                  <Text>
                    <strong>Cost per Launch:</strong> $
                    {rocket!.cost_per_launch.toLocaleString()}
                  </Text>
                  <Text>
                    <strong>Success Rate:</strong> {rocket!.success_rate_pct}%
                  </Text>
                  <Text>
                    <strong>First Flight:</strong>{" "}
                    {new Date(rocket!.first_flight).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Height:</strong> {rocket!.height.meters}m /{" "}
                    {rocket!.height.feet}ft
                  </Text>
                  <Text>
                    <strong>Diameter:</strong> {rocket!.diameter.meters}m /{" "}
                    {rocket!.diameter.feet}ft
                  </Text>
                  <Text>
                    <strong>Mass:</strong> {rocket!.mass.kg.toLocaleString()}kg
                    / {rocket!.mass.lb.toLocaleString()}lb
                  </Text>
                  {rocket!.description && (
                    <Text size="sm" mt="xs">
                      <em>{rocket!.description}</em>
                    </Text>
                  )}
                  {rocket!.wikipedia && (
                    <Button
                      component="a"
                      href={rocket!.wikipedia}
                      target="_blank"
                      variant="subtle"
                      size="xs"
                      mt="xs"
                    >
                      Wikipedia
                    </Button>
                  )}
                </Stack>
              )
            )}
          </Card>

          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Title order={5}>Launchpad Details</Title>
              <IconBuildingFortress size={24} />
            </Group>
            {renderEnrichedData(
              launchpad,
              isLoadingLaunchpad,
              launchpadError,
              "Launchpad",
              () => (
                <Stack spacing="xs">
                  <Text>
                    <strong>Name:</strong>{" "}
                    {launchpad!.full_name || launchpad!.name}
                  </Text>
                  <Text>
                    <strong>Locality:</strong> {launchpad!.locality},{" "}
                    {launchpad!.region}
                  </Text>
                  <Text>
                    <strong>Status:</strong>{" "}
                    <Badge
                      color={launchpad!.status === "active" ? "green" : "red"}
                    >
                      {launchpad!.status}
                    </Badge>
                  </Text>
                  <Text>
                    <strong>Launch Attempts:</strong>{" "}
                    {launchpad!.launch_attempts}
                  </Text>
                  <Text>
                    <strong>Launch Successes:</strong>{" "}
                    {launchpad!.launch_successes}
                  </Text>
                  <Text>
                    <strong>Timezone:</strong> {launchpad!.timezone}
                  </Text>
                  {launchpad!.details && (
                    <Text size="sm" mt="xs">
                      <em>{launchpad!.details}</em>
                    </Text>
                  )}
                  {/* Consider adding a map link for lat/lon if desired */}
                </Stack>
              )
            )}
          </Card>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
