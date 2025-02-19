import React from 'react'
import "./css/About.css"
import OurMission from '../assest/About/our-mission.png'
import OurApproach from '../assest/About/our-approach.png'
import OurStories from '../assest/About/our-stories.png'
import OurPhilosphy from '../assest/About/our-philosphy.png'
import { ReactComponent as QuoteIcon } from '../assest/About/Quote.svg'
 
const AboutLowerContent = [
    {
        title: "BEST SELLER",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
     
    },
    {
        title: "READERS CHOICE",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
 
    },
    {
        title: "BIOGRAPHICAL",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
 
    },
    {
        title: "SCIENCE FICTION",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
       
    }
];
 
const aboutCards = [
    { id: 1, title: "OUR MISSION", image: OurMission, reverse: false, description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." },
    { id: 2, title: "OUR STORIES", image: OurStories, reverse: false, description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." },
    { id: 3, title: "OUR APPROACH", image: OurApproach, reverse: true, description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." },
    { id: 4, title: "OUR PHILOSOPHY", image: OurPhilosphy, reverse: true, description:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." },
  ];
 
 
const About = () => {
    return (<div className='main-hero'>
        <div>
            <div className="about-container">
 
                 <div className="about-sub-container1">
        {aboutCards.reduce((rows, item, index) => {
          if (index % 2 === 0) rows.push([item]);
          else rows[rows.length - 1].push(item);
          return rows;
        }, []).map((row, rowIndex) => (
          <div className="about-container1-row" key={rowIndex}>
            {row.map((card) => (
              <div className="about-container1-card" key={card.id}>
                {!card.reverse ? (
                  <>
                    <div className="about-card-content">
                      <h1 className="about-sub-heading">{card.title}</h1>
                      <p className="about-card-para">
                        {card.description}
                      </p>
                    </div>
                    <img src={card.image} alt={card.title} className="about-card-image" />
                  </>
                ) : (
                  <>
                    <img src={card.image} alt={card.title} className="about-card-image" />
                    <div className="about-card-content">
                      <h1 className="about-sub-heading">{card.title}</h1>
                      <p className="about-card-para">
                         {card.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
           
                <div className="about-sub-container2">
                    <QuoteIcon />
                    <p className="about-container2-para">
                        An amazing space for book lovers, offering the latest and most high-quality titles across genres, An amazing space for book lovers, offering the latest and most high-quality titles across genres, An amazing space for book lovers, offering the latest and most high-quality titles across genres, An amazing space for book lovers, offering the latest.
                    </p>
                </div>
 
                <div className="about-sub-container3">
                    {AboutLowerContent.map((category, index) => (
                        <div className="about-sub-container3-card" key={index}>
                            <h1 className="about-sub-heading about-sub-container3-card-heading">{category.title}</h1>
                            <p className="about-card-para">
                                {category.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    )
}
export default About