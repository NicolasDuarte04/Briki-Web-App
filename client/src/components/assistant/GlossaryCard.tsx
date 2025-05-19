import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

// Sample glossary terms
export const insuranceGlossary = {
  "deductible": {
    term: "Deductible",
    definition: "The amount you pay for covered healthcare services before your insurance plan starts to pay.",
    example: "With a $2,000 deductible, you pay the first $2,000 of covered services yourself before insurance begins to pay."
  },
  "premium": {
    term: "Premium",
    definition: "The amount you pay for your health insurance every month.",
    example: "If your premium is $400, that's the amount you pay every month whether you use medical services or not."
  },
  "copay": {
    term: "Copay",
    definition: "A fixed amount you pay for a covered healthcare service after you've paid your deductible.",
    example: "Your plan might require a $20 copay for each doctor visit and a $10 copay for each prescription."
  },
  "coinsurance": {
    term: "Coinsurance",
    definition: "The percentage of costs of a covered healthcare service you pay after you've paid your deductible.",
    example: "If your coinsurance is 20%, you pay 20% of the allowed service cost, and your insurer pays 80%."
  },
  "out_of_pocket_maximum": {
    term: "Out-of-Pocket Maximum",
    definition: "The most you have to pay for covered services in a plan year. After you spend this amount on deductibles, copayments, and coinsurance, your health plan pays 100% of the costs of covered benefits.",
    example: "If your out-of-pocket maximum is $8,000, once you've spent $8,000 on covered services, your insurance will pay for all covered services for the rest of the plan year."
  },
  "claim": {
    term: "Claim",
    definition: "A request for payment that you or your healthcare provider submits to your health insurer when you get items or services you think are covered.",
    example: "After visiting the doctor, they'll file a claim with your insurance company to receive payment for services provided."
  },
  "exclusions": {
    term: "Exclusions",
    definition: "Items or services that your health insurance or plan doesn't cover.",
    example: "Many health plans exclude cosmetic surgery, experimental treatments, or certain elective procedures."
  },
  "preexisting_condition": {
    term: "Pre-existing Condition",
    definition: "A health problem you had before the date that new health coverage starts.",
    example: "If you were treated for diabetes before enrolling in a new health plan, diabetes would be considered a pre-existing condition."
  },
  "rider": {
    term: "Rider",
    definition: "An amendment to an insurance policy that modifies the policy by adding, restricting, or excluding coverage for certain conditions.",
    example: "You might add a critical illness rider to a life insurance policy to receive additional benefits if diagnosed with a specified illness."
  },
  "comprehensive_coverage": {
    term: "Comprehensive Coverage",
    definition: "Auto insurance that covers damage to your car not caused by a collision, such as theft, vandalism, or natural disasters.",
    example: "If a tree falls on your car during a storm, comprehensive coverage would help pay for repairs."
  },
  "collision_coverage": {
    term: "Collision Coverage",
    definition: "Auto insurance that pays for damages to your car caused by a collision with another vehicle or object.",
    example: "If you hit a guardrail and damage your car, collision coverage would help pay for repairs."
  },
  "liability_insurance": {
    term: "Liability Insurance",
    definition: "Insurance that protects you if you're legally responsible for damage to another person's property or injuries to other people.",
    example: "If you cause an accident that injures another driver, your liability insurance would help cover their medical expenses."
  },
  "actuary": {
    term: "Actuary",
    definition: "A professional who analyzes the financial costs of risk and uncertainty using mathematics, statistics, and financial theory.",
    example: "Insurance companies employ actuaries to determine how much to charge for policies based on risk assessment."
  },
  "underwriting": {
    term: "Underwriting",
    definition: "The process of evaluating the risk of insuring a home, car, driver, or individual to determine if it's profitable and at what premium to accept an applicant.",
    example: "During the underwriting process, the insurer may check your driving record, credit history, and other factors."
  },
  "endorsement": {
    term: "Endorsement",
    definition: "An amendment to an insurance policy that changes the original terms of coverage.",
    example: "You might add an endorsement to your homeowner's policy to increase coverage for jewelry or art collections."
  }
};

export interface GlossaryCardProps {
  term: string;
  definition: string;
  example?: string;
}

export function GlossaryCard({ term, definition, example }: GlossaryCardProps) {
  return (
    <Card className="w-full my-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-bold text-blue-700">{term}</CardTitle>
        </div>
        {example && (
          <CardDescription className="text-blue-600/90 italic text-sm">
            "{example}"
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{definition}</p>
      </CardContent>
    </Card>
  );
}

// Component to lookup a term and display the definition
export function GlossaryLookup({ termId }: { termId: string }) {
  // Normalize the termId to handle different formats
  const normalizedTermId = termId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // Find the term in our glossary
  const glossaryItem = insuranceGlossary[normalizedTermId as keyof typeof insuranceGlossary];
  
  if (!glossaryItem) {
    return (
      <Card className="w-full my-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
        <CardContent className="py-4">
          <p className="text-sm text-gray-700">
            Sorry, I couldn't find a definition for "{termId}" in our insurance glossary.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return <GlossaryCard {...glossaryItem} />;
}