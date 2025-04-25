import React, { useState } from 'react';
import { WeatherRiskVisualization } from '@/components/weather-risk-visualization';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { destinationRisks } from '@/data/weatherRiskData';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WeatherRiskPage() {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [originCountry, setOriginCountry] = useState<string>('colombia');
  const [insuranceRecommendation, setInsuranceRecommendation] = useState<string>('');

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
  };

  const handleOriginChange = (value: string) => {
    setOriginCountry(value);
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

      <Alert className="mb-6 bg-blue-50 border border-blue-100 text-blue-700">
        <AlertDescription>
          La información de riesgos climáticos está basada en datos meteorológicos históricos y tendencias estacionales. 
          Los datos se actualizan periódicamente y se proporcionan como referencia para ayudar en la planificación de viajes. 
          Recomendamos verificar las condiciones climáticas actuales antes de viajar.
        </AlertDescription>
      </Alert>

      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Detalles del Viaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">País de Origen</label>
            <Select value={originCountry} onValueChange={handleOriginChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el país de origen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colombia">Colombia</SelectItem>
                <SelectItem value="mexico">México</SelectItem>
                <SelectItem value="argentina">Argentina</SelectItem>
                <SelectItem value="peru">Perú</SelectItem>
                <SelectItem value="chile">Chile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País de Destino</label>
            <Select 
              value={selectedDestination} 
              onValueChange={handleDestinationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el país de destino" />
              </SelectTrigger>
              <SelectContent>
                {destinationRisks.map((destination) => (
                  <SelectItem 
                    key={`${destination.country}-${destination.city}`} 
                    value={`${destination.country.toLowerCase()}-${destination.city.toLowerCase()}`}
                  >
                    {destination.city}, {destination.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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

      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          La información de seguro está basada en documentos públicos oficiales de cada proveedor, 
          incluyendo folletos y resúmenes de pólizas. Nos esforzamos por mantener la precisión y 
          transparencia mientras finalizamos alianzas formales con aseguradoras. Por favor, confirme 
          los detalles del plan con el proveedor antes de comprar.
        </p>
      </div>
    </div>
  );
}