import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Calendar, Shield, DollarSign, Phone, Mail, User, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/format';

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

export default function CotizarPage() {
  const { planId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get plan from sessionStorage first
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
      // Simulate API call delay
      setTimeout(() => {
        const mockPlan: InsurancePlan = {
          id: parseInt(planId),
          name: `Plan Premium ${planId}`,
          category: 'travel',
          provider: 'Seguros Colombia',
          basePrice: 89000,
          coverageAmount: 150000,
          currency: 'COP',
          country: 'CO',
          benefits: [
            'Cobertura médica hasta $150,000 USD',
            'Cancelación de viaje 100%',
            'Equipaje perdido hasta $2,000 USD',
            'Asistencia 24/7',
            'Deportes de aventura incluidos',
            'COVID-19 cubierto'
          ],
          description: 'Plan completo para viajeros que buscan máxima protección',
          duration: 'por viaje',
          deductible: 0,
          validity: '365 días'
        };
        setPlan(mockPlan);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [planId]);

  const handleContactAgent = () => {
    toast({
      title: "Conectando con agente",
      description: "Te contactaremos en los próximos 5 minutos",
    });
  };

  const handleProceedToCheckout = () => {
    if (plan) {
      // Store plan data and navigate to checkout
      sessionStorage.setItem('checkoutPlan', JSON.stringify(plan));
      navigate(`/checkout/${plan.id}`);
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
          <p className="text-gray-600">Cargando información del plan...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cotización de Seguro
              </h1>
              <p className="text-gray-600">
                Información detallada y opciones de contratación
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{plan.provider}</p>
                    {plan.description && (
                      <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Disponible
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Price Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Precio del plan</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(plan.basePrice, plan.currency)}
                      </p>
                      {plan.duration && (
                        <p className="text-sm text-gray-500">{plan.duration}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Cobertura máxima</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(plan.coverageAmount, 'USD')}
                      </p>
                      {plan.deductible === 0 && (
                        <Badge variant="secondary" className="mt-1">
                          Sin deducible
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Cobertura médica</p>
                      <p className="text-sm text-gray-600">{formatCurrency(plan.coverageAmount, 'USD')}</p>
                    </div>
                  </div>
                  
                  {plan.deductible !== undefined && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Deducible</p>
                        <p className="text-sm text-gray-600">
                          {plan.deductible === 0 ? 'Sin deducible' : formatCurrency(plan.deductible, plan.currency)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {plan.validity && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Vigencia</p>
                        <p className="text-sm text-gray-600">{plan.validity}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Beneficios incluidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-4">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Listo para contratar?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Contratar ahora
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleContactAgent}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Hablar con agente
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Necesitas ayuda?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Llámanos</p>
                      <p className="text-sm text-gray-600">+57 1 234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">soporte@briki.co</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Chat en vivo</p>
                      <p className="text-sm text-gray-600">Disponible 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium">100% Seguro</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Información protegida con SSL
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-3">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-xs">Autorizado por Fasecolda</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 