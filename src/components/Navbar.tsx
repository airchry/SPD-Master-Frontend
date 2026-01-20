import api from "../api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get("/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
    },[])

    async function handleLogout() {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (!confirm) return;
        
        try {
            await api.post("/logout");
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err)
        }
    }   
    

    return (
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-center lg:px-8 mx-6">
            <a href="/inputspd" className="p-2 text-sm/6 font-semibold text-white hover:bg-yellow-500 hover:text-black">Input SPD</a>
            <a href="/listspd" className="p-2 text-sm/6 font-semibold text-white hover:bg-yellow-500 hover:text-black">List SPD</a>
            {user ?
            <button onClick={handleLogout} className="p-2 text-sm/6 font-semibold text-white hover:bg-yellow-500 hover:text-black">Logout</button>
            : <button onClick={() => navigate("/login")} className="p-2 text-sm/6 font-semibold text-white hover:bg-yellow-500 hover:text-black">Login</button>
            }
        </nav>
    )
}

export default Navbar;