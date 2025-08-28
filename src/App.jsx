import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/landing_page/LandingPage";
import MealPopup from "./Components/landing_page/MealPopUp";
import Favourites from "./Components/landing_page/Favourites";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/favourites" element={<Favourites />} />
        <Route path="/meal/:id" element={<MealPopup />} />
      </Routes>
    </Router>
  );
}
