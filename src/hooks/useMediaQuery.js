// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

/**
 * A custom hook that returns whether a given media query matches the current viewport
 * @param {string} query - The media query to check against (e.g. '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  // Initialize with the current match state if window is available
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    // Return early if window is not available (e.g. during SSR)
    if (typeof window === 'undefined') return;

    // Create the media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Handler function to update state when query match changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial matches value
    setMatches(mediaQueryList.matches);

    // Add event listener for changes
    // Use the modern addEventListener API if available, otherwise use deprecated addListener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Clean up event listener on component unmount
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Fallback cleanup for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]); // Re-run effect if query changes

  return matches;
};