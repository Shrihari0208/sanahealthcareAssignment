import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  MantineProvider,
  AppShell,
  Header,
  Title,
  Button,
  Group,
  Box,
} from "@mantine/core";
import { useAuthStore, selectIsAuthenticated } from "./store/authStore";
import { theme } from "./theme";
import "./App.scss";

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        header={
          <Header height={60} p="xs">
            <Group position="apart" sx={{ height: "100%" }}>
              <Title order={3}>SpaceX Explorer</Title>
              {isAuthenticated && (
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Group>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Box component="main" style={{ paddingTop: "10px" }}>
          <Outlet />
        </Box>
      </AppShell>
    </MantineProvider>
  );
}
