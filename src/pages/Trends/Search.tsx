// SearchPage.tsx
import React, { useState, FormEvent } from "react";

// Update the type to match SerperAPI response structure
type SerperResult = {
  title: string;
  link: string;
  snippet?: string;
  position?: number;
  date?: string;
};

type SerperResponse = {
  organic: SerperResult[];
  searchParameters: {
    q: string;
    type: string;
  };
  searchInformation?: {
    totalResults: string;
    timeTaken: number;
  };
};

// Trending searches data structure
type TrendingCategory = {
  name: string;
  keywords: string[];
};

type RegionTrends = {
  region: string;
  categories: TrendingCategory[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SerperResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [showTrending, setShowTrending] = useState(true);
  const [searchSuccess, setSearchSuccess] = useState(false);

  // Mock trending data (replace with real API call)
  const trendingData: RegionTrends[] = [
    {
      region: "US",
      categories: [
        {
          name: "Technology",
          keywords: ["iPhone 16", "Tesla", "OpenAI", "AI news", "Drone"],
        },
        {
          name: "Entertainment",
          keywords: [
            "Netflix",
            "Taylor Swift",
            "Marvel movies",
            "TikTok",
            "Spotify",
          ],
        },
        {
          name: "Sports",
          keywords: [
            "NFL playoffs",
            "NBA scores",
            "World Cup",
            "Olympics",
            "Soccer",
          ],
        },
        {
          name: "News",
          keywords: [
            "Election 2024",
            "Climate change",
            "Economy news",
            "Health updates",
            "World news",
          ],
        },
      ],
    },
    {
      region: "Nigeria",
      categories: [
        {
          name: "Technology",
          keywords: [
            "Fintech Nigeria",
            "Mobile banking",
            "Tech jobs Lagos",
            "Internet providers",
            "Cryptocurrency",
          ],
        },
        {
          name: "Entertainment",
          keywords: [
            "Nollywood movies",
            "Afrobeats",
            "Big Brother Naija",
            "Nigerian music",
            "Comedy shows",
          ],
        },
        {
          name: "Sports",
          keywords: [
            "Super Eagles",
            "Nigerian Premier League",
            "Football transfers",
            "Manchester United",
            "Boxing",
          ],
        },
        {
          name: "Business",
          keywords: [
            "Lagos business",
            "Import export",
            "Real estate Nigeria",
            "Stock market",
            "Small business",
          ],
        },
      ],
    },
    {
      region: "UK",
      categories: [
        {
          name: "Technology",
          keywords: [
            "Tech London",
            "AI startups",
            "Cybersecurity UK",
            "Cloud computing",
            "5G UK",
          ],
        },
        {
          name: "Entertainment",
          keywords: [
            "BBC shows",
            "British music",
            "West End shows",
            "UK festivals",
            "Streaming UK",
          ],
        },
        {
          name: "Sports",
          keywords: [
            "Premier League",
            "Cricket England",
            "Wimbledon",
            "Rugby",
            "F1 British GP",
          ],
        },
        {
          name: "News",
          keywords: [
            "UK politics",
            "Royal family",
            "Brexit updates",
            "Weather UK",
            "Education UK",
          ],
        },
      ],
    },
  ];

  // SerperAPI integration with success tracking
  async function searchWithSerper(q: string): Promise<SerperResult[]> {
    const myHeaders = new Headers();
    myHeaders.append(
      "X-API-KEY",
      process.env.REACT_APP_SERPER_API_KEY || "your-api-key-here"
    );
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      q: q,
      num: 10,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://google.serper.dev/search",
        requestOptions
      );

      if (!response.ok) {
        console.warn(
          `SerperAPI returned status ${response.status}, falling back to dummy data`
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SerperResponse = await response.json();

      // Check for successFUL response
      const isSuccessful = result.organic && result.organic.length > 0;
      setSearchSuccess(isSuccessful);

      // Store search info for display
      setSearchInfo(result.searchInformation);

      return result.organic || [];
    } catch (error) {
      console.error("SerperAPI Error:", error);
      setSearchSuccess(false);
      throw new Error("Failed to search. Please try again.");
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setSearchInfo(null);
    setSearchSuccess(false);

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setShowTrending(false); // Hide trending when searching

    try {
      const data = await searchWithSerper(trimmed);
      setResults(data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Handle trending keyword click
  const handleTrendingClick = (keyword: string) => {
    setQuery(keyword);
    setShowTrending(false);
    // Auto-search the trending term
    handleSearchWithKeyword(keyword);
  };

  // Search with specific keyword (for trending clicks)
  const handleSearchWithKeyword = async (keyword: string) => {
    setError(null);
    setResults(null);
    setSearchInfo(null);
    setSearchSuccess(false);
    setLoading(true);

    try {
      const data = await searchWithSerper(keyword);
      setResults(data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get current region's trending data
  const currentTrends =
    trendingData.find((data) => data.region === selectedRegion) ||
    trendingData[0];

  // Helper function to format URLs for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Search</h1>
          <p className="text-sm text-gray-500 mt-1">
            Powered by Google via SerperAPI
          </p>

          {/* Success indicator */}
          {searchSuccess && (
            <div className="mt-2 flex items-center text-green-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Search successful
            </div>
          )}
        </header>

        {/* Region selector */}
        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="region" className="text-sm font-medium text-gray-700">
            Region:
          </label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="US">United States</option>
            <option value="Nigeria">Nigeria</option>
            <option value="UK">United Kingdom</option>
          </select>

          <button
            onClick={() => setShowTrending(!showTrending)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showTrending ? "Hide" : "Show"} Trending
          </button>
        </div>

        {/* Trending Keywords Section */}
        {showTrending && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              🔥 Trending in {currentTrends.region}
            </h2>
            <div className="space-y-4">
              {currentTrends.categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.keywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => handleTrendingClick(keyword)}
                        className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form
          className="flex gap-3"
          onSubmit={handleSearch}
          aria-label="Search form"
        >
          <label htmlFor="search" className="sr-only">
            Search
          </label>

          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div
            id="search-error"
            className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Search Info */}
        {searchInfo && (
          <div className="mt-4 text-sm text-gray-600">
            About {parseInt(searchInfo.totalResults || "0").toLocaleString()}{" "}
            results ({searchInfo.timeTaken?.toFixed(2)} seconds)
          </div>
        )}

        {/* Results area */}
        <section className="mt-6">
          {/* Loading state */}
          {loading && !results && (
            <div className="text-center text-gray-500 py-12">
              <div className="animate-pulse">
                <p className="text-lg">Searching the web...</p>
              </div>
            </div>
          )}

          {/* No results yet */}
          {!loading && results === null && !error && (
            <div className="text-center text-gray-400 py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg">Enter a search term to get started</p>
            </div>
          )}

          {/* Results list */}
          {results && results.length > 0 && (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={`${result.link}-${index}`}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      {/* URL */}
                      <div className="text-sm text-green-700 mb-1">
                        {formatUrl(result.link)}
                      </div>

                      {/* Title - clickable link */}
                      <h3 className="text-xl mb-2">
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline visited:text-purple-600"
                        >
                          {result.title}
                        </a>
                      </h3>

                      {/* Snippet */}
                      {result.snippet && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {result.snippet}
                        </p>
                      )}

                      {/* Date if available */}
                      {result.date && (
                        <div className="text-xs text-gray-500 mt-2">
                          {result.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty results */}
          {results && results.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-lg mb-2">No results found</p>
              <p className="text-sm">
                Try different keywords or check your spelling
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// // SearchPage.tsx
// import React, { useState, FormEvent } from "react";

// // Update the type to match SerperAPI response structure
// type SerperResult = {
//   title: string;
//   link: string;
//   snippet?: string;
//   position?: number;
//   date?: string;
// };

// type SerperResponse = {
//   organic: SerperResult[];
//   searchParameters: {
//     q: string;
//     type: string;
//   };
//   searchInformation?: {
//     totalResults: string;
//     timeTaken: number;
//   };
// };

// // Trending searches data structure
// type TrendingCategory = {
//   name: string;
//   keywords: string[];
// };

// type RegionTrends = {
//   region: string;
//   categories: TrendingCategory[];
// };

// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<SerperResult[] | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchInfo, setSearchInfo] = useState<any>(null);
//   const [selectedRegion, setSelectedRegion] = useState("US");
//   const [showTrending, setShowTrending] = useState(true);
//   const [searchSuccess, setSearchSuccess] = useState(false);

//   // Mock trending data (replace with real API call)
//   const trendingData: RegionTrends[] = [
//     {
//       region: "US",
//       categories: [
//         {
//           name: "Technology",
//           keywords: [
//             "ChatGPT",
//             "iPhone 16",
//             "Tesla",
//             "AI news",
//             "Meta Quest 3",
//           ],
//         },
//         {
//           name: "Entertainment",
//           keywords: [
//             "Netflix shows",
//             "Taylor Swift",
//             "Marvel movies",
//             "TikTok trends",
//             "Spotify",
//           ],
//         },
//         {
//           name: "Sports",
//           keywords: [
//             "NFL playoffs",
//             "NBA scores",
//             "World Cup",
//             "Olympics",
//             "Fantasy football",
//           ],
//         },
//         {
//           name: "News",
//           keywords: [
//             "Election 2024",
//             "Climate change",
//             "Economy news",
//             "Health updates",
//             "World news",
//           ],
//         },
//       ],
//     },
//     {
//       region: "Nigeria",
//       categories: [
//         {
//           name: "Technology",
//           keywords: [
//             "Fintech Nigeria",
//             "Mobile banking",
//             "Tech jobs Lagos",
//             "Internet providers",
//             "Cryptocurrency",
//           ],
//         },
//         {
//           name: "Entertainment",
//           keywords: [
//             "Nollywood movies",
//             "Afrobeats",
//             "Big Brother Naija",
//             "Nigerian music",
//             "Comedy shows",
//           ],
//         },
//         {
//           name: "Sports",
//           keywords: [
//             "Super Eagles",
//             "Nigerian Premier League",
//             "Football transfers",
//             "Athletics Nigeria",
//             "Boxing",
//           ],
//         },
//         {
//           name: "Business",
//           keywords: [
//             "Lagos business",
//             "Import export",
//             "Real estate Nigeria",
//             "Stock market",
//             "Small business",
//           ],
//         },
//       ],
//     },
//     {
//       region: "UK",
//       categories: [
//         {
//           name: "Technology",
//           keywords: [
//             "Tech London",
//             "AI startups",
//             "Cybersecurity UK",
//             "Cloud computing",
//             "5G UK",
//           ],
//         },
//         {
//           name: "Entertainment",
//           keywords: [
//             "BBC shows",
//             "British music",
//             "West End shows",
//             "UK festivals",
//             "Streaming UK",
//           ],
//         },
//         {
//           name: "Sports",
//           keywords: [
//             "Premier League",
//             "Cricket England",
//             "Wimbledon",
//             "Rugby",
//             "F1 British GP",
//           ],
//         },
//         {
//           name: "News",
//           keywords: [
//             "UK politics",
//             "Royal family",
//             "Brexit updates",
//             "Weather UK",
//             "Education UK",
//           ],
//         },
//       ],
//     },
//   ];

//   // Dummy data fallback function
//   const getDummyFallback = (searchTerm: string): SerperResult[] => {
//     setSearchSuccess(true); // Still consider it successful with dummy data
//     setSearchInfo(generateDummySearchInfo(searchTerm));
//     return generateDummyResults(searchTerm);
//   };

//   // SerperAPI integration with success tracking and fallback
//   async function searchWithSerper(q: string): Promise<SerperResult[]> {
//     const myHeaders = new Headers();
//     myHeaders.append(
//       "X-API-KEY",
//       process.env.NODE_ENV_SERPER_API_KEY || "your-api-key-here"
//     );
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       q: q,
//       num: 10, // Number of results to return (optional)
//     });

//     const requestOptions: RequestInit = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(
//         "https://google.serper.dev/search",
//         requestOptions
//       );

//       if (!response.ok) {
//         console.warn(
//           `SerperAPI returned status ${response.status}, falling back to dummy data`
//         );
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result: SerperResponse = await response.json();

//       // Check for successful results
//       if (result.organic && result.organic.length > 0) {
//         setSearchSuccess(true);
//         setSearchInfo(result.searchInformation);
//         return result.organic;
//       } else {
//         // No results from API, use dummy data
//         console.warn("No results from SerperAPI, using dummy data");
//         return getDummyFallback(q);
//       }
//     } catch (error) {
//       console.error("SerperAPI Error:", error);
//       console.log("Using dummy data fallback");

//       // Use dummy data as fallback
//       return getDummyFallback(q);
//     }
//   }

//   async function handleSearch(e: FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setResults(null);
//     setSearchInfo(null);
//     setSearchSuccess(false);

//     const trimmed = query.trim();
//     if (!trimmed) {
//       setError("Please enter a search term.");
//       return;
//     }

//     setLoading(true);
//     setShowTrending(false); // Hide trending when searching

//     try {
//       const data = await searchWithSerper(trimmed);
//       setResults(data);
//     } catch (err: any) {
//       setError(err?.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Handle trending keyword click
//   const handleTrendingClick = (keyword: string) => {
//     setQuery(keyword);
//     setShowTrending(false);
//     // Auto-search the trending term
//     handleSearchWithKeyword(keyword);
//   };

//   // Search with specific keyword (for trending clicks)
//   const handleSearchWithKeyword = async (keyword: string) => {
//     setError(null);
//     setResults(null);
//     setSearchInfo(null);
//     setSearchSuccess(false);
//     setLoading(true);

//     try {
//       const data = await searchWithSerper(keyword);
//       setResults(data);
//     } catch (err: any) {
//       setError(err?.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get current region's trending data
//   const currentTrends =
//     trendingData.find((data) => data.region === selectedRegion) ||
//     trendingData[0];

//   // Dummy search results generator
//   const generateDummyResults = (searchTerm: string): SerperResult[] => {
//     const dummyDomains = [
//       "wikipedia.org",
//       "stackoverflow.com",
//       "github.com",
//       "medium.com",
//       "reddit.com",
//       "youtube.com",
//       "twitter.com",
//       "linkedin.com",
//       "techcrunch.com",
//       "forbes.com",
//       "cnn.com",
//       "bbc.com",
//     ];

//     const dummyTitles = [
//       `${searchTerm} - Complete Guide and Tutorial`,
//       `Everything You Need to Know About ${searchTerm}`,
//       `${searchTerm}: Latest News and Updates`,
//       `How to Get Started with ${searchTerm}`,
//       `${searchTerm} Best Practices and Tips`,
//       `Understanding ${searchTerm}: A Comprehensive Overview`,
//       `${searchTerm} - Official Documentation`,
//       `Top 10 ${searchTerm} Resources for 2024`,
//       `${searchTerm} Community Discussion and Forum`,
//       `${searchTerm} Reviews and Comparisons`,
//     ];

//     const dummySnippets = [
//       `Learn everything about ${searchTerm} with our comprehensive guide. Get started today with step-by-step instructions and expert tips.`,
//       `Discover the latest information about ${searchTerm}. Find tutorials, news, and community discussions all in one place.`,
//       `${searchTerm} made simple. Our detailed explanation covers all aspects from basics to advanced topics.`,
//       `Join thousands of users exploring ${searchTerm}. Get access to resources, tools, and community support.`,
//       `Stay updated with the latest ${searchTerm} trends, news, and developments in the industry.`,
//       `Professional insights and analysis on ${searchTerm}. Expert opinions and detailed reviews.`,
//       `Official information and documentation about ${searchTerm}. Authoritative source for accurate details.`,
//       `Compare different aspects of ${searchTerm}. In-depth analysis and user reviews to help you decide.`,
//       `Community-driven content about ${searchTerm}. Share experiences and learn from others.`,
//       `Historical background and evolution of ${searchTerm}. Timeline and key milestones.`,
//     ];

//     return Array.from(
//       { length: Math.min(8, Math.max(3, Math.floor(Math.random() * 8) + 3)) },
//       (_, i) => ({
//         title: dummyTitles[i % dummyTitles.length],
//         link: `https://${dummyDomains[i % dummyDomains.length]}/${searchTerm
//           .toLowerCase()
//           .replace(/\s+/g, "-")}`,
//         snippet: dummySnippets[i % dummySnippets.length],
//         position: i + 1,
//         date:
//           Math.random() > 0.5
//             ? `${Math.floor(Math.random() * 30) + 1} days ago`
//             : undefined,
//       })
//     );
//   };

//   // Generate dummy search info
//   const generateDummySearchInfo = (searchTerm: string) => ({
//     totalResults: (
//       Math.floor(Math.random() * 900000) + 100000
//     ).toLocaleString(),
//     timeTaken: Math.random() * 0.5 + 0.1,
//   });

//   // Helper function to format URLs for display
//   const formatUrl = (url: string) => {
//     try {
//       const urlObj = new URL(url);
//       return urlObj.hostname + urlObj.pathname;
//     } catch {
//       return url;
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
//       <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
//         <header className="mb-6">
//           <h1 className="text-3xl font-extrabold text-gray-900">Search</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Powered by Google via SerperAPI
//           </p>

//           {/* Success indicator */}
//           {searchSuccess && (
//             <div className="mt-2 flex items-center text-green-600 text-sm">
//               <svg
//                 className="w-4 h-4 mr-1"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Search successful
//             </div>
//           )}
//         </header>

//         {/* Region selector */}
//         <div className="mb-4 flex items-center gap-4">
//           <label htmlFor="region" className="text-sm font-medium text-gray-700">
//             Region:
//           </label>
//           <select
//             id="region"
//             value={selectedRegion}
//             onChange={(e) => setSelectedRegion(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="US">United States</option>
//             <option value="Nigeria">Nigeria</option>
//             <option value="UK">United Kingdom</option>
//           </select>

//           <button
//             onClick={() => setShowTrending(!showTrending)}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             {showTrending ? "Hide" : "Show"} Trending
//           </button>
//         </div>

//         {/* Trending Keywords Section */}
//         {showTrending && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <h2 className="text-lg font-semibold text-blue-900 mb-3">
//               🔥 Trending in {currentTrends.region}
//             </h2>
//             <div className="space-y-4">
//               {currentTrends.categories.map((category) => (
//                 <div key={category.name}>
//                   <h3 className="text-sm font-medium text-blue-800 mb-2">
//                     {category.name}
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {category.keywords.map((keyword) => (
//                       <button
//                         key={keyword}
//                         onClick={() => handleTrendingClick(keyword)}
//                         className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-colors"
//                       >
//                         {keyword}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <form
//           className="flex gap-3"
//           onSubmit={handleSearch}
//           aria-label="Search form"
//         >
//           <label htmlFor="search" className="sr-only">
//             Search
//           </label>

//           <input
//             id="search"
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search anything..."
//             className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             aria-invalid={!!error}
//             aria-describedby={error ? "search-error" : undefined}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   ></path>
//                 </svg>
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//                 Search
//               </>
//             )}
//           </button>
//         </form>

//         {/* Error */}
//         {error && (
//           <div
//             id="search-error"
//             className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
//           >
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {error}
//             </div>
//           </div>
//         )}

//         {/* Search Info with fallback indicator */}
//         {searchInfo && (
//           <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
//             <div>
//               About {parseInt(searchInfo.totalResults || "0").toLocaleString()}{" "}
//               results ({searchInfo.timeTaken?.toFixed(2)} seconds)
//             </div>
//             {/* Show if using dummy data */}
//             {!process.env.NEXT_PUBLIC_SERPER_API_KEY && (
//               <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
//                 <svg
//                   className="w-3 h-3 mr-1"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Demo Mode
//               </div>
//             )}
//           </div>
//         )}

//         {/* Results area */}
//         <section className="mt-6">
//           {/* Loading state */}
//           {loading && !results && (
//             <div className="text-center text-gray-500 py-12">
//               <div className="animate-pulse">
//                 <p className="text-lg">Searching the web...</p>
//               </div>
//             </div>
//           )}

//           {/* No results yet */}
//           {!loading && results === null && !error && (
//             <div className="text-center text-gray-400 py-12">
//               <svg
//                 className="w-16 h-16 mx-auto mb-4 text-gray-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <p className="text-lg">Enter a search term to get started</p>
//               {!process.env.NEXT_PUBLIC_SERPER_API_KEY && (
//                 <p className="text-sm mt-2 text-amber-600">
//                   🚀 Demo mode active - Add your SerperAPI key for live results
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Results list */}
//           {results && results.length > 0 && (
//             <div className="space-y-6">
//               {results.map((result, index) => (
//                 <div
//                   key={`${result.link}-${index}`}
//                   className="border-b border-gray-200 pb-6 last:border-b-0"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="flex-1">
//                       {/* URL */}
//                       <div className="text-sm text-green-700 mb-1">
//                         {formatUrl(result.link)}
//                       </div>

//                       {/* Title - clickable link */}
//                       <h3 className="text-xl mb-2">
//                         <a
//                           href={result.link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:text-blue-800 hover:underline visited:text-purple-600"
//                         >
//                           {result.title}
//                         </a>
//                       </h3>

//                       {/* Snippet */}
//                       {result.snippet && (
//                         <p className="text-gray-600 text-sm leading-relaxed">
//                           {result.snippet}
//                         </p>
//                       )}

//                       {/* Date if available */}
//                       {result.date && (
//                         <div className="text-xs text-gray-500 mt-2">
//                           {result.date}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty results */}
//           {results && results.length === 0 && (
//             <div className="py-12 text-center text-gray-500">
//               <svg
//                 className="w-16 h-16 mx-auto mb-4 text-gray-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//               <p className="text-lg mb-2">No results found</p>
//               <p className="text-sm">
//                 Try different keywords or check your spelling
//               </p>
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }
