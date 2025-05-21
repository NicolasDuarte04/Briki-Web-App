import React from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar-new";
import Footer from "@/components/footer";
import { ArrowLeft, Shield, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/language-selector";

export default function LearnMorePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="briki-mobile-container">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-6">{t('aboutBriki')}</h1>
          </div>
          
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t('ourMission')}</h2>
              <p className="text-gray-700 mb-4">
                {t('missionDescription')}
              </p>
              <div className="flex items-center space-x-2 text-primary font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>{t('travelConfidence')}</span>
              </div>
            </section>
            
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <Clock className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('quickAndEasy')}</h3>
                    <p className="text-gray-700">
                      {t('quickAndEasyDescription')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <Shield className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('trustedProviders')}</h3>
                    <p className="text-gray-700">
                      {t('trustedProvidersDescription')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-4 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                      <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('securePayments')}</h3>
                    <p className="text-gray-700">
                      {t('securePaymentsDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t('whyChooseBriki')}</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{t('whyChoosePoint1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{t('whyChoosePoint2')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{t('whyChoosePoint3')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{t('whyChoosePoint4')}</span>
                </li>
              </ul>
            </section>
            
            <section className="bg-primary/10 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">{t('startYourJourney')}</h2>
              <p className="text-gray-700 mb-6">
                {t('startYourJourneyDescription')}
              </p>
              <Link href="/trip-info">
                <button className="briki-button w-full">
                  {t('findPlanNow')}
                </button>
              </Link>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}