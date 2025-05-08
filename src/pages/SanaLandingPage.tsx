import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Anchor,
} from "@mantine/core";
import {
  IconHeartbeat,
  IconShieldCheck,
  IconUserPlus,
  IconBrandGithub,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "../store/authStore"; // To redirect if already logged in
import { useEffect } from "react";

export function SanaLandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    // If user is already authenticated, redirect them to the app's main page
    if (isAuthenticated) {
      navigate("/app"); // Assuming '/app' will be the authenticated base path
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <Container
      size="lg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper
        shadow="xl"
        p="xl"
        radius="lg"
        withBorder
        style={{
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Title order={1} align="center" mb="lg" size="4rem">
          Welcome to Sana Healthcare
        </Title>
        <Text align="center" size="xl" mb="xl">
          Your health, our priority. Access our comprehensive healthcare
          platform today.
        </Text>

        <SimpleGrid
          cols={3}
          spacing="lg"
          mb="xl"
          breakpoints={[{ maxWidth: "md", cols: 1, spacing: "md" }]}
        >
          <FeatureCard
            icon={<IconHeartbeat size={30} />}
            title="Personalized Care"
            description="Tailored health plans and tracking to meet your individual needs."
          />
          <FeatureCard
            icon={<IconShieldCheck size={30} />}
            title="Secure & Private"
            description="Your health data is protected with the highest security standards."
          />
          <FeatureCard
            icon={<IconUserPlus size={30} />}
            title="Easy Access"
            description="Connect with healthcare professionals and manage your health records seamlessly."
          />
        </SimpleGrid>

        <Group position="center">
          <Button
            size="xl"
            radius="xl"
            onClick={handleGetStarted}
            variant="white"
            color="indigo"
          >
            Get Started
          </Button>
        </Group>
      </Paper>
      <Text align="center" mt="md" c="dimmed">
        Streamlining healthcare for a better tomorrow.
      </Text>
      <Group position="center" mt="sm">
        <Anchor
          href="https://github.com/Shrihari0208/sanahealthcareAssignment"
          target="_blank"
          c="dimmed"
          size="sm"
        >
          <Group spacing="xs" noWrap>
            <IconBrandGithub size={16} />
            <Text inherit>View Project on GitHub</Text>
          </Group>
        </Anchor>
      </Group>
    </Container>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Paper
      p="md"
      radius="md"
      style={{ backgroundColor: "rgba(255,255,255, 0.1)" }}
    >
      <Group noWrap>
        <ThemeIcon variant="light" size="xl" radius="md" color="indigo">
          {icon}
        </ThemeIcon>
        <div>
          <Text weight={700} size="lg">
            {title}
          </Text>
          <Text size="sm">{description}</Text>
        </div>
      </Group>
    </Paper>
  );
}
