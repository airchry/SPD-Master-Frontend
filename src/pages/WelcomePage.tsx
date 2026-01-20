import api from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface User {
        username: string;
    }

function WelcomePage() {

    const [user, setUser] = useState<User | null>(null);
    
    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await api.get("/me");
                setUser(res.data)
            } catch (err) {
                setUser(null)
            }
        }

        fetchData();
    }, [])

    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center gap-8 bg-gray-100">
            <div className="text-4xl text-gray-600">
                {user === null ? (
                <div>Loading...</div>
                ) : (
                <div>👋 Welcome {user.username}</div>
                )}
            </div>
            <div className="flex gap-4">
                <Link to="/inputspd" className="p-2 text-sm leading-6 font-semibold text-white bg-blue-600 hover:bg-yellow-500 hover:text-black">Input SPD</Link>
                <Link to="/listspd" className="p-2 text-sm leading-6 font-semibold text-white bg-blue-600 hover:bg-yellow-500 hover:text-black">List SPD</Link>
            </div>
        </div>
    )
}

export default WelcomePage;