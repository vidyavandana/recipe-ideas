import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Hero from "./Hero";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import RecommendedGrid from "./RecommendedGrid";
import Footer from "./Footer";
// Helper function to fetch a single meal by its ID
const fetchMealById = async (id) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals && data.meals[0] ? data.meals[0] : null;
};
const useMealSearch = (availableAreas) => {
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery) {
            setSearchResults(null);
            return;
        }
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const foundMeals = new Map();
        //Prioritize direct search by meal name
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${normalizedQuery}`);
            const data = await res.json();
            if (data.meals) {
                data.meals.forEach(meal => foundMeals.set(meal.idMeal, meal));
            }
        } catch (err) {
            console.error("Error with direct meal search:", err);
        }
        if (foundMeals.size === 0) {
            const matchedArea = availableAreas.find(area => area.toLowerCase() === normalizedQuery);
            if (matchedArea) {
                try {
                    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${matchedArea}`);
                    const data = await res.json();
                    if (data.meals) {
                        const detailedMeals = await Promise.all(
                            data.meals.map(meal => fetchMealById(meal.idMeal))
                        );
                        detailedMeals.forEach(meal => {
                            if (meal) foundMeals.set(meal.idMeal, meal);
                        });
                    }
                } catch (err) {
                    console.error("Error searching by area:", err);
                }
            }
        }

        // 3. If still no results, perform a multi-ingredient search
        if (foundMeals.size === 0) {
            const parts = normalizedQuery.split(/[\s,]+/).filter(item => item !== '');
            if (parts.length > 0) {
                const ingredientPromises = parts.map(ingredient =>
                    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
                        .then(res => res.json())
                        .then(data => data.meals || [])
                        .catch(err => {
                            console.error(`Error searching by ingredient '${ingredient}':`, err);
                            return [];
                        })
                );

                const ingredientResults = await Promise.all(ingredientPromises);
                const mealIngredientCounts = new Map();
                ingredientResults.forEach(mealList => {
                    mealList.forEach(meal => {
                        mealIngredientCounts.set(meal.idMeal, (mealIngredientCounts.get(meal.idMeal) || 0) + 1);
                    });
                });

                // Find meals that match at least half of the ingredients
                const matchedMealIds = [...mealIngredientCounts.entries()]
                    .filter(([id, count]) => count >= parts.length / 2)
                    .map(([id]) => id);

                const detailedMealsPromises = matchedMealIds.map(fetchMealById);
                const detailedMeals = await Promise.all(detailedMealsPromises);
                detailedMeals.forEach(meal => {
                    if (meal) foundMeals.set(meal.idMeal, meal);
                });
            }
        }

        setSearchResults(Array.from(foundMeals.values()));
    };

    return { searchResults, handleSearch };
};
export default function LandingPage() {
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize dark mode from localStorage to persist user preference
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === "true";
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [recommendedMeals, setRecommendedMeals] = useState([]);
    const [availableAreas, setAvailableAreas] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        document.body.classList.toggle("dark-mode", darkMode);
    }, [darkMode]);
    // Effect to fetch the list of available meal areas once on component mount
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
                const data = await res.json();
                if (data.meals) {
                    setAvailableAreas(data.meals.map(area => area.strArea));
                }
            } catch (err) {
                console.error("Error fetching available areas:", err);
            }
        };
        fetchAreas();
    }, []);
    // Effect to fetch recommended random meals once on component mount
    useEffect(() => {
        const fetchRecommendedMeals = async () => {
            try {
                const promises = Array.from({ length: 15 }, () =>
                    fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(res => res.json())
                );
                const results = await Promise.all(promises);
                setRecommendedMeals(results.map(r => r.meals[0]));
            } catch (err) {
                console.error("Error fetching recommended meals:", err);
            }
        };
        fetchRecommendedMeals();
    }, []);
    const { searchResults, handleSearch } = useMealSearch(availableAreas);
    const onSearch = () => {
        handleSearch(searchQuery);
    };
    // Handler to navigate to a specific meal's detail page
    const handleMealClick = (idMeal) => {
        navigate(`/meal/${idMeal}`);
    };
    return (
        <div className="landing-page">
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <Hero />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={onSearch}
            />
            
            {searchResults === null ? (
                <RecommendedGrid meals={recommendedMeals} handleMealClick={handleMealClick} />
            ) : searchResults.length > 0 ? (
                <SearchResults meals={searchResults} handleMealClick={handleMealClick} />
            ) : (
                <>
                    <p className="no-results-message">No meals found. Please try another search term.</p>
                    <RecommendedGrid meals={recommendedMeals} handleMealClick={handleMealClick} />
                </>
            )}
            <Footer />
        </div>
    );
}