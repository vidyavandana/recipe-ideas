import { Sun, Moon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ darkMode, setDarkMode }) {
    const navigate = useNavigate();

    // Effect to apply/remove 'dark' class on the document element for dark mode
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <header className="app-header">
            <div className="header-logo">
                <a href="/">Recipe Ideas</a>
            </div>
            <nav className="header-nav">
                {/* Button to navigate to the Favourites page */}
                <button
                    onClick={() => navigate("/favourites")}
                    className="nav-link-button"
                >
                    Favourites
                </button>
                {/* Button to toggle dark mode, updating state and icon */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="dark-mode-toggle"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </nav>
        </header>
    );
}