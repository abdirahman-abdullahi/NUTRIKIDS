import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogComponent.css'; // Import the styles
import logo from '../assets/logo.jpeg';

const BlogComponent = () => {
  // Array of foods with details
  const foods = [
    {
      name: "Ugali",
      description: "Ugali is the national dish of Kenya, made from maize flour (cornmeal) cooked with water to a porridge- or dough-like consistency. It is the staple accompaniment to meals for most Kenyan families. Ugali is typically eaten with hands and used to scoop up meat stews or vegetable sauces.",
      image: "ugali.jpg"
    },
    {
      name: "Sukuma Wiki",
      description: "Sukuma Wiki, a nutritious and ubiquitous dish in Kenyan homes, consists of collard greens sautéed with onions and spices, sometimes mixed with a small amount of meat or fish. The name translates to 'push the week' implying its role in stretching meals to last all week.",
      image: "sukuma-wiki.jpg"
    },
    {
      name: "Nyama Choma",
      description: "Nyama Choma, which means 'grilled meat' in Swahili, is a favorite dish in Kenya, especially during gatherings and celebrations. It is typically made from goat, beef, or chicken, seasoned simply with salt, and grilled over charcoal until tender.",
      image: "nyama-choma.jpg"
    },
    {
      name: "Chapati",
      description: "Chapati, a type of unleavened flatbread from the Indian subcontinent, has become a beloved part of Kenyan cuisine. It's made by kneading whole wheat flour, water and oil into a dough, then rolling it out and frying it on a skillet.",
      image: "chapati.jpg"
    },
    {
      name: "Mandazi",
      description: "Mandazi, also known as the Swahili bun or doughnut, is a form of fried bread that's slightly sweet and sometimes flavored with coconut or cardamom. It's a popular snack or breakfast item, often served with Kenyan chai (tea).",
      image: "mandazi.jpg"
    },
    {
      name: "Githeri",
      description: "Githeri is a traditional Kenyan dish originally from the Kikuyu tribe, consisting of boiled maize and beans, sometimes mixed with green peas and potatoes. It can be seasoned with salt, pepper, and sometimes served with a side of vegetables.",
      image: "githeri.jpg"
    },
    {
      name: "Samaki",
      description: "Samaki, which means 'fish' in Swahili, refers to various fish dishes that are often grilled or fried and served with lemon wedges. Fish is particularly popular in the regions close to Lake Victoria and along the coast.",
      image: "samaki.jpg"
    },
    {
      name: "Kachumbari",
      description: "Kachumbari is a fresh tomato and onion salad that often includes chillies, cilantro, and sometimes avocado. It's a common accompaniment to Nyama Choma and other main dishes, adding a crisp, refreshing bite.",
      image: "kachumbari.jpg"
    },
    {
      name: "Pilau",
      description: "Pilau is a fragrant rice dish cooked with spices like cumin, cardamom, cinnamon, and cloves, often mixed with pieces of meat, such as chicken or beef, and sometimes potatoes and peas. It's a festive dish, commonly served at celebrations.",
      image: "pilau.jpg"
    },
    {
      name: "Biriani",
      description: "Biriani is an aromatic and colorful rice dish with origins in the Indian subcontinent but has been adopted into Swahili cuisine with local variations. It is often made with chicken or beef, cooked with a blend of spices, and served at weddings and special occasions.",
      image: "biriani.jpg"
    },
    {
      name: "Matoke",
      description: "Matoke refers to a dish of starchy bananas, known in Swahili as 'ndizi', which are cooked and mashed with onions, tomatoes, garlic, and sometimes lemon juice. It's a common meal in Western Kenya and among the Kisii community.",
      image: "matoke.jpg"
    },
    {
      name: "Irio",
      description: "Irio is another traditional Kikuyu dish that has become popular across Kenya. It's made by mashing together green peas and potatoes, often with corn added for texture and sweetness. It's typically served with roasted or stewed meat.",
      image: "irio.jpg"
    },
    {
      name: "Kenyan Beef Stew",
      description: "Kenyan Beef Stew is a hearty dish made with chunks of beef slow-cooked with carrots, potatoes, onions, and aromatic spices. It's a fulfilling dish often enjoyed with Ugali or rice, providing a comforting and satisfying meal.",
      image: "kenyan-beef-stew.jpg"
    },
    {
      name: "Wali wa Nazi",
      description: "Wali wa Nazi is a coconut rice dish that's creamy and rich, often served as a side with spicy curries or grilled meats. It's particularly popular along the Kenyan coast, where coconut trees are abundant.",
      image: "wali-wa-nazi.jpg"
    },
    {
      name: "Tilapia",
      description: "Tilapia is a type of fish commonly found in Kenyan waters, especially in Lake Victoria. It's often fried until crispy and served with sides such as Ugali and Kachumbari, making for a simple yet delicious meal.",
      image: "tilapia.jpg"
    }
  ];

  return (
    <div className="page-container">
      <nav className="dashboard-nav">
        <img src={logo} alt="NutriKids Logo" className="navbar-logo" />
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/account" className="nav-link">Account</Link>
          <Link to="/meal-plansform" className="nav-link">Meals</Link>
          <Link to="/view-meal-plans" className="nav-link">Meal-Plans</Link>
          <Link to="/metrics" className="nav-link">Metrics</Link>
          <Link to="/metrics-comparison" className="nav-link">Comparison</Link>
          
        </div>
      </nav>
      <div className="blog-container">
        {foods.map((food, index) => (
          <div key={index} className="food-item">
            <img src={require(`../assets/${food.image}`)} alt={food.name} className="food-image" />
            <div className="food-info">
              <h3>{food.name}</h3>
              <p>{food.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogComponent;