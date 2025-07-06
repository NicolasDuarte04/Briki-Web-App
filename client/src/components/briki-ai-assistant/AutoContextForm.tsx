import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AutoContextFormProps {
  initialData: {
    make?: string;
    year?: string;
    country?: string;
  };
  onSubmit: (data: { make: string; year: string; country: string }) => void;
  onCancel: () => void;
}

export const AutoContextForm: React.FC<AutoContextFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [make, setMake] = useState(initialData.make || '');
  const [year, setYear] = useState(initialData.year || '');
  const [country, setCountry] = useState(initialData.country || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (make && year && country) {
      onSubmit({ make, year, country });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Necesitamos un poco más de información para tu seguro de auto:</h3>
      <div className="space-y-2">
        <Label htmlFor="make">Marca del auto</Label>
        <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Ej: Mazda" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Año del modelo</Label>
        <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ej: 2022" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">País o ciudad</Label>
        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej: Colombia" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Buscar planes</Button>
      </div>
    </form>
  );
}; 