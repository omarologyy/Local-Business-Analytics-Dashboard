import React, { useState, useEffect } from "react";
import { TrendingUp, Globe, Tag, RefreshCw, AlertCircle } from "lucide-react";
import { DUMMY_TREND_DATA, TrendData, TrendingKeyword } from "./DummyData";

// Serper API Response Types
interface SerperOrganicResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  position: number;
}

interface SerperKnowledgeGraph {
  title?: string;
  type?: string;
  website?: string;
  imageUrl?: string;
  description?: string;
  descriptionSource?: string;
  descriptionLink?: string;
  attributes?: Record<string, string>;
}

interface SerperPeopleAlsoAsk {
  question: string;
  snippet: string;
  title: string;
  link: string;
}

interface SerperRelatedSearches {
  query: string;
}

interface SerperSearchParameters {
  q: string;
  gl?: string;
  hl?: string;
  num?: number;
  autocorrect?: boolean;
  page?: number;
  type?: string;
  engine?: string;
}

interface SerperApiResponse {
  searchParameters: SerperSearchParameters;
  organic?: SerperOrganicResult[];
  knowledgeGraph?: SerperKnowledgeGraph;
  peopleAlsoAsk?: SerperPeopleAlsoAsk[];
  relatedSearches?: SerperRelatedSearches[];
  credits?: number;
}

// API Configuration
const SERPER_CONFIG = {
  apiKey: import.meta.env.VITE_SERPER_API_KEY,
  baseUrl: "https://google.serper.dev/search",
};

const TrendingSearch: React.FC = () => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Technology");
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(true);

  // Serper API call function with proper typing
  const fetchTrendingData = async (
    query: string
  ): Promise<SerperApiResponse> => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", SERPER_CONFIG.apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ q: query });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(SERPER_CONFIG.baseUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: SerperApiResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Serper API Error:", error);
      throw error;
    }
  };

  // Process Serper API response to extract trending keywords with proper typing
  const processTrendingData = (
    apiResponse: SerperApiResponse,
    category: string,
    region: string
  ): TrendData => {
    const processedKeywords: TrendingKeyword[] = [];

    if (apiResponse.organic) {
      apiResponse.organic
        .slice(0, 5)
        .forEach((item: SerperOrganicResult, index: number) => {
          processedKeywords.push({
            keyword:
              item.title?.toLowerCase().slice(0, 30) || `trending ${index + 1}`,
            volume: Math.floor(Math.random() * 1000000) + 100000,
            growth: Math.floor(Math.random() * 40) - 10,
            category: category,
          });
        });
    }

    return {
      category,
      region,
      keywords: processedKeywords,
      lastUpdated: new Date().toISOString(),
    };
  };

  // Fetch data from API or use fallback
  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Construct query based on selected category and region
      const query = `trending ${selectedCategory.toLowerCase()} ${selectedRegion.toLowerCase()}`;

      const apiResponse = await fetchTrendingData(query);
      const processedData = processTrendingData(
        apiResponse,
        selectedCategory,
        selectedRegion
      );

      // Update the trend data
      setTrendData((prev) => {
        const filtered = prev.filter(
          (item) =>
            item.category !== selectedCategory || item.region !== selectedRegion
        );
        return [...filtered, processedData];
      });

      setUsingFallback(false);
    } catch (err) {
      console.error("Failed to fetch trending data:", err);
      setError("Failed to fetch live data. Using fallback data.");
      setUsingFallback(true);
      // Use dummy data as fallback
      if (trendData.length === 0) {
        setTrendData(DUMMY_TREND_DATA);
      }
    }

    setLoading(false);
  };

  // Initialize with dummy data
  useEffect(() => {
    setTrendData(DUMMY_TREND_DATA);
  }, []);

  // Get current trend data based on selection
  const currentTrendData =
    trendData.find(
      (item) =>
        item.category === selectedCategory && item.region === selectedRegion
    ) || trendData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="text-blue-600" />
            Trending Search Keywords
          </h1>
          <p className="text-gray-600">
            Discover what's trending across different categories and regions
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              {/* Category Selector */}
              <div className="flex items-center gap-2">
                <Tag className="text-gray-500" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              {/* Region Selector */}
              <div className="flex items-center gap-2">
                <Globe className="text-gray-500" size={20} />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Global">Global</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">Europe</option>
                  <option value="NG">Nigeria</option>
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Status Indicators */}
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="text-yellow-800">{error}</span>
            </div>
          )}

          {usingFallback && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-800">
                Currently showing demo data. Click refresh to fetch live data.
              </span>
            </div>
          )}
        </div>

        {/* Trending Keywords Display */}
        {currentTrendData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentTrendData.category} - {currentTrendData.region}
              </h2>
              <span className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(currentTrendData.lastUpdated).toLocaleString()}
              </span>
            </div>

            <div className="grid gap-4">
              {currentTrendData.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">
                        {keyword.keyword}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {keyword.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {keyword.volume.toLocaleString()} searches
                    </div>
                    <div
                      className={`text-sm flex items-center gap-1 ${
                        keyword.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp
                        className={`size-3 ${
                          keyword.growth < 0 ? "rotate-180" : ""
                        }`}
                      />
                      {keyword.growth >= 0 ? "+" : ""}
                      {keyword.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Powered by Serper API </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingSearch;
