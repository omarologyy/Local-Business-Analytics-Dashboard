// src/components/Trends.tsx

import React, { useState, useEffect } from "react";
import { getTrendingSearches } from "../serperTrendsService";

// Define the available categories and regions for your dropdowns
const categories = [
  { value: "business", label: "Business" },
  { value: "tech", label: "Technology" },
  { value: "sports", label: "Sports" },
  // Add more as needed, check Serper.dev docs for valid categories
];

const regions = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "IN", label: "India" },
  // Add more as needed, check Serper.dev docs for valid regions
];

const Trends: React.FC = () => {
  // Use useState to manage the selected category and region
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].value
  );
  const [selectedRegion, setSelectedRegion] = useState<string>(
    regions[0].value
  );

  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        // Pass the state values to your service function
        const data = await getTrendingSearches(
          selectedCategory,
          selectedRegion
        );
        setTrends(data);
      } catch (err) {
        setError("Failed to fetch trending searches.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [selectedCategory, selectedRegion]); // The effect now depends on these two state variables

  // Handlers for when the dropdown values change
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Google Trends</h1>
      {/* Category Dropdown */}
      <label htmlFor="category-select">Select Category: </label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Region Dropdown */}
      <label htmlFor="region-select">Select Region: </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={handleRegionChange}
      >
        {regions.map((reg) => (
          <option key={reg.value} value={reg.value}>
            {reg.label}
          </option>
        ))}
      </select>

      <h2>
        Trending Searches for {selectedCategory} in {selectedRegion}
      </h2>
      {trends && (
        <ul>
          {/* Display the trending searches */}
          {trends.related_queries
            .slice(0, 10)
            .map((item: any, index: number) => (
              <li key={index}>
                {item.query} (Score: {item.value})
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Trends;
