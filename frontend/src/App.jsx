import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { getCookie } from "./utils";
import { Login, Register, Dashboard, Settings } from "./pages";
import { ToastProvider } from "./contexts/ToastContext";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

const App = () => {
  const [sessionUserID, setSessionUserID] = useState();
  const [currentProject, setCurrentProject] = useState();

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <Login
                setSessionUserID={setSessionUserID}
                setCurrentProject={setCurrentProject}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/:projectID"
            element={
              <Protected>
                <Dashboard
                  sessionUserID={sessionUserID}
                  currentProject={currentProject}
                  setCurrentProject={setCurrentProject}
                />
              </Protected>
            }
          />
          <Route
            path="/settings/:projectID"
            element={
              <Protected>
                <Settings
                  sessionUserID={sessionUserID}
                  currentProject={currentProject}
                  setCurrentProject={setCurrentProject}
                />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
