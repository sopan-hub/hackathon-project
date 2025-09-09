import type { Lesson, Challenge, LeaderboardEntry, CommunityPost, Badge, NavItem } from './types';
import { Icons } from '@/components/icons';

export const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Icons.layoutDashboard },
  { href: '/lessons', label: 'Lessons', icon: Icons.bookOpen },
  { href: '/challenges', label: 'Challenges', icon: Icons.trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Icons.barChart },
  { href: '/community', label: 'Community', icon: Icons.messageCircle },
  { href: '/eco-advisor', label: 'Eco Advisor', icon: Icons.lightbulb },
  { href: '/profile', label: 'Profile', icon: Icons.user },
];

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'The Carbon Cycle and Climate Change',
    description: 'Understand how carbon moves through our planet and its impact on the global climate.',
    ecoPoints: 80,
    chapters: [
      {
        id: '1-1',
        title: 'What is the Carbon Cycle?',
        content: "## The Planet's Breathing System\n\nThe carbon cycle is the process by which carbon atoms continuously travel from the atmosphere to the Earth and then back into the atmosphere. Since our planet and its atmosphere are a closed environment, the amount of carbon in this system does not change. Where the carbon is located — in the atmosphere or on Earth — is constantly in flux.\n\n### Key Reservoirs\nCarbon is stored in various 'reservoirs.' The main ones are:\n*   **The Atmosphere:** Carbon exists here as carbon dioxide (CO2).\n*   **The Oceans:** Oceans store a vast amount of carbon, absorbing it from the atmosphere.\n*   **Land:** Stored in soil, plants, and animals. Rocks and fossil fuels are the largest reservoir of Earth's carbon.\n\nThis natural balance is crucial for maintaining a stable climate on Earth. Human activities, however, are disrupting this delicate balance.",
        quiz: {
          questions: [
            {
              question: 'Which of the following is the largest reservoir of carbon on Earth?',
              options: ['The atmosphere', 'Oceans', 'Forests', 'Rocks and fossil fuels'],
              correctAnswerIndex: 3,
            },
          ],
        },
      },
      {
        id: '1-2',
        title: 'How Humans Are Disrupting the Cycle',
        content: "## The Human Factor\n\nFor most of human history, the carbon cycle was in a relatively stable balance. However, the Industrial Revolution changed everything. Humans began burning vast quantities of fossil fuels (coal, oil, and natural gas) to power homes, factories, and vehicles. \n\n### Major Disruptions\n*   **Burning Fossil Fuels:** This process releases enormous amounts of CO2 into the atmosphere, much faster than natural processes can absorb it.\n*   **Deforestation:** Trees are powerful carbon sinks. When we cut down forests, we not only lose the ability to absorb CO2 but also release the carbon stored in those trees back into the atmosphere.\n*   **Industrial Processes:** Manufacturing cement and other industrial activities also contribute significant CO2 emissions.\n\nThis influx of atmospheric CO2 is the primary driver of modern climate change.",
        quiz: {
          questions: [
            {
              question: 'What is the main way humans have disrupted the carbon cycle?',
              options: ['Planting more trees', 'Burning fossil fuels', 'Protecting oceans', 'Volcanic eruptions'],
              correctAnswerIndex: 1,
            },
          ],
        },
      },
      {
        id: '1-3',
        title: 'The Greenhouse Effect and Global Warming',
        content: "## Earth's Climate Blanket\n\nThe 'greenhouse effect' is a natural process that warms the Earth’s surface. When the Sun’s energy reaches the Earth’s atmosphere, some of it is reflected back to space and the rest is absorbed and re-radiated by greenhouse gases.\n\n### The Problem\nIncreased concentrations of greenhouse gases, like the CO2 from burning fossil fuels, are making this blanket thicker. This traps more heat in the atmosphere, leading to a gradual increase in the planet's average temperature, a phenomenon known as global warming. The consequences include melting ice caps, rising sea levels, more extreme weather events, and disruptions to ecosystems worldwide.",
        quiz: {
          questions: [
            {
              question: 'What is the direct consequence of an enhanced greenhouse effect?',
              options: ['Cooler global temperatures', 'A thinner atmosphere', 'Trapping more heat, leading to global warming', 'Increased oxygen levels'],
              correctAnswerIndex: 2,
            },
          ],
        },
      },
    ],
  },
  {
    id: '2',
    title: 'Renewable Energy Sources',
    description: 'Explore the clean and sustainable energy sources that power our future.',
    ecoPoints: 90,
    chapters: [
      {
        id: '2-1',
        title: 'Harnessing the Sun: Solar Power',
        content: "## The Power of Sunlight\n\nSolar power is energy from the sun that is converted into thermal or electrical energy. Solar energy is the most abundant renewable energy source on the planet. Photovoltaic (PV) panels are the most common way to harness this energy. \n\n### How it Works\nPV panels are made of many solar cells. When sunlight shines on these cells, it creates an electric field across the layers. This flow of electrons is electricity! This electricity can be used to power homes and businesses, or stored in batteries for later use. Solar power is a clean alternative to fossil fuels, producing no greenhouse gas emissions.",
        quiz: {
          questions: [
            {
              question: 'What do Photovoltaic (PV) panels do?',
              options: ['Cool down buildings', 'Convert sunlight directly into electricity', 'Create wind', 'Store water'],
              correctAnswerIndex: 1,
            },
          ],
        },
      },
      {
        id: '2-2',
        title: 'The Force of Nature: Wind Power',
        content: "## Riding the Wind\n\nWind power, or wind energy, is the use of wind to provide mechanical power through wind turbines to turn electric generators. Wind is a clean fuel source; it doesn't pollute the air like power plants that rely on combustion of fossil fuels.\n\n### Wind Turbines\nModern wind turbines look like giant propellers. The wind pushes against the blades, causing them to spin. This rotation turns a shaft, which is connected to a generator that produces electricity. Wind farms, which are large collections of turbines, are often built in windy locations, such as on hills or offshore.",
        quiz: {
          questions: [
            {
              question: 'How do wind turbines generate electricity?',
              options: ['By burning natural gas', 'Through a chemical reaction', 'By using the wind to spin blades connected to a generator', 'By using solar panels'],
              correctAnswerIndex: 2,
            },
          ],
        },
      },
       {
        id: '2-3',
        title: 'Water and Heat: Hydropower and Geothermal',
        content: "## Earth's Inner and Outer Power\n\n**Hydropower** is one of the oldest and largest sources of renewable energy. It uses the flow of moving water—from rivers or dams—to spin turbines and generate electricity. It's generally reliable and low-cost, but building large dams can have significant environmental and social impacts.\n\n**Geothermal energy** taps into the Earth's internal heat. Water or steam is piped from deep underground reservoirs to the surface, where it is used to drive turbines connected to electricity generators. It's a powerful and consistent energy source, but it is only available in specific geological hotspots around the world.",
        quiz: {
          questions: [
            {
              question: 'What does geothermal energy use to generate electricity?',
              options: ['The flow of rivers', 'The heat from within the Earth', 'The movement of the tides', 'Sunlight'],
              correctAnswerIndex: 1,
            },
          ],
        },
      },
    ]
  },
  {
    id: '3',
    title: 'Simple Steps for a Greener Lifestyle',
    description: 'Learn easy, everyday actions you can take to make a positive impact on the environment.',
    ecoPoints: 75,
    chapters: [
      {
        id: '3-1',
        title: 'The 3 R\'s: Reduce, Reuse, Recycle',
        content: "## The Foundation of Eco-Friendly Living\n\nThe three R's are a simple but powerful guide to minimizing your environmental footprint. They are prioritized in order:\n\n### 1. Reduce\nThis is the most important step. It means consuming less and generating less waste in the first place. Simple ways to reduce include:\n*   Saying no to plastic bags at the store.\n*   Buying products with less packaging.\n*   Turning off lights and electronics when not in use to reduce energy consumption.\n\n### 2. Reuse\nBefore you throw something away, think if it can be used again. Reusing items saves the energy and resources needed to make new ones. Examples include:\n*   Using a reusable water bottle and coffee cup.\n*   Donating old clothes and toys instead of trashing them.\n*   Using empty jars for storage.\n\n### 3. Recycle\nRecycling is the process of converting waste materials into new materials and objects. Check your local guidelines to see what you can recycle. Common recyclables include paper, cardboard, plastic bottles, and metal cans.",
        quiz: {
          questions: [
            {
              question: 'Which of the "3 R\'s" is the most important for reducing our environmental impact?',
              options: ['Recycle', 'Reuse', 'Reduce', 'All are equally important'],
              correctAnswerIndex: 2,
            },
          ],
        },
      },
      {
        id: '3-2',
        title: 'Conserving Water and Energy at Home',
        content: "## Small Changes, Big Savings\n\nConserving water and energy at home is easier than you think. Many small habits add up to a significant positive impact on the environment and can even save you money on utility bills.\n\n### Saving Water\n*   Turn off the tap while brushing your teeth.\n*   Take shorter showers. A five-minute shower uses much less water than a full bath.\n*   Fix leaky faucets promptly. A single drip can waste gallons of water per day.\n\n### Saving Energy\n*   Switch to LED light bulbs, which use up to 80% less energy than traditional bulbs.\n*   Unplug chargers and appliances when they are not in use. Many devices draw 'phantom' power even when turned off.\n*   In winter, wear a sweater instead of turning up the heat. In summer, use fans and close blinds to keep cool.",
        quiz: {
          questions: [
            {
              question: 'What is "phantom power"?',
              options: ['Energy from ghosts', 'The power used by devices that are plugged in but turned off', 'The power from solar panels at night', 'A type of renewable energy'],
              correctAnswerIndex: 1,
            },
          ],
        },
      },
       {
        id: '3-3',
        title: 'Making Eco-Friendly Choices',
        content: "## You Have the Power\n\nEvery choice you make as a consumer has an impact. By making informed decisions, you can support a healthier planet.\n\n### Think Before You Buy\n*   **Support Sustainable Brands:** Look for companies that are transparent about their supply chains and use eco-friendly materials.\n*   **Eat Local:** Buying food from local farmers reduces the carbon emissions associated with long-distance transportation.\n*   **Choose Reusable over Disposable:** Opt for products that can be used many times, like cloth napkins, reusable shopping bags, and rechargeable batteries.\n\nYour daily habits are powerful. By adopting a greener lifestyle, you contribute to a more sustainable future for everyone.",
        quiz: {
          questions: [
            {
              question: 'Why is buying local food often a more eco-friendly choice?',
              options: ['It is always cheaper', 'It tastes better', 'It reduces carbon emissions from transportation', 'It uses more packaging'],
              correctAnswerIndex: 2,
            },
          ],
        },
      },
    ]
  }
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
    { id: '1', name: 'Seedling Starter', description: 'Completed your first lesson!', icon: Icons.sprout },
    { id: '2', name: 'Waste Warrior', description: 'Mastered the waste segregation lesson.', icon: Icons.recycle },
    { id: '3', name: 'Compost Champion', description: 'Became an expert in composting.', icon: Icons.leaf },
    { id: '4', name: 'Aqua Saver', description: 'Aced the water conservation quiz.', icon: Icons.droplets },
    { id: '5', name: 'First Challenge', description: 'Completed your first real-world challenge.', icon: Icons.star },
    { id: '6', name: 'Green Thumb', description: 'Planted a tree.', icon: Icons.treePine },
];
