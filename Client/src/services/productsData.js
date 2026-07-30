import kaleImg from '../assets/product_kale.png';
import tomatoesImg from '../assets/product_tomatoes.png';
import avocadoImg from '../assets/product_avocado.png';
import blueberriesImg from '../assets/product_blueberries.png';
import applesGreenImg from '../assets/product_apples_green.png';
import carrotsImg from '../assets/product_carrots.png';
import peppersImg from '../assets/product_peppers.png';
import broccoliImg from '../assets/product_broccoli.png';
import radishesImg from '../assets/product_radishes.png';
import bananasImg from '../assets/product_bananas.png';
import baguetteImg from '../assets/product_baguette.png';
import almondMilkImg from '../assets/product_almond_milk.png';

// New Organic Red Apples assets
import applesRedImg from '../assets/product_apples_red.png';
import applesRedSingleImg from '../assets/product_apples_red_single.png';
import applesRedSliceImg from '../assets/product_apples_red_slice.png';
import applesRedWashImg from '../assets/product_apples_red_wash.png';

export const products = [
  {
    id: 1,
    name: 'Premium Wheat Flour (Chakki Atta)',
    category: 'Atta & Flours',
    description: '5kg Pack',
    price: 8.99,
    unit: '($1.80 / kg)',
    image: baguetteImg,
    thumbnails: [baguetteImg, baguetteImg],
    badge: 'Best Seller',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Whole Wheat',
    source: 'Local Mills',
    freshness: 'Freshly Milled',
    weightOptions: ['5kg Pack', '10kg Sack', '2kg Trial Pack'],
    details: 'Our Premium Chakki Atta is made from select whole wheat grains sourced directly from local farmers. Ground in traditional stone mills, it retains natural nutrients, dietary fiber, and wheat germ, ensuring soft, fluffy rotis every time.',
    bullets: [
      '100% Whole Wheat Flour',
      'No added preservatives or maida',
      'Naturally rich in dietary fiber',
      'Traditional stone-ground process'
    ],
    nutrition: {
      kcal: '364',
      carbs: '72g',
      fiber: '11g',
      protein: '12g',
      serving: 'per 100g'
    }
  },
  {
    id: 2,
    name: 'Cold-Pressed Mustard Oil',
    category: 'Cooking Oils',
    description: '1L Bottle',
    price: 6.50,
    oldPrice: 7.99,
    unit: '($6.50 / L)',
    image: avocadoImg,
    thumbnails: [avocadoImg],
    badge: 'Sale',
    badgeClass: 'best-seller',
    organic: true,
    onSale: true,
    variety: 'Cold-Pressed Kachi Ghani',
    source: 'Organic Farms',
    freshness: 'Pure & Unrefined',
    weightOptions: ['1L Bottle', '5L Can', '500ml Bottle'],
    details: 'Pure and natural Cold-Pressed Mustard Oil (Kachi Ghani) extracted from premium mustard seeds. Unrefined and nutrient-dense, it possesses a strong aroma and high smoke point, ideal for traditional cooking and pickles.',
    bullets: [
      '100% Pure Cold-Pressed',
      'Rich in monounsaturated fatty acids',
      'Zero chemicals or artificial colors',
      'Excellent natural preservative'
    ],
    nutrition: {
      kcal: '884',
      carbs: '0g',
      fiber: '0g',
      protein: '0g',
      serving: 'per 100g'
    }
  },
  {
    id: 3,
    name: 'Premium Chocolate Chip Cookies',
    category: 'Biscuits & Snacks',
    description: '250g Box',
    price: 3.50,
    unit: '($1.40 / 100g)',
    image: blueberriesImg,
    thumbnails: [blueberriesImg],
    badge: 'Popular',
    badgeClass: 'organic',
    organic: false,
    onSale: false,
    variety: 'Double Chocolate',
    source: 'In-house Bakery',
    freshness: 'Freshly Packaged',
    weightOptions: ['250g Box', '500g Value Pack'],
    details: 'Indulge in our baked Premium Chocolate Chip Cookies loaded with rich dark chocolate chunks. Crispy on the outside, soft on the inside, they are the perfect pairing for tea, coffee, or hot milk.',
    bullets: [
      'Baked with real butter and dark chocolate chunks',
      'No artificial flavors or colors',
      'Perfect snack for all age groups'
    ],
    nutrition: {
      kcal: '480',
      carbs: '62g',
      fiber: '3g',
      protein: '5.5g',
      serving: 'per 100g'
    }
  },
  {
    id: 4,
    name: 'Premium Basmati Rice (Rozana)',
    category: 'Atta & Flours',
    description: '5kg Sack',
    price: 14.99,
    unit: '($3.00 / kg)',
    image: bananasImg,
    thumbnails: [bananasImg],
    badge: 'Premium',
    badgeClass: 'freshly-baked',
    organic: false,
    onSale: false,
    variety: 'Long Grain Basmati',
    source: 'Himalayan Foothills',
    freshness: 'Aged 1 Year',
    weightOptions: ['5kg Sack', '10kg Sack', '1kg Trial Pack'],
    details: 'Fragrant and aged long grain Basmati Rice perfect for daily use, biryani, or pulao. Aged for one year to achieve a non-sticky texture and fluffiness upon cooking.',
    bullets: [
      'Extra long slender grains',
      'Aromatic Himalayan Basmati',
      'Aged to perfection'
    ],
    nutrition: {
      kcal: '349',
      carbs: '78g',
      fiber: '1.3g',
      protein: '8.1g',
      serving: 'per 100g'
    }
  },
  {
    id: 5,
    name: 'Digestive Wheat Biscuits',
    category: 'Biscuits & Snacks',
    description: '400g Pack',
    price: 2.75,
    unit: '($0.69 / 100g)',
    image: applesGreenImg,
    thumbnails: [applesGreenImg],
    badge: 'Healthy Choice',
    badgeClass: 'organic',
    organic: false,
    onSale: false,
    variety: 'High Fiber Digestive',
    source: 'Raj Essentials',
    freshness: 'Freshly Baked',
    weightOptions: ['400g Pack', '200g Pack'],
    details: 'Rich in dietary fiber and whole wheat grains, our Digestive Wheat Biscuits offer a healthy tea-time snacking choice with low sugar content.',
    bullets: [
      'High in whole wheat fiber',
      'Supports healthy digestion',
      'Low sugar formula'
    ],
    nutrition: {
      kcal: '460',
      carbs: '65g',
      fiber: '7.2g',
      protein: '7g',
      serving: 'per 100g'
    }
  },
  {
    id: 6,
    name: 'Organic Toor Dal (Arhar)',
    category: 'Dals & Pulses',
    description: '1kg Pack',
    price: 3.99,
    unit: '($3.99 / kg)',
    image: carrotsImg,
    thumbnails: [carrotsImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Unpolished Toor Dal',
    source: 'Deccan Plateau Farms',
    freshness: 'Newly Harvested',
    weightOptions: ['1kg Pack', '2kg Pack', '500g Pouch'],
    details: 'Certified USDA Organic Unpolished Toor Dal, free from synthetic coloring and marble powder polishing. Ideal for making high-protein lentil soups and traditional dal tadka.',
    bullets: [
      'Unpolished and natural grains',
      'High in dietary plant proteins',
      'Free from chemical pest controls'
    ],
    nutrition: {
      kcal: '343',
      carbs: '58g',
      fiber: '15g',
      protein: '22g',
      serving: 'per 100g'
    }
  },
  {
    id: 7,
    name: 'Red Lentils (Masoor Dal)',
    category: 'Dals & Pulses',
    description: '1kg Pack',
    price: 3.25,
    unit: '($3.25 / kg)',
    image: peppersImg,
    thumbnails: [peppersImg],
    badge: 'Hot Seller',
    badgeClass: 'best-seller',
    organic: true,
    onSale: false,
    variety: 'Split Red Masoor',
    source: 'Northern Plains',
    freshness: 'Newly Harvested',
    weightOptions: ['1kg Pack', '2kg Pack'],
    details: 'High quality Split Red Lentils that cook rapidly without pre-soaking. High in iron, potassium, and essential amino acids.',
    bullets: [
      'No polishing agents',
      'Cooks in 15 minutes',
      'Rich in B vitamins and iron'
    ],
    nutrition: {
      kcal: '352',
      carbs: '60g',
      fiber: '10.8g',
      protein: '24g',
      serving: 'per 100g'
    }
  },
  {
    id: 8,
    name: 'Organic Green Moong Dal',
    category: 'Dals & Pulses',
    description: '1kg Pack',
    price: 4.10,
    unit: '($4.10 / kg)',
    image: broccoliImg,
    thumbnails: [broccoliImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Whole Moong Beans',
    source: 'Organic Cultivations',
    freshness: 'Fresh Harvest',
    weightOptions: ['1kg Pack', '500g Pack'],
    details: 'Whole green moong beans ideal for sprouting or boiling. High in dietary fiber, low in fat, and exceptionally digestible.',
    bullets: [
      'Certified Organic Moong',
      'High protein profile',
      'Great for sprouting'
    ],
    nutrition: {
      kcal: '347',
      carbs: '62g',
      fiber: '16g',
      protein: '24g',
      serving: 'per 100g'
    }
  },
  {
    id: 9,
    name: 'Lemon Fresh Dishwash Gel',
    category: 'Household Essentials',
    description: '750ml Bottle',
    price: 4.99,
    unit: '($6.65 / L)',
    image: applesRedImg,
    thumbnails: [applesRedSingleImg, applesRedSliceImg, applesRedWashImg],
    badge: 'New Formula',
    badgeClass: 'organic',
    organic: false,
    onSale: false,
    variety: 'Concentrated Dishwash Gel',
    source: 'Raj Essentials',
    freshness: 'Concentrated Liquid',
    weightOptions: ['750ml Bottle', '2L Refill pack'],
    details: 'Our concentrated Dishwash Gel cut grease from utensils with ease while remaining gentle on hands. Infused with natural lemon extracts for odor removal.',
    bullets: [
      'Cuts through tough grease',
      'Contains real lemon extract',
      'Gentle on skin formulation'
    ],
    nutrition: {
      kcal: 'N/A',
      carbs: 'N/A',
      fiber: 'N/A',
      protein: 'N/A',
      serving: 'Household Product'
    }
  },
  {
    id: 10,
    name: 'Liquid Laundry Detergent',
    category: 'Household Essentials',
    description: '2L Jug',
    price: 9.99,
    unit: '($5.00 / L)',
    image: almondMilkImg,
    thumbnails: [almondMilkImg],
    badge: 'Best Value',
    badgeClass: 'best-seller',
    organic: false,
    onSale: false,
    variety: 'Concentrated Laundry Liquid',
    source: 'Raj Essentials',
    freshness: 'Fresh Scent',
    weightOptions: ['2L Jug', '1L Pouch'],
    details: 'Advanced stain-removal laundry liquid formulated for front load, top load, and manual bucket washes. Softens fabrics while retaining fabric colors.',
    bullets: [
      'Advanced enzyme stain removal',
      'Color protection technology',
      'Refreshing floral fragrance'
    ],
    nutrition: {
      kcal: 'N/A',
      carbs: 'N/A',
      fiber: 'N/A',
      protein: 'N/A',
      serving: 'Household Product'
    }
  }
];
