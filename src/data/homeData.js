const categories = [
  { id: 'spa', label: 'Spa', icon: 'flower-outline', selected: true },
  { id: 'massage', label: 'Massage', icon: 'hand-left-outline' },
  { id: 'beauty', label: 'Beauty', icon: 'sparkles' },
  { id: 'wellness', label: 'Wellness', icon: 'leaf-outline' },
];

const featuredSpas = [
  {
    id: 'featured-1',
    name: 'Serenity Spa',
    location: 'Jubilee Hills',
    distance: '1.2 km',
    rating: '4.7',
    reviews: '1.2K reviews',
    price: '₹1,999',
    oldPrice: '₹2,400',
    badge: '15% OFF',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60',
    favorite: true,
  },
  {
    id: 'featured-2',
    name: 'Bliss Spa',
    location: 'Banjara Hills',
    distance: '900 m',
    rating: '4.6',
    reviews: '931 reviews',
    price: '₹1,399',
    oldPrice: '₹1,900',
    badge: '20% OFF',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
    favorite: false,
  },
  {
    id: 'featured-3',
    name: 'The Calm Space',
    location: 'Jubilee Hills',
    distance: '1.9 km',
    rating: '4.7',
    reviews: '1.1K reviews',
    price: '₹1,650',
    oldPrice: '₹1,900',
    badge: '10% OFF',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=60',
    favorite: false,
  },
];

const nearbySpas = [
  {
    id: 'nearby-1',
    name: 'Bliss Spa',
    subtitle: '1.1 km · 10 mins away',
    typeA: 'Massage',
    typeB: 'Beauty',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1525109462008-1f1ede51f3ae?auto=format&fit=crop&w=900&q=60',
  },
  {
    id: 'nearby-2',
    name: 'The Calm Space',
    subtitle: '1.9 km · 12 mins away',
    typeA: 'Wellness',
    typeB: 'Steam',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da2?auto=format&fit=crop&w=900&q=60',
  },
];

const wellnessMoments = [
  {
    id: 'moment-1',
    title: 'Stress melting away',
    subtitle: 'Best deep tissue spas near you',
    icon: 'snow-outline',
  },
  {
    id: 'moment-2',
    title: 'Glow up today',
    subtitle: 'Top rated facial treatments open now',
    icon: 'sparkles',
  },
  {
    id: 'moment-3',
    title: 'Self-Care Time',
    subtitle: 'Curated spas near you',
    icon: 'flower-outline',
  },
];

const banners = [
  {
    id: 'banner-1',
    label: 'Premium Offers',
    title: 'Treat yourself today',
    description: 'Discover curated spa deals around your area.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=60',
  },
];

const offer = {
  id: 'offer-1',
  label: 'Limited time',
  title: 'Take a break today.',
  subtitle: '20% off at your favourite spa.',
  cta: 'Claim Now',
};

const wellnessInsight = {
  id: 'insight-1',
  title: 'The Art of Hot Stone Therapy',
  description: 'Discover how heated basalt stones can melt away tension, improve circulation, & promote a deeper state of relaxation than traditional massage alone.',
  image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60',
};

export { categories, featuredSpas, nearbySpas, wellnessMoments, banners, offer, wellnessInsight };
