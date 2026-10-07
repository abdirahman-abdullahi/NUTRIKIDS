import React from 'react';
import '../styles/ChildCard.css';

const ChildCard = ({ child, onClick }) => {
    return (
        <div className="child-card" onClick={onClick}>
            <h3>{child.child_name}</h3>
            <p>Age: {child.age} years</p>  {/* Show the calculated age */}
        </div>
    );
};

export default ChildCard;
