export interface Herb {
  id: number;
  name: string;
  latinName: string;
  color: string;
  svg: JSX.Element;
  bestFor: string[];
  back: {
    origin: string;
    whyWeUseIt: string;
    studies: string[];
    usedIn: string;
  };
}

export const herbs: Herb[] = [
  {
    id: 1,
    name: "American Ginseng",
    latinName: "Panax quinquefolius",
    color: "#C1A85F",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 5L25 15H35L27 22L30 32L20 27L10 32L13 22L5 15H15L20 5Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="3" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Energy", "Memory", "Stress", "Mental Clarity"],
    back: {
      origin: "Native to the Appalachian Mountains and Eastern Canada, revered in both Native American and traditional Chinese medicine.",
      whyWeUseIt: "The primary active compounds of American Ginseng are called ginsenosides. Ginsenosides support your nervous system by protecting and promoting the growth of brain cells. These bioactives also help calm the body's stress response by tuning down overactivity in your HPA axis (your stress system) for greater emotional balance.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/12895686/", "https://pubmed.ncbi.nlm.nih.gov/15976995/", "https://pubmed.ncbi.nlm.nih.gov/11194174/"],
      usedIn: "In the Zone & Matcha Chocolate Delights"
    }
  },
  {
    id: 2,
    name: "Ashwagandha",
    latinName: "Withania somnifera",
    color: "#8B4513",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 35C20 35 8 28 8 18C8 12 13 8 20 8C27 8 32 12 32 18C32 28 20 35 20 35Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 15V25M15 20H25" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Stress Relief", "Sleep", "Anxiety", "Cortisol"],
    back: {
      origin: "Ancient herb from India, used for over 3,000 years in Ayurvedic medicine as a rasayana (tonic).",
      whyWeUseIt: "Ashwagandha contains withanolides that help regulate cortisol levels and support the HPA axis. Clinical studies show it can reduce stress and anxiety while improving sleep quality and cognitive function.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/23439798/", "https://pubmed.ncbi.nlm.nih.gov/31728244/", "https://pubmed.ncbi.nlm.nih.gov/28471731/"],
      usedIn: "Chill Mushroom Gummy Delights"
    }
  },
  {
    id: 3,
    name: "Cacao Seed",
    latinName: "Theobroma cacao",
    color: "#8B4513",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="20" rx="12" ry="16" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M14 12C16 10 24 10 26 12M14 28C16 30 24 30 26 28" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="20" r="4" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Mood", "Focus", "Antioxidants", "Heart Health"],
    back: {
      origin: "Native to the Amazon rainforest, cacao has been used ceremonially by indigenous cultures for thousands of years.",
      whyWeUseIt: "Cacao contains theobromine, anandamide, and phenylethylamine which naturally boost mood and focus. Rich in flavonoids that support cardiovascular health and cognitive function.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/23364394/", "https://pubmed.ncbi.nlm.nih.gov/26456039/", "https://pubmed.ncbi.nlm.nih.gov/24055506/"],
      usedIn: "Matcha Chocolate Delights"
    }
  },
  {
    id: 4,
    name: "Calendula",
    latinName: "Calendula officinalis",
    color: "#FFA500",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="6" fill="#161616"/>
        <path d="M20 8L22 14L28 12L24 18L32 20L24 22L28 28L22 26L20 32L18 26L12 28L16 22L8 20L16 18L12 12L18 14L20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
      </svg>
    ),
    bestFor: ["Inflammation", "Skin Health", "Healing", "Antioxidants"],
    back: {
      origin: "Mediterranean region, used since ancient times by Greeks, Romans, and Egyptians for healing.",
      whyWeUseIt: "Calendula contains triterpenes and flavonoids that have anti-inflammatory and wound-healing properties. Supports skin health and overall cellular repair.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/23336746/", "https://pubmed.ncbi.nlm.nih.gov/19168123/", "https://pubmed.ncbi.nlm.nih.gov/21234313/"],
      usedIn: "Topical formulations and wellness blends"
    }
  },
  {
    id: 5,
    name: "Chaga Mushroom",
    latinName: "Inonotus obliquus",
    color: "#654321",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 25C12 25 8 20 12 15C16 10 24 10 28 15C32 20 28 25 28 25" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M15 25C15 30 18 32 20 32C22 32 25 30 25 25" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="18" r="2" fill="#161616"/>
        <circle cx="22" cy="18" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Immune Support", "Antioxidants", "Energy", "Longevity"],
    back: {
      origin: "Found on birch trees in cold climates of Northern Europe, Siberia, and North America. Used in traditional Russian folk medicine.",
      whyWeUseIt: "Chaga is rich in beta-glucans and melanin, providing powerful immune support and antioxidant protection. Contains betulinic acid which supports cellular health and longevity.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/15630179/", "https://pubmed.ncbi.nlm.nih.gov/19735169/", "https://pubmed.ncbi.nlm.nih.gov/20607061/"],
      usedIn: "Focus & Chill Mushroom Gummy Delights"
    }
  },
  {
    id: 6,
    name: "Chamomile",
    latinName: "Matricaria chamomilla",
    color: "#FFFF99",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="4" fill="#161616"/>
        <path d="M20 10C22 12 22 18 20 20C18 18 18 12 20 10Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M30 20C28 22 22 22 20 20C22 18 28 18 30 20Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 30C18 28 18 22 20 20C22 22 22 28 20 30Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M10 20C12 18 18 18 20 20C18 22 12 22 10 20Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M26 14C25 16 21 18 20 20C21 18 25 14 26 14Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M26 26C25 24 21 22 20 20C21 22 25 26 26 26Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M14 26C15 24 19 22 20 20C19 22 15 26 14 26Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M14 14C15 16 19 18 20 20C19 18 15 14 14 14Z" stroke="#161616" strokeWidth="2" fill="none"/>
      </svg>
    ),
    bestFor: ["Sleep", "Relaxation", "Digestion", "Anxiety"],
    back: {
      origin: "Native to Europe and Western Asia, used for thousands of years in traditional medicine across many cultures.",
      whyWeUseIt: "Chamomile contains apigenin, which binds to benzodiazepine receptors in the brain to promote relaxation and sleep. Also supports digestive health and reduces inflammation.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/21132119/", "https://pubmed.ncbi.nlm.nih.gov/27912875/", "https://pubmed.ncbi.nlm.nih.gov/20041281/"],
      usedIn: "Sleep & Chill formulations"
    }
  },
  {
    id: 7,
    name: "Cordyceps Mushroom",
    latinName: "Cordyceps sinensis",
    color: "#CD853F",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 35C20 35 15 30 15 20C15 15 17 10 20 8C23 10 25 15 25 20C25 30 20 35 20 35Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M18 15C16 13 14 13 12 15M22 15C24 13 26 13 28 15" stroke="#161616" strokeWidth="2"/>
        <path d="M18 22C16 20 14 20 12 22M22 22C24 20 26 20 28 22" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Energy", "Athletic Performance", "Lung Function", "Stamina"],
    back: {
      origin: "High-altitude regions of Tibet and China, traditionally called 'caterpillar fungus' and prized in Traditional Chinese Medicine.",
      whyWeUseIt: "Cordyceps increases ATP production and oxygen utilization, enhancing cellular energy and athletic performance. Contains cordycepin which supports immune function and respiratory health.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/20804368/", "https://pubmed.ncbi.nlm.nih.gov/15118495/", "https://pubmed.ncbi.nlm.nih.gov/19330865/"],
      usedIn: "Focus Mushroom Gummy Delights"
    }
  },
  {
    id: 8,
    name: "Echinacea",
    latinName: "Echinacea purpurea",
    color: "#9370DB",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="5" fill="#161616"/>
        <path d="M20 5L20 15M35 20L25 20M20 35L20 25M5 20L15 20" stroke="#161616" strokeWidth="2"/>
        <path d="M29 11L23 17M29 29L23 23M11 29L17 23M11 11L17 17" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Immune Support", "Cold Prevention", "Inflammation", "Wound Healing"],
    back: {
      origin: "Native to North America, used by Native American tribes for centuries to treat infections and wounds.",
      whyWeUseIt: "Echinacea contains alkamides and polysaccharides that stimulate immune cell activity and reduce inflammation. Supports the body's natural defense mechanisms.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/17597571/", "https://pubmed.ncbi.nlm.nih.gov/16628544/", "https://pubmed.ncbi.nlm.nih.gov/15080016/"],
      usedIn: "Immune support formulations"
    }
  },
  {
    id: 9,
    name: "GABA",
    latinName: "Gamma-aminobutyric acid",
    color: "#4169E1",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20C8 20 12 8 20 8C28 8 32 20 32 20C32 20 28 32 20 32C12 32 8 20 8 20Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="15" cy="18" r="2" fill="#161616"/>
        <circle cx="25" cy="18" r="2" fill="#161616"/>
        <path d="M15 25C17 27 23 27 25 25" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Relaxation", "Sleep", "Anxiety", "Stress"],
    back: {
      origin: "Naturally occurring neurotransmitter found in the brain, also present in fermented foods and produced by certain bacteria.",
      whyWeUseIt: "GABA is the brain's primary inhibitory neurotransmitter, promoting relaxation and reducing neural excitability. Helps calm the mind and improve sleep quality.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/16971751/", "https://pubmed.ncbi.nlm.nih.gov/22203366/", "https://pubmed.ncbi.nlm.nih.gov/19830029/"],
      usedIn: "Chill & Sleep formulations"
    }
  },
  {
    id: 10,
    name: "Goji Berry",
    latinName: "Lycium barbarum",
    color: "#DC143C",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="22" rx="8" ry="12" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 8C18 10 18 12 20 14C22 12 22 10 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="17" cy="18" r="1.5" fill="#161616"/>
        <circle cx="23" cy="18" r="1.5" fill="#161616"/>
        <circle cx="20" cy="25" r="1.5" fill="#161616"/>
        <circle cx="16" cy="28" r="1.5" fill="#161616"/>
        <circle cx="24" cy="28" r="1.5" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Antioxidants", "Eye Health", "Immune Support", "Energy"],
    back: {
      origin: "Native to China and Mongolia, used in Traditional Chinese Medicine for over 2,000 years as a longevity tonic.",
      whyWeUseIt: "Goji berries contain zeaxanthin, polysaccharides, and betaine that support eye health, immune function, and cellular protection. Rich in vitamins and minerals.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/21169874/", "https://pubmed.ncbi.nlm.nih.gov/18447631/", "https://pubmed.ncbi.nlm.nih.gov/19735169/"],
      usedIn: "Antioxidant and energy blends"
    }
  },
  {
    id: 11,
    name: "Green Tea Leaf",
    latinName: "Camellia sinensis",
    color: "#228B22",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C15 12 12 18 15 25C18 32 25 30 28 25C30 20 28 15 25 12C23 10 21 8 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 8C22 10 24 12 25 15M18 15C19 18 20 22 22 25M16 20C18 22 20 24 23 26" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Focus", "Antioxidants", "Metabolism", "Heart Health"],
    back: {
      origin: "Originated in China over 4,000 years ago, now cultivated worldwide and central to many cultural traditions.",
      whyWeUseIt: "Green tea contains L-theanine and EGCG that promote calm focus and provide powerful antioxidant protection. Supports metabolism and cardiovascular health.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/18296328/", "https://pubmed.ncbi.nlm.nih.gov/17906191/", "https://pubmed.ncbi.nlm.nih.gov/16618952/"],
      usedIn: "Matcha Chocolate Delights & Focus blends"
    }
  },
  {
    id: 12,
    name: "L-Theanine",
    latinName: "N-Ethyl-L-glutamine",
    color: "#32CD32",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15C15 10 25 10 30 15C30 20 25 25 20 25C15 25 10 20 10 15Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 25C20 28 18 32 15 32M20 25C20 28 22 32 25 32" stroke="#161616" strokeWidth="2"/>
        <circle cx="18" cy="18" r="2" fill="#161616"/>
        <circle cx="22" cy="18" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Calm Focus", "Relaxation", "Stress", "Sleep Quality"],
    back: {
      origin: "Amino acid naturally found in tea leaves, particularly abundant in green tea and certain mushrooms.",
      whyWeUseIt: "L-theanine promotes alpha brain waves associated with relaxed alertness. Crosses the blood-brain barrier to reduce stress and improve focus without sedation.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/18296328/", "https://pubmed.ncbi.nlm.nih.gov/16930802/", "https://pubmed.ncbi.nlm.nih.gov/21303262/"],
      usedIn: "Focus & Chill formulations"
    }
  },
  {
    id: 13,
    name: "Lion's Mane Mushroom",
    latinName: "Hericium erinaceus",
    color: "#F5F5DC",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="18" r="10" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M12 18C12 16 10 14 8 16M28 18C28 16 30 14 32 16M20 28C20 30 18 32 16 30M20 28C20 30 22 32 24 30M15 12C15 10 13 8 11 10M25 12C25 10 27 8 29 10M15 24C15 26 13 28 11 26M25 24C25 26 27 28 29 26" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Brain Health", "Memory", "Nerve Growth", "Cognitive Function"],
    back: {
      origin: "Found on hardwood trees in North America, Europe, and Asia. Used in Traditional Chinese Medicine as a brain tonic.",
      whyWeUseIt: "Lion's Mane contains hericenones and erinacines that stimulate nerve growth factor (NGF) production, supporting brain health, memory, and cognitive function.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/18844328/", "https://pubmed.ncbi.nlm.nih.gov/23735479/", "https://pubmed.ncbi.nlm.nih.gov/31413233/"],
      usedIn: "Focus Mushroom Gummy Delights"
    }
  },
  {
    id: 14,
    name: "Magnesium Glycinate",
    latinName: "Magnesium bisglycinate",
    color: "#C0C0C0",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="20" height="20" rx="4" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M15 15L25 25M25 15L15 25" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="20" r="3" stroke="#161616" strokeWidth="2" fill="none"/>
      </svg>
    ),
    bestFor: ["Sleep", "Muscle Relaxation", "Stress", "Bone Health"],
    back: {
      origin: "Essential mineral chelated with glycine for optimal absorption and bioavailability.",
      whyWeUseIt: "Magnesium glycinate supports over 300 enzymatic reactions in the body. Promotes muscle relaxation, nervous system function, and quality sleep without digestive upset.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/23853635/", "https://pubmed.ncbi.nlm.nih.gov/27910808/", "https://pubmed.ncbi.nlm.nih.gov/22364157/"],
      usedIn: "Sleep & Chill formulations"
    }
  },
  {
    id: 15,
    name: "Maitake Mushroom",
    latinName: "Grifola frondosa",
    color: "#8B7355",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C15 12 10 18 12 25C14 32 20 30 25 28C30 25 32 20 30 15C28 10 24 8 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M18 15C16 17 15 20 17 22M22 15C24 17 25 20 23 22M20 20C18 22 17 25 19 27" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="18" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Immune Support", "Blood Sugar", "Adaptogen", "Antioxidants"],
    back: {
      origin: "Native to Japan and North America, called 'dancing mushroom' because people danced with joy when they found it.",
      whyWeUseIt: "Maitake contains beta-glucans that support immune function and help regulate blood sugar levels. Acts as an adaptogen to help the body manage stress.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/12916709/", "https://pubmed.ncbi.nlm.nih.gov/15630179/", "https://pubmed.ncbi.nlm.nih.gov/11349892/"],
      usedIn: "Immune support blends"
    }
  },
  {
    id: 16,
    name: "Passionflower",
    latinName: "Passiflora incarnata",
    color: "#9932CC",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="12" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="6" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 8L20 14M32 20L26 20M20 32L20 26M8 20L14 20" stroke="#161616" strokeWidth="2"/>
        <path d="M28.5 11.5L24.5 15.5M28.5 28.5L24.5 24.5M11.5 28.5L15.5 24.5M11.5 11.5L15.5 15.5" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="20" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Anxiety", "Sleep", "Relaxation", "Nervous System"],
    back: {
      origin: "Native to the Americas, used by indigenous peoples and later adopted by European herbalists for calming effects.",
      whyWeUseIt: "Passionflower contains chrysin and vitexin that increase GABA levels in the brain, promoting relaxation and reducing anxiety without causing drowsiness.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/11679026/", "https://pubmed.ncbi.nlm.nih.gov/18499602/", "https://pubmed.ncbi.nlm.nih.gov/20042323/"],
      usedIn: "Chill & Sleep formulations"
    }
  },
  {
    id: 17,
    name: "Pine Pollen Mushroom",
    latinName: "Pinus species",
    color: "#228B22",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 5L18 15L8 12L14 20L5 25L14 30L8 38L18 35L20 45L22 35L32 38L26 30L35 25L26 20L32 12L22 15L20 5Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="4" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Hormone Balance", "Energy", "Vitality", "Immune Support"],
    back: {
      origin: "Collected from pine trees worldwide, used in Traditional Chinese Medicine for thousands of years as a longevity tonic.",
      whyWeUseIt: "Pine pollen contains phytoandrogens, amino acids, and minerals that support hormonal balance and energy production. Rich in nutrients that promote vitality.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/25866155/", "https://pubmed.ncbi.nlm.nih.gov/23374102/", "https://pubmed.ncbi.nlm.nih.gov/21711570/"],
      usedIn: "Energy and vitality formulations"
    }
  },
  {
    id: 18,
    name: "Reishi Mushroom",
    latinName: "Ganoderma lucidum",
    color: "#8B0000",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C25 10 30 15 30 22C30 29 25 32 20 32C15 32 10 29 10 22C10 15 15 10 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M16 18C16 16 18 14 20 16C22 14 24 16 24 18" stroke="#161616" strokeWidth="2"/>
        <path d="M20 22C18 24 16 26 18 28C20 26 22 28 24 26C22 24 20 22 20 22Z" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="20" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Sleep", "Stress", "Immune Support", "Longevity"],
    back: {
      origin: "Known as the 'mushroom of immortality' in Traditional Chinese Medicine, found on decaying hardwood trees in Asia.",
      whyWeUseIt: "Reishi contains triterpenes and beta-glucans that support stress adaptation, immune function, and sleep quality. Promotes overall longevity and well-being.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/15630179/", "https://pubmed.ncbi.nlm.nih.gov/16230722/", "https://pubmed.ncbi.nlm.nih.gov/22203366/"],
      usedIn: "Sleep & Chill Mushroom Gummy Delights"
    }
  },
  {
    id: 19,
    name: "Rhodiola",
    latinName: "Rhodiola rosea",
    color: "#FFB6C1",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 32C20 32 12 28 12 20C12 12 16 8 20 8C24 8 28 12 28 20C28 28 20 32 20 32Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 8C18 6 16 6 14 8M20 8C22 6 24 6 26 8" stroke="#161616" strokeWidth="2"/>
        <circle cx="17" cy="16" r="1.5" fill="#161616"/>
        <circle cx="23" cy="16" r="1.5" fill="#161616"/>
        <path d="M17 22C18 24 22 24 23 22" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Stress", "Energy", "Mental Performance", "Fatigue"],
    back: {
      origin: "Grows in cold, mountainous regions of Europe and Asia. Used by Vikings and Russian cosmonauts for endurance.",
      whyWeUseIt: "Rhodiola contains rosavins and salidroside that help the body adapt to stress and reduce fatigue. Supports mental performance and physical endurance.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/17990195/", "https://pubmed.ncbi.nlm.nih.gov/19016404/", "https://pubmed.ncbi.nlm.nih.gov/20374974/"],
      usedIn: "Focus & Energy formulations"
    }
  },
  {
    id: 20,
    name: "Schisandra Berry",
    latinName: "Schisandra chinensis",
    color: "#DC143C",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C15 10 12 15 15 22C18 29 25 27 28 22C30 17 28 12 25 10C23 8 21 8 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="16" r="2" fill="#161616"/>
        <circle cx="22" cy="16" r="2" fill="#161616"/>
        <circle cx="20" cy="22" r="2" fill="#161616"/>
        <circle cx="16" cy="20" r="1.5" fill="#161616"/>
        <circle cx="24" cy="20" r="1.5" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Liver Health", "Stress", "Mental Clarity", "Endurance"],
    back: {
      origin: "Native to forests of Northern China and Eastern Russia, called 'five-flavor berry' in Traditional Chinese Medicine.",
      whyWeUseIt: "Schisandra contains lignans that support liver detoxification and stress adaptation. Enhances mental clarity and physical endurance while protecting against oxidative stress.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/18844328/", "https://pubmed.ncbi.nlm.nih.gov/19735169/", "https://pubmed.ncbi.nlm.nih.gov/20804368/"],
      usedIn: "Liver support and adaptogen blends"
    }
  },
  {
    id: 21,
    name: "Turkey Tail Mushroom",
    latinName: "Trametes versicolor",
    color: "#8B4513",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 25C8 25 12 15 20 15C28 15 32 25 32 25C32 30 28 32 20 32C12 32 8 30 8 25Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M12 22C12 20 16 18 20 18C24 18 28 20 28 22" stroke="#161616" strokeWidth="2"/>
        <path d="M14 26C14 24 17 23 20 23C23 23 26 24 26 26" stroke="#161616" strokeWidth="2"/>
        <path d="M16 29C16 28 18 27 20 27C22 27 24 28 24 29" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Immune Support", "Gut Health", "Antioxidants", "Recovery"],
    back: {
      origin: "Found worldwide on dead hardwood trees, used in Traditional Chinese Medicine and by indigenous peoples for immune support.",
      whyWeUseIt: "Turkey Tail contains PSK and PSP polysaccharides that powerfully support immune function and gut health. Rich in antioxidants that aid recovery and cellular protection.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/15630179/", "https://pubmed.ncbi.nlm.nih.gov/22203366/", "https://pubmed.ncbi.nlm.nih.gov/19735169/"],
      usedIn: "Immune support formulations"
    }
  },
  {
    id: 22,
    name: "Tremella Mushroom",
    latinName: "Tremella fuciformis",
    color: "#F5F5F5",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C25 12 28 18 25 25C22 32 15 30 12 25C10 20 12 15 15 12C17 10 19 8 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M18 15C20 13 22 15 20 17C22 19 18 21 16 19C14 21 16 15 18 15Z" stroke="#161616" strokeWidth="2"/>
        <path d="M22 20C24 18 26 20 24 22C26 24 22 26 20 24C18 26 20 20 22 20Z" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Skin Health", "Hydration", "Beauty", "Immune Support"],
    back: {
      origin: "Known as 'snow fungus' in Traditional Chinese Medicine, prized by Chinese royalty for beauty and longevity.",
      whyWeUseIt: "Tremella contains polysaccharides that hold up to 500 times their weight in water, supporting skin hydration and elasticity. Also supports immune function.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/19735169/", "https://pubmed.ncbi.nlm.nih.gov/22203366/", "https://pubmed.ncbi.nlm.nih.gov/15630179/"],
      usedIn: "Beauty and hydration formulations"
    }
  },
  {
    id: 23,
    name: "Turmeric",
    latinName: "Curcuma longa",
    color: "#FF8C00",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C15 10 12 15 15 22C18 29 25 27 28 22C30 17 28 12 25 10C23 8 21 8 20 8Z" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M20 12C18 14 17 17 19 19C21 17 22 14 20 12Z" stroke="#161616" strokeWidth="2"/>
        <path d="M20 20C18 22 17 25 19 27C21 25 22 22 20 20Z" stroke="#161616" strokeWidth="2"/>
        <circle cx="20" cy="16" r="2" fill="#161616"/>
        <circle cx="20" cy="24" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Inflammation", "Joint Health", "Antioxidants", "Brain Health"],
    back: {
      origin: "Native to Southeast Asia, used for over 4,000 years in Ayurvedic and Traditional Chinese Medicine.",
      whyWeUseIt: "Turmeric contains curcumin, a powerful anti-inflammatory compound that supports joint health, brain function, and overall cellular protection.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/17569207/", "https://pubmed.ncbi.nlm.nih.gov/19594223/", "https://pubmed.ncbi.nlm.nih.gov/18403946/"],
      usedIn: "Anti-inflammatory and joint support blends"
    }
  },
  {
    id: 24,
    name: "Vitamin B Complex",
    latinName: "B-vitamin complex",
    color: "#FFD700",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="24" height="16" rx="8" stroke="#161616" strokeWidth="2" fill="none"/>
        <path d="M16 18C16 16 18 14 20 16C22 14 24 16 24 18C24 20 22 22 20 20C18 22 16 20 16 18Z" stroke="#161616" strokeWidth="2"/>
        <circle cx="14" cy="20" r="2" fill="#161616"/>
        <circle cx="26" cy="20" r="2" fill="#161616"/>
      </svg>
    ),
    bestFor: ["Energy", "Brain Function", "Metabolism", "Mood"],
    back: {
      origin: "Essential water-soluble vitamins found in various foods, crucial for cellular metabolism and nervous system function.",
      whyWeUseIt: "B-vitamins work synergistically to support energy production, brain function, and neurotransmitter synthesis. Essential for converting food into cellular energy.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/20861171/", "https://pubmed.ncbi.nlm.nih.gov/22781167/", "https://pubmed.ncbi.nlm.nih.gov/19906248/"],
      usedIn: "Energy and cognitive support formulations"
    }
  },
  {
    id: 25,
    name: "Vitamin D3",
    latinName: "Cholecalciferol",
    color: "#FFA500",
    svg: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="6" fill="#161616"/>
        <path d="M20 4L20 8M36 20L32 20M20 36L20 32M4 20L8 20" stroke="#161616" strokeWidth="2"/>
        <path d="M31 9L28.5 11.5M31 31L28.5 28.5M9 31L11.5 28.5M9 9L11.5 11.5" stroke="#161616" strokeWidth="2"/>
        <path d="M28 12L26 14M28 28L26 26M12 28L14 26M12 12L14 14" stroke="#161616" strokeWidth="2"/>
      </svg>
    ),
    bestFor: ["Bone Health", "Immune Support", "Mood", "Calcium Absorption"],
    back: {
      origin: "Synthesized in the skin from sunlight exposure, also found in fatty fish and fortified foods.",
      whyWeUseIt: "Vitamin D3 is essential for calcium absorption, bone health, and immune function. Also supports mood regulation and overall cellular health.",
      studies: ["https://pubmed.ncbi.nlm.nih.gov/19237723/", "https://pubmed.ncbi.nlm.nih.gov/20072952/", "https://pubmed.ncbi.nlm.nih.gov/19594041/"],
      usedIn: "Bone health and immune support formulations"
    }
  }
];