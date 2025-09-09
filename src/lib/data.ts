import type { Lesson, Challenge, LeaderboardEntry, CommunityPost, Badge, NavItem } from './types';
import { Icons } from '@/components/icons';

export const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Icons.layoutDashboard },
  { href: '/lessons', label: 'Lessons', icon: Icons.bookOpen },
  { href: '/challenges', label: 'Challenges', icon: Icons.trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Icons.barChart },
  { href: '/community', label: 'Community', icon: Icons.messageCircle },
  { href: '/profile', label: 'Profile', icon: Icons.user },
];

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Waste Segregation',
    description: 'Learn the basics of sorting waste to help our planet.',
    content: `## Why Segregate Waste?\n\nWaste segregation is the sorting and separation of waste types to facilitate recycling and correct disposal. When we segregate waste, we reduce the amount of waste that ends up in landfills, which are a major source of pollution.\n\n### Main Categories:\n\n*   **Organic Waste (Wet Waste):** Kitchen waste like fruit and vegetable peels, tea leaves, coffee grounds, and food leftovers.\n*   **Inorganic Waste (Dry Waste):** Paper, plastic, glass, metal, and other non-biodegradable materials.\n*   **Hazardous Waste:** Items like batteries, paint cans, and expired medicines that need special disposal.\n\n![Waste Bins](https://picsum.photos/600/400?random=1 "Waste Bins")\n\nBy sorting your waste at home, you take the first and most crucial step in the recycling process.`,
    imageUrl: 'https://picsum.photos/400/250?random=1',
    dataAiHint: 'recycling bins',
    ecoPoints: 50,
    quiz: {
      questions: [
        {
          question: 'Which of these is an example of Organic Waste?',
          options: ['Plastic Bottle', 'Apple Core', 'Used Battery', 'Newspaper'],
          correctAnswerIndex: 1,
        },
        {
          question: 'Why is waste segregation important?',
          options: ['To make trash cans look colorful', 'To facilitate recycling', 'To make more waste', 'It is not important'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    id: '2',
    title: 'The Magic of Composting',
    description: 'Turn your kitchen scraps into black gold for your garden.',
    content: `## What is Composting?\n\nComposting is a natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer that can enrich soil and plants. Anything that was once living will decompose.\n\n### How to Start:\n\n1.  **Choose a Spot:** Find a dry, shady spot in your yard for your compost pile or bin.\n2.  **Add Layers:** Alternate layers of green materials (like vegetable scraps, grass clippings) and brown materials (like leaves, twigs, paper).\n3.  **Maintain:** Keep the pile moist and turn it every week or two to aerate it.\n\n![Compost Pile](https://picsum.photos/600/400?random=2 "Compost Pile")\n\nIn a few months, you'll have nutrient-rich compost for your plants!`,
    imageUrl: 'https://picsum.photos/400/250?random=2',
    dataAiHint: 'compost soil',
    ecoPoints: 75,
    quiz: {
      questions: [
        {
          question: 'What are "green materials" in composting?',
          options: ['Plastic bags', 'Glass bottles', 'Vegetable scraps', 'Aluminum cans'],
          correctAnswerIndex: 2,
        },
        {
          question: 'How often should you turn your compost pile?',
          options: ['Once a year', 'Every week or two', 'Never', 'Every day'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Water Conservation at Home',
    description: 'Simple tips and tricks to save water every day.',
    content: `## Every Drop Counts\n\nWater is a precious resource, and conserving it is vital for our environment. Many simple habits can significantly reduce your water consumption at home.\n\n### Top Tips:\n\n*   **Turn off the tap:** Don't let water run while brushing your teeth or washing dishes.\n*   **Fix leaks:** A small drip can waste gallons of water per day.\n*   **Shorter showers:** Try to limit your shower time to 5 minutes.\n*   **Collect rainwater:** Use a rain barrel to collect water for your garden.\n\n![Water Drop](https://picsum.photos/600/400?random=3 "Water Drop")\n\nSaving water not only helps the planet but also reduces your water bill.`,
    imageUrl: 'https://picsum.photos/400/250?random=3',
    dataAiHint: 'water conservation',
    ecoPoints: 60,
    quiz: {
      questions: [
        {
          question: 'Which of the following is a good way to save water?',
          options: ['Letting the tap run while brushing teeth', 'Taking 30-minute showers', 'Fixing a leaky faucet', 'Watering your lawn at noon'],
          correctAnswerIndex: 2,
        },
      ],
    },
  },
   {
    id: '4',
    title: 'Benefits of Tree Planting',
    description: 'Discover why planting trees is crucial for a healthy planet.',
    content: `## Trees: The Lungs of Our Planet\n\nPlanting trees is one of the most effective ways to combat climate change, improve air quality, and support biodiversity.\n\n### Key Benefits:\n\n*   **Carbon Sequestration:** Trees absorb carbon dioxide, a major greenhouse gas, from the atmosphere.\n*   **Improved Air Quality:** They produce oxygen and filter out pollutants.\n*   **Biodiversity:** Trees provide habitats for countless species of animals, insects, and plants.\n*   **Cooling Effect:** They provide shade and can help cool urban areas.\n\n![Forest](https://picsum.photos/600/400?random=4 "Forest")\n\nEven planting one tree can make a difference!`,
    imageUrl: 'https://picsum.photos/400/250?random=4',
    dataAiHint: 'forest trees',
    ecoPoints: 80,
    quiz: {
      questions: [
        {
          question: 'How do trees help combat climate change?',
          options: ['By producing more heat', 'By absorbing carbon dioxide', 'By using more water', 'By providing shade'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
];

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Plant a Sapling',
    description: 'Plant a native tree in your community or backyard. Submit a geo-tagged photo of you with the newly planted sapling.',
    ecoPoints: 150,
    imageUrl: 'https://picsum.photos/400/250?random=5',
    dataAiHint: 'tree sapling',
  },
  {
    id: '2',
    title: 'DIY Compost Bin',
    description: 'Create your own compost bin from recycled materials. Submit a photo of your bin and the first layer of compost.',
    ecoPoints: 120,
    imageUrl: 'https://picsum.photos/400/250?random=6',
    dataAiHint: 'compost bin',
  },
  {
    id: '3',
    title: 'Zero-Waste Week',
    description: 'Try to produce as little waste as possible for one week. Submit a photo of your weekly trash (or lack thereof!).',
    ecoPoints: 200,
    imageUrl: 'https://picsum.photos/400/250?random=7',
    dataAiHint: 'waste reduction',
  },
];

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, team: 'Green Warriors', school: 'Oakridge International', points: 12500, avatarUrl: 'https://picsum.photos/40/40?random=1' },
  { rank: 2, team: 'Eco Avengers', school: 'Maplewood High', points: 11800, avatarUrl: 'https://picsum.photos/40/40?random=2' },
  { rank: 3, team: 'Planet Protectors', school: 'Riverdale School', points: 11250, avatarUrl: 'https://picsum.photos/40/40?random=3' },
  { rank: 4, team: 'Nature Ninjas', school: 'Hilltop Academy', points: 10500, avatarUrl: 'https://picsum.photos/40/40?random=4' },
  { rank: 5, team: 'Earth Heroes', school: 'Sunshine Public School', points: 9800, avatarUrl: 'https://picsum.photos/40/40?random=5' },
  { rank: 6, team: 'Recycle Rangers', school: 'Banyan Tree School', points: 9200, avatarUrl: 'https://picsum.photos/40/40?random=6' },
];

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    authorAvatarUrl: 'https://picsum.photos/40/40?random=7',
    title: 'Idea: Community Garden Project',
    content: 'I think we should start a community garden in the unused plot behind the library. We can grow our own organic vegetables and share them. It would be a great way to learn about farming and also provide fresh produce for everyone. We can use compost from our own homes to fertilize the soil. This would reduce waste and promote healthy eating.',
    timestamp: '2 days ago',
  },
  {
    id: '2',
    author: 'Rohan Verma',
    authorAvatarUrl: 'https://picsum.photos/40/40?random=8',
    title: 'Rainwater Harvesting in our School',
    content: 'Our school has a huge rooftop. We could install a rainwater harvesting system to collect all the water during the monsoon. This water can be used for cleaning, watering the school garden, and flushing toilets. It would save a lot of freshwater and reduce our water bills. I have researched some simple systems that are not too expensive to set up.',
    timestamp: '5 days ago',
  },
   {
    id: '3',
    author: 'Anika Reddy',
    authorAvatarUrl: 'https://picsum.photos/40/40?random=9',
    title: 'Upcycling old clothes drive',
    content: 'Let\'s organize a drive to collect old clothes. Instead of throwing them away, we can teach students how to upcycle them into useful items like bags, rugs, or decorative pieces. We can hold workshops and even sell the finished products to raise funds for other eco-projects.',
    timestamp: '1 week ago',
  },
];

export const userBadges: Badge[] = [
    { id: '1', name: 'Seedling Starter', description: 'Completed your first lesson!', icon: Icons.seedling },
    { id: '2', name: 'Waste Warrior', description: 'Mastered the waste segregation lesson.', icon: Icons.recycle },
    { id: '3', name: 'Compost Champion', description: 'Became an expert in composting.', icon: Icons.leaf },
    { id: '4', name: 'Aqua Saver', description: 'Aced the water conservation quiz.', icon: Icons.droplets },
    { id: '5', name: 'First Challenge', description: 'Completed your first real-world challenge.', icon: Icons.star },
    { id: '6', name: 'Green Thumb', description: 'Planted a tree.', icon: Icons.treePine },
];
