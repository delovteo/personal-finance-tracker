import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaList, FaChartPie, FaCog } from "react-icons/fa";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import BackgroundCanvas from "./components/BackgroundCanvas";
import { useOnlineStatus } from "./utils/useOnlineStatus";


import "./App.css";

export default function App() {

    const isOnline = useOnlineStatus();

    return (
        <Router>
            {/* Background Canvas Animation */}
            <BackgroundCanvas />

            {/* Offline Banner */}
            {!isOnline && (
                <div className="offline-banner">
                    You are offline brother
                </div>
            )}

            {/* Navigation Bar */}
            <nav>
                <Link to="/">
                    <FaHome className="mr-2 pulse-animation" /> Dashboard
                </Link>
                <Link to="/transactions">
                    <FaList className="mr-2 pulse-animation" /> Transactions
                </Link>
                <Link to="/reports">
                    <FaChartPie className="mr-2 pulse-animation" /> Reports
                </Link>
                <Link to="/settings">
                    <FaCog className="mr-2 pulse-animation" /> Settings
                </Link>
            </nav>

            {/* Page Content */}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    );
}
