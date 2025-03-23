// 游戏标签定义
export const gameTags = [
  { id: 'all', name: 'All Games' },
  { id: 'classic', name: 'Classic Survivors' },
  { id: 'dungeon', name: 'Dungeon' },
  { id: 'apocalypse', name: 'Apocalypse' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'new', name: 'New Games' },
  { id: 'popular', name: 'Popular' },
  { id: 'strategy', name: 'Strategy' } // 新添加的策略标签
];

// 游戏数据
export const games = [
  {
    id: 'monster-survivors-classic',
    title: 'Monster Survivors: Classic',
    description: 'The original hit that started it all. Survive waves of monsters, collect power-ups, and become stronger as you defeat more enemies.',
    longDescription: `Monster Survivors: Classic is the game that started the entire genre. In this thrilling roguelike experience, you'll face endless waves of monsters while collecting power-ups to enhance your abilities.

Features:
- 10 unique characters with different abilities
- Over 50 weapons and items to collect
- Procedurally generated levels for endless replayability
- Increasing difficulty as you progress
- Special boss monsters that appear every 5 minutes
- Various environments to battle in

Can you survive longer than your friends? Play now and find out!`,
    tags: ['classic', 'popular'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/TrainMinerTeaser.jpg', // 更新的图片URL
    gameUrl: ' https://play.famobi.com/train-miner', // 更新的游戏链接指向一个类似的实际游戏
    featured: true,
    controls: 'Use WASD or arrow keys to move. Mouse to aim and attack. Space to dodge roll.'
  },
  {
    id: 'monster-survivors-dungeon',
    title: 'Monster Survivors: Dungeon',
    description: 'Explore dangerous dungeons filled with monsters and treasures.',
    longDescription: `Monster Survivors: Dungeon takes the classic survival gameplay into the depths of mysterious dungeons. Navigate through procedurally generated mazes while battling horrifying creatures that lurk in the shadows.

Features:
- Explore unique dungeon layouts every run
- Discover hidden treasure rooms with powerful artifacts
- Unlock new characters as you progress
- Upgrade your gear using materials collected from defeated monsters
- Fight epic boss monsters guarding valuable treasures
- Multiple difficulty settings for all skill levels

Do you have what it takes to conquer the dungeons and uncover their secrets?`,
    tags: ['dungeon'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/RiseUpTeaser.jpg',
    gameUrl: 'https://play.famobi.com/rise-up',
    featured: false,
    controls: 'Use WASD or arrow keys to move. Mouse to aim and attack. E to interact with objects.'
  },
  {
    id: 'monster-survivors-apocalypse',
    title: 'Monster Survivors: Apocalypse',
    description: 'Survive in a post-apocalyptic world overrun by mutated monsters.',
    longDescription: `Monster Survivors: Apocalypse is set in a devastated world where a catastrophic event has mutated creatures into terrifying monsters. As one of the few survivors, you must scavenge for resources and fight to stay alive.

Features:
- Post-apocalyptic environments with dynamic weather effects
- Day/night cycle that affects monster behavior
- Craft weapons and tools from scavenged materials
- Set up defensive structures to protect yourself
- Unique radiation system that can mutate your character
- Challenging boss fights against massive mutated creatures

The world has ended, but your fight for survival has just begun!`,
    tags: ['apocalypse', 'popular'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/GiantRushTeaser.jpg',
    gameUrl: 'https://play.famobi.com/giant-rush',
    featured: false,
    controls: 'Use WASD or arrow keys to move. Mouse to aim and attack. Q to use special ability. Tab to open inventory.'
  },
  {
    id: 'monster-survivors-fantasy',
    title: 'Monster Survivors: Fantasy',
    description: 'Battle fantasy creatures in a magical world filled with spells and sorcery.',
    longDescription: `Monster Survivors: Fantasy transports you to a magical realm where you'll wield powerful spells against mythical creatures. Choose your mage class and master the arcane arts to survive against hordes of fantasy monsters.

Features:
- 5 unique mage classes with distinct spell trees
- Combine spell effects to create devastating combos
- Summon magical familiars to aid you in battle
- Collect magical artifacts to enhance your abilities
- Explore enchanted forests, ancient ruins, and dragon lairs
- Face legendary creatures from mythology and fantasy

The magical realm awaits - will you become the most powerful sorcerer?`,
    tags: ['fantasy', 'new'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/WesternSniperTeaser.jpg',
    gameUrl: 'https://play.famobi.com/western-sniper', // 更新为指向真实的类似游戏
    featured: false,
    controls: 'Use WASD or arrow keys to move. Number keys 1-4 to cast different spells. Mouse to aim spells.'
  },
  {
    id: 'monster-survivors-cyborg',
    title: 'Monster Survivors: Cyborg',
    description: 'Battle as a half-human, half-machine against alien invaders in a futuristic city.',
    longDescription: `Monster Survivors: Cyborg places you in the role of an advanced cyborg defender protecting the last human city from alien monsters. Upgrade your mechanical parts and weapons to face increasingly dangerous extraterrestrial threats.

Features:
- Modular cyborg system with interchangeable parts
- Unlock new technology through research
- Advanced weapon systems with customizable ammunition
- Energy management system adds strategic depth
- Futuristic cityscape with destructible environments
- Face alien creatures with unique attack patterns

Humanity's last hope is half-human, half-machine - all hero!`,
    tags: ['sci-fi', 'new'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/GoEscapeTeaser.jpg',
    gameUrl: 'https://games.cdn.famobi.com/html5games/w/western-sniper/v040/?fg_domain=play.famobi.com&fg_aid=A1000-111&fg_uid=dce582f0-3659-4cdb-9c7a-d8d2eea38cd0&fg_pid=e37ab3ce-88cd-4438-9b9c-a37df5d33736&fg_beat=668&original_ref=https%3A%2F%2Fplay.famobi.com%2Fwestern-sniper', // 更新为指向真实的类似游戏
    featured: false,
    controls: 'Use WASD or arrow keys to move. Mouse to aim. Left click to fire primary weapon, right click for secondary weapon.'
  },
  {
    id: 'monster-survivors-pirate',
    title: 'Monster Survivors: Sea Monsters',
    description: 'Navigate treacherous waters filled with sea monsters and mythical ocean creatures.',
    longDescription: `Monster Survivors: Sea Monsters sets sail on a dangerous voyage across monster-infested seas. As a brave pirate captain, you must defend your ship against kraken, leviathans, and other terrors from the deep.

Features:
- Naval combat combined with survivor gameplay
- Upgrade your ship with cannons, sails, and special defenses
- Weather affects gameplay and monster spawns
- Explore uncharted islands for treasures and upgrades
- Crew management system to enhance your capabilities
- Epic battles against massive sea monsters

Hoist the sails and prepare your cannons - the monsters of the deep are coming!`,
    tags: ['fantasy', 'popular'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/ColorFill3dTeaser.jpg',
    gameUrl: 'https://play.famobi.com/color-fill-3d',
    featured: false,
    controls: 'Use WASD to navigate ship. Mouse to aim cannons. Space to activate special abilities.'
  },
  // 新添加的游戏
  {
    id: 'monster-survivors-strategy',
    title: 'Monster Survivors: Tactical',
    description: 'Plan your defense and strategically defeat waves of monsters in this tactical survival game.',
    longDescription: `Monster Survivors: Tactical takes the survivor genre to a new level by adding deep strategic elements. Instead of just reacting to monster attacks, you'll need to carefully plan your defenses, position your characters, and make tactical decisions to survive.

Features:
- Grid-based combat system with tactical positioning
- Build defensive structures and traps to control the battlefield
- Command a squad of survivors with unique abilities
- Research new technologies and upgrade paths
- Dynamic terrain that changes throughout the battle
- Advanced AI that adapts to your strategies

Do you have the tactical mind to outthink the monster hordes? Test your strategy skills now!`,
    tags: ['strategy', 'new'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/SpotTheCatTeaser.jpg',
    gameUrl: 'https://play.famobi.com/spot-the-cat',
    featured: false,
    controls: 'Use mouse to select units and issue commands. WASD to pan camera. Q, W, E, R for special abilities. Tab to switch between units.'
  },
  // 新添加的游戏
  {
    id: 'monster-survivors-strategy',
    title: 'Monster Survivors: Tactical',
    description: 'Plan your defense and strategically defeat waves of monsters in this tactical survival game.',
    longDescription: `Monster Survivors: Tactical takes the survivor genre to a new level by adding deep strategic elements. Instead of just reacting to monster attacks, you'll need to carefully plan your defenses, position your characters, and make tactical decisions to survive.

Features:
- Grid-based combat system with tactical positioning
- Build defensive structures and traps to control the battlefield
- Command a squad of survivors with unique abilities
- Research new technologies and upgrade paths
- Dynamic terrain that changes throughout the battle
- Advanced AI that adapts to your strategies

Do you have the tactical mind to outthink the monster hordes? Test your strategy skills now!`,
    tags: ['strategy', 'new'],
    thumbnailUrl: 'https://img.cdn.famobi.com/portal/html5games/images/tmp/ColorRoll3dTeaser.jpg',
    gameUrl: 'https://play.famobi.com/color-roll-3d',
    featured: false,
    controls: 'Use mouse to select units and issue commands. WASD to pan camera. Q, W, E, R for special abilities. Tab to switch between units.'
  }
];
