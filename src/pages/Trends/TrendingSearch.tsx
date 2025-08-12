import React, { useState, useEffect } from "react";
import { TrendingUp, Globe, Tag, RefreshCw, AlertCircle } from "lucide-react";

interface TrendingKeyword {
  keyword: string;
  volume: number;
  growth: number;
  category: string;
}

interface TrendData {
  category: string;
  region: string;
  keywords: TrendingKeyword[];
  lastUpdated: string;
}

// API Configuration
const SERPER_CONFIG = {
  apiKey: import.meta.env.VITE_SERPER_API_KEY,
  baseUrl: "https://google.serper.dev/search",
};

// Dummy fallback data
const DUMMY_TREND_DATA: TrendData[] = [
  {
    category: "Technology",
    region: "Global",
    keywords: [
      {
        keyword: "Artificial intelligence",
        volume: 2500000,
        growth: 15.2,
        category: "AI",
      },
      {
        keyword: "Cyber attack",
        volume: 890000,
        growth: 8.7,
        category: "Cyber Security",
      },
      {
        keyword: "5G URLLC",
        volume: 650000,
        growth: 12.3,
        category: "5G",
      },
      {
        keyword: "Cloud automation",
        volume: 420000,
        growth: 25.1,
        category: "Automation",
      },
      {
        keyword: "Drones",
        volume: 1800000,
        growth: 5.6,
        category: "General",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    category: "Business",
    region: "US",
    keywords: [
      {
        keyword: "startup funding",
        volume: 340000,
        growth: 18.9,
        category: "Finance",
      },
      {
        keyword: "remote work",
        volume: 1200000,
        growth: 3.2,
        category: "Workplace",
      },
      {
        keyword: "digital marketing",
        volume: 980000,
        growth: 7.8,
        category: "Marketing",
      },
      {
        keyword: "cryptocurrency",
        volume: 2100000,
        growth: -2.4,
        category: "Finance",
      },
      {
        keyword: "e-commerce",
        volume: 1450000,
        growth: 9.1,
        category: "Retail",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    category: "Entertainment",
    region: "Global",
    keywords: [
      {
        keyword: "streaming services",
        volume: 890000,
        growth: 4.5,
        category: "Media",
      },
      {
        keyword: "video games",
        volume: 1600000,
        growth: 11.2,
        category: "Gaming",
      },
      {
        keyword: "social media",
        volume: 2200000,
        growth: -1.8,
        category: "Social",
      },
      {
        keyword: "mobile apps",
        volume: 750000,
        growth: 6.9,
        category: "Technology",
      },
      {
        keyword: "content creation",
        volume: 620000,
        growth: 22.7,
        category: "Creator Economy",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
];

const TrendingSearch: React.FC = () => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Technology");
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(true);

  // Serper API call function
  const fetchTrendingData = async (query: string): Promise<any> => {
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
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Serper API Error:", error);
      throw error;
    }
  };

  // Process Serper API response to extract trending keywords
  const processTrendingData = (
    apiResponse: any,
    category: string,
    region: string
  ): TrendData => {
    // This adapt based on actual Serper API response structure
    const processedKeywords: TrendingKeyword[] = [];

    if (apiResponse.organic) {
      apiResponse.organic.slice(0, 5).forEach((item: any, index: number) => {
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
  const fetchData = async () => {
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
          <p>Powered by Serper API</p>
        </div>
      </div>
    </div>
  );
};

export default TrendingSearch;
