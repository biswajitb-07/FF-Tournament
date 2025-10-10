import { lazy, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import PageLoader from "./components/Loader/PageLoader";
import FreeFire404 from "./pages/user/FreeFire404";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoute";
import { useLoadUserQuery } from "./features/api/authApi";
import RefundPolicy from "./pages/user/RefundPolicy";

const Home = lazy(() => import("./pages/user/Home"));
const Login = lazy(() => import("./pages/user/Login"));
const About = lazy(() => import("./pages/user/About"));
const Contact = lazy(() => import("./pages/user/Contact"));
const Tournament = lazy(() => import("./pages/user/Tournament"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Wallet = lazy(() => import("./pages/user/WalletComponent"));
const TournamentRulesAndPrivacy = lazy(() =>
  import("./pages/user/TournamentRulesAndPrivacy")
);
const TermsOfService = lazy(() => import("./pages/user/TermsOfService"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "/about-us",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/tournament",
        element: <Tournament />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/privacy-policy-rules",
        element: <TournamentRulesAndPrivacy />,
      },
      {
        path: "/refund-policy",
        element: <RefundPolicy />,
      },
      {
        path: "/terms-service",
        element: <TermsOfService />,
      },
    ],
  },
  {
    path: "*",
    element: <FreeFire404 />,
  },
  {
    path: "/admin-dashboard",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
]);

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isLoading: authLoading } = useLoadUserQuery();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online!");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("No internet connection");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
        }}
      />

      {isOnline ? (
        authLoading ? (
          <PageLoader />
        ) : (
          <Suspense fallback={<PageLoader />}>
            <RouterProvider router={appRouter} />
          </Suspense>
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
          <WifiOff
            className="w-28 h-28 text-sky-400 animate-pulse"
            strokeWidth={0.5}
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            You're offline
          </h1>
          <p className="mt-2 text-slate-300 text-center max-w-xs">
            Check your connection to continue using the site.
          </p>
        </div>
      )}
    </main>
  );
};

export default App;
