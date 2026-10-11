import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useCallback, useEffect, useState } from "react";
import { LoadingIndicator } from "./LoadingIndicator";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post("/user/token/refresh/", {
        refresh: token,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  }, []);

  const auth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  }, [refreshToken]);

  useEffect(() => {
    // auth() is async: it only calls setState after token verification
    // (or immediately when there is no token), which is the intended
    // mount-time check rather than a synchronous render cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    auth().catch(() => setIsAuthorized(false));
  }, [auth]);

  if (isAuthorized === null) {
    return (
      <div className="app-splash">
        <LoadingIndicator />
        <p>Getting things ready…</p>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
