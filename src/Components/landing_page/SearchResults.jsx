import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SearchResults.css";

export default function SearchResults({ meals, handleMealClick }) {
  const navigate = useNavigate();

  return (
    <div className="search-results-container">
      {/* Button to navigate back to the previous page */}
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <h2 className="search-results-heading">Search Results</h2>
      
      {/* Conditionally render results or a "no meals found" message */}
      {meals.length === 0 ? (
        <p className="no-results-message">No meals found...</p>
      ) : (
        <div className="search-results-grid">
          {meals.map(meal => (
            <div 
              key={meal.idMeal} 
              className="search-result-card" 
              onClick={() => handleMealClick(meal.idMeal)}
            >
              <img 
                src={meal.strMealThumb} 
                alt={meal.strMeal} 
                className="search-result-image" 
              />
              <div className="search-result-details">
                <h3 className="search-result-title">{meal.strMeal}</h3>
                <p className="search-result-area">{meal.strArea}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}