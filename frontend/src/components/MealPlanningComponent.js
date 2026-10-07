import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/MealPlanningComponent.css';

function MealPlanningComponent() {
    const { user } = useContext(UserContext);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        drinks: []
    });
    const [selectedMeals, setSelectedMeals] = useState({
        breakfastItem: '',
        breakfastDrink: '',
        lunchItem: '',
        lunchDrink: '',
        dinnerItem: '',
        dinnerDrink: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchChildren = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('No token found');
                return;
            }

            try {
                const response = await fetch('http://localhost:5001/api/child/get-children', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch children: ${response.status}`);
                }

                const data = await response.json();
                setChildren(data.map(child => ({
                    ...child,
                    id: child.id.toString(),
                    name: child.child_name
                })));
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchChildren();
    }, [user]);

    useEffect(() => {
        const fetchFoodsByCategory = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/nutrition/foods');
                if (!response.ok) {
                    throw new Error('Failed to fetch foods');
                }
                const data = await response.json();
                const categorizedFoods = {
                    breakfast: data.filter(item => item.category === 'Breakfast'),
                    lunch: data.filter(item => item.category === 'Lunch'),
                    dinner: data.filter(item => item.category === 'Dinner'),
                    drinks: data.filter(item => item.category === 'Drinks')
                };
                setMeals(categorizedFoods);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchFoodsByCategory();
    }, []);

    const handleMealSelection = (e) => {
        const { name, value } = e.target;
        setSelectedMeals(prevMeals => ({
            ...prevMeals,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedChild) {
            alert('Please select a child before submitting.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/mealplans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    child_id: selectedChild,
                    breakfast_item: selectedMeals.breakfastItem,
                    breakfast_drink: selectedMeals.breakfastDrink,
                    lunch_item: selectedMeals.lunchItem,
                    lunch_drink: selectedMeals.lunchDrink,
                    dinner_item: selectedMeals.dinnerItem,
                    dinner_drink: selectedMeals.dinnerDrink
                })
            });

            if (!response.ok) throw new Error('Failed to submit meal plan');
            alert('Meal plan submitted successfully!');
        } catch (error) {
            alert('Failed to submit meal plan: ' + error.message);
        }
    };

    return (
        <div className="meal-planning">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="child">Child:</label>
                <select name="child" onChange={e => setSelectedChild(e.target.value)} value={selectedChild}>
                    <option value="">Select a child</option>
                    {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                </select>

                <label htmlFor="breakfastItem">Breakfast Item:</label>
                <select name="breakfastItem" onChange={handleMealSelection} value={selectedMeals.breakfastItem}>
                    {meals.breakfast.map(item => (
                        <option key={item.food_id} value={item.food_id}>{item.name}</option>
                    ))}
                </select>

                <label htmlFor="breakfastDrink">Breakfast Drink:</label>
                <select name="breakfastDrink" onChange={handleMealSelection} value={selectedMeals.breakfastDrink}>
                    {meals.drinks.map(drink => (
                        <option key={drink.food_id} value={drink.food_id}>{drink.name}</option>
                    ))}
                </select>

                <label htmlFor="lunchItem">Lunch Item:</label>
                <select name="lunchItem" onChange={handleMealSelection} value={selectedMeals.lunchItem}>
                    {meals.lunch.map(item => (
                        <option key={item.food_id} value={item.food_id}>{item.name}</option>
                    ))}
                </select>

                <label htmlFor="lunchDrink">Lunch Drink:</label>
                <select name="lunchDrink" onChange={handleMealSelection} value={selectedMeals.lunchDrink}>
                    {meals.drinks.map(drink => (
                        <option key={drink.food_id} value={drink.food_id}>{drink.name}</option>
                    ))}
                </select>

                <label htmlFor="dinnerItem">Dinner Item:</label>
                <select name="dinnerItem" onChange={handleMealSelection} value={selectedMeals.dinnerItem}>
                    {meals.dinner.map(item => (
                        <option key={item.food_id} value={item.food_id}>{item.name}</option>
                    ))}
                </select>

                <label htmlFor="dinnerDrink">Dinner Drink:</label>
                <select name="dinnerDrink" onChange={handleMealSelection} value={selectedMeals.dinnerDrink}>
                    {meals.drinks.map(drink => (
                        <option key={drink.food_id} value={drink.food_id}>{drink.name}</option>
                    ))}
                </select>

                <button type="submit">Submit Meal Plan</button>
            </form>
        </div>
    );
}

export default MealPlanningComponent;