import { useEffect, useState, useCallback } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Debounce function to limit the rate of function execution
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    const debouncedToggleVisibility = debounce(toggleVisibility, 200);
    window.addEventListener("scroll", debouncedToggleVisibility);

    return () => window.removeEventListener("scroll", debouncedToggleVisibility);
  }, [toggleVisibility]);

  return (
    <>
      {isVisible && (
        <div className="scrollToHome" onClick={scrollToTop}>
          <i className="flaticon-arrows"></i>
        </div>
      )}
    </>
  );
}
