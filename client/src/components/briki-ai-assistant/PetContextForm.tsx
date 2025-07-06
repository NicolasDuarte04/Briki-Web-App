import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PetContextFormProps {
  initialData: {
    petType?: string;
    petAge?: string;
    location?: string;
  };
  onSubmit: (data: { petType: string; petAge: string; location: string }) => void;
  onCancel: () => void;
}

export const PetContextForm: React.FC<PetContextFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [petType, setPetType] = useState(initialData.petType || '');
  const [petAge, setPetAge] = useState(initialData.petAge || '');
  const [location, setLocation] = useState(initialData.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petType && petAge && location) {
      onSubmit({ petType, petAge, location });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Necesitamos un poco más de información para tu seguro de mascota:</h3>
      <div className="space-y-2">
        <Label htmlFor="petType">Tipo de mascota</Label>
        <Input id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} placeholder="Ej: Perro" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="petAge">Edad de la mascota</Label>
        <Input id="petAge" value={petAge} onChange={(e) => setPetAge(e.target.value)} placeholder="Ej: 2 años" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">País o ciudad</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Colombia" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Buscar planes</Button>
      </div>
    </form>
  );
}; 