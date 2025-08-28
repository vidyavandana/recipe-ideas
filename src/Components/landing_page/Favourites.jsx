import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import "./Favourites.css";
export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  // Load favorites from local storage on initial render
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);
  const handleRemoveFavorite = (idMeal) => {
    const updatedFavorites = favorites.filter(meal => meal.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  const handleMealClick = (idMeal) => {
    navigate(`/meal/${idMeal}`);
  };

  return (
    <div className="favorites-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <h1 className="favorites-heading">Your Favorite Recipes ❤️</h1>
      
      {/* Display a message if no favorites are saved */}
      {favorites.length === 0 ? (
        <p className="no-favorites-message">
          You haven't added any favorites yet. Start exploring recipes!
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(meal => (
            <div 
              key={meal.idMeal} 
              className="favorite-card"
              onClick={() => handleMealClick(meal.idMeal)}
            >
              {/* Button to remove a meal from favorites. `e.stopPropagation()` prevents the card's click event. */}
              <button 
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(meal.idMeal);
                }}
              >
                <XCircle size={20} />
              </button>
              <img 
                src={meal.strMealThumb} 
                alt={meal.strMeal} 
                className="favorite-image"
              />
              <div className="favorite-details">
                <h3 className="favorite-title">{meal.strMeal}</h3>
                <p className="favorite-area">{meal.strArea}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}