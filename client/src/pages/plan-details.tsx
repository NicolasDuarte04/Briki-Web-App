import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, CheckCircle, XCircle, Calendar, Shield, DollarSign, Info, Star } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { formatCurrency } from '../utils/format';

interface InsurancePlan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  coverageAmount: number;
  currency: string;
  country: string;
  benefits: string[];
  description?: string;
  duration?: string;
  tags?: string[];
  deductible?: number;
  copay?: string;
  validity?: string;
}

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get plan from sessionStorage or navigation state first
    const storedPlan = sessionStorage.getItem('selectedPlan');
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setPlan(parsedPlan);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored plan:', error);
      }
    }

    // If no stored plan, create a mock plan based on planId
    if (planId) {
      setTimeout(() => {
        const mockPlan: InsurancePlan = {
          id: parseInt(planId) || 1,
          name: `Plan Detallado ${planId}`,
          category: 'travel',
          provider: 'Seguros Colombia Premium',
          basePrice: 125000,
          coverageAmount: 200000,
          currency: 'COP',
          country: 'CO',
          benefits: [
            'Cobertura médica hasta $200,000 USD',
            'Cancelación de viaje 100%',
            'Equipaje perdido hasta $3,000 USD',
            'Asistencia 24/7 en español',
            'Deportes de aventura incluidos',
            'COVID-19 cubierto completamente',
            'Repatriación sanitaria',
            'Gastos odontológicos de emergencia',
            'Responsabilidad civil',
            'Asistencia legal en el extranjero'
          ],
          description: 'Plan premium con la mayor cobertura disponible para viajeros exigentes',
          duration: 'por viaje',
          deductible: 0,
          validity: '365 días'
        };
        setPlan(mockPlan);
        setLoading(false);
      }, 800);
    } else {
      setLoading(false);
    }
  }, [planId]);

  const handleGetQuote = () => {
    if (plan) {
      sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
      navigate(`/cotizar/${plan.id}`);
    }
  };

  const handleGoBack = () => {
    navigate('/ask-briki-ai');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Plan no encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              No pudimos encontrar la información del plan solicitado.
            </p>
            <Button onClick={handleGoBack}>
              Volver al asistente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock additional data for comprehensive view
  const mockExclusions = [
    'Actividades de alto riesgo no declaradas',
    'Condiciones médicas preexistentes no declaradas',
    'Viajes a zonas de conflicto',
    'Actividades ilegales'
  ];

  const mockTerms = [
    'Póliza válida por 365 días desde la emisión',
    'Cobertura inicia 24 horas después del pago',
    'Deducible de $0 USD para emergencias médicas',
    'Límite de edad: 75 años',
    'Renovación automática disponible'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al asistente
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {plan.name}
                </h1>
                <p className="text-gray-600">
                  {plan.provider} • {plan.category} insurance
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-600">4.2/5 (128 reseñas)</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Desde</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(plan.basePrice, plan.currency)}
              </p>
              <p className="text-sm text-gray-500">{plan.duration}</p>
              <Button 
                onClick={handleGetQuote}
                className="mt-3 bg-gradient-to-r from-primary to-primary/90"
                size="lg"
              >
                Obtener cotización
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="coverage">Cobertura</TabsTrigger>
              <TabsTrigger value="terms">Términos</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plan Summary */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen del Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{plan.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-500" />
                          <div>
                            <p className="font-medium">Cobertura máxima</p>
                            <p className="text-sm text-gray-600">{formatCurrency(plan.coverageAmount, 'USD')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Deducible</p>
                            <p className="text-sm text-gray-600">
                              {plan.deductible === 0 ? 'Sin deducible' : formatCurrency(plan.deductible || 0, plan.currency)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Vigencia</p>
                            <p className="text-sm text-gray-600">{plan.validity}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Categoría</p>
                            <p className="text-sm text-gray-600 capitalize">{plan.category}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Info */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Información rápida</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Proceso de compra</span>
                        <Badge variant="secondary">100% online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tiempo de emisión</span>
                        <Badge variant="secondary">Inmediato</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Soporte</span>
                        <Badge variant="secondary">24/7</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Idioma</span>
                        <Badge variant="secondary">Español</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coverage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Included Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      Beneficios incluidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {plan.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Exclusions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      Exclusiones principales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockExclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Términos y condiciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTerms.map((term, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{term}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="text-center">
                    <Button variant="outline" className="w-full">
                      Descargar términos completos (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Reseñas de clientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mock reviews */}
                    {[
                      {
                        name: "María González",
                        rating: 5,
                        comment: "Excelente servicio, me ayudaron cuando tuve una emergencia médica en Europa.",
                        date: "Hace 2 semanas"
                      },
                      {
                        name: "Carlos Rodríguez", 
                        rating: 4,
                        comment: "Buen plan, aunque el proceso de reembolso fue un poco lento.",
                        date: "Hace 1 mes"
                      },
                      {
                        name: "Ana López",
                        rating: 5,
                        comment: "Recomendado 100%. La atención al cliente es excepcional.",
                        date: "Hace 3 semanas"
                      }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calificación general</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div>
                        <div className="text-4xl font-bold text-primary">4.2</div>
                        <div className="flex justify-center items-center gap-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Basado en 128 reseñas</p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2 text-sm">
                            <span>{stars}</span>
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ 
                                  width: `${stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : stars === 2 ? 3 : 2}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-gray-500">
                              {stars === 5 ? 77 : stars === 4 ? 32 : stars === 3 ? 13 : stars === 2 ? 4 : 2}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
} 