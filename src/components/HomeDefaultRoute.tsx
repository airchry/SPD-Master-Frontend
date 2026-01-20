import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function HomeDefaultRoute() {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        api.get("/me")
        .then(() => setAuth(true))
        .catch(() => setAuth(false))
        .finally(() => setLoading(false));
    }, [])

    if (loading) return <p>Loading...</p>

    return auth ? <Navigate to="/welcome" /> : <Navigate to="/login"/>
        
}

export default HomeDefaultRoute;