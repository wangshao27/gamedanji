import './style.css';
import { games, gameTags } from './games';
import { t, switchLanguage, getCurrentLanguage, TranslationKeys } from './i18n';

// 为window添加router属性的类型定义
declare global {
  interface Window {
    router: Router;
  }
}

// Helper function for Chinese tag names
function getChineseTagName(tagId: string): string {
  const tagMap: Record<string, string> = {
    'all': '所有游戏',
    'classic': '经典生存',
    'dungeon': '地牢探险',
    'apocalypse': '末日求生',
    'fantasy': '奇幻世界',
    'sci-fi': '科幻未来',
    'new': '新游戏',
    'popular': '热门游戏'
  };

  return tagMap[tagId] || tagId;
}

// 简单的路由器实现
class Router {
  private routes: Map<string, () => void> = new Map();
  private notFoundHandler: () => void;
  private mobileMenuOpen: boolean = false;

  constructor() {
    window.addEventListener('popstate', () => this.resolve());

    // 设置默认的404处理函数
    this.notFoundHandler = () => {
      console.log('Page not found');
      this.navigate('/');
    };

    // 监听语言更改事件
    window.addEventListener('languageChanged', () => {
      this.updateUITexts();
      this.resolve(); // 重新渲染当前页面
    });

    // Initialize search functionality after DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeSearch();
    });
  }

  // Initialize search form
  private initializeSearch(): void {
    const searchForm = document.getElementById('search-form') as HTMLFormElement;
    const searchInput = document.getElementById('search-input') as HTMLInputElement;

    if (searchForm && searchInput) {
      // Set placeholder text based on current language
      searchInput.placeholder = t('searchGames' as keyof TranslationKeys);

      // Handle search form submission
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          this.navigate(`/search/${encodeURIComponent(query)}`);
        }
      });
    }

    // Update placeholders when language changes
    window.addEventListener('languageChanged', () => {
      if (searchInput) {
        searchInput.placeholder = t('searchGames' as keyof TranslationKeys);
      }
    });
  }

  public addRoute(path: string, handler: () => void): void {
    this.routes.set(path, handler);
  }

  public setNotFound(handler: () => void): void {
    this.notFoundHandler = handler;
  }

  public navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.resolve();

    // 导航时关闭移动菜单
    this.closeMobileMenu();
  }

  public resolve(): void {
    const path = window.location.pathname;

    // 尝试查找精确路径
    const exactHandler = this.routes.get(path);
    if (exactHandler) {
      exactHandler();
      return;
    }

    // 检查是否为游戏详情页
    if (path.startsWith('/game/')) {
      const gameId = path.substring('/game/'.length);
      const game = games.find(g => g.id === gameId);

      if (game) {
        this.renderGameDetail(game);
        return;
      }
    }

    // 检查是否为标签页
    if (path.startsWith('/tag/')) {
      const tagId = path.substring('/tag/'.length);
      const tag = gameTags.find(t => t.id === tagId);

      if (tag) {
        this.renderTagPage(tag);
        return;
      }
    }

    // 检查是否为搜索结果页
    if (path.startsWith('/search/')) {
      const query = decodeURIComponent(path.substring('/search/'.length));
      this.renderSearchResults(query);
      return;
    }

    // 未找到路由，执行404处理
    this.notFoundHandler();
  }

  // 更新UI文本
  private updateUITexts(): void {
    // 更新语言显示
    const currentLanguageElement = document.getElementById('current-language');
    if (currentLanguageElement) {
      currentLanguageElement.textContent = getCurrentLanguage() === 'en' ? 'English' : '中文';
    }

    // 更新所有带data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = t(key as keyof TranslationKeys);
      }
    });

    // Update placeholder attributes for inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (key && element instanceof HTMLInputElement) {
        element.placeholder = t(key as keyof TranslationKeys);
      }
    });
  }

  // Render search results
  private renderSearchResults(query: string): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Perform case-insensitive search across game title and description
    const searchResults = games.filter(game =>
      game.title.toLowerCase().includes(query.toLowerCase()) ||
      game.description.toLowerCase().includes(query.toLowerCase())
    );

    mainContent.innerHTML = `
      <h1 class="text-3xl font-bold mb-2 text-apple-indigo">${t('searchResults' as keyof TranslationKeys)}</h1>
      <p class="mb-6 text-apple-gray-700">${searchResults.length > 0
        ? `${searchResults.length} ${searchResults.length === 1 ? 'game' : 'games'} found for "${query}"`
        : t('noSearchResults' as keyof TranslationKeys)}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${searchResults.length > 0 ? searchResults.map(game => `
          <div class="game-card cursor-pointer" data-game-id="${game.id}">
            <div class="relative pb-[56.25%] bg-apple-gray-800 overflow-hidden">
              <img src="${game.thumbnailUrl}" alt="${game.title}" class="absolute top-0 left-0 w-full h-full object-cover">
            </div>
            <div class="p-4">
              <h3 class="game-title">${game.title}</h3>
              <p class="game-description">${game.description}</p>
              <div class="flex flex-wrap gap-2 my-2">
                ${game.tags.map(tagId => {
                  const gameTag = gameTags.find(t => t.id === tagId);
                  const gameTagName = gameTag ? gameTag.name : tagId;
                  return `<span class="game-tag">${getCurrentLanguage() === 'en' ? gameTagName : getChineseTagName(tagId)}</span>`;
                }).join('')}
              </div>
              <button class="btn btn-primary w-full mt-2">${t('playGame' as keyof TranslationKeys)}</button>
            </div>
          </div>
        `).join('') : ''}
      </div>
    `;

    // Add click event listeners to game cards
    const gameCards = mainContent.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const gameId = card.getAttribute('data-game-id');
        if (gameId) {
          // If clicking the button, navigate to game page
          const target = e.target as HTMLElement;
          if (target.tagName === 'BUTTON') {
            this.navigate(`/game/${gameId}`);
          } else if (!target.closest('button')) {
            this.navigate(`/game/${gameId}`);
          }
        }
      });
    });

    // Highlight relevant sidebar categories
    this.highlightSidebarTags(['all']);
  }

  private renderGameDetail(game: typeof games[0]): void {
    // 获取页面元素
    const mainContent = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (!mainContent) return;

    // 隐藏侧边栏、页眉和页脚，创建全屏游戏页面
    if (sidebar) sidebar.classList.add('hidden');
    if (header) header.classList.add('hidden');
    if (footer) footer.classList.add('hidden');

    // 修改主内容区域样式
    mainContent.className = 'w-full h-screen bg-apple-gray-900 flex items-center justify-center p-4';

    // 获取游戏标签的本地化名称
    const localizedTags = game.tags.map((tagId: string) => {
      const tag = gameTags.find(t => t.id === tagId);
      const tagName = tag ? tag.name : tagId;
      return getCurrentLanguage() === 'en' ? tagName : getChineseTagName(tagId);
    });

    mainContent.innerHTML = `
      <div class="relative w-full max-w-5xl">
        <!-- 返回按钮 -->
        <button id="back-to-home" class="absolute top-4 left-4 z-10 flex items-center text-white bg-apple-blue hover:bg-apple-indigo transition-colors rounded-md px-4 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          ${t('backToGames' as keyof TranslationKeys)}
        </button>

        <!-- 游戏窗口容器，可拖动 -->
        <div id="game-window" class="game-window">
          <!-- 游戏窗口顶部栏 -->
          <div id="game-title-bar" class="game-title-bar">
            <div class="flex items-center">
              <img src="${game.thumbnailUrl}" alt="${game.title}" class="w-8 h-8 rounded-full mr-3">
              <h1 class="text-xl font-bold">${game.title}</h1>
            </div>
            <div class="flex items-center space-x-3">
              <button id="fullscreen-btn" class="p-1.5 hover:bg-white/20 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 游戏iframe容器 -->
          <div class="game-iframe-container">
            <iframe src="${game.gameUrl}" frameborder="0" allowfullscreen class="game-iframe"></iframe>
          </div>
        </div>

        <!-- 游戏信息面板 -->
        <div class="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div class="flex flex-wrap gap-2 mb-4">
            ${localizedTags.map(tag => `
              <span class="game-tag">${tag}</span>
            `).join('')}
          </div>

          <div class="prose max-w-none mb-6">
            ${game.longDescription.split('\n').map((line: string) => {
              if (line.trim().startsWith('-')) {
                return `<li>${line.substring(1).trim()}</li>`;
              } else if (line.trim() && line.trim().endsWith(':')) {
                return `<h3 class="text-xl font-bold mt-4 mb-2">${line}</h3>`;
              } else if (line.trim()) {
                return `<p>${line}</p>`;
              }
              return '';
            }).join('')}
          </div>

          <div class="bg-apple-gray-100 p-4 rounded-lg">
            <h3 class="font-bold mb-2">${t('controls' as keyof TranslationKeys)}:</h3>
            <p>${game.controls}</p>
          </div>
        </div>
      </div>
    `;

    // 添加返回按钮事件
    const backButton = document.getElementById('back-to-home');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.navigateBack();
      });
    }

    // 添加全屏按钮事件
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const iframe = document.querySelector('.game-iframe') as HTMLIFrameElement;
        if (iframe) {
          // 尝试进入全屏模式
          iframe.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      });
    }

    // 实现拖动功能
    this.setupDraggable();

    // 高亮当前标签在侧边栏
    this.highlightSidebarTags(game.tags);
  }

  // 返回上一页并恢复页面布局
  private navigateBack(): void {
    // 恢复页面元素
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainContent = document.getElementById('main-content');

    if (sidebar) sidebar.classList.remove('hidden');
    if (header) header.classList.remove('hidden');
    if (footer) footer.classList.remove('hidden');
    if (mainContent) mainContent.className = 'flex-1';

    // 返回上一页
    window.history.back();
  }

  // 设置可拖动功能
  private setupDraggable(): void {
    const gameWindow = document.getElementById('game-window');
    const titleBar = document.getElementById('game-title-bar');

    if (!gameWindow || !titleBar) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;

      // 计算鼠标在窗口内的偏移位置
      const rect = gameWindow.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // 添加拖动时的样式
      gameWindow.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      // 计算新位置
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // 更新窗口位置
      gameWindow.style.position = 'absolute';
      gameWindow.style.left = `${x}px`;
      gameWindow.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        gameWindow.classList.remove('dragging');
      }
    });
  }

  private renderTagPage(tag: { id: string, name: string }): void {
    // 清空主内容区域
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 获取该标签下的所有游戏
    let filteredGames;
    if (tag.id === 'all') {
      filteredGames = games;
    } else {
      filteredGames = games.filter(game => game.tags.includes(tag.id));
    }

    const tagName = getCurrentLanguage() === 'en' ? tag.name : getChineseTagName(tag.id);

    mainContent.innerHTML = `
      <h1 class="text-3xl font-bold mb-6 text-apple-indigo">${tagName}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredGames.length > 0 ? filteredGames.map(game => `
          <div class="game-card cursor-pointer" data-game-id="${game.id}">
            <div class="relative pb-[56.25%] bg-apple-gray-800 overflow-hidden">
              <img src="${game.thumbnailUrl}" alt="${game.title}" class="absolute top-0 left-0 w-full h-full object-cover">
            </div>
            <div class="p-4">
              <h3 class="game-title">${game.title}</h3>
              <p class="game-description">${game.description}</p>
              <div class="flex flex-wrap gap-2 my-2">
                ${game.tags.map(tagId => {
                  const gameTag = gameTags.find(t => t.id === tagId);
                  const gameTagName = gameTag ? gameTag.name : tagId;
                  return `<span class="game-tag">${getCurrentLanguage() === 'en' ? gameTagName : getChineseTagName(tagId)}</span>`;
                }).join('')}
              </div>
              <button class="btn btn-primary w-full mt-2">${t('playGame' as keyof TranslationKeys)}</button>
            </div>
          </div>
        `).join('') : `<div class="col-span-full text-center py-12 text-apple-gray-600">${t('noGamesFound' as keyof TranslationKeys)}</div>`}
      </div>
    `;

    // 添加游戏卡片点击事件
    const gameCards = mainContent.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const gameId = card.getAttribute('data-game-id');
        if (gameId) {
          // 如果点击的是按钮，不要阻止默认行为
          const target = e.target as HTMLElement;
          if (target.tagName === 'BUTTON') {
            this.navigate(`/game/${gameId}`);
          } else if (!target.closest('button')) {
            this.navigate(`/game/${gameId}`);
          }
        }
      });
    });

    // 高亮当前标签
    this.highlightSidebarTags([tag.id]);
  }

  public highlightSidebarTags(tagIds: string[]): void {
    // 取消所有标签的高亮
    const allTagLinks = document.querySelectorAll('.sidebar-tag');
    allTagLinks.forEach(link => {
      link.classList.remove('bg-apple-blue', 'text-white');
      link.classList.add('hover:bg-apple-gray-200');
    });

    // 高亮当前标签
    tagIds.forEach(tagId => {
      const tagLink = document.querySelector(`.sidebar-tag[data-tag-id="${tagId}"]`);
      if (tagLink) {
        tagLink.classList.add('bg-apple-blue', 'text-white');
        tagLink.classList.remove('hover:bg-apple-gray-200');
      }
    });
  }

  // 切换移动菜单
  public toggleMobileMenu(): void {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    if (this.mobileMenuOpen) {
      // 关闭菜单
      sidebar.classList.remove('block', 'mobile-sidebar');
      sidebar.classList.add('hidden', 'md:block');
    } else {
      // 打开菜单
      sidebar.classList.remove('hidden');
      sidebar.classList.add('block', 'mobile-sidebar');
    }

    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // 关闭移动菜单
  public closeMobileMenu(): void {
    if (!this.mobileMenuOpen) return;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('block', 'mobile-sidebar');
      sidebar.classList.add('hidden', 'md:block');
      this.mobileMenuOpen = false;
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Create and set up router
  const router = new Router();
  window.router = router;

  // Add routes
  router.addRoute('/', () => {
    renderHomePage();
  });

  // Add privacy policy route
  router.addRoute('/privacy-policy', () => {
    renderPrivacyPolicyPage();
  });

  // Add terms of service route
  router.addRoute('/terms-of-service', () => {
    renderTermsOfServicePage();
  });

  // Add contact us route
  router.addRoute('/contact', () => {
    renderContactPage();
  });

  // Initialize sidebar
  initializeSidebar();

  // Initialize language switcher
  initializeLanguageSwitcher();

  // Initialize mobile menu
  initializeMobileMenu();

  // Resolve current route
  router.resolve();
});

// Initialize sidebar with game categories
function initializeSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="p-4">
      <h3 class="text-lg font-bold mb-4 text-apple-blue" data-i18n="gameCategories">Game Categories</h3>
      <div class="space-y-1">
        ${gameTags.map(tag => `
          <a href="/tag/${tag.id}"
             class="sidebar-tag block w-full text-left px-3 py-2 rounded-md transition-colors"
             data-tag-id="${tag.id}">
            ${getCurrentLanguage() === 'en' ? tag.name : getChineseTagName(tag.id)}
          </a>
        `).join('')}
      </div>
    </div>
  `;

  // Add click event to sidebar links
  const tagLinks = sidebar.querySelectorAll('.sidebar-tag');
  tagLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (href) {
        window.router.navigate(href);
      }
    });
  });
}

// Initialize language switcher
function initializeLanguageSwitcher(): void {
  const languageButton = document.getElementById('language-button');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageOptions = document.querySelectorAll('[data-lang]');

  if (languageButton && languageDropdown) {
    // Toggle dropdown
    languageButton.addEventListener('click', () => {
      languageDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!languageButton.contains(e.target as Node) && !languageDropdown.contains(e.target as Node)) {
        languageDropdown.classList.add('hidden');
      }
    });

    // Language selection
    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (lang === 'en' || lang === 'zh') {
          switchLanguage(lang);
          languageDropdown.classList.add('hidden');
        }
      });
    });
  }
}

// Initialize mobile menu toggle
function initializeMobileMenu(): void {
  const menuButton = document.querySelector('.mobile-menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      window.router.toggleMobileMenu();
    });
  }
}

// Render the home page
function renderHomePage(): void {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Find featured games
  const featuredGames = games.filter(game => game.featured);
  // Get games for different categories
  const newGames = games.filter(game => game.tags.includes('new'));
  const popularGames = games.filter(game => game.tags.includes('popular'));

  // Build the home page
  mainContent.innerHTML = `
    <!-- Hero Section with Featured Game -->
    <section class="mb-10">
      ${featuredGames.length > 0 ? `
        <div class="relative rounded-xl overflow-hidden bg-apple-gray-900 shadow-xl">
          <div class="relative pb-[40%] md:pb-[35%] lg:pb-[30%]">
            <img src="${featuredGames[0].thumbnailUrl}" alt="${featuredGames[0].title}" class="absolute top-0 left-0 w-full h-full object-cover opacity-40">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-apple-gray-900 to-transparent"></div>
            <div class="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-10">
              <span class="bg-apple-blue text-white px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">${t('featuredGame' as keyof TranslationKeys)}</span>
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">${featuredGames[0].title}</h1>
              <p class="text-white text-lg mb-6 max-w-3xl">${featuredGames[0].description}</p>
              <button class="bg-apple-yellow hover:bg-yellow-500 text-apple-gray-900 font-bold px-6 py-3 rounded-md text-lg transition-colors play-game-btn" data-game-id="${featuredGames[0].id}">
                ${t('playGame' as keyof TranslationKeys)}
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </section>

    <!-- Popular Games Section -->
    <section class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-apple-indigo">${t('popular' as keyof TranslationKeys)}</h2>
        <a href="/tag/popular" class="text-apple-blue hover:text-apple-indigo transition-colors">${t('viewAll' as keyof TranslationKeys)} →</a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${popularGames.slice(0, 3).map(game => `
          <div class="game-card cursor-pointer" data-game-id="${game.id}">
            <div class="relative pb-[56.25%] bg-apple-gray-800 overflow-hidden">
              <img src="${game.thumbnailUrl}" alt="${game.title}" class="absolute top-0 left-0 w-full h-full object-cover">
            </div>
            <div class="p-4">
              <h3 class="game-title">${game.title}</h3>
              <p class="game-description">${game.description}</p>
              <div class="flex flex-wrap gap-2 my-2">
                ${game.tags.map(tagId => {
                  const gameTag = gameTags.find(t => t.id === tagId);
                  const gameTagName = gameTag ? gameTag.name : tagId;
                  return `<span class="game-tag">${getCurrentLanguage() === 'en' ? gameTagName : getChineseTagName(tagId)}</span>`;
                }).join('')}
              </div>
              <button class="btn btn-primary w-full mt-2">${t('playGame' as keyof TranslationKeys)}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- New Games Section -->
    <section class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-apple-indigo">${t('newGames' as keyof TranslationKeys)}</h2>
        <a href="/tag/new" class="text-apple-blue hover:text-apple-indigo transition-colors">${t('viewAll' as keyof TranslationKeys)} →</a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${newGames.slice(0, 3).map(game => `
          <div class="game-card cursor-pointer" data-game-id="${game.id}">
            <div class="relative pb-[56.25%] bg-apple-gray-800 overflow-hidden">
              <img src="${game.thumbnailUrl}" alt="${game.title}" class="absolute top-0 left-0 w-full h-full object-cover">
              <div class="absolute top-2 right-2 bg-apple-yellow text-apple-gray-900 rounded-full px-2 py-0.5 text-xs font-bold">
                ${t('new' as keyof TranslationKeys)}
              </div>
            </div>
            <div class="p-4">
              <h3 class="game-title">${game.title}</h3>
              <p class="game-description">${game.description}</p>
              <div class="flex flex-wrap gap-2 my-2">
                ${game.tags.map(tagId => {
                  const gameTag = gameTags.find(t => t.id === tagId);
                  const gameTagName = gameTag ? gameTag.name : tagId;
                  return `<span class="game-tag">${getCurrentLanguage() === 'en' ? gameTagName : getChineseTagName(tagId)}</span>`;
                }).join('')}
              </div>
              <button class="btn btn-primary w-full mt-2">${t('playGame' as keyof TranslationKeys)}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white rounded-xl shadow-lg p-6 mb-10">
      <h2 class="text-2xl font-bold text-apple-indigo mb-4">${t('aboutMonsterSurvivors' as keyof TranslationKeys)}</h2>
      <div class="prose max-w-none">
        <p>${t('monsterSurvivorsIntro' as keyof TranslationKeys)}</p>
        <p class="mt-4">${t('gameFeatures' as keyof TranslationKeys)}</p>
        <ul class="mt-2 space-y-2">
          <li>${t('proceduralLevels' as keyof TranslationKeys)}</li>
          <li>${t('characterProgression' as keyof TranslationKeys)}</li>
          <li>${t('monsterVariety' as keyof TranslationKeys)}</li>
          <li>${t('increasingDifficulty' as keyof TranslationKeys)}</li>
          <li>${t('quickGameplay' as keyof TranslationKeys)}</li>
        </ul>
        <p class="mt-4">${t('casualOrHardcore' as keyof TranslationKeys)}</p>
      </div>
    </section>
  `;

  // Add click event listeners to game cards
  const gameCards = mainContent.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const gameId = card.getAttribute('data-game-id');
      if (gameId) {
        // If clicking the button, navigate to game page
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON') {
          window.router.navigate(`/game/${gameId}`);
        } else if (!target.closest('button')) {
          window.router.navigate(`/game/${gameId}`);
        }
      }
    });
  });

  // Add click event listener to featured game button
  const featuredGameBtn = mainContent.querySelector('.play-game-btn');
  if (featuredGameBtn) {
    featuredGameBtn.addEventListener('click', () => {
      const gameId = featuredGameBtn.getAttribute('data-game-id');
      if (gameId) {
        window.router.navigate(`/game/${gameId}`);
      }
    });
  }

  // Highlight all games in sidebar
  window.router.highlightSidebarTags(['all']);
}

// Render the privacy policy page
function renderPrivacyPolicyPage(): void {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
      <h1 class="text-3xl font-bold mb-6 text-apple-indigo">Privacy Policy</h1>

      <div class="prose max-w-none">
        <p class="mb-4">Last updated: March 23, 2025</p>

        <h2 class="text-xl font-bold mt-6 mb-3">1. Introduction</h2>
        <p>Welcome to Monster Survivors. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">2. The Data We Collect About You</h2>
        <p>When you visit our website, we may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul class="list-disc pl-6 my-4 space-y-2">
          <li><strong>Identity Data</strong> includes username or similar identifier.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
        </ul>

        <h2 class="text-xl font-bold mt-6 mb-3">3. How We Use Your Personal Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul class="list-disc pl-6 my-4 space-y-2">
          <li>To provide you with the gaming experience.</li>
          <li>To improve our website and user experience.</li>
          <li>To administer and protect our website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data).</li>
        </ul>

        <h2 class="text-xl font-bold mt-6 mb-3">4. Cookies</h2>
        <p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. By continuing to browse the site, you are agreeing to our use of cookies.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">5. Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">6. Contact Us</h2>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: privacy@monstersurvivors.com</p>
      </div>
    </div>
  `;
}

// Render the terms of service page
function renderTermsOfServicePage(): void {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
      <h1 class="text-3xl font-bold mb-6 text-apple-indigo">Terms of Service</h1>

      <div class="prose max-w-none">
        <p class="mb-4">Last updated: March 23, 2025</p>

        <h2 class="text-xl font-bold mt-6 mb-3">1. Introduction</h2>
        <p>These terms and conditions govern your use of our website and the games provided through our platform. By using our website, you accept these terms and conditions in full.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">2. Intellectual Property Rights</h2>
        <p>All intellectual property rights in the website and games are owned by us or our licensors. You have no intellectual property rights in, or to, the website or games other than the right to use them in accordance with these terms.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">3. Restrictions on Use</h2>
        <p>You must not:</p>
        <ul class="list-disc pl-6 my-4 space-y-2">
          <li>Use the website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</li>
          <li>Use the website in any way that is unlawful, illegal, fraudulent or harmful.</li>
          <li>Use the website for any commercial purposes without our express permission.</li>
          <li>Attempt to circumvent any technical protection measures implemented for the games.</li>
        </ul>

        <h2 class="text-xl font-bold mt-6 mb-3">4. User Content</h2>
        <p>If you submit any content to our website, you grant us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">5. Limited Warranties</h2>
        <p>We do not warrant the completeness or accuracy of the information published on this website. The website is provided "as is" without any representations or warranties, express or implied.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">6. Limitations of Liability</h2>
        <p>We will not be liable to you in respect of any losses arising out of any event or events beyond our reasonable control, or in respect of any business losses, including (without limitation) loss of or damage to profits, income, revenue, use, production, anticipated savings, business, contracts, commercial opportunities or goodwill.</p>

        <h2 class="text-xl font-bold mt-6 mb-3">7. Changes to Terms</h2>
        <p>We may revise these terms and conditions from time to time. The revised terms and conditions shall apply to the use of our website from the date of publication of the revised terms and conditions on our website.</p>
      </div>
    </div>
  `;
}

// Render the contact page
function renderContactPage(): void {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
      <h1 class="text-3xl font-bold mb-6 text-apple-indigo">Contact Us</h1>

      <div class="prose max-w-none mb-8">
        <p>We'd love to hear from you! If you have any questions, feedback, or concerns about our games or website, please don't hesitate to reach out using one of the methods below.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-bold mb-4">Contact Information</h2>
          <div class="space-y-4">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3 text-apple-blue shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div>
                <h3 class="font-bold">Email</h3>
                <p><a href="mailto:contact@monstersurvivors.com" class="text-apple-blue hover:text-apple-indigo">contact@monstersurvivors.com</a></p>
              </div>
            </div>

            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3 text-apple-blue shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <div>
                <h3 class="font-bold">Website</h3>
                <p><a href="https://monstersurvivors.com" class="text-apple-blue hover:text-apple-indigo">monstersurvivors.com</a></p>
              </div>
            </div>

            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3 text-apple-blue shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <div>
                <h3 class="font-bold">Social Media</h3>
                <div class="flex space-x-4 mt-2">
                  <a href="https://twitter.com/monstersurvivors" class="text-apple-blue hover:text-apple-indigo">Twitter</a>
                  <a href="https://discord.gg/monstersurvivors" class="text-apple-blue hover:text-apple-indigo">Discord</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">Send a Message</h2>
          <form class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-apple-gray-700 mb-1">Your Name</label>
              <input type="text" id="name" name="name" class="w-full px-3 py-2 border border-apple-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-apple-blue">
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-apple-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" class="w-full px-3 py-2 border border-apple-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-apple-blue">
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-apple-gray-700 mb-1">Subject</label>
              <input type="text" id="subject" name="subject" class="w-full px-3 py-2 border border-apple-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-apple-blue">
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-apple-gray-700 mb-1">Message</label>
              <textarea id="message" name="message" rows="5" class="w-full px-3 py-2 border border-apple-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-apple-blue"></textarea>
            </div>

            <div>
              <button type="submit" class="bg-apple-blue hover:bg-apple-indigo text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add event listener for form submission
  const contactForm = mainContent.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // In a real app, you would send the form data to a server
      // For now, we'll just show a success message
      const formContainer = contactForm.parentElement;
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  Thank you for your message! We'll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>
        `;
      }
    });
  }
}
