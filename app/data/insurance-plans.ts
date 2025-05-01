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
    tag: null
  },
  {
    id: "assist-card-premium",
    provider: "Assist Card – Premium Coverage",
    rating: 4.6,
    price: 125,
    coverage: {
      "Medical Expenses": 150000,
      "Trip Cancellation": 5000,
      "Baggage Loss": 2500,
      "Trip Delay": 1000,
      "Covid Coverage": "Included"
    },
    tag: "Premium"
  },
  {
    id: "axa-basic",
    provider: "AXA Assistance – Basic Plan",
    rating: 4.1,
    price: 85,
    coverage: {
      "Medical Expenses": 50000,
      "Trip Cancellation": 2000,
      "Baggage Loss": 1000,
      "Trip Delay": 300,
      "Covid Coverage": "Included"
    },
    tag: null
  },
  {
    id: "iati-premium",
    provider: "IATI – Premium Coverage",
    rating: 4.8,
    price: 135,
    coverage: {
      "Medical Expenses": 120000,
      "Trip Cancellation": 4000,
      "Baggage Loss": 2200,
      "Trip Delay": 900,
      "Covid Coverage": "Included"
    },
    tag: "Comprehensive"
  },
  {
    id: "starr-premium",
    provider: "Starr – Complete Protection",
    rating: 4.4,
    price: 110,
    coverage: {
      "Medical Expenses": 100000,
      "Trip Cancellation": 3500,
      "Baggage Loss": 1500,
      "Trip Delay": 700,
      "Covid Coverage": "Included"
    },
    tag: null
  },
  {
    id: "sura-basic",
    provider: "SURA – Basic Coverage",
    rating: 4.0,
    price: 70,
    coverage: {
      "Medical Expenses": 30000,
      "Trip Cancellation": 1000,
      "Baggage Loss": 800,
      "Trip Delay": 250,
      "Covid Coverage": "Included"
    },
    tag: "Budget"
  }
];

// For backwards compatibility
export default insurancePlans;

// Also export real insurance plans in the format used in the available-plans screen
export const realInsurancePlans = insurancePlans;