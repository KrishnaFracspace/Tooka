import type { ExploreSpa } from '../types/explore';

type SpaSeed = Omit<ExploreSpa, 'latitude' | 'longitude'> & {
  latitudeOffset: number;
  longitudeOffset: number;
};

const SPA_SEEDS: SpaSeed[] = [
  {
    id: 'explore-serenity-spa',
    name: 'Serenity Spa',
    latitudeOffset: 0.0028,
    longitudeOffset: -0.0019,
    rating: 4.7,
    reviewCount: 1200,
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    address: 'Jubilee Hills, Hyderabad',
    isOpen: true,
    distance: '0.6 km',
    description:
      'A premium wellness destination offering Thai therapies, deep tissue massages, aromatherapy and luxury relaxation experiences.',
  },
  {
    id: 'explore-ebony-salon-spa',
    name: 'Ebony Salon & Spa',
    latitudeOffset: -0.0014,
    longitudeOffset: 0.0023,
    rating: 4.9,
    reviewCount: 1250,
    image:
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=80',
    address: 'Road No. 12, Banjara Hills',
    isOpen: true,
    distance: '0.8 km',
    description:
      'A calm urban spa with signature massages, facial therapies and restorative body treatments.',
  },
  {
    id: 'explore-aura-wellness',
    name: 'Aura Wellness Lounge',
    latitudeOffset: 0.0045,
    longitudeOffset: 0.0035,
    rating: 4.8,
    reviewCount: 980,
    image:
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
    address: 'Film Nagar, Hyderabad',
    isOpen: true,
    distance: '1.1 km',
    description:
      'Personalized wellness rituals, aromatherapy and stress relief treatments in a warm boutique setting.',
  },
  {
    id: 'explore-lotus-thai-spa',
    name: 'Lotus Thai Spa',
    latitudeOffset: -0.0036,
    longitudeOffset: -0.0031,
    rating: 4.6,
    reviewCount: 760,
    image:
      'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=900&q=80',
    address: 'Madhapur Main Road',
    isOpen: false,
    distance: '1.4 km',
    description:
      'Traditional Thai massage, foot reflexology and calm recovery treatments for long workdays.',
  },
  {
    id: 'explore-moonstone-spa',
    name: 'Moonstone Spa',
    latitudeOffset: 0.0011,
    longitudeOffset: 0.0055,
    rating: 4.5,
    reviewCount: 640,
    image:
      'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=900&q=80',
    address: 'Kavuri Hills, Hyderabad',
    isOpen: true,
    distance: '1.6 km',
    description:
      'Quiet wellness rooms, premium oils and therapist-led bodywork for deep relaxation.',
  },
  {
    id: 'explore-nira-spa-studio',
    name: 'Nira Spa Studio',
    latitudeOffset: -0.0052,
    longitudeOffset: 0.0014,
    rating: 4.7,
    reviewCount: 840,
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    address: 'HITEC City Road',
    isOpen: true,
    distance: '1.9 km',
    description:
      'Modern spa studio focused on body massage, detox therapies and restorative skin care.',
  },
  {
    id: 'explore-prana-retreat',
    name: 'Prana Retreat',
    latitudeOffset: 0.006,
    longitudeOffset: -0.0048,
    rating: 4.8,
    reviewCount: 1120,
    image:
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
    address: 'Banjara Hills, Hyderabad',
    isOpen: true,
    distance: '2.1 km',
    description:
      'Luxury retreat for couple massages, aromatherapy, body scrubs and weekend wellness sessions.',
  },
  {
    id: 'explore-veda-spa',
    name: 'Veda Spa',
    latitudeOffset: -0.0024,
    longitudeOffset: -0.006,
    rating: 4.4,
    reviewCount: 520,
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    address: 'Jubilee Check Post',
    isOpen: false,
    distance: '2.3 km',
    description:
      'Ayurvedic-inspired treatments, full body massages and everyday wellness packages.',
  },
  {
    id: 'explore-ivory-wellness',
    name: 'Ivory Wellness',
    latitudeOffset: 0.0032,
    longitudeOffset: 0.0071,
    rating: 4.6,
    reviewCount: 710,
    image:
      'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80',
    address: 'Shaikpet, Hyderabad',
    isOpen: true,
    distance: '2.6 km',
    description:
      'Elegant treatment rooms with massages, facials and curated relaxation therapies.',
  },
  {
    id: 'explore-sukha-spa',
    name: 'Sukha Spa',
    latitudeOffset: -0.0063,
    longitudeOffset: -0.0044,
    rating: 4.7,
    reviewCount: 930,
    image:
      'https://images.unsplash.com/photo-1530193783736-e56d998cc0c4?auto=format&fit=crop&w=900&q=80',
    address: 'Madhapur, Hyderabad',
    isOpen: true,
    distance: '2.8 km',
    description:
      'A friendly neighborhood spa for body massage, head therapy, foot care and skin refresh sessions.',
  },
];

export const getExploreSpas = (
  latitude: number,
  longitude: number,
): ExploreSpa[] =>
  SPA_SEEDS.map(({ latitudeOffset, longitudeOffset, ...spa }) => ({
    ...spa,
    latitude: latitude + latitudeOffset,
    longitude: longitude + longitudeOffset,
  }));
