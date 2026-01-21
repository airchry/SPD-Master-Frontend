import { Routes, Route } from "react-router-dom";
import InputSPD from "./pages/InputSPD";
import ListPage from "./pages/ListPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeDefaultRoute from "./components/HomeDefaultRoute";
import WelcomePage from "./pages/WelcomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeDefaultRoute/>} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute/>}>
        <Route path="/welcome" element={<WelcomePage/>} />
        <Route path="/inputspd" element={<InputSPD />} />
        <Route path="/listspd" element={<ListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
