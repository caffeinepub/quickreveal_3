import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCreateSalon } from '../hooks/useQueries';
import type { Service } from '../backend';

type Step = 1 | 2 | 3;

interface ServiceForm {
  name: string;
  durationMinutes: number;
  price: number;
}

interface OpeningHours {
  openTime: number;
  closeTime: number;
}

export default function ProSalonWizard() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [services, setServices] = useState<ServiceForm[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHours>({ openTime: 9, closeTime: 18 });

  const { mutate: createSalon, isPending, isSuccess } = useCreateSalon();

  const addService = () => {
    setServices([...services, { name: '', durationMinutes: 30, price: 0 }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof ServiceForm, value: string | number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const canProceedStep1 = name.trim() && neighborhood.trim() && description.trim();
  const canProceedStep2 = services.length > 0 && services.every(s => s.name.trim() && s.price > 0);
  const canSubmit = canProceedStep1 && canProceedStep2;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const backendServices: Service[] = services.map(s => ({
      name: s.name,
      durationMinutes: BigInt(s.durationMinutes),
      price: BigInt(s.price)
    }));

    const photoUrls = photoUrl.trim() ? [photoUrl.trim()] : [];

    createSalon(
      {
        name: name.trim(),
        neighborhood: neighborhood.trim(),
        description: description.trim(),
        photoUrls,
        services: backendServices,
        isPremium
      },
      {
        onSuccess: () => {
          // Reset form
          setStep(1);
          setName('');
          setNeighborhood('');
          setDescription('');
          setPhotoUrl('');
          setIsPremium(false);
          setServices([]);
          setOpeningHours({ openTime: 9, closeTime: 18 });
        }
      }
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Salon Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., The Night Studio"
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-white">
                Neighborhood *
              </Label>
              <Input
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g., Downtown"
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your salon's unique atmosphere and services..."
                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl" className="text-white">
                Photo URL (optional)
              </Label>
              <Input
                id="photoUrl"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="premium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked === true)}
                className="border-zinc-700"
              />
              <Label htmlFor="premium" className="text-white cursor-pointer">
                Mark as Premium Salon
              </Label>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full"
            >
              Next: Add Services <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {services.map((service, index) => (
                <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <Label className="text-white text-sm">Service {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                      placeholder="Service name (e.g., Men's Haircut)"
                      className="bg-zinc-900 border-zinc-700 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-zinc-400 text-xs">Duration (min)</Label>
                        <Input
                          type="number"
                          value={service.durationMinutes}
                          onChange={(e) => updateService(index, 'durationMinutes', parseInt(e.target.value) || 0)}
                          className="bg-zinc-900 border-zinc-700 text-white"
                          min="5"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-xs">Price (€)</Label>
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', parseInt(e.target.value) || 0)}
                          className="bg-zinc-900 border-zinc-700 text-white"
                          min="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={addService}
              variant="outline"
              className="w-full border-zinc-700 text-white hover:bg-zinc-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1"
              >
                Next: Opening Hours <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-white">Opening Hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-400 text-xs">Opens at</Label>
                  <Input
                    type="number"
                    value={openingHours.openTime}
                    onChange={(e) => setOpeningHours({ ...openingHours, openTime: parseInt(e.target.value) || 0 })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    min="0"
                    max="23"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Closes at</Label>
                  <Input
                    type="number"
                    value={openingHours.closeTime}
                    onChange={(e) => setOpeningHours({ ...openingHours, closeTime: parseInt(e.target.value) || 0 })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    min="0"
                    max="23"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                Availability slots will be generated for today and tomorrow within these hours.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !canSubmit}
                className="flex-1"
              >
                {isPending ? 'Creating...' : 'Create Salon'}
              </Button>
            </div>

            {isSuccess && (
              <p className="text-sm text-green-400 text-center">
                Salon created successfully!
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Create New Salon</span>
          <span className="text-sm font-normal text-zinc-500">Step {step} of 3</span>
        </CardTitle>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition ${
                s <= step ? 'bg-violet-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
