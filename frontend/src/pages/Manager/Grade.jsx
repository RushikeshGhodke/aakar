import React, { useState, useEffect } from 'react';
import './Grade.css';
import axios from 'axios';

function Grade({ pemp_id, pskill_id, pgrade, onGradeChange ,isChangable = false }) {
  const [clickedIndex, setClickedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (pgrade) {
      setClickedIndex(pgrade);
    }
  }, [pgrade]);

  const handleHover = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const handleClick = (index) => {
    setClickedIndex(index);
    onGradeChange(pemp_id, pskill_id, index); // Update local state in the parent
  };

  return (
    <div className="cell-container">
      <div className="matrix">
        {[1, 2, 3, 4].map((cellIndex) => (
          <div
            key={cellIndex}
            className={`cell
              ${clickedIndex !== null && cellIndex <= clickedIndex ? 'clicked' : ''}
              ${hoveredIndex !== null && cellIndex <= hoveredIndex ? 'hovered' : ''}`}
              onMouseEnter={isChangable ? () => handleHover(cellIndex) : undefined}
              onMouseLeave={isChangable ? handleMouseLeave : undefined}
              onClick={isChangable ? () => handleClick(cellIndex) : undefined}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Grade;

