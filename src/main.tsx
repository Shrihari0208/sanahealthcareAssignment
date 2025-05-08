import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import Landing from "./pages/landing/Landing";
import { LoginPage } from "./pages/LoginPage";
import { SanaLandingPage } from "./pages/SanaLandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LaunchesListPage } from "./pages/LaunchesListPage";
import { LaunchDetailPage } from "./pages/LaunchDetailPage";

function ProtectedLayout() {
  return <App />;
}

export const routes = [
  {
    path: "/",
    element: <SanaLandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <LaunchesListPage />,
          },
          {
            path: "landing",
            element: <Landing />,
          },
          {
            path: "launches",
            element: <LaunchesListPage />,
          },
          {
            path: "launches/:launchId",
            element: <LaunchDetailPage />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
