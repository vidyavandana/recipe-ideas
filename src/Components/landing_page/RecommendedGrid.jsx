import { useNavigate } from "react-router-dom";
import "./RecommendedGrid.css";
export default function RecommendedGrid({ meals, handleMealClick }) {
    const navigate = useNavigate();
    // Use a Set to efficiently filter out duplicate meals by ID
    const uniqueMeals = Array.from(new Set(meals.map(meal => meal.idMeal)))
        .map(id => meals.find(meal => meal.idMeal === id))
        // Filter out meals with missing data or long titles for better display
        .filter(meal => meal && meal.strMeal && meal.strMeal.length < 20);
         const onMealClick = handleMealClick || ((id) => navigate(`/meal/${id}`));
    return (
        <section className="recommended-section">
            <h2 className="recommended-heading">🔥 Recommended for You</h2>
            <div className="recommended-grid">
                {uniqueMeals.map(meal => (
                    <div
                        key={meal.idMeal}
                        className="meal-card"
                        onClick={() => onMealClick(meal.idMeal)}
                    >
                        <div className="meal-image-wrapper">
                            <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
                        </div>
                        <h3 className="meal-title">
                            {meal.strMeal}
                        </h3>
                        <p className="meal-area">
                            {meal.strArea || "World"}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}