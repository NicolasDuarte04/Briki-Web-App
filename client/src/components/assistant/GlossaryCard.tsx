import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Book } from "lucide-react";

// Insurance glossary terms for our AI assistant to reference
export const insuranceGlossary = {
  "deductible": {
    definition: "The amount you pay for covered healthcare services before your insurance plan starts to pay.",
    example: "With a $1,000 deductible, you pay the first $1,000 of covered services yourself."
  },
  "premium": {
    definition: "The amount you pay for your health insurance every month.",
    example: "If your premium is $400 per month, you'll pay $4,800 per year for your insurance coverage."
  },
  "copay": {
    definition: "A fixed amount you pay for a covered healthcare service after you've paid your deductible.",
    example: "A $25 copay for doctor visits means you pay $25 each time you see the doctor regardless of the actual cost of the visit."
  },
  "coinsurance": {
    definition: "The percentage of costs of a covered health care service you pay after you've paid your deductible.",
    example: "With 20% coinsurance, if a hospital stay costs $10,000, you would pay $2,000 and insurance would cover $8,000."
  },
  "out-of-pocket-maximum": {
    definition: "The most you have to pay for covered services in a plan year. After you spend this amount on deductibles, copayments, and coinsurance, your health plan pays 100% of the costs of covered benefits.",
    example: "If your out-of-pocket maximum is $8,000, once you've paid $8,000 in a year, your insurance covers all remaining costs for covered services."
  },
  "network": {
    definition: "The facilities, providers and suppliers your health insurer or plan has contracted with to provide health care services.",
    example: "Seeing providers in your network typically costs less than seeing out-of-network providers."
  },
  "claim": {
    definition: "A request for payment that you or your healthcare provider submits to your health insurer when you get items or services you think are covered.",
    example: "After your hospital stay, the hospital sends a claim to your insurance company for payment."
  },
  "preauthorization": {
    definition: "A decision by your health insurer or plan that a health care service, treatment plan, prescription drug or durable medical equipment is medically necessary.",
    example: "Your insurance may require preauthorization for an MRI before they will cover the cost."
  },
  "excluded-services": {
    definition: "Health care services that your health insurance doesn't pay for or cover.",
    example: "Many health plans don't cover cosmetic surgery as it's considered an excluded service."
  },
  "explanation-of-benefits": {
    definition: "A statement sent by a health insurance company to covered individuals explaining what medical treatments and/or services were paid for on their behalf.",
    example: "After your doctor visit, you'll receive an EOB showing the total charge was $150, your plan paid $110, and you owe $40."
  },
  "rider": {
    definition: "A provision added to an insurance policy that provides additional benefits or amends the terms of the basic policy.",
    example: "You can add a dental rider to your health insurance policy to cover dental services."
  },
  "underwriting": {
    definition: "The process by which an insurance company examines, accepts, or rejects insurance risks, and classifies those selected in order to charge the proper premium for each.",
    example: "During underwriting, the insurer will review your medical history to determine your premium."
  },
  "grace-period": {
    definition: "A specified period of time after a premium payment is due in which the policyholder may make a payment without coverage lapsing.",
    example: "If your payment is due on the 1st, a 30-day grace period means you have until the 30th to pay before your policy is canceled."
  },
  "comprehensive-coverage": {
    definition: "In auto insurance, this covers damage to your car from causes other than a collision, such as fire, theft, vandalism, or falling objects.",
    example: "If a tree falls on your car during a storm, comprehensive coverage would help pay for the damages."
  },
  "collision-coverage": {
    definition: "In auto insurance, this pays for damage to your car when you hit another vehicle or object.",
    example: "If you back into a pole, collision coverage would help pay for the repairs to your car."
  },
  "liability-coverage": {
    definition: "Coverage that protects you if you're legally responsible for a car accident that injures another person or damages their property.",
    example: "If you cause an accident that damages someone else's car, liability coverage helps pay for their repairs."
  },
  "personal-injury-protection": {
    definition: "In auto insurance, this covers medical expenses for injuries to you and your passengers regardless of who caused the accident.",
    example: "If you're injured in a car accident, PIP would help cover your medical bills regardless of fault."
  },
  "uninsured-motorist-coverage": {
    definition: "Coverage that protects you when you're in an accident with a driver who doesn't have insurance.",
    example: "If you're hit by a driver without insurance, uninsured motorist coverage would help pay for your medical bills and car repairs."
  },
  "actual-cash-value": {
    definition: "The amount equal to the replacement cost minus depreciation of a damaged or stolen property at the time of the loss.",
    example: "If your 5-year-old laptop is stolen, the actual cash value would be what a 5-year-old laptop of the same model is worth today, not what a new one costs."
  },
  "replacement-cost": {
    definition: "The amount needed to replace damaged or stolen property with new property of the same kind and quality, without deducting for depreciation.",
    example: "If your home is damaged by fire, replacement cost coverage would pay to rebuild it with similar materials at current prices."
  }
};

export interface GlossaryCardProps {
  term: string;
  definition: string;
  example?: string;
}

export function GlossaryCard({ term, definition, example }: GlossaryCardProps) {
  return (
    <Card className="w-full my-4 bg-gradient-to-b from-blue-50 to-white border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Book className="h-5 w-5 text-blue-500" />
          <span className="capitalize">{term.replace(/-/g, ' ')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-2">{definition}</p>
        {example && (
          <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
            <p className="text-gray-600 italic">{example}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function GlossaryLookup({ termId }: { termId: string }) {
  // Convert term IDs like "out-of-pocket-maximum" to match our glossary keys
  const normalizedTermId = termId.toLowerCase().trim();
  
  // Find the term in our glossary
  const glossaryEntry = insuranceGlossary[normalizedTermId as keyof typeof insuranceGlossary];
  
  if (!glossaryEntry) {
    return (
      <Card className="w-full my-4 bg-amber-50 border-amber-100">
        <CardContent className="py-4">
          <p className="text-sm text-amber-700">
            Sorry, I couldn't find a definition for "{termId}". Please try another insurance term.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <GlossaryCard 
      term={normalizedTermId} 
      definition={glossaryEntry.definition}
      example={glossaryEntry.example}
    />
  );
}