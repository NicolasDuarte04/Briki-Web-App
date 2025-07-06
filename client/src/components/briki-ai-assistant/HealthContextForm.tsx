import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface HealthContextFormProps {
  initialData: {
    age?: string;
    gender?: string;
    country?: string;
  };
  onSubmit: (data: { age: string; gender: string; country: string }) => void;
  onCancel: () => void;
}

export const HealthContextForm: React.FC<HealthContextFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [age, setAge] = useState(initialData.age || '');
  const [gender, setGender] = useState(initialData.gender || '');
  const [country, setCountry] = useState(initialData.country || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && gender && country) {
      onSubmit({ age, gender, country });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Necesitamos un poco más de información para tu seguro de salud:</h3>
      <div className="space-y-2">
        <Label htmlFor="age">Edad</Label>
        <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ej: 30 años" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Género</Label>
        <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Ej: Femenino" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">País o ciudad de residencia</Label>
        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej: Colombia" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Buscar planes</Button>
      </div>
    </form>
  );
}; 