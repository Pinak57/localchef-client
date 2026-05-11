import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Meals from "../pages/Meals";
import MealDetails from "../pages/MealDetails";
import OrderPage from "../pages/OrderPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PaymentSuccess from "../pages/PaymentSuccess";
import ErrorPage from "../components/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../dashboard/DashboardLayout";

// User Dashboard
import MyProfile from "../dashboard/user/MyProfile";
import MyOrders from "../dashboard/user/MyOrders";
import MyReviews from "../dashboard/user/MyReviews";
import FavoriteMeals from "../dashboard/user/FavoriteMeals";

// Chef Dashboard
import ChefProfile from "../dashboard/chef/ChefProfile";
import CreateMeal from "../dashboard/chef/CreateMeal";
import MyMeals from "../dashboard/chef/MyMeals";
import OrderRequests from "../dashboard/chef/OrderRequests";

// Admin Dashboard
import AdminProfile from "../dashboard/admin/AdminProfile";
import ManageUsers from "../dashboard/admin/ManageUsers";
import ManageRequests from "../dashboard/admin/ManageRequests";
import Statistics from "../dashboard/admin/Statistics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "meals", element: <Meals /> },
      {
        path: "meals/:id",
        element: <PrivateRoute><MealDetails /></PrivateRoute>,
      },
      {
        path: "order/:id",
        element: <PrivateRoute><OrderPage /></PrivateRoute>,
      },
      {
        path: "payment-success",
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>,
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      // User routes
      {
        path: "my-profile",
        element: <RoleRoute allowedRoles={["user"]}><MyProfile /></RoleRoute>,
      },
      {
        path: "my-orders",
        element: <RoleRoute allowedRoles={["user"]}><MyOrders /></RoleRoute>,
      },
      {
        path: "my-reviews",
        element: <RoleRoute allowedRoles={["user"]}><MyReviews /></RoleRoute>,
      },
      {
        path: "favorites",
        element: <RoleRoute allowedRoles={["user"]}><FavoriteMeals /></RoleRoute>,
      },
      // Chef routes
      {
        path: "chef-profile",
        element: <RoleRoute allowedRoles={["chef"]}><ChefProfile /></RoleRoute>,
      },
      {
        path: "create-meal",
        element: <RoleRoute allowedRoles={["chef"]}><CreateMeal /></RoleRoute>,
      },
      {
        path: "my-meals",
        element: <RoleRoute allowedRoles={["chef"]}><MyMeals /></RoleRoute>,
      },
      {
        path: "order-requests",
        element: <RoleRoute allowedRoles={["chef"]}><OrderRequests /></RoleRoute>,
      },
      // Admin routes
      {
        path: "admin-profile",
        element: <RoleRoute allowedRoles={["admin"]}><AdminProfile /></RoleRoute>,
      },
      {
        path: "manage-users",
        element: <RoleRoute allowedRoles={["admin"]}><ManageUsers /></RoleRoute>,
      },
      {
        path: "manage-requests",
        element: <RoleRoute allowedRoles={["admin"]}><ManageRequests /></RoleRoute>,
      },
      {
        path: "statistics",
        element: <RoleRoute allowedRoles={["admin"]}><Statistics /></RoleRoute>,
      },
    ],
  },
]);

export default router;
