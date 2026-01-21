import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await api.post("/login", { username, password });
            if (res.data.success) {
                navigate("/welcome");
            } else {
                alert("Login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Login error");
    }
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-row shadow-md h-[550px] w-[950px] rounded-tl-md rounded-bl-md overflow-hidden border-1 border-black/10">
                <div className="flex flex-col basis-3/7 bg-white w-full h-full">
                    <h1 className="text-2xl font-bold text-[#212c5f] px-10 py-7">Login</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col px-10">
                        <label className="mb-2 text-sm text-gray-600">ID Pengguna</label>
                        <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="block w-full h-[30px] rounded-xs bg-black/1 px-3 text-base text-gray-600 outline-1 outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-1 focus:outline-indigo-500 sm:text-sm/6 mb-5"/>
                        <label className="mb-2 text-sm text-gray-600">Kata Sandi</label>
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="block w-full h-[30px] rounded-xs bg-black/1 px-3 text-base text-gray-600 outline-1 outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-1 focus:outline-indigo-500 sm:text-sm/6 mb-5"/>
                        <button type="submit" className="font-bold text-[#212c5f] mt-5 bg-[#ffc91b] w-full h-[30px] rounded-xs hover:bg-[#212c5f] hover:text-[#ffc91b]">Loginn</button>
                    </form>
                    
                </div>
                <div className="basis-4/7 bg-[#212c5f]"></div>
            </div>
        </div>
    )
}

export default Login;