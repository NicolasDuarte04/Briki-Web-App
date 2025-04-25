import React, { useState } from 'react';
import { WeatherRiskVisualization } from '@/components/weather-risk-visualization';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { destinationRisks } from '@/data/weatherRiskData';

export default function WeatherRiskPage() {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [insuranceRecommendation, setInsuranceRecommendation] = useState<string>('');

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
  };

  const handleRecommendationUpdate = (recommendation: string) => {
    setInsuranceRecommendation(recommendation);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Riesgos Climáticos de Viaje</h1>
      <p className="text-gray-600 mb-8">
        Consulta los posibles riesgos climáticos en tu destino de viaje para elegir el seguro más adecuado.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <WeatherRiskVisualization 
            selectedDestination={selectedDestination}
            onInsuranceRecommendation={handleRecommendationUpdate}
          />
        </div>

        <div className="col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Guía de Seguro</h2>
            <p className="text-sm text-gray-600 mb-4">
              Según los factores de riesgo en tu destino, te ayudamos a elegir el seguro más adecuado.
            </p>

            {insuranceRecommendation ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-700 mb-2">Recomendación personalizada:</h3>
                <p className="text-sm text-blue-600">{insuranceRecommendation}</p>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center text-gray-500">
                <p>Selecciona un destino para recibir una recomendación personalizada</p>
              </div>
            )}

            <Button className="w-full">Ver planes recomendados</Button>
          </div>
        </div>
      </div>
    </div>
  );
}