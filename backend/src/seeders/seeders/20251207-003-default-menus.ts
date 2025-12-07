// ============================================
// FILE: backend/src/seeders/seeders/20251207-003-default-menus.ts
// ============================================
import { Menu, MenuType } from '../../models/Menu';

export const name = '20251207-003-default-menus';

const defaultMenusConfig = [
  {
    title: 'Home',
    type: MenuType.INTERNAL,
    url: '/',
    icon: 'home',
    order: 1,
    isActive: true
  },
  {
    title: 'Notice',
    type: MenuType.INTERNAL,
    url: '/notice',
    icon: 'bell',
    order: 2,
    isActive: true
  },
  {
    title: 'Teams',
    type: MenuType.INTERNAL,
    url: '/teams',
    icon: 'users',
    order: 3,
    isActive: true
  },
  {
    title: 'Projects',
    type: MenuType.INTERNAL,
    url: '/projects',
    icon: 'folder',
    order: 4,
    isActive: true
  },
  {
    title: 'Resources',
    type: MenuType.INTERNAL,
    url: '/resources',
    icon: 'file-text',
    order: 5,
    isActive: true
  },
  {
    title: 'About',
    type: MenuType.INTERNAL,
    url: '/about',
    icon: 'info',
    order: 6,
    isActive: true
  }
];

export async function up() {
  for (const menuConfig of defaultMenusConfig) {
    const existingMenu = await Menu.findOne({ title: menuConfig.title, parentId: null });
    
    if (!existingMenu) {
      await Menu.create(menuConfig);
      console.log(`✅ Created menu: ${menuConfig.title}`);
    } else {
      console.log(`ℹ️  Menu already exists: ${menuConfig.title}`);
    }
  }
  
  console.log('✅ Default menus created/verified');
}

export async function down() {
  const menuTitles = defaultMenusConfig.map(m => m.title);
  
  const result = await Menu.deleteMany({ 
    title: { $in: menuTitles },
    parentId: null
  });
  
  console.log(`✅ Removed ${result.deletedCount} default menus`);
}