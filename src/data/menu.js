import chocolateClassic from '../assets/b1t1/chocolate-classic.png';
import chocolateWhite from '../assets/b1t1/chocolate-white.png';
import donutAlmondChoco from '../assets/b1t1/donut-almond-choco.png';
import donutMilkMatcha from '../assets/b1t1/donut-milk-matcha.png';
import donutStrawberry from '../assets/b1t1/donut-strawberry.png';
import espressoAmericano from '../assets/b1t1/espresso-americano.png';
import espressoBrownSugar from '../assets/b1t1/espresso-brown-sugar.png';
import espressoCaramelMacchiato from '../assets/b1t1/espresso-caramel-macchiato.png';
import espressoDarkMochaLatte from '../assets/b1t1/espresso-dark-mocha-latte.png';
import espressoFerreroLatte from '../assets/b1t1/espresso-ferrero-latte.png';
import espressoLatte from '../assets/b1t1/espresso-latte.png';
import espressoSpanishLatte from '../assets/b1t1/espresso-spanish-latte.png';
import espressoUbeLatte from '../assets/b1t1/espresso-ube-latte.png';
import espressoVietnamese from '../assets/b1t1/espresso-vietnamese.png';
import frappeBlueberry from '../assets/b1t1/frappe-blueberry.png';
import frappeChocolate from '../assets/b1t1/frappe-chocolate.png';
import frappeDarkMocha from '../assets/b1t1/frappe-dark-mocha.png';
import frappeEspresso from '../assets/b1t1/frappe-espresso.png';
import frappeStrawberry from '../assets/b1t1/frappe-strawberry.png';
import fruitTeaBlueberry from '../assets/b1t1/fruit-tea-blueberry.png';
import fruitTeaGreenApple from '../assets/b1t1/fruit-tea-green-apple.png';
import fruitTeaLychee from '../assets/b1t1/fruit-tea-lychee.png';
import fruitTeaPassionFruit from '../assets/b1t1/fruit-tea-passion-fruit.png';
import fruitTeaStrawberry from '../assets/b1t1/fruit-tea-strawberry.png';
import matchaDirtyMatcha from '../assets/b1t1/matcha-dirty-matcha.png';
import matchaFrappe from '../assets/b1t1/matcha-frappe.png';
import matchaLatte from '../assets/b1t1/matcha-latte.png';
import waffleBiscoffCream from '../assets/b1t1/waffle-biscoff-cream.png';
import waffleCaramel from '../assets/b1t1/waffle-caramel.png';
import waffleChocolate from '../assets/b1t1/waffle-chocolate.png';
import waffleCookiesAndCream from '../assets/b1t1/waffle-cookies-and-cream.png';
import waffleMatchaCream from '../assets/b1t1/waffle-matcha-cream.png';
import wafflePeanutButter from '../assets/b1t1/waffle-peanut-butter.png';
import wafflePlain from '../assets/b1t1/waffle-plain.png';
import waffleSmores from '../assets/b1t1/waffle-smores.png';
import waffleStrawberry from '../assets/b1t1/waffle-strawberry.png';

export const categories = [
  { id: 'all', label: 'All', icon: 'sparkles' },
  { id: 'frappe', label: 'Frappe', icon: 'drink' },
  { id: 'espresso', label: 'Espresso', icon: 'coffee' },
  { id: 'matcha', label: 'Matcha', icon: 'leaf' },
  { id: 'chocolate', label: 'Chocolate', icon: 'chocolate' },
  { id: 'fruit-tea', label: 'Fruit Tea', icon: 'fruit-tea' },
  { id: 'donuts', label: 'Mini Donuts', icon: 'donut' },
  { id: 'waffles', label: 'Waffles', icon: 'waffle' },
];

function drinkVariants(soloPesos, b1t1Pesos) {
  return [
    { id: 'solo', label: 'Solo', priceCentavos: soloPesos * 100, servingCount: 1 },
    { id: 'b1t1', label: 'Buy 1 Take 1', priceCentavos: b1t1Pesos * 100, servingCount: 2 },
  ];
}

export const products = [
  {
    id: 'espresso-americano', sourceId: 1, name: 'Americano',
    description: 'Espresso with hot water', priceCentavos: 4800,
    variants: drinkVariants(48, 88), categoryId: 'espresso', image: espressoAmericano, popularity: 1,
  },
  {
    id: 'espresso-latte', sourceId: 6, name: 'Latte',
    description: 'Espresso with steamed milk', priceCentavos: 7800,
    variants: drinkVariants(78, 145), categoryId: 'espresso', image: espressoLatte, popularity: 2,
  },
  {
    id: 'espresso-ube-latte', sourceId: 8, name: 'Ube Latte',
    description: 'Espresso with ube syrup and steamed milk', priceCentavos: 7800,
    variants: drinkVariants(78, 145), categoryId: 'espresso', image: espressoUbeLatte, popularity: 3,
  },
  {
    id: 'espresso-brown-sugar', sourceId: 2, name: 'Brown Sugar',
    description: 'Espresso with brown sugar syrup and steamed milk', priceCentavos: 8800,
    variants: drinkVariants(88, 160), categoryId: 'espresso', image: espressoBrownSugar, popularity: 4,
  },
  {
    id: 'espresso-dark-mocha-latte', sourceId: 4, name: 'Dark Mocha Latte',
    description: 'Espresso with dark chocolate and steamed milk', priceCentavos: 8800,
    variants: drinkVariants(88, 160), categoryId: 'espresso', image: espressoDarkMochaLatte, popularity: 5,
  },
  {
    id: 'espresso-vietnamese', sourceId: 27, name: 'Vietnamese',
    description: 'Espresso with Vietnamese coffee and steamed milk', priceCentavos: 9500,
    variants: drinkVariants(95, 175), categoryId: 'espresso', image: espressoVietnamese, popularity: 6,
  },
  {
    id: 'espresso-spanish-latte', sourceId: 7, name: 'Spanish Latte',
    description: 'Espresso with Spanish chocolate and steamed milk', priceCentavos: 9800,
    variants: drinkVariants(98, 185), categoryId: 'espresso', image: espressoSpanishLatte, popularity: 7,
  },
  {
    id: 'espresso-caramel-macchiato', sourceId: 3, name: 'Caramel Macchiato',
    description: 'Espresso with caramel drizzle and steamed milk', priceCentavos: 9800,
    variants: drinkVariants(98, 165), categoryId: 'espresso', image: espressoCaramelMacchiato, popularity: 8,
  },
  {
    id: 'espresso-ferrero-latte', sourceId: 5, name: 'Ferrero Latte',
    description: 'Espresso with Ferrero chocolate and steamed milk', priceCentavos: 9800,
    variants: drinkVariants(98, 185), categoryId: 'espresso', image: espressoFerreroLatte, popularity: 9,
  },
  {
    id: 'matcha-latte', sourceId: 10, name: 'Matcha Latte',
    description: 'Matcha with steamed milk', priceCentavos: 9000,
    variants: drinkVariants(90, 185), categoryId: 'matcha', image: matchaLatte, popularity: 10,
  },
  {
    id: 'matcha-dirty-matcha', sourceId: 9, name: 'Dirty Matcha',
    description: 'Matcha with espresso and steamed milk', priceCentavos: 10500,
    variants: drinkVariants(105, 195), categoryId: 'matcha', image: matchaDirtyMatcha, popularity: 11,
  },
  {
    id: 'matcha-frappe', sourceId: 17, name: 'Matcha Frappe',
    description: 'Matcha with ice and milk', priceCentavos: 10500,
    variants: drinkVariants(105, 195), categoryId: 'matcha', image: matchaFrappe, popularity: 12,
  },
  {
    id: 'chocolate-classic', sourceId: 11, name: 'Chocolate',
    description: 'Chocolate with steamed milk', priceCentavos: 8500,
    variants: drinkVariants(85, 160), categoryId: 'chocolate', image: chocolateClassic, popularity: 13,
  },
  {
    id: 'chocolate-white', sourceId: 12, name: 'White Chocolate',
    description: 'White chocolate with hot water', priceCentavos: 9500,
    variants: drinkVariants(95, 175), categoryId: 'chocolate', image: chocolateWhite, popularity: 14,
  },
  {
    id: 'frappe-strawberry', sourceId: 18, name: 'Strawberry',
    description: 'Strawberry with ice and milk', priceCentavos: 9800,
    variants: drinkVariants(98, 188), categoryId: 'frappe', image: frappeStrawberry, popularity: 15,
  },
  {
    id: 'frappe-blueberry', sourceId: 13, name: 'Blueberry',
    description: 'Blueberry with ice and milk', priceCentavos: 9800,
    variants: drinkVariants(98, 188), categoryId: 'frappe', image: frappeBlueberry, popularity: 16,
  },
  {
    id: 'frappe-espresso', sourceId: 16, name: 'Espresso',
    description: 'Espresso with ice and milk', priceCentavos: 9800,
    variants: drinkVariants(98, 188), categoryId: 'frappe', image: frappeEspresso, popularity: 17,
  },
  {
    id: 'frappe-chocolate', sourceId: 14, name: 'Chocolate',
    description: 'Chocolate with ice and milk', priceCentavos: 9800,
    variants: drinkVariants(98, 188), categoryId: 'frappe', image: frappeChocolate, popularity: 18,
  },
  {
    id: 'frappe-dark-mocha', sourceId: 15, name: 'Dark Mocha',
    description: 'Dark mocha with ice and milk', priceCentavos: 9800,
    variants: drinkVariants(98, 188), categoryId: 'frappe', image: frappeDarkMocha, popularity: 19,
  },
  {
    id: 'fruit-tea-lychee', sourceId: 21, name: 'Lychee',
    description: 'Lychee with fruit tea', priceCentavos: 7500,
    variants: drinkVariants(75, 140), categoryId: 'fruit-tea', image: fruitTeaLychee, popularity: 20,
  },
  {
    id: 'fruit-tea-passion-fruit', sourceId: 22, name: 'Passion Fruit',
    description: 'Passion fruit with fruit tea', priceCentavos: 7500,
    variants: drinkVariants(75, 140), categoryId: 'fruit-tea', image: fruitTeaPassionFruit, popularity: 21,
  },
  {
    id: 'fruit-tea-blueberry', sourceId: 19, name: 'Blue Berry',
    description: 'Blueberry with fruit tea', priceCentavos: 7500,
    variants: drinkVariants(75, 140), categoryId: 'fruit-tea', image: fruitTeaBlueberry, popularity: 22,
  },
  {
    id: 'fruit-tea-strawberry', sourceId: 23, name: 'Strawberry',
    description: 'Strawberry with fruit tea', priceCentavos: 7500,
    variants: drinkVariants(75, 140), categoryId: 'fruit-tea', image: fruitTeaStrawberry, popularity: 23,
  },
  {
    id: 'fruit-tea-green-apple', sourceId: 20, name: 'Green Apple',
    description: 'Green apple with fruit tea', priceCentavos: 7500,
    variants: drinkVariants(75, 140), categoryId: 'fruit-tea', image: fruitTeaGreenApple, popularity: 24,
  },
  {
    id: 'waffle-plain', sourceId: 28, name: 'Plain Waffle',
    description: 'Plain waffles', priceCentavos: 5800,
    categoryId: 'waffles', image: wafflePlain, popularity: 25,
  },
  {
    id: 'waffle-strawberry', sourceId: 32, name: 'Strawberry Waffle',
    description: 'Strawberry waffles', priceCentavos: 6800,
    categoryId: 'waffles', image: waffleStrawberry, popularity: 26,
  },
  {
    id: 'waffle-matcha-cream', sourceId: 36, name: 'Matcha Cream Waffle',
    description: 'Matcha cream waffles', priceCentavos: 6800,
    categoryId: 'waffles', image: waffleMatchaCream, popularity: 27,
  },
  {
    id: 'waffle-caramel', sourceId: 29, name: 'Caramel Waffle',
    description: 'Caramel waffles', priceCentavos: 7800,
    categoryId: 'waffles', image: waffleCaramel, popularity: 28,
  },
  {
    id: 'waffle-chocolate', sourceId: 30, name: 'Chocolate Waffle',
    description: 'Chocolate waffles', priceCentavos: 8000,
    categoryId: 'waffles', image: waffleChocolate, popularity: 29,
  },
  {
    id: 'waffle-peanut-butter', sourceId: 33, name: 'Peanut Butter Waffle',
    description: 'Peanut butter waffles', priceCentavos: 8000,
    categoryId: 'waffles', image: wafflePeanutButter, popularity: 30,
  },
  {
    id: 'waffle-cookies-and-cream', sourceId: 35, name: 'Cookies and Cream Waffle',
    description: 'Cookies and cream waffles', priceCentavos: 8800,
    categoryId: 'waffles', image: waffleCookiesAndCream, popularity: 31,
  },
  {
    id: 'waffle-biscoff-cream', sourceId: 31, name: 'Biscoff Cream Waffle',
    description: 'Biscoff cream waffles', priceCentavos: 9800,
    categoryId: 'waffles', image: waffleBiscoffCream, popularity: 32,
  },
  {
    id: 'waffle-smores', sourceId: 34, name: "S'mores Waffle",
    description: "S'mores waffles", priceCentavos: 9800,
    categoryId: 'waffles', image: waffleSmores, popularity: 33,
  },
  {
    id: 'donut-almond-choco', sourceId: 24, name: 'Almond Choco Mini Donuts',
    description: 'One box of 8 almond choco mini donuts', priceCentavos: 19800,
    categoryId: 'donuts', image: donutAlmondChoco, popularity: 34,
  },
  {
    id: 'donut-milk-matcha', sourceId: 25, name: 'Milk Matcha Mini Donuts',
    description: 'One box of 8 milky matcha mini donuts', priceCentavos: 19800,
    categoryId: 'donuts', image: donutMilkMatcha, popularity: 35,
  },
  {
    id: 'donut-strawberry', sourceId: 26, name: 'Strawberry Mini Donuts',
    description: 'One box of 8 strawberry mini donuts', priceCentavos: 19800,
    categoryId: 'donuts', image: donutStrawberry, popularity: 36,
  },
];
