import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        api.get("/me")
        .then(() => setAuth(true))
        .catch(() => setAuth(false))
        .finally(() => setLoading(false));
    }, [])

    if (loading) return <p>Loading...</p>;
    if (!auth) return <Navigate to="/login" replace />;

    return <Outlet />;

        
}

export default ProtectedRoute;