import chickenAdoboBowl from '../assets/menu/chicken-adobo-bowl.jpg';
import classicBeefTapa from '../assets/menu/classic-beef-tapa.jpg';
import creamyChickenPasta from '../assets/menu/creamy-chicken-pasta.jpg';
import darkChocolateCroissant from '../assets/menu/dark-chocolate-croissant.jpg';
import icedSpanishLatte from '../assets/menu/iced-spanish-latte.jpg';
import mangoCalamansiFizz from '../assets/menu/mango-calamansi-fizz.jpg';
import truffleMushroomBurger from '../assets/menu/truffle-mushroom-burger.jpg';
import ubeCheesecake from '../assets/menu/ube-cheesecake.jpg';

export const categories = [
  { id: 'best-sellers', label: 'Best Sellers', icon: 'sparkles' },
  { id: 'meals', label: 'Meals', icon: 'meal' },
  { id: 'burgers', label: 'Burgers', icon: 'burger' },
  { id: 'drinks', label: 'Drinks', icon: 'drink' },
  { id: 'desserts', label: 'Desserts', icon: 'dessert' },
];

export const products = [
  {
    id: 'chicken-adobo-bowl',
    name: 'Chicken Adobo Bowl',
    description: 'Slow-glazed chicken, steamed rice, and a soft egg.',
    priceCentavos: 17900,
    categoryId: 'meals',
    image: chickenAdoboBowl,
    featured: true,
    popularity: 1,
  },
  {
    id: 'truffle-mushroom-burger',
    name: 'Truffle Mushroom Burger',
    description: 'Beef, cheddar, caramelized onion, and truffle sauce.',
    priceCentavos: 22900,
    categoryId: 'burgers',
    image: truffleMushroomBurger,
    featured: true,
    popularity: 2,
  },
  {
    id: 'creamy-chicken-pasta',
    name: 'Creamy Chicken Pasta',
    description: 'Roasted chicken, mushrooms, parmesan, and herbs.',
    priceCentavos: 18900,
    categoryId: 'meals',
    image: creamyChickenPasta,
    featured: true,
    popularity: 3,
  },
  {
    id: 'classic-beef-tapa',
    name: 'Classic Beef Tapa',
    description: 'Tender tapa, garlic rice, sunny egg, and tomato.',
    priceCentavos: 19900,
    categoryId: 'meals',
    image: classicBeefTapa,
    featured: false,
    popularity: 8,
  },
  {
    id: 'iced-spanish-latte',
    name: 'Iced Spanish Latte',
    description: 'Silky milk, bold espresso, and gentle sweetness.',
    priceCentavos: 14500,
    categoryId: 'drinks',
    image: icedSpanishLatte,
    featured: true,
    popularity: 4,
  },
  {
    id: 'mango-calamansi-fizz',
    name: 'Mango Calamansi Fizz',
    description: 'Bright tropical mango, calamansi, and sparkling soda.',
    priceCentavos: 11900,
    categoryId: 'drinks',
    image: mangoCalamansiFizz,
    featured: false,
    popularity: 7,
  },
  {
    id: 'ube-cheesecake',
    name: 'Ube Cheesecake',
    description: 'Velvety ube cheesecake on a crisp biscuit base.',
    priceCentavos: 13900,
    categoryId: 'desserts',
    image: ubeCheesecake,
    featured: true,
    popularity: 5,
  },
  {
    id: 'dark-chocolate-croissant',
    name: 'Dark Chocolate Croissant',
    description: 'Flaky butter pastry with a dark chocolate center.',
    priceCentavos: 12900,
    categoryId: 'desserts',
    image: darkChocolateCroissant,
    featured: false,
    popularity: 6,
  },
];

