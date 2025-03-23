// 定义语言类型
export type Language = 'en' | 'zh';

// 所有需要翻译的文本键
export interface TranslationKeys {
  // 导航和标题
  home: string;
  allGames: string;
  popular: string;
  newGames: string;
  gameCategories: string;
  featuredGame: string;
  aboutMonsterSurvivors: string;
  viewAll: string;
  searchGames: string;
  searchResults: string;
  noSearchResults: string;

  // 游戏类别
  classicSurvivors: string;
  dungeon: string;
  apocalypse: string;
  fantasy: string;
  sciFi: string;

  // 按钮和交互
  playGame: string;
  fullScreen: string;
  backToGames: string;
  controls: string;

  // 游戏描述
  monsterSurvivorsIntro: string;
  gameFeatures: string;
  proceduralLevels: string;
  characterProgression: string;
  monsterVariety: string;
  increasingDifficulty: string;
  quickGameplay: string;
  casualOrHardcore: string;

  // 页脚
  quickLinks: string;
  legal: string;
  privacyPolicy: string;
  termsOfService: string;
  contactUs: string;
  copyright: string;

  // 标签
  new: string;
  hot: string;

  // 其他
  noGamesFound: string;
  language: string;
}

// 英文翻译
export const en: TranslationKeys = {
  // 导航和标题
  home: 'Home',
  allGames: 'All Games',
  popular: 'Popular',
  newGames: 'New Games',
  gameCategories: 'Game Categories',
  featuredGame: 'Featured Game',
  aboutMonsterSurvivors: 'About Monster Survivors',
  viewAll: 'View All',
  searchGames: 'Search games...',
  searchResults: 'Search Results',
  noSearchResults: 'No games found for your search.',

  // 游戏类别
  classicSurvivors: 'Classic Survivors',
  dungeon: 'Dungeon',
  apocalypse: 'Apocalypse',
  fantasy: 'Fantasy',
  sciFi: 'Sci-Fi',

  // 按钮和交互
  playGame: 'Play Game',
  fullScreen: 'Full Screen',
  backToGames: 'Back to Games',
  controls: 'Controls',

  // 游戏描述
  monsterSurvivorsIntro: 'Battle endless hordes of monsters and survive as long as possible in these thrilling roguelike games.',
  gameFeatures: 'These games typically feature:',
  proceduralLevels: 'Procedurally generated levels for unique gameplay each time',
  characterProgression: 'Character progression systems with various abilities and upgrades',
  monsterVariety: 'A wide variety of monsters with different abilities and attack patterns',
  increasingDifficulty: 'Increasing difficulty as you progress further into the game',
  quickGameplay: 'Quick, action-packed gameplay sessions',
  casualOrHardcore: 'Whether you\'re a casual gamer looking for a quick session or a hardcore player aiming to top the leaderboards, Monster Survivors games offer endless entertainment and challenge.',

  // 页脚
  quickLinks: 'Quick Links',
  legal: 'Legal',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  contactUs: 'Contact Us',
  copyright: '© 2025 MonsterSurvivors.com. All rights reserved.',

  // 标签
  new: 'New',
  hot: 'Hot',

  // 其他
  noGamesFound: 'No games found for this category.',
  language: 'Language'
};

// 中文翻译
export const zh: TranslationKeys = {
  // 导航和标题
  home: '首页',
  allGames: '所有游戏',
  popular: '热门游戏',
  newGames: '新游戏',
  gameCategories: '游戏分类',
  featuredGame: '推荐游戏',
  aboutMonsterSurvivors: '关于怪物生存者',
  viewAll: '查看全部',
  searchGames: '搜索游戏...',
  searchResults: '搜索结果',
  noSearchResults: '没有找到符合您搜索的游戏。',

  // 游戏类别
  classicSurvivors: '经典生存',
  dungeon: '地牢探险',
  apocalypse: '末日求生',
  fantasy: '奇幻世界',
  sciFi: '科幻未来',

  // 按钮和交互
  playGame: '开始游戏',
  fullScreen: '全屏模式',
  backToGames: '返回游戏列表',
  controls: '操作说明',

  // 游戏描述
  monsterSurvivorsIntro: '在这些刺激的 Roguelike 游戏中与无尽的怪物大军作战，尽可能长时间地生存下去。',
  gameFeatures: '这些游戏通常具有以下特点：',
  proceduralLevels: '程序生成的关卡，每次游戏体验都不同',
  characterProgression: '具有各种能力和升级的角色进阶系统',
  monsterVariety: '种类繁多的怪物，拥有不同的能力和攻击模式',
  increasingDifficulty: '随着游戏进程的推进，难度不断增加',
  quickGameplay: '快节奏、充满动作的游戏体验',
  casualOrHardcore: '无论您是寻找快速游戏体验的休闲玩家，还是希望登上排行榜的硬核玩家，怪物生存者游戏都能为您带来无尽的娱乐和挑战。',

  // 页脚
  quickLinks: '快速链接',
  legal: '法律信息',
  privacyPolicy: '隐私政策',
  termsOfService: '服务条款',
  contactUs: '联系我们',
  copyright: '© 2025 怪物生存者网. 保留所有权利。',

  // 标签
  new: '新品',
  hot: '热门',

  // 其他
  noGamesFound: '该分类下暂无游戏。',
  language: '语言'
};

// 默认语言
let currentLanguage: Language = 'en';

// 检查本地存储中是否有保存的语言设置
try {
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
    currentLanguage = savedLanguage;
  }
} catch (e) {
  // 如果无法访问本地存储（例如在隐私模式下），使用默认语言
  console.error('Failed to access localStorage:', e);
}

// 获取翻译的函数
export function t(key: keyof TranslationKeys): string {
  const translations = currentLanguage === 'en' ? en : zh;
  return translations[key] || key;
}

// 切换语言的函数
export function switchLanguage(lang: Language): void {
  if (lang === 'en' || lang === 'zh') {
    currentLanguage = lang;
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.error('Failed to save language setting to localStorage:', e);
    }

    // 触发自定义事件，通知应用语言已更改
    window.dispatchEvent(new CustomEvent('languageChanged'));
  }
}

// 获取当前语言
export function getCurrentLanguage(): Language {
  return currentLanguage;
}
