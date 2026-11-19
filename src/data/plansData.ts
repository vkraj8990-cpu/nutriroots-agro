import { Plan, AgroProject, ReferralMember } from '../types';

export const PLANS_DATA: Plan[] = [
  {
    id: "00",
    name: "NutriRoots Starter Plan",
    investment: 500,
    daily: 22,
    cycle: 150,
    total: 3300,
    category: 'starter',
    cropType: 'Organic Vegetables & Microgreens',
    harvestCycle: 'Daily Batch',
    roiMultiplier: '6.6x'
  },
  {
    id: "01",
    name: "NutriRoots Plan A",
    investment: 1500,
    daily: 50,
    cycle: 150,
    total: 7500,
    category: 'starter',
    cropType: 'Hydroponic Leafy Greens & Exotic Salad',
    harvestCycle: 'Daily Rotation',
    roiMultiplier: '5.0x'
  },
  {
    id: "02",
    name: "NutriRoots Plan B",
    investment: 2500,
    daily: 80,
    cycle: 150,
    total: 12000,
    category: 'starter',
    cropType: 'Precision Greenhouse Bell Peppers',
    harvestCycle: 'Continuous Yield',
    roiMultiplier: '4.8x'
  },
  {
    id: "03",
    name: "NutriRoots Plan C",
    investment: 3500,
    daily: 120,
    cycle: 150,
    total: 18000,
    category: 'starter',
    cropType: 'Aromatic Herbs & Stevia Plantation',
    harvestCycle: 'Continuous Yield',
    roiMultiplier: '5.1x'
  },
  {
    id: "04",
    name: "NutriRoots Plan D",
    investment: 4500,
    daily: 160,
    cycle: 150,
    total: 24000,
    category: 'standard',
    cropType: 'High-Value Ashwagandha & Tulsi Herbs',
    harvestCycle: 'Daily Extraction',
    roiMultiplier: '5.3x'
  },
  {
    id: "05",
    name: "NutriRoots Plan E",
    investment: 6500,
    daily: 240,
    cycle: 150,
    total: 36000,
    category: 'standard',
    cropType: 'Solar Powered Dragon Fruit & Kiwi Orchards',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.5x'
  },
  {
    id: "06",
    name: "NutriRoots Plan F",
    investment: 8900,
    daily: 320,
    cycle: 150,
    total: 48000,
    category: 'standard',
    cropType: 'Polyhouse Seedless Cucumber & Cherry Tomato',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.4x'
  },
  {
    id: "07",
    name: "NutriRoots Plan G",
    investment: 14500,
    daily: 520,
    cycle: 150,
    total: 78000,
    category: 'standard',
    cropType: 'Sandalwood & Medicinal Agro-Forestry',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.4x'
  },
  {
    id: "08",
    name: "NutriRoots Plan H",
    investment: 24500,
    daily: 880,
    cycle: 150,
    total: 132000,
    category: 'advanced',
    cropType: 'Export Grade Mushroom & Spirulina Lab',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.4x'
  },
  {
    id: "09",
    name: "NutriRoots Plan I",
    investment: 30500,
    daily: 1100,
    cycle: 150,
    total: 165000,
    category: 'advanced',
    cropType: 'Smart Drip Climate-Controlled Estate',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.4x'
  },
  {
    id: "10",
    name: "NutriRoots Plan J",
    investment: 45500,
    daily: 1600,
    cycle: 150,
    total: 240000,
    category: 'premium',
    cropType: 'Commercial Teak Timber & Fruit Agro Compound',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.3x'
  },
  {
    id: "11",
    name: "NutriRoots Plan K",
    investment: 50000,
    daily: 1800,
    cycle: 150,
    total: 270000,
    category: 'premium',
    cropType: 'NutriRoots Mega Agricultural Hub & Cold Chain',
    harvestCycle: 'Daily Agro Payout',
    roiMultiplier: '5.4x'
  }
];

export const AGRO_PROJECTS: AgroProject[] = [
  {
    id: 'proj_smart_farm',
    title: 'Solar Micro-Irrigation & Precision Farmlands',
    titleHi: 'सोलर माइक्रो-सिंचाई एवं स्मार्ट कृषि फार्म',
    subtitle: 'Zero water wastage smart drip farming spanning 450+ acres',
    subtitleHi: '450+ एकड़ में शून्य जल अपव्यय स्मार्ट ड्रिप खेती',
    image: '/src/assets/images/hero_agro_farm_1794502966213.jpg',
    location: 'Madhya Pradesh & Gujarat Corridor',
    hectares: '185 Hectares',
    yieldCycle: 'Year-round automated',
    technology: 'IoT Soil Sensors & Solar Automation',
    description: 'Automated solar drip irrigation network connected to moisture probes. Maximizes crop harvest yield by 3.4x while lowering water and electricity overheads to near zero.',
    descriptionHi: 'नमी सेंसर से जुड़ा स्वचालित सौर ड्रिप सिंचाई नेटवर्क। पानी और बिजली के खर्च को घटाते हुए फसल की पैदावार में 3.4 गुना तक वृद्धि करता है।',
    returnsContribution: 'Generates base stability for Starter & Standard Growth Plans.'
  },
  {
    id: 'proj_hydroponics',
    title: 'Commercial Polyhouse Hydroponics',
    titleHi: 'आधुनिक पॉलीहाउस हाइड्रोपोनिक्स फार्मिंग',
    subtitle: 'High-density pesticide-free leafy greens and exotic bell peppers',
    subtitleHi: 'कीटनाशक-मुक्त हरी सब्जियां व विदेशी शिमला मिर्च',
    image: '/src/assets/images/project_greenhouse_1794502967027.jpg',
    location: 'Nashik & Pune Agro Belt',
    hectares: '65 Hectares (Enclosed)',
    yieldCycle: 'Daily continuous harvests',
    technology: 'NFT Hydroponic Vertical Stacks',
    description: 'Enclosed climate-controlled greenhouses delivering pristine fresh produce directly to premium urban grocery chains and 5-star hospitality vendors at guaranteed off-take contracts.',
    descriptionHi: 'नियंत्रित तापमान वाले पॉलीहाउस, जहां से ताजा जैविक उपज सीधे बड़े शहरों के रिटेल स्टोर और होटलों को निश्चित मूल्य अनुबंध पर बेची जाती है।',
    returnsContribution: 'Powers the daily cashflow distribution for Plan A to Plan F.'
  },
  {
    id: 'proj_medicinal',
    title: 'Ayurvedic Medicinal & Herbal Cultivation',
    titleHi: 'आयुर्वेदिक एवं औषधीय पादप संवर्धन',
    subtitle: 'Certified organic Ashwagandha, Shatavari, Tulsi & Stevia',
    subtitleHi: 'प्रमाणित जैविक अश्वगंधा, शतावरी, तुलसी एवं स्टीविया',
    image: '/src/assets/images/project_medicinal_crops_1794502967449.jpg',
    location: 'Udaipur & Malwa Foothills',
    hectares: '120 Hectares',
    yieldCycle: 'Semi-annual harvest with daily essential oil extraction',
    technology: 'Organic Steam Distillation Units',
    description: 'Cultivating pharmaceutical-grade herbal botanicals with direct buyback agreements with leading Ayurvedic and nutraceutical companies in India and Europe.',
    descriptionHi: 'फार्मास्युटिकल-ग्रेड औषधीय जड़ी-बूटियों की खेती, जिसकी भारत और यूरोप की अग्रणी आयुर्वेदिक कंपनियों के साथ सीधे बायबैक अनुबंध हैं।',
    returnsContribution: 'Supplies high-margin profit margins backing Plans G through I.'
  },
  {
    id: 'proj_agroforestry',
    title: 'Sustainable Teak & Fruit Agro-Forestry Plantation',
    titleHi: 'सस्टेनेबल टीक (सागवान) व बागवानी एग्रो-फॉरेस्ट्री',
    subtitle: 'Intercropped teak, sandalwood, and dragon fruit with long-term capital backing',
    subtitleHi: 'सागवान, चंदन और ड्रैगन फ्रूट की बहु-स्तरीय वृक्षारोपण योजना',
    image: '/src/assets/images/project_agroforestry_1794502966893.jpg',
    location: 'Karnataka & Maharashtra Border',
    hectares: '240 Hectares',
    yieldCycle: 'Multi-tiered seasonal fruits + carbon credit yields',
    technology: 'GPS Canopy Monitoring & Biomass Tracking',
    description: 'High-value timber inter-planted with short-cycle seasonal fruits. The plantation is registered for verified carbon offset credits, creating dual institutional revenue streams.',
    descriptionHi: 'उच्च मूल्य वाली इमारती लकड़ी के साथ अल्पकालिक फलदार पौधे। यह प्लांटेशन कार्बन क्रेडिट प्रोग्राम से भी पंजीकृत है, जिससे दोहरा लाभ प्राप्त होता है।',
    returnsContribution: 'Underwrites the high-yield stability for Plan J & Plan K.'
  }
];

export const INITIAL_REFERRAL_MEMBERS: ReferralMember[] = [];
