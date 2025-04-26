import React from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/language-selector";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-primary mb-2">{t('termsOfService')}</h1>
            <p className="text-gray-500 text-sm">
              {t('lastUpdated')}: April 25, 2025
            </p>
          </div>
          
          <div className="space-y-8 mb-10">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('introduction')}</h2>
              <p className="text-gray-700 mb-4">
                {t('termsIntro')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('userObligations')}</h2>
              <p className="text-gray-700 mb-4">
                {t('userObligationsText1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('userObligationsText2')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('limitationOfLiability')}</h2>
              <p className="text-gray-700 mb-4">
                {t('limitationOfLiabilityText1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('limitationOfLiabilityText2')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('noWarranty')}</h2>
              <p className="text-gray-700 mb-4">
                {t('noWarrantyText')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('purchaseAgreements')}</h2>
              <p className="text-gray-700 mb-4">
                {t('purchaseAgreementsText1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('purchaseAgreementsText2')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('refundPolicy')}</h2>
              <p className="text-gray-700 mb-4">
                {t('refundPolicyText')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('intellectualProperty')}</h2>
              <p className="text-gray-700 mb-4">
                {t('intellectualPropertyText')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('governingLaw')}</h2>
              <p className="text-gray-700 mb-4">
                {t('governingLawText')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('contactUs')}</h2>
              <p className="text-gray-700 mb-4">
                {t('contactUsText')}
              </p>
              <p className="text-gray-700">
                Email: support@briki.co
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}