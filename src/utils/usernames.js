// Comprehensive username pool with crypto, gaming, and neutral handles
const cryptoHandles = [
  'pepe247', 'satoshiX', 'bitcoinBull', 'ethMiner', 'cryptoKing', 'hodlMaster', 'moonLambo',
  'degenApe', 'diamondHands', 'cryptoWhale', 'btcMaxi', 'altcoinHero', 'nftFliper',
  'web3Warrior', 'blockchainBro', 'coinCollector', 'tokenTitan', 'cryptoNinja',
  'satoshiSon', 'vitalikFan', 'defiDegen', 'yieldFarmer', 'liquidityLord', 'stakingKing',
  'cryptoPunk', 'boredApe', 'metaverseMike', 'daoMember', 'rugPuller', 'moonBoy',
  'bearMarket', 'bullRun', 'pumpAndDump', 'hodlGang', 'cryptoMoon', 'lamboSoon',
  'toTheMoon', 'whenLambo', 'cryptoGod', 'blockchainBeast', 'coinMaster', 'tokenKing',
  'cryptoLord', 'bitcoinBoss', 'ethGiant', 'altKing', 'defiLord', 'nftKing',
  'web3God', 'metaLord', 'cryptoSage', 'blockWizard', 'coinSorcerer', 'tokenMage'
];

const gamingHandles = [
  'plinkoPro', 'slotMaster', 'casinoKing', 'luckyStrike', 'jackpotJoe', 'bigWinner',
  'spinDoctor', 'reelKing', 'cardShark', 'pokerFace', 'blackjackBoss', 'roulettePro',
  'diceRoller', 'betMaster', 'gambleGod', 'luckLord', 'fortuneSeeker', 'winStreak',
  'megaWin', 'bonusHunter', 'freeSpins', 'wildSymbol', 'scatterWin', 'multiplierX',
  'progressiveWin', 'maxBet', 'allIn', 'doubleDown', 'hitMe', 'standPat',
  'royalFlush', 'fullHouse', 'straightFlush', 'fourOfKind', 'aceHigh', 'kingPair',
  'luckyNumber7', 'triple777', 'cherryBomb', 'goldenBell', 'diamondMine', 'treasureChest',
  'goldRush', 'silverStrike', 'bronzeMedal', 'platinumPlay', 'eliteGamer', 'proPlayer',
  'masterGamer', 'legendaryWin', 'epicVictory', 'ultimateWin', 'supremePlayer', 'alphaGamer'
];

const neutralHandles = [
  'marta_lee', 'john_smith', 'sarah_jones', 'mike_wilson', 'anna_brown', 'david_clark',
  'lisa_taylor', 'chris_white', 'emma_davis', 'ryan_miller', 'sofia_garcia', 'alex_johnson',
  'maya_rodriguez', 'tyler_anderson', 'zoe_martinez', 'noah_thompson', 'ava_lopez',
  'ethan_lee', 'mia_gonzalez', 'lucas_harris', 'chloe_clark', 'mason_lewis', 'grace_walker',
  'logan_hall', 'lily_allen', 'jacob_young', 'ella_king', 'owen_wright', 'aria_scott',
  'carter_green', 'luna_adams', 'wyatt_baker', 'nova_nelson', 'eli_hill', 'ivy_carter',
  'liam_mitchell', 'ruby_perez', 'nolan_roberts', 'sage_turner', 'kai_phillips',
  'aurora_campbell', 'felix_parker', 'iris_evans', 'oscar_edwards', 'violet_collins',
  'theo_stewart', 'rose_sanchez', 'leo_morris', 'hazel_rogers', 'max_reed',
  'willow_cook', 'sam_morgan', 'poppy_bailey', 'finn_cooper', 'daisy_richardson'
];

// Generate additional variations
const generateVariations = (baseHandles, suffixes) => {
  const variations = [];
  baseHandles.forEach(handle => {
    variations.push(handle);
    suffixes.forEach(suffix => {
      variations.push(`${handle}${suffix}`);
    });
  });
  return variations;
};

const cryptoSuffixes = ['2024', 'X', '100x', 'Moon', 'Gem', 'Pro', 'Elite', 'Max', 'Prime', 'Alpha'];
const gamingSuffixes = ['Winner', 'Lucky', 'Pro', 'Master', 'King', 'Lord', 'Boss', 'God', 'Legend', 'Epic'];
const neutralSuffixes = ['123', '2024', '_pro', '_win', '_lucky', '_max', '_elite', '_prime', '_alpha', '_beta'];

// Generate comprehensive username pool
const allCryptoHandles = generateVariations(cryptoHandles, cryptoSuffixes);
const allGamingHandles = generateVariations(gamingHandles, gamingSuffixes);
const allNeutralHandles = generateVariations(neutralHandles, neutralSuffixes);

// Combine all handles
export const USERNAME_POOL = [
  ...allCryptoHandles,
  ...allGamingHandles,
  ...allNeutralHandles
];

// Country pool with flags
export const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
  { name: 'Norway', flag: '🇳🇴', code: 'NO' },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
  { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE' }
];

// Avatar generation
export const generateAvatar = (username) => {
  // Use a deterministic avatar service based on username
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}&backgroundColor=transparent`;
};

// Username usage tracking
let usedUsernames = new Map(); // username -> timestamp

export const getRandomUsername = () => {
  const now = Date.now();
  const ninetyMinutes = 90 * 60 * 1000;
  
  // Clean up old entries
  for (const [username, timestamp] of usedUsernames.entries()) {
    if (now - timestamp > ninetyMinutes) {
      usedUsernames.delete(username);
    }
  }
  
  // Get available usernames
  const availableUsernames = USERNAME_POOL.filter(username => 
    !usedUsernames.has(username)
  );
  
  // If all usernames are used, reset the tracking
  if (availableUsernames.length === 0) {
    usedUsernames.clear();
    return USERNAME_POOL[Math.floor(Math.random() * USERNAME_POOL.length)];
  }
  
  // Select random available username
  const selectedUsername = availableUsernames[Math.floor(Math.random() * availableUsernames.length)];
  usedUsernames.set(selectedUsername, now);
  
  return selectedUsername;
};

export const getRandomCountry = () => {
  return COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
};

const EMAIL_PROVIDERS = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
  'icloud.com', 'proton.me', 'yandex.com', 'gmx.com', 'mail.com'
];

export const pickRandomProvider = () => {
  const i = Math.floor(Math.random() * EMAIL_PROVIDERS.length);
  return EMAIL_PROVIDERS[i];
}

export const toEmailLocalPart = (name) => {
  if (!name) return 'user';
  // remove accents, spaces -> dots, keep a-z0-9._+-
  const ascii = name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip diacritics
    .toLowerCase();
  const dots = ascii.trim().replace(/\s+/g, '.');      // spaces -> dots
  const cleaned = dots.replace(/[^a-z0-9._+-]/g, '');  // remove illegal chars
  return cleaned || 'user';
}

export const ensureEmail = (value) => {
  const str = String(value || '');
  if (str.includes('@')) return str;                   // already an email
  return `${toEmailLocalPart(str)}@${pickRandomProvider()}`;
}