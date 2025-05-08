import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  ScrollArea,
  Loader,
  Alert,
  TextInput,
  Title,
  Text,
  Container,
  Badge,
  Group,
  Pagination,
} from "@mantine/core";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";

// Define an interface for the Launch object based on expected API response
interface Launch {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  rocket: string; // Rocket ID, we might fetch rocket name later if needed
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
    article: string | null;
    wikipedia: string | null;
  };
}

const API_ENDPOINT = "https://api.spacexdata.com/v5/launches";

const fetchLaunches = async (): Promise<Launch[]> => {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function LaunchesListPage() {
  const {
    data: launches,
    isLoading,
    error,
  } = useQuery<Launch[], Error>(["launches"], fetchLaunches);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLaunches = useMemo(() => {
    if (!launches) return [];
    return launches.filter((launch) =>
      launch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [launches, searchTerm]);

  const paginatedLaunches = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredLaunches.slice(start, end);
  }, [filteredLaunches, activePage, itemsPerPage]);

  if (isLoading) {
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

  if (error) {
    return (
      <Container mt="lg">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error Fetching Launches"
          color="red"
        >
          {error.message}
        </Alert>
      </Container>
    );
  }

  const rows = paginatedLaunches.map((launch) => (
    <tr key={launch.id}>
      <td>{launch.flight_number}</td>
      <td>
        <Link to={`/launches/${launch.id}`}>{launch.name}</Link>
      </td>
      <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
      <td>
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
      </td>
      <td>
        {launch.details ? `${launch.details.substring(0, 50)}...` : "N/A"}
      </td>
      <td>
        {launch.links.patch.small && (
          <img
            src={launch.links.patch.small}
            alt={`${launch.name} patch`}
            style={{ height: "30px" }}
          />
        )}
      </td>
    </tr>
  ));

  return (
    <Container fluid mt="lg">
      <Title order={2} mb="md">
        SpaceX Launches
      </Title>
      <TextInput
        placeholder="Search by mission name..."
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.currentTarget.value);
          setPage(1); // Reset to first page on search
        }}
      />
      {filteredLaunches.length === 0 && !isLoading && (
        <Text>No launches found matching your criteria.</Text>
      )}
      {filteredLaunches.length > 0 && (
        <>
          <ScrollArea>
            <Table
              sx={{ minWidth: 800 }}
              verticalSpacing="sm"
              striped
              highlightOnHover
              withBorder
              withColumnBorders
            >
              <thead>
                <tr>
                  <th>Flight No.</th>
                  <th>Mission Name</th>
                  <th>Date (UTC)</th>
                  <th>Status</th>
                  <th>Details (Snippet)</th>
                  <th>Patch</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
          {filteredLaunches.length > itemsPerPage && (
            <Group position="center" mt="md">
              <Pagination
                value={activePage}
                onChange={setPage}
                total={Math.ceil(filteredLaunches.length / itemsPerPage)}
              />
            </Group>
          )}
        </>
      )}
    </Container>
  );
}
