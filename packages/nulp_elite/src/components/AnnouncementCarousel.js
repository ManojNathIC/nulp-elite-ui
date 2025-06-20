import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./AnnouncementCarousel.css";
import DiscussionForumAnnouncement from "./DiscussionForumAnnouncement";
import LearnathonSection from "./LearnathonSection";

const AnnouncementCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carousel configuration
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  // Initialize announcements with timing
  useEffect(() => {
    const initializeAnnouncements = () => {
      const initialAnnouncements = [
        {
          id: "discussion-forum",
          component: <DiscussionForumAnnouncement />,
          delay: 0, // Show immediately
        },
        {
          id: "learnathon",
          component: <LearnathonSection />,
          delay: 10000, // Show after 10 seconds
        },
        // Future announcements can be added here
        // {
        //   id: "future-announcement",
        //   component: <FutureAnnouncement />,
        //   delay: 20000, // Show after 20 seconds
        // },
      ];

      setAnnouncements(initialAnnouncements);
      setIsInitialized(true);
    };

    initializeAnnouncements();
  }, []);

  // Handle slide change
  const handleSlideChange = (currentSlideIndex) => {
    setCurrentSlide(currentSlideIndex);
  };

  // Auto-advance to learnathon after 10 seconds
  useEffect(() => {
    if (isInitialized && announcements.length > 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(1); // Move to learnathon slide
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, announcements.length]);

  // Don't render if no announcements
  if (!isInitialized || announcements.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="xl" className="announcement-carousel-container">
      <Box className="announcement-carousel-wrapper">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={announcements.length > 1}
          responsive={responsive}
          ssr={true}
          infinite={false}
          autoPlay={false}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="announcement-carousel-container"
          dotListClass="announcement-dot-list"
          itemClass="announcement-item"
          beforeChange={(nextSlide) => handleSlideChange(nextSlide)}
          activeSlide={currentSlide}
        >
          {announcements.map((announcement, index) => (
            <Box key={announcement.id} className="announcement-slide">
              {announcement.component}
            </Box>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};

export default AnnouncementCarousel;
