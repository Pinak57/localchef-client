import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  );
}

export default App;
