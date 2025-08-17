export interface TrendingKeyword {
  keyword: string;
  volume: number;
  growth: number;
  category: string;
}

export interface TrendData {
  category: string;
  region: string;
  keywords: TrendingKeyword[];
  lastUpdated: string;
}

// Dummy fallback data
export const DUMMY_TREND_DATA: TrendData[] = [
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
