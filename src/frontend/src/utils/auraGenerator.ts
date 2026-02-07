// Local-only Aura text generator for Creator Cockpit AI Assist
// Generates marketing descriptions based on salon form data

interface SalonFormData {
  name: string;
  city: string;
  category: string;
  type: string;
  tags: string[];
  services: Array<{ name: string; price: string | number }>;
}

const categoryAuras: Record<string, string[]> = {
  Barber: [
    "L'art de la coupe masculine redéfini. Précision chirurgicale, style intemporel.",
    "Sanctuaire du gentleman moderne. Chaque coupe raconte une histoire.",
    "Excellence traditionnelle, vision contemporaine. Le barbier réinventé.",
  ],
  Coiffure: [
    "Sculpteur de silhouettes capillaires. Votre transformation commence ici.",
    "L'élégance n'est pas un hasard. C'est une signature.",
    "Créateur de looks iconiques. Votre style, notre obsession.",
  ],
  Onglerie: [
    "Précision russe, élégance suisse. L'art au bout des doigts.",
    "Chaque ongle est une toile. Chaque main, une œuvre d'art.",
    "Perfection millimétrique. Beauté durable. Excellence absolue.",
  ],
  Esthétique: [
    "Technologies de pointe, rituels ancestraux. Le glow ultime.",
    "Sanctuaire de régénération. Votre peau mérite l'excellence.",
    "Science et sensorialité fusionnées. L'éclat révélé.",
  ],
};

const typeModifiers: Record<string, string> = {
  Domicile: "Service mobile premium. L'excellence vient à vous.",
  Salon: "Espace privé dédié. Atmosphère exclusive.",
};

const tagModifiers: Record<string, string> = {
  Soir: "Disponible en soirée pour les agendas exigeants.",
  Dimanche: "Ouvert le dimanche. Parce que le style ne prend pas de repos.",
  Lundi: "Lundi disponible. Commencez la semaine en beauté.",
};

export function generateAura(data: SalonFormData): string {
  const parts: string[] = [];

  // Category-based opening
  const categoryOptions = categoryAuras[data.category] || categoryAuras.Coiffure;
  const opening = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
  parts.push(opening);

  // Type modifier
  if (data.type && typeModifiers[data.type]) {
    parts.push(typeModifiers[data.type]);
  }

  // Tag modifiers
  if (data.tags && data.tags.length > 0) {
    const tagDescriptions = data.tags
      .filter((tag) => tagModifiers[tag])
      .map((tag) => tagModifiers[tag]);
    if (tagDescriptions.length > 0) {
      parts.push(tagDescriptions.join(" "));
    }
  }

  // Location touch
  if (data.city) {
    parts.push(`Basé à ${data.city}.`);
  }

  return parts.join(" ");
}
