import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TravelContextFormProps {
  initialData: {
    destination?: string;
    datesOrDuration?: string;
    travelers?: string;
    purpose?: string;
  };
  onSubmit: (data: { destination: string; datesOrDuration: string; travelers: string; purpose: string }) => void;
  onCancel: () => void;
}

export const TravelContextForm: React.FC<TravelContextFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [destination, setDestination] = useState(initialData.destination || '');
  const [datesOrDuration, setDatesOrDuration] = useState(initialData.datesOrDuration || '');
  const [travelers, setTravelers] = useState(initialData.travelers || '');
  const [purpose, setPurpose] = useState(initialData.purpose || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination && datesOrDuration && travelers && purpose) {
      onSubmit({ destination, datesOrDuration, travelers, purpose });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Necesitamos un poco más de información para tu seguro de viaje:</h3>
      <div className="space-y-2">
        <Label htmlFor="destination">Destino</Label>
        <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ej: Europa" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="datesOrDuration">Fechas o duración</Label>
        <Input id="datesOrDuration" value={datesOrDuration} onChange={(e) => setDatesOrDuration(e.target.value)} placeholder="Ej: 2 semanas" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="travelers">Número de viajeros</Label>
        <Input id="travelers" value={travelers} onChange={(e) => setTravelers(e.target.value)} placeholder="Ej: 2 personas" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="purpose">Propósito del viaje</Label>
        <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Ej: Turismo" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Buscar planes</Button>
      </div>
    </form>
  );
}; 