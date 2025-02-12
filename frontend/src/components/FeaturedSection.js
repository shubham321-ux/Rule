import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./css/FeaturedSection.css";

const FeaturedSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const items = [
    {
      id: 1,
      title: "Item 1",
      description: "Description 1",
      rating: 4.5,
      author: "shubham",
    },
    {
      id: 2,
      title: "Item 2",
      description: "Description 2",
      rating: 4.8,
      author: "shubham",
    },
    // Add more items as needed
  ];

  const handleScroll = (direction) => {
    const container = document.querySelector(".items-container");
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="featured-section">
      <div className="featured-content">
        <div className="content-left">
          <p className="subtitle">Featured Collection</p>
          <h2 className="section-title">Discover Our Special Selection</h2>
          <p className="section-description">
            Explore our handpicked collection of premium items curated just for
            you
          </p>
        </div>

        <div className="content-right">
  <div className="items-container">
    {items.map((item) => (
      <div key={item.id} className="item-card">
        <div className="item-header">
          <h3>{item.title}</h3>
          <p>{item.author}</p>
        </div>
        <div className="item-details">
          <p className="item-description">{item.description}</p>
          <div className="rating">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < Math.floor(item.rating) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
            <span className="rating-number">{item.rating}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="scroll-buttons-bottom">
    <button onClick={() => handleScroll("left")} className="scroll-button">
      <IoIosArrowBack size={20} />
    </button>
    <button onClick={() => handleScroll("right")} className="scroll-button">
      <IoIosArrowForward size={20} />
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default FeaturedSection;
