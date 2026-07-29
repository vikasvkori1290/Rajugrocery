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
    name: 'Vine-Ripened Cherry Tomatoes',
    category: 'Fruits & Veg',
    description: '500g Cluster',
    price: 4.99,
    unit: '($2.26 / lb)',
    image: tomatoesImg,
    thumbnails: [tomatoesImg, tomatoesImg, tomatoesImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Cherry Variety',
    source: 'Locally Sourced',
    freshness: 'Farm Fresh',
    weightOptions: ['500g Pack', '1kg Box', 'By the piece'],
    details: 'Our Vine-Ripened Cherry Tomatoes are grown in nutrient-rich soils under optimal sun conditions. Characterized by their crisp skin and sweet, juicy interior, they are perfect for snacking, salads, or pasta dishes.',
    bullets: [
      'Certified USDA Organic',
      'Non-GMO Project Verified',
      'No synthetic pesticides or fertilizers',
      'Directly sourced from family-owned farms'
    ],
    nutrition: {
      kcal: '18',
      carbs: '3.9g',
      fiber: '1.2g',
      protein: '0.9g',
      serving: 'per 100g'
    }
  },
  {
    id: 2,
    name: 'Hass Avocado',
    category: 'Fruits & Veg',
    description: 'Each',
    price: 1.50,
    oldPrice: 2.20,
    unit: '($1.50 / piece)',
    image: avocadoImg,
    thumbnails: [avocadoImg, avocadoImg],
    badge: 'Sale',
    badgeClass: 'best-seller',
    organic: false,
    onSale: true,
    variety: 'Hass Variety',
    source: 'Imported',
    freshness: 'Ripe & Ready',
    weightOptions: ['1 piece', '3 pack', '5 pack bag'],
    details: 'Rich, creamy Hass Avocados, perfect for making guacamole, spreading on toast, or adding to your salads. High in healthy monounsaturated fats.',
    bullets: [
      'Excellent source of healthy fats',
      'Rich in potassium and fiber',
      'Naturally gluten-free and vegan'
    ],
    nutrition: {
      kcal: '160',
      carbs: '8.5g',
      fiber: '6.7g',
      protein: '2g',
      serving: 'per 100g'
    }
  },
  {
    id: 3,
    name: 'Blueberries',
    category: 'Fruits & Veg',
    description: '125g Pack',
    price: 3.50,
    unit: '($12.70 / lb)',
    image: blueberriesImg,
    thumbnails: [blueberriesImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Southern Highbush',
    source: 'Locally Sourced',
    freshness: 'Hand-picked',
    weightOptions: ['125g pack', '250g pack', '500g value tub'],
    details: 'Plump, sweet, and bursting with antioxidants. Enjoy them fresh as a healthy snack, or add them to pancakes, oatmeal, and smoothies.',
    bullets: [
      'High in antioxidants and vitamin C',
      'Sweet and tangy flavor profile',
      'Carefully selected and packed'
    ],
    nutrition: {
      kcal: '57',
      carbs: '14g',
      fiber: '2.4g',
      protein: '0.7g',
      serving: 'per 100g'
    }
  },
  {
    id: 4,
    name: 'Curly Kale',
    category: 'Fruits & Veg',
    description: '200g Bag',
    price: 2.75,
    unit: '($6.24 / lb)',
    image: kaleImg,
    thumbnails: [kaleImg],
    badge: null,
    badgeClass: '',
    organic: true,
    onSale: false,
    variety: 'Curly Dwarf',
    source: 'Locally Sourced',
    freshness: 'Crisp & Fresh',
    weightOptions: ['200g Bag', '500g Bunch'],
    details: 'Nutrient-dense curly kale leaves, pre-washed and ready to cook. Excellent for making kale chips, sautéing, or adding to green smoothies.',
    bullets: [
      'Rich in Vitamin K, A, and C',
      'Pre-washed for your convenience',
      '100% locally grown and harvested'
    ],
    nutrition: {
      kcal: '49',
      carbs: '9g',
      fiber: '3.6g',
      protein: '4.3g',
      serving: 'per 100g'
    }
  },
  {
    id: 5,
    name: 'Green Apples',
    category: 'Fruits & Veg',
    description: 'Pack of 4',
    price: 3.99,
    unit: '($1.00 / piece)',
    image: applesGreenImg,
    thumbnails: [applesGreenImg],
    badge: null,
    badgeClass: '',
    organic: false,
    onSale: false,
    variety: 'Granny Smith',
    source: 'Locally Sourced',
    freshness: 'Crunchy',
    weightOptions: ['4 Pack', '8 Pack Bag', 'By the piece'],
    details: 'Tart, crisp Granny Smith green apples. Perfect for a refreshing snack, baking in pies, or slicing into cheese boards.',
    bullets: [
      'Tangy and refreshing taste',
      'High in dietary fiber',
      'Great for baking or fresh snacking'
    ],
    nutrition: {
      kcal: '52',
      carbs: '14g',
      fiber: '2.4g',
      protein: '0.3g',
      serving: 'per 100g'
    }
  },
  {
    id: 6,
    name: 'Carrots with Tops',
    category: 'Fruits & Veg',
    description: 'Bunch',
    price: 2.50,
    unit: '($2.50 / bunch)',
    image: carrotsImg,
    thumbnails: [carrotsImg],
    badge: null,
    badgeClass: '',
    organic: true,
    onSale: false,
    variety: 'Nantes Variety',
    source: 'Locally Sourced',
    freshness: 'Freshly Harvested',
    weightOptions: ['1 Bunch', '2 Bunches'],
    details: 'Sweet, tender carrots complete with their vibrant green tops. Ideal for roasting, dipping, or juicing.',
    bullets: [
      'Excellent source of beta-carotene',
      'Vibrant greens can be used for pesto',
      'Sweet and earthy flavor'
    ],
    nutrition: {
      kcal: '41',
      carbs: '9.6g',
      fiber: '2.8g',
      protein: '0.9g',
      serving: 'per 100g'
    }
  },
  {
    id: 7,
    name: 'Mixed Bell Peppers',
    category: 'Fruits & Veg',
    description: '2 Pack',
    price: 3.20,
    unit: '($1.60 / piece)',
    image: peppersImg,
    thumbnails: [peppersImg],
    badge: null,
    badgeClass: '',
    organic: false,
    onSale: false,
    variety: 'Bell Pepper',
    source: 'Locally Sourced',
    freshness: 'Crisp',
    weightOptions: ['2 Pack', '4 Pack Value'],
    details: 'Vibrant and sweet red and yellow bell peppers. Perfect for fajitas, stir-fries, stuffing, or raw snacking with dip.',
    bullets: [
      'High in Vitamin C',
      'Sweet flavor with zero heat',
      'Perfect addition to colorful stir-fries'
    ],
    nutrition: {
      kcal: '20',
      carbs: '4.6g',
      fiber: '1.7g',
      protein: '0.9g',
      serving: 'per 100g'
    }
  },
  {
    id: 8,
    name: 'Organic Broccoli',
    category: 'Fruits & Veg',
    description: 'Each',
    price: 2.10,
    unit: '($2.10 / crown)',
    image: broccoliImg,
    thumbnails: [broccoliImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Calabrese',
    source: 'Locally Sourced',
    freshness: 'Farm Fresh',
    weightOptions: ['1 Crown', '2 Crowns Pack'],
    details: 'Nutrient-rich organic broccoli crowns. Excellent steamed, roasted, or raw in salads.',
    bullets: [
      'Certified organic product',
      'Rich in vitamins K and C',
      'Great for side dishes or snacking'
    ],
    nutrition: {
      kcal: '34',
      carbs: '6.6g',
      fiber: '2.6g',
      protein: '2.8g',
      serving: 'per 100g'
    }
  },
  {
    id: 9,
    name: 'Fresh Radishes',
    category: 'Fruits & Veg',
    description: 'Bunch',
    price: 1.80,
    unit: '($1.80 / bunch)',
    image: radishesImg,
    thumbnails: [radishesImg],
    badge: null,
    badgeClass: '',
    organic: false,
    onSale: false,
    variety: 'Cherry Belle',
    source: 'Locally Sourced',
    freshness: 'Crisp & Peppery',
    weightOptions: ['1 Bunch', '2 Bunches'],
    details: 'Crisp radishes with a bright red skin and white, peppery flesh. Adds a wonderful crunch to salads and tacos.',
    bullets: [
      'Zesty and peppery crunch',
      'Low in calories, high in hydration',
      'Locally harvested'
    ],
    nutrition: {
      kcal: '16',
      carbs: '3.4g',
      fiber: '1.6g',
      protein: '0.7g',
      serving: 'per 100g'
    }
  },
  {
    id: 10,
    name: 'Premium Bananas',
    category: 'Fruits & Veg',
    description: 'Bunch (approx. 5-6)',
    price: 2.25,
    unit: '($0.45 / banana)',
    image: bananasImg,
    thumbnails: [bananasImg],
    badge: null,
    badgeClass: '',
    organic: false,
    onSale: false,
    variety: 'Cavendish',
    source: 'Imported',
    freshness: 'Sweet & Creamy',
    weightOptions: ['Bunch of 5-6', 'Single Banana'],
    details: 'Fresh premium Cavendish bananas. An easy, nutritious portable snack or base for your breakfast bowls and smoothies.',
    bullets: [
      'High in potassium and energy',
      'Sweet, smooth texture',
      'Great for baking banana bread'
    ],
    nutrition: {
      kcal: '89',
      carbs: '22.8g',
      fiber: '2.6g',
      protein: '1.1g',
      serving: 'per 100g'
    }
  },
  {
    id: 11,
    name: 'Organic Red Apples',
    category: 'Fruits & Veg',
    description: '4 lb Bag',
    price: 4.99,
    unit: '($1.25 / lb)',
    image: applesRedImg,
    thumbnails: [applesRedSingleImg, applesRedSliceImg, applesRedWashImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Gala Variety',
    source: 'Locally Sourced',
    freshness: 'Farm Fresh',
    weightOptions: ['4 lb Bag', '2 lb Bag', 'By the piece'],
    details: 'Our Organic Gala Apples are grown in the nutrient-rich soils of the Pacific Northwest. Characterized by their crisp texture and mild, sweet flavor, they are perfect for snacking, salads, or school lunches.',
    bullets: [
      'Certified USDA Organic',
      'Non-GMO Project Verified',
      'No synthetic pesticides or fertilizers',
      'Directly sourced from family-owned orchards'
    ],
    nutrition: {
      kcal: '52',
      carbs: '14g',
      fiber: '2.4g',
      protein: '0.2g',
      serving: 'per 100g'
    }
  },
  {
    id: 12,
    name: 'Organic Lacinato Kale',
    category: 'Fruits & Veg',
    description: 'Fresh bunch, locally grown',
    price: 3.99,
    unit: '($3.99 / bunch)',
    image: kaleImg,
    thumbnails: [kaleImg],
    badge: 'Organic',
    badgeClass: 'organic',
    organic: true,
    onSale: false,
    variety: 'Lacinato (Dinosaur)',
    source: 'Locally Sourced',
    freshness: 'Freshly Picked',
    weightOptions: ['1 Bunch', '2 Bunches'],
    details: 'Deep green, flat leaves of Lacinato Kale, also known as dinosaur kale. Perfect for hearty kale salads, soups, and healthy juices.',
    bullets: [
      'Certified USDA Organic',
      'Deep, earthy green flavor',
      'High in iron and calcium'
    ],
    nutrition: {
      kcal: '49',
      carbs: '9g',
      fiber: '3.6g',
      protein: '4.3g',
      serving: 'per 100g'
    }
  },
  {
    id: 13,
    name: 'Artisan Sourdough Baguette',
    category: 'Bakery',
    description: 'Baked daily, 100% natural',
    price: 2.25,
    unit: '($2.25 / piece)',
    image: baguetteImg,
    thumbnails: [baguetteImg],
    badge: 'Freshly Baked',
    badgeClass: 'freshly-baked',
    organic: false,
    onSale: false,
    variety: 'Sourdough Baguette',
    source: 'In-store Bakery',
    freshness: 'Baked Daily',
    weightOptions: ['1 Baguette', '2 Baguettes Pack'],
    details: 'Artisan Sourdough Baguette baked fresh daily from a wild yeast sourdough starter. Crispy crust, open crumb.',
    bullets: [
      'No commercial yeast used',
      'Baked fresh daily',
      'Perfect for sandwiches or table bread'
    ],
    nutrition: {
      kcal: '289',
      carbs: '56g',
      fiber: '2.4g',
      protein: '9g',
      serving: 'per 100g'
    }
  },
  {
    id: 14,
    name: 'Unsweetened Almond Milk',
    category: 'Dairy & Eggs',
    description: '1L, plant-based goodness',
    price: 5.49,
    unit: '($5.49 / carton)',
    image: almondMilkImg,
    thumbnails: [almondMilkImg],
    badge: null,
    badgeClass: '',
    organic: false,
    onSale: false,
    variety: 'Almond Milk',
    source: 'California Almonds',
    freshness: 'Shelf-stable until opened',
    weightOptions: ['1L Carton', '3 Pack'],
    details: 'Our Unsweetened Almond Milk is a rich, creamy plant-based alternative. Excellent in coffee, cereals, or directly in glass.',
    bullets: [
      'Dairy & lactose free',
      'No added sugar',
      'Rich source of calcium'
    ],
    nutrition: {
      kcal: '15',
      carbs: '0.3g',
      fiber: '0.2g',
      protein: '0.5g',
      serving: 'per 100g'
    }
  }
];
