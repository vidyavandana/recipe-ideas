import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import "./MealPopUp.css";

export default function MealPopup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [activeTab, setActiveTab] = useState("method");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedMeal = data.meals[0];
        setMeal(fetchedMeal);
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFav = favorites.some(fav => fav.idMeal === fetchedMeal.idMeal);
        setIsFavorite(isFav);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!meal)
    return (
      <p className="meal-popup-container">
        Loading...
      </p>
    );

  const steps = meal.strInstructions
    ? meal.strInstructions.split(". ").filter((s) => s.trim() !== "")
    : [];

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          ingredient: ingredient,
          measure: measure,
        });
      }
    }
    return ingredients;
  };
  const ingredients = getIngredients();

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
    } else {
      newFavorites = [...favorites, meal];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };
  return (
    <div className="meal-popup-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <div className="image-container">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="meal-image"
        />
      </div>
        <button onClick={toggleFavorite} className="favorite-button">
          <Heart
            size={24}
            fill={isFavorite ? 'red' : 'none'}
            color={isFavorite ? 'red' : 'black'}
          />
        </button>
      <div className="info-card">
        <h1 className="meal-title">{meal.strMeal}</h1>
        <span className="famous-tag">
          Famous at {meal.strArea || "World"}
        </span>
        <p className="category-text">
          Category: {meal.strCategory || "Category N/A"}
        </p>
      </div>
      <div className="tab-container">
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`tab-button ${activeTab === "ingredients" ? "active" : ""}`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("method")}
            className={`tab-button ${activeTab === "method" ? "active" : ""}`}
          >
            Method
          </button>
        </div>
        {activeTab === "method" && (
          <ul className="content-list">
            {steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">
                  Step {index + 1}:
                </span>{" "}
                {step.trim()}.
              </li>
            ))}
          </ul>
        )}
        {activeTab === "ingredients" && (
          <ul className="content-list">
            {ingredients.map((item, index) => (
              <li key={index}>
                {item.measure} {item.ingredient}
              </li>
            ))}
          </ul>
        )}
      </div>
      {meal.strYoutube && (
        <a
          href={meal.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="video-button"
        >
          🎬 Watch Video
        </a>
      )}
    </div>
  );
}