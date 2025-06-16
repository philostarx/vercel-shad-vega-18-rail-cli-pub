// 하드코딩된 현재 데이터셋 (JSON import 문제 완전 해결)
const currentDataset = [
  {
    "id": 1,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 245000,
    "clicks": 12250,
    "conversions": 612,
    "cost": 1850000,
    "revenue": 12240000,
    "date": "2024-05-01"
  },
  {
    "id": 2,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 180000,
    "clicks": 7200,
    "conversions": 288,
    "cost": 1200000,
    "revenue": 4320000,
    "date": "2024-05-01"
  },
  {
    "id": 3,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 95000,
    "clicks": 2850,
    "conversions": 171,
    "cost": 570000,
    "revenue": 2565000,
    "date": "2024-05-01"
  },
  {
    "id": 4,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 320000,
    "clicks": 9600,
    "conversions": 96,
    "cost": 960000,
    "revenue": 1440000,
    "date": "2024-05-01"
  },
  {
    "id": 5,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 150000,
    "clicks": 3000,
    "conversions": 180,
    "cost": 750000,
    "revenue": 3600000,
    "date": "2024-05-01"
  },
  {
    "id": 6,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 268000,
    "clicks": 13400,
    "conversions": 938,
    "cost": 2010000,
    "revenue": 15632000,
    "date": "2024-05-02"
  },
  {
    "id": 7,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 195000,
    "clicks": 7800,
    "conversions": 156,
    "cost": 1300000,
    "revenue": 2340000,
    "date": "2024-05-02"
  },
  {
    "id": 8,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 88000,
    "clicks": 2640,
    "conversions": 79,
    "cost": 528000,
    "revenue": 1185000,
    "date": "2024-05-02"
  },
  {
    "id": 9,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 340000,
    "clicks": 10200,
    "conversions": 204,
    "cost": 1020000,
    "revenue": 3060000,
    "date": "2024-05-02"
  },
  {
    "id": 10,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 165000,
    "clicks": 3300,
    "conversions": 462,
    "cost": 825000,
    "revenue": 11550000,
    "date": "2024-05-02"
  },
  {
    "id": 11,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 220000,
    "clicks": 11000,
    "conversions": 440,
    "cost": 1650000,
    "revenue": 8800000,
    "date": "2024-05-03"
  },
  {
    "id": 12,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 165000,
    "clicks": 6600,
    "conversions": 396,
    "cost": 1100000,
    "revenue": 5940000,
    "date": "2024-05-03"
  },
  {
    "id": 13,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 102000,
    "clicks": 3060,
    "conversions": 61,
    "cost": 612000,
    "revenue": 915000,
    "date": "2024-05-03"
  },
  {
    "id": 14,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 285000,
    "clicks": 8550,
    "conversions": 85,
    "cost": 855000,
    "revenue": 1275000,
    "date": "2024-05-03"
  },
  {
    "id": 15,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 135000,
    "clicks": 2700,
    "conversions": 135,
    "cost": 675000,
    "revenue": 2700000,
    "date": "2024-05-03"
  },
  {
    "id": 16,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 290000,
    "clicks": 14500,
    "conversions": 1160,
    "cost": 2175000,
    "revenue": 17400000,
    "date": "2024-05-04"
  },
  {
    "id": 17,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 210000,
    "clicks": 8400,
    "conversions": 168,
    "cost": 1400000,
    "revenue": 2520000,
    "date": "2024-05-04"
  },
  {
    "id": 18,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 78000,
    "clicks": 2340,
    "conversions": 187,
    "cost": 468000,
    "revenue": 2805000,
    "date": "2024-05-04"
  },
  {
    "id": 19,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 375000,
    "clicks": 11250,
    "conversions": 112,
    "cost": 1125000,
    "revenue": 1680000,
    "date": "2024-05-04"
  },
  {
    "id": 20,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 180000,
    "clicks": 3600,
    "conversions": 720,
    "cost": 900000,
    "revenue": 21600000,
    "date": "2024-05-04"
  },
  {
    "id": 21,
    "campaignName": "Weekend Flash Sale",
    "channel": "Google",
    "impressions": 350000,
    "clicks": 17500,
    "conversions": 1750,
    "cost": 2625000,
    "revenue": 26250000,
    "date": "2024-05-05"
  },
  {
    "id": 22,
    "campaignName": "Mother's Day Campaign",
    "channel": "Facebook",
    "impressions": 280000,
    "clicks": 11200,
    "conversions": 224,
    "cost": 1680000,
    "revenue": 3360000,
    "date": "2024-05-05"
  },
  {
    "id": 23,
    "campaignName": "Local Market Push",
    "channel": "Naver",
    "impressions": 120000,
    "clicks": 3600,
    "conversions": 36,
    "cost": 720000,
    "revenue": 540000,
    "date": "2024-05-05"
  },
  {
    "id": 24,
    "campaignName": "Influencer Collab",
    "channel": "Instagram",
    "impressions": 450000,
    "clicks": 13500,
    "conversions": 270,
    "cost": 1350000,
    "revenue": 4050000,
    "date": "2024-05-05"
  },
  {
    "id": 25,
    "campaignName": "Video Series Launch",
    "channel": "YouTube",
    "impressions": 220000,
    "clicks": 4400,
    "conversions": 220,
    "cost": 1100000,
    "revenue": 6600000,
    "date": "2024-05-05"
  },
  {
    "id": 26,
    "campaignName": "Monday Motivation",
    "channel": "Google",
    "impressions": 195000,
    "clicks": 9750,
    "conversions": 292,
    "cost": 1462500,
    "revenue": 5840000,
    "date": "2024-05-06"
  },
  {
    "id": 27,
    "campaignName": "Retargeting Campaign",
    "channel": "Facebook",
    "impressions": 85000,
    "clicks": 3400,
    "conversions": 340,
    "cost": 680000,
    "revenue": 5100000,
    "date": "2024-05-06"
  },
  {
    "id": 28,
    "campaignName": "Mobile App Promo",
    "channel": "Naver",
    "impressions": 65000,
    "clicks": 1950,
    "conversions": 117,
    "cost": 390000,
    "revenue": 1755000,
    "date": "2024-05-06"
  },
  {
    "id": 29,
    "campaignName": "Story Ads Test",
    "channel": "Instagram",
    "impressions": 195000,
    "clicks": 5850,
    "conversions": 58,
    "cost": 585000,
    "revenue": 870000,
    "date": "2024-05-06"
  },
  {
    "id": 30,
    "campaignName": "Tutorial Series",
    "channel": "YouTube",
    "impressions": 110000,
    "clicks": 2200,
    "conversions": 88,
    "cost": 550000,
    "revenue": 1760000,
    "date": "2024-05-06"
  },
  {
    "id": 31,
    "campaignName": "Tuesday Deals",
    "channel": "Google",
    "impressions": 275000,
    "clicks": 13750,
    "conversions": 825,
    "cost": 2062500,
    "revenue": 12375000,
    "date": "2024-05-07"
  },
  {
    "id": 32,
    "campaignName": "Lookalike Audience",
    "channel": "Facebook",
    "impressions": 225000,
    "clicks": 9000,
    "conversions": 180,
    "cost": 1350000,
    "revenue": 2700000,
    "date": "2024-05-07"
  },
  {
    "id": 33,
    "campaignName": "Search Expansion",
    "channel": "Naver",
    "impressions": 145000,
    "clicks": 4350,
    "conversions": 261,
    "cost": 870000,
    "revenue": 3915000,
    "date": "2024-05-07"
  },
  {
    "id": 34,
    "campaignName": "Reels Campaign",
    "channel": "Instagram",
    "impressions": 520000,
    "clicks": 15600,
    "conversions": 156,
    "cost": 1560000,
    "revenue": 2340000,
    "date": "2024-05-07"
  },
  {
    "id": 35,
    "campaignName": "Shorts Experiment",
    "channel": "YouTube",
    "impressions": 380000,
    "clicks": 7600,
    "conversions": 380,
    "cost": 1900000,
    "revenue": 11400000,
    "date": "2024-05-07"
  }
];

// 하드코딩된 시나리오 데이터
const normalCase = [
  {
    "id": 1,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 125000,
    "clicks": 4750,
    "conversions": 142,
    "cost": 890000,
    "revenue": 4260000,
    "date": "2024-05-01"
  },
  {
    "id": 2,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 98000,
    "clicks": 3920,
    "conversions": 118,
    "cost": 720000,
    "revenue": 3540000,
    "date": "2024-05-01"
  },
  {
    "id": 3,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 67000,
    "clicks": 2010,
    "conversions": 67,
    "cost": 450000,
    "revenue": 2010000,
    "date": "2024-05-01"
  },
  {
    "id": 4,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 156000,
    "clicks": 4680,
    "conversions": 93,
    "cost": 680000,
    "revenue": 2790000,
    "date": "2024-05-01"
  },
  {
    "id": 5,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 89000,
    "clicks": 2670,
    "conversions": 80,
    "cost": 560000,
    "revenue": 3200000,
    "date": "2024-05-01"
  },
  {
    "id": 6,
    "campaignName": "Summer Sale 2024",
    "channel": "Google",
    "impressions": 132000,
    "clicks": 5016,
    "conversions": 155,
    "cost": 920000,
    "revenue": 4650000,
    "date": "2024-05-02"
  },
  {
    "id": 7,
    "campaignName": "Fashion Week Special",
    "channel": "Facebook",
    "impressions": 104000,
    "clicks": 4160,
    "conversions": 125,
    "cost": 760000,
    "revenue": 3750000,
    "date": "2024-05-02"
  },
  {
    "id": 8,
    "campaignName": "Spring Collection",
    "channel": "Naver",
    "impressions": 71000,
    "clicks": 2130,
    "conversions": 71,
    "cost": 480000,
    "revenue": 2130000,
    "date": "2024-05-02"
  },
  {
    "id": 9,
    "campaignName": "Brand Awareness",
    "channel": "Instagram",
    "impressions": 162000,
    "clicks": 4860,
    "conversions": 97,
    "cost": 710000,
    "revenue": 2910000,
    "date": "2024-05-02"
  },
  {
    "id": 10,
    "campaignName": "Product Launch",
    "channel": "YouTube",
    "impressions": 94000,
    "clicks": 2820,
    "conversions": 85,
    "cost": 590000,
    "revenue": 3400000,
    "date": "2024-05-02"
  }
];

export const mockData = {
  current: currentDataset,
  scenarios: {
    'normal-case': normalCase
  }
};

export type ScenarioType = keyof typeof mockData.scenarios | 'current';

/**
 * 현재 활성 데이터셋을 반환합니다.
 */
export function getCurrentData() {
  return mockData.current;
}

/**
 * 지정된 시나리오 데이터를 반환합니다.
 * @param scenario - 시나리오 타입
 */
export function getScenarioData(scenario: ScenarioType) {
  if (scenario === 'current') {
    return mockData.current;
  }
  
  const data = mockData.scenarios[scenario as keyof typeof mockData.scenarios];
  if (!data) {
    console.warn(`시나리오 '${scenario}'를 찾을 수 없습니다. 기본 데이터를 반환합니다.`);
    return mockData.current;
  }
  
  return data;
}

/**
 * 사용 가능한 모든 시나리오 목록을 반환합니다.
 */
export function getAvailableScenarios(): ScenarioType[] {
  return ['current', ...Object.keys(mockData.scenarios)] as ScenarioType[];
}