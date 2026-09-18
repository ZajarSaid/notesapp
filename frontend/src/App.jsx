import "./App.css";
import NameHandler from "./components/home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
