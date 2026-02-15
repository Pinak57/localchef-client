import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Meals from "../pages/Meals";
import MealDetails from "../pages/MealDetails";
import Profile from "../pages/Profile";
import MyMeals from "../pages/MyMeals";
import MyOrders from "../pages/MyOrders";
import MyReviews from "../pages/MyReviews";
import Favorites from "../pages/Favorites";
import CreateMeal from "../pages/CreateMeal";
import OrderRequests from "../pages/OrderRequests";
import ManageUsers from "../pages/ManageUsers";
import ManageRequests from "../pages/ManageRequests";
import PlatformStats from "../pages/PlatformStats";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UpdateMeal from "../pages/UpdateMeal";
import LoadingPage from "../pages/LoadingPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailure from "../pages/PaymentFailure";
import OrderPage from "../pages/OrderPage";
import Dashboard from "../pages/Dashboard";  // ✅ central dashboard

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ChefRoute from "./ChefRoute";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // ---------------- Public Routes ----------------
      { path: "/", element: <Home /> },
      { path: "/meals", element: <Meals /> },
      { path: "/meals/:id", element: <MealDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/loading", element: <LoadingPage /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/payment-failure", element: <PaymentFailure /> },

      // ---------------- Normal User (Customer) ----------------
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-reviews",
        element: (
          <PrivateRoute>
            <MyReviews />
          </PrivateRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        ),
      },
      {
        path: "/order/:id",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },

      // ---------------- Chef ----------------
      {
        path: "/my-meals",
        element: (
          <ChefRoute>
            <MyMeals />
          </ChefRoute>
        ),
      },
      {
        path: "/create-meal",
        element: (
          <ChefRoute>
            <CreateMeal />
          </ChefRoute>
        ),
      },
      {
        path: "/update-meal/:id",
        element: (
          <ChefRoute>
            <UpdateMeal />
          </ChefRoute>
        ),
      },
      {
        path: "/order-requests",
        element: (
          <ChefRoute>
            <OrderRequests />
          </ChefRoute>
        ),
      },

      // ---------------- Admin ----------------
      {
        path: "/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/manage-requests",
        element: (
          <AdminRoute>
            <ManageRequests />
          </AdminRoute>
        ),
      },
      {
        path: "/platform-stats",
        element: (
          <AdminRoute>
            <PlatformStats />
          </AdminRoute>
        ),
      },
      {
        path: "/admin-order-requests", // ✅ আলাদা admin route
        element: (
          <AdminRoute>
            <OrderRequests />
          </AdminRoute>
        ),
      },

      // ---------------- Central Dashboard ----------------
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default AppRouter;
