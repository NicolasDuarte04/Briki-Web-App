// Respuestas prefabricadas para el Asistente de Briki
// Usadas para demostraciones y validación con inversionistas

export interface MockPlan {
  name: string;
  price: string;
  features: string[];
  badge: string;
}

export interface MockResponse {
  text: string;
  plans: MockPlan[];
  cta: {
    label: string;
    href: string;
  };
}

export interface MockPrompt {
  match: string;
  response: MockResponse;
}

export const mockPrompts: MockPrompt[] = [
  {
    match: "compré una Vespa y quiero asegurarla",
    response: {
      text: "¡Buena elección! Asegurar tu Vespa en Colombia es clave para protegerte ante robos, accidentes o daños. Aquí tienes tres opciones ideales para ti:",
      plans: [
        {
          name: "MotoProtect Plus",
          price: "$52.000/mes",
          features: [
            "Cobertura contra robo total",
            "Asistencia en carretera 24/7",
            "Protección de daños a terceros"
          ],
          badge: "Recomendado para motos nuevas"
        },
        {
          name: "Plan Básico Vespa",
          price: "$39.000/mes",
          features: [
            "Cobertura por accidentes",
            "Defensa jurídica incluida",
            "Revisión técnica anual gratis"
          ],
          badge: "Económico"
        },
        {
          name: "MotoTotal VIP",
          price: "$74.000/mes",
          features: [
            "Cobertura total con deducible bajo",
            "Reemplazo por daño total",
            "Asistencia médica y grúa premium"
          ],
          badge: "Cobertura total"
        }
      ],
      cta: {
        label: "Ver todos los planes de moto",
        href: "/insurance/auto"
      }
    }
  },
  {
    match: "seguro de viaje",
    response: {
      text: "Los seguros de viaje son esenciales para disfrutar de tu aventura con tranquilidad. Aquí tienes tres opciones que podrían adaptarse a tus necesidades:",
      plans: [
        {
          name: "Traveler Basic",
          price: "$15.000/día",
          features: [
            "Asistencia médica hasta $50.000 USD",
            "Pérdida de equipaje",
            "Cancelación de viaje"
          ],
          badge: "Más popular"
        },
        {
          name: "World Explorer",
          price: "$24.000/día",
          features: [
            "Asistencia médica hasta $150.000 USD",
            "Deportes de aventura incluidos",
            "Cobertura para dispositivos electrónicos"
          ],
          badge: "Para aventureros"
        },
        {
          name: "Premium Global",
          price: "$35.000/día",
          features: [
            "Asistencia médica ilimitada",
            "Evacuación médica de emergencia",
            "Concierge 24/7 y compensación por retrasos"
          ],
          badge: "Cobertura total"
        }
      ],
      cta: {
        label: "Ver todos los planes de viaje",
        href: "/insurance/travel"
      }
    }
  },
  {
    match: "seguro de salud",
    response: {
      text: "La salud es lo más importante. Estos planes de seguro médico te ofrecen diferentes niveles de cobertura según tus necesidades y presupuesto:",
      plans: [
        {
          name: "HealthEssential",
          price: "$120.000/mes",
          features: [
            "Consultas médicas generales",
            "Atención de urgencias",
            "Medicamentos genéricos"
          ],
          badge: "Básico"
        },
        {
          name: "FamilyCare Plus",
          price: "$250.000/mes",
          features: [
            "Cobertura familiar completa",
            "Especialistas sin remisión",
            "Hospitalización y cirugías"
          ],
          badge: "Recomendado"
        },
        {
          name: "TotalHealth Elite",
          price: "$380.000/mes",
          features: [
            "Cobertura nacional e internacional",
            "Acceso a clínicas premium",
            "Procedimientos estéticos incluidos"
          ],
          badge: "Premium"
        }
      ],
      cta: {
        label: "Ver todos los planes de salud",
        href: "/insurance/health"
      }
    }
  },
  {
    match: "seguro para mascota",
    response: {
      text: "Tu mascota merece la mejor protección. Estos planes cubren desde cuidados básicos hasta emergencias complejas:",
      plans: [
        {
          name: "PetCare Basic",
          price: "$35.000/mes",
          features: [
            "Consultas veterinarias básicas",
            "Vacunas esenciales",
            "Desparasitación"
          ],
          badge: "Económico"
        },
        {
          name: "FurryFriend Plus",
          price: "$65.000/mes",
          features: [
            "Consultas con especialistas",
            "Cirugías y hospitalizaciones",
            "Medicamentos recetados"
          ],
          badge: "Más vendido"
        },
        {
          name: "PawsElite",
          price: "$95.000/mes",
          features: [
            "Tratamientos oncológicos",
            "Terapias alternativas",
            "Seguro de responsabilidad civil"
          ],
          badge: "Completo"
        }
      ],
      cta: {
        label: "Ver todos los planes para mascotas",
        href: "/insurance/pet"
      }
    }
  }
];

// Mensaje para respuestas que no coinciden con ningún prompt mock
export const defaultAssistantMessage = "Briki está en mantenimiento, pero pronto volveré con respuestas personalizadas. Mientras tanto, puedes explorar nuestros planes de seguro o hacer una de estas preguntas: '¿Cómo asegurar mi Vespa?', '¿Qué seguro de viaje me recomiendas?', '¿Cuál es el mejor seguro de salud?', o '¿Hay seguros para mi mascota?'";