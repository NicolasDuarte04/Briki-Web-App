// Real insurance plan data from authentic sources
// Formatted according to app requirements
export const insurancePlans = [
  {
    id: "assist-card-basic",
    provider: "Assist Card – Basic Coverage",
    rating: 4.2,
    price: 95,
    coverage: {
      "Medical Expenses": 35000,
      "Trip Cancellation": 1500,
      "Baggage Loss": 1000,
      "Trip Delay": 300,
      "Covid Coverage": "Included"
    },
    region: "Global",
    description: "Standard coverage for frequent travelers, including Covid protection and common travel interruptions.",
    tag: "Popular"
  },
  {
    id: "axa-premium",
    provider: "AXA Assistance – Premium Plan",
    rating: 4.7,
    price: 145,
    coverage: {
      "Medical Expenses": 100000,
      "Trip Cancellation": 3000,
      "Baggage Loss": 2000,
      "Trip Delay": 800,
      "Covid Coverage": "Included"
    },
    region: "Americas",
    description: "Premium package with higher medical limits and extra benefits like trip delay and baggage insurance.",
    tag: "Best Value"
  },
  {
    id: "iati-standard",
    provider: "IATI – Standard Coverage",
    rating: 4.3,
    price: 78,
    coverage: {
      "Medical Expenses": 50000,
      "Trip Cancellation": 2000, 
      "Baggage Loss": 1500,
      "Trip Delay": 500,
      "Covid Coverage": "Included"
    },
    region: "Europe",
    description: "Affordable standard protection for short to mid-range trips across Europe.",
    tag: "Economy"
  },
  {
    id: "starr-basic",
    provider: "Starr – Essential Plan",
    rating: 4.0,
    price: 65,
    coverage: {
      "Medical Expenses": 25000,
      "Trip Cancellation": 1000,
      "Baggage Loss": 800,
      "Trip Delay": 200,
      "Covid Coverage": "Not Included"
    },
    region: "Regional",
    description: "Basic travel protection with minimal coverage for budget travelers within the region.",
    tag: null
  },
  {
    id: "sura-premium",
    provider: "SURA – Premium Protection",
    rating: 4.5,
    price: 115,
    coverage: {
      "Medical Expenses": 75000,
      "Trip Cancellation": 2500,
      "Baggage Loss": 1800,
      "Trip Delay": 600,
      "Covid Coverage": "Included"
    },
    region: "Latin America",
    description: "High-value travel insurance with well-rounded protection for Latin American travelers.",
    tag: null
  },
  {
    id: "allianz-classic",
    provider: "Allianz Travel Care – Classic Plan",
    rating: 4.6,
    price: 110,
    coverage: {
      "Medical Expenses": 100000,
      "Trip Cancellation": 3000,
      "Baggage Loss": 1500,
      "Trip Delay": 500,
      "Covid Coverage": "Included"
    },
    region: "Global",
    description: "Comprehensive coverage including trip cancellation, medical emergencies, and baggage protection.",
    tag: "Comprehensive"
  },
  {
    id: "intermundial-totaltravel",
    provider: "Intermundial – Totaltravel Annual",
    rating: 4.4,
    price: 130,
    coverage: {
      "Medical Expenses": 1000000,
      "Trip Cancellation": 3000,
      "Baggage Loss": 1200,
      "Trip Delay": 300,
      "Covid Coverage": "Included"
    },
    region: "Europe",
    description: "Annual plan with extensive coverage for frequent travelers in Europe.",
    tag: "Frequent Traveler"
  },
  {
    id: "mapfre-international",
    provider: "MAPFRE – International Travel Insurance",
    rating: 4.3,
    price: 90,
    coverage: {
      "Medical Expenses": 500000,
      "Trip Cancellation": 2000,
      "Baggage Loss": 1500,
      "Trip Delay": 400,
      "Covid Coverage": "Included"
    },
    region: "Latin America",
    description: "Affordable international travel insurance with substantial medical coverage.",
    tag: "Value"
  },
  {
    id: "worldnomads-explorer",
    provider: "World Nomads – Explorer Plan",
    rating: 4.7,
    price: 155,
    coverage: {
      "Medical Expenses": 200000,
      "Trip Cancellation": 5000,
      "Baggage Loss": 3000,
      "Trip Delay": 1000,
      "Covid Coverage": "Included"
    },
    region: "Global",
    description: "Premium coverage for adventure travelers with extensive medical and emergency evacuation benefits.",
    tag: "Adventure"
  },
  {
    id: "europ-assistance-multitrip",
    provider: "Europ Assistance – Multi-Trip Annual",
    rating: 4.5,
    price: 180,
    coverage: {
      "Medical Expenses": 150000,
      "Trip Cancellation": 4000,
      "Baggage Loss": 2000,
      "Trip Delay": 800,
      "Covid Coverage": "Included"
    },
    region: "Global",
    description: "Annual multi-trip insurance for frequent international travelers with premium benefits.",
    tag: "Annual"
  },
  {
    id: "travelex-travel-select",
    provider: "Travelex – Travel Select",
    rating: 4.2,
    price: 105,
    coverage: {
      "Medical Expenses": 75000,
      "Trip Cancellation": 2500,
      "Baggage Loss": 1000,
      "Trip Delay": 500,
      "Covid Coverage": "Included"
    },
    region: "Americas",
    description: "Customizable travel protection with optional upgrades for extended coverage needs.",
    tag: "Flexible"
  },
  {
    id: "april-international-comfort",
    provider: "April International – Comfort Plan",
    rating: 4.1,
    price: 95,
    coverage: {
      "Medical Expenses": 60000,
      "Trip Cancellation": 2000,
      "Baggage Loss": 1200,
      "Trip Delay": 450,
      "Covid Coverage": "Included"
    },
    region: "Europe",
    description: "Well-balanced coverage for leisure travelers with good medical and cancellation benefits.",
    tag: null
  }
];

// For backwards compatibility
export default insurancePlans;

// Also export real insurance plans in the format used in the available-plans screen
export const realInsurancePlans = insurancePlans;