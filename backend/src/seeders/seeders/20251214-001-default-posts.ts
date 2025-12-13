// ============================================
// FILE: backend/src/seeders/seeders/202512014-001-default-posts.ts
// ============================================
import { Post, Board, PostStatus } from '../../models/Post';
import { User } from '../../models/User';
import { Role } from '../../models/Role';

export const name = '202512014-001-default-posts';

async function getAdminUser() {
  // Try to find an existing admin user
  const adminRole = await Role.findOne({ name: 'Admin' });
  if (!adminRole) {
    throw new Error('Admin role not found. Please run role seeder first.');
  }

  let adminUser: any = await User.findOne({ roleId: adminRole._id });
  
  if (!adminUser) {
    // Create a default admin user if none exists
    adminUser = await User.signUp({
      name: 'System Administrator',
      email: 'admin@encircle.com',
      password: 'Admin@123',
      roleId: adminRole._id.toString()
    });
    console.log('✅ Created default admin user for posts');
  }
  
  return adminUser;
}

const defaultBoardsConfig = [
  {
    title: 'General',
    description: 'General announcements and information',
    slug: 'general',
  },
  {
    title: 'News',
    description: 'Latest news and updates',
    slug: 'news',
  },
  {
    title: 'Guides',
    description: 'How-to guides and tutorials',
    slug: 'guides',
  }
];

const defaultPostsConfig = [
  {
    title: 'Welcome to ENCIRCLE',
    content: `
      <div>
        <h2>Welcome to ENCIRCLE</h2>
        <p>Your content management system portal. Use the navigation menu above to explore different sections.</p>
        
        <h3>Getting Started</h3>
        <p>ENCIRCLE provides a comprehensive platform for managing your organization's content, projects, and resources. Here are some key features:</p>
        
        <ul>
          <li><strong>Notices:</strong> Stay updated with the latest announcements and notices</li>
          <li><strong>Teams:</strong> Collaborate with your team members effectively</li>
          <li><strong>Projects:</strong> Manage and track all your ongoing projects</li>
          <li><strong>Resources:</strong> Access important documents and learning materials</li>
        </ul>
        
        <h3>Latest Features</h3>
        <p>We continuously improve ENCIRCLE to meet your needs. Check back regularly for new features and updates.</p>
        
        <blockquote>
          "ENCIRCLE - Connecting people, projects, and possibilities."
        </blockquote>
        
        <h3>Need Help?</h3>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
      </div>
    `,
    excerpt: 'Your content management system portal. Use the navigation menu above to explore different sections.',
    slug: 'welcome-to-encircle',
    boardSlug: 'general',
    tags: ['welcome', 'introduction', 'getting-started'],
    status: PostStatus.PUBLISHED
  },
  {
    title: 'System Updates - December 2024',
    content: `
      <div>
        <h2>System Updates - December 2024</h2>
        <p>We're excited to announce several new features and improvements to ENCIRCLE.</p>
        
        <h3>New Features</h3>
        <ul>
          <li>Enhanced user interface with improved navigation</li>
          <li>Advanced search functionality across all modules</li>
          <li>Real-time collaboration tools</li>
          <li>Mobile-responsive design improvements</li>
        </ul>
        
        <h3>Bug Fixes</h3>
        <ul>
          <li>Fixed issue with file upload on slow connections</li>
          <li>Resolved notification display problems</li>
          <li>Improved page load times</li>
        </ul>
        
        <h3>Coming Soon</h3>
        <p>We're working on exciting new features including:</p>
        <ul>
          <li>Advanced analytics dashboard</li>
          <li>Integration with third-party tools</li>
          <li>Customizable workflows</li>
        </ul>
        
        <p>Thank you for using ENCIRCLE!</p>
      </div>
    `,
    excerpt: 'Check out the latest features and improvements to ENCIRCLE.',
    slug: 'system-updates-december-2024',
    boardSlug: 'news',
    tags: ['updates', 'features', 'announcement'],
    status: PostStatus.PUBLISHED
  },
  {
    title: 'How to Create Your First Project',
    content: `
      <div>
        <h2>How to Create Your First Project</h2>
        <p>This guide will walk you through the process of creating your first project in ENCIRCLE.</p>
        
        <h3>Step 1: Navigate to Projects</h3>
        <p>Click on the "Projects" menu item in the navigation bar at the top of the page.</p>
        
        <h3>Step 2: Click Create New Project</h3>
        <p>On the Projects page, look for the "Create Project" or "+ New Project" button and click it.</p>
        
        <h3>Step 3: Fill in Project Details</h3>
        <p>You'll need to provide the following information:</p>
        <ul>
          <li><strong>Project Name:</strong> A clear, descriptive name for your project</li>
          <li><strong>Description:</strong> Brief overview of what the project is about</li>
          <li><strong>Start Date:</strong> When the project begins</li>
          <li><strong>End Date:</strong> Expected completion date</li>
          <li><strong>Team Members:</strong> Add people who will work on the project</li>
        </ul>
        
        <h3>Step 4: Set Project Goals</h3>
        <p>Define what you want to achieve with this project. Clear goals help keep everyone aligned.</p>
        
        <h3>Step 5: Save and Start Working</h3>
        <p>Click "Save" or "Create Project" to finalize. You can now start adding tasks, documents, and collaborating with your team.</p>
        
        <h3>Tips for Success</h3>
        <ul>
          <li>Keep your project description clear and concise</li>
          <li>Assign tasks with specific deadlines</li>
          <li>Regularly update project status</li>
          <li>Communicate with your team frequently</li>
        </ul>
        
        <p>Happy project managing!</p>
      </div>
    `,
    excerpt: 'Learn how to create and set up your first project in ENCIRCLE.',
    slug: 'how-to-create-first-project',
    boardSlug: 'guides',
    tags: ['guide', 'tutorial', 'projects', 'getting-started'],
    status: PostStatus.PUBLISHED
  }
];

export async function up() {
  try {
    // Get or create admin user
    const adminUser = await getAdminUser();
    
    // Create boards
    const boardMap = new Map();
    for (const boardConfig of defaultBoardsConfig) {
      let board = await Board.findOne({ slug: boardConfig.slug });
      
      if (!board) {
        board = await Board.create({
          ...boardConfig,
          authorId: adminUser._id,
          isActive: true
        });
        console.log(`✅ Created board: ${boardConfig.title}`);
      } else {
        console.log(`ℹ️  Board already exists: ${boardConfig.title}`);
      }
      
      boardMap.set(boardConfig.slug, board._id);
    }
    
    // Create posts
    for (const postConfig of defaultPostsConfig) {
      const existingPost = await Post.findOne({ slug: postConfig.slug });
      
      if (!existingPost) {
        const seriesId = boardMap.get(postConfig.boardSlug);
        
        await Post.create({
          title: postConfig.title,
          content: postConfig.content,
          excerpt: postConfig.excerpt,
          slug: postConfig.slug,
          status: postConfig.status,
          authorId: adminUser._id,
          seriesId: seriesId,
          tags: postConfig.tags,
          isActive: true,
          publishedAt: new Date()
        });
        console.log(`✅ Created post: ${postConfig.title}`);
      } else {
        console.log(`ℹ️  Post already exists: ${postConfig.title}`);
      }
    }
    
    console.log('✅ Default boards and posts created/verified');
  } catch (error) {
    console.error('❌ Error creating default posts:', error);
    throw error;
  }
}

export async function down() {
  try {
    // Delete posts
    const postSlugs = defaultPostsConfig.map(p => p.slug);
    const postResult = await Post.deleteMany({ 
      slug: { $in: postSlugs }
    });
    console.log(`✅ Removed ${postResult.deletedCount} default posts`);
    
    // Delete boards
    const boardSlugs = defaultBoardsConfig.map(b => b.slug);
    const boardResult = await Board.deleteMany({ 
      slug: { $in: boardSlugs }
    });
    console.log(`✅ Removed ${boardResult.deletedCount} default boards`);
  } catch (error) {
    console.error('❌ Error removing default posts:', error);
    throw error;
  }
}