// src/App.js
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage'; 
import AddChildPage from './pages/AddChildPage';
import EditProfilePage from './pages/EditProfilePage';
import BlogPage from './pages/BlogPage';
import MetricsPage from './pages/MetricsPage';
import MetricsComparisonPage from './pages/MetricsComparisonPage';
import MealPlanningPage from './pages/MealPlanningPage';
import ViewMealPlansPage from './pages/ViewMealPlansPage';


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={ < DashboardPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/add-child" element={<AddChildPage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/blog" element={<BlogPage/>} />
                <Route path="/metrics" element={<MetricsPage/>} />
                <Route path="/metrics-comparison" element={<MetricsComparisonPage/>} />
                <Route path="/meal-plansform" element={<MealPlanningPage/>} />
                <Route path="/view-meal-plans" element={<ViewMealPlansPage/>} />
               
                
                
            </Routes>
        </Router>
    );
}

export default App;