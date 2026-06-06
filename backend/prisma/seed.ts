import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing data...');
  await prisma.cutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  console.log('Seeding curated Indian colleges...');

  const realColleges = [
    // JEE ADVANCED (IITs)
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      location: "Mumbai",
      state: "Maharashtra",
      type: "Government",
      category: "Engineering",
      fees: 230000,
      rating: 4.9,
      established: 1958,
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
      overview: "IIT Bombay is a globally recognized engineering institution known for cutting-edge research and top-tier placements.",
      naacGrade: "A++",
      nirfRank: 3,
      placementAvgSalary: 2200000,
      placementHighestSalary: 15000000,
      placementPercent: 95,
      exam: 'JEE_ADV',
      cutoffs: { General: [1, 65], OBC: [10, 30], SC: [1, 15] }
    },
    {
      name: "Indian Institute of Technology (IIT) Delhi",
      location: "New Delhi",
      state: "Delhi",
      type: "Government",
      category: "Engineering",
      fees: 225000,
      rating: 4.8,
      established: 1961,
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      overview: "IIT Delhi offers world-class faculty and facilities, located in the heart of the capital city.",
      naacGrade: "A++",
      nirfRank: 2,
      placementAvgSalary: 2100000,
      placementHighestSalary: 12000000,
      placementPercent: 93,
      exam: 'JEE_ADV',
      cutoffs: { General: [66, 120], OBC: [31, 60], SC: [16, 30] }
    },
    
    // JEE MAIN (NITs Tier 1)
    {
      name: "National Institute of Technology (NIT) Trichy",
      location: "Tiruchirappalli",
      state: "Tamil Nadu",
      type: "Government",
      category: "Engineering",
      fees: 160000,
      rating: 4.7,
      established: 1964,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
      overview: "NIT Trichy is the top-ranked NIT in India, boasting excellent infrastructure and alumni network.",
      naacGrade: "A++",
      nirfRank: 9,
      placementAvgSalary: 1500000,
      placementHighestSalary: 4500000,
      placementPercent: 90,
      exam: 'JEE_MAIN',
      cutoffs: { General: [100, 5000], OBC: [500, 2000], SC: [200, 1000] } // Tier 1 up to 5k
    },
    {
      name: "National Institute of Technology (NIT) Surathkal",
      location: "Mangalore",
      state: "Karnataka",
      type: "Government",
      category: "Engineering",
      fees: 165000,
      rating: 4.6,
      established: 1960,
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
      overview: "NITK Surathkal offers a beautiful coastal campus and stellar academic programs.",
      naacGrade: "A+",
      nirfRank: 12,
      placementAvgSalary: 1400000,
      placementHighestSalary: 4000000,
      placementPercent: 88,
      exam: 'JEE_MAIN',
      cutoffs: { General: [5000, 12000], OBC: [2000, 5000], SC: [1000, 2500] } // Tier 1-2
    },

    // JEE MAIN (NITs Tier 2)
    {
      name: "Visvesvaraya National Institute of Technology (VNIT)",
      location: "Nagpur",
      state: "Maharashtra",
      type: "Government",
      category: "Engineering",
      fees: 150000,
      rating: 4.4,
      established: 1960,
      imageUrl: "https://images.unsplash.com/photo-1627556592933-ffe99c1c9dd0?auto=format&fit=crop&q=80&w=800",
      overview: "VNIT Nagpur is a premier technical institution in Central India.",
      naacGrade: "A+",
      nirfRank: 41,
      placementAvgSalary: 1100000,
      placementHighestSalary: 3000000,
      placementPercent: 85,
      exam: 'JEE_MAIN',
      cutoffs: { General: [12000, 25000], OBC: [5000, 10000], SC: [2500, 5000] } // Tier 2 up to 25k
    },
    {
      name: "Delhi Technological University (DTU)",
      location: "New Delhi",
      state: "Delhi",
      type: "Government",
      category: "Engineering",
      fees: 210000,
      rating: 4.5,
      established: 1941,
      imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800",
      overview: "DTU is renowned for its excellent placement records and vibrant student life in Delhi.",
      naacGrade: "A",
      nirfRank: 29,
      placementAvgSalary: 1300000,
      placementHighestSalary: 6400000,
      placementPercent: 87,
      exam: 'JEE_MAIN',
      cutoffs: { General: [15000, 35000], OBC: [10000, 20000], SC: [5000, 15000] } // Tier 2
    },

    // JEE MAIN (Tier 3)
    {
      name: "National Institute of Technology (NIT) Agartala",
      location: "Agartala",
      state: "Tripura",
      type: "Government",
      category: "Engineering",
      fees: 140000,
      rating: 4.1,
      established: 2006,
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      overview: "NIT Agartala provides quality technical education with a growing infrastructure.",
      naacGrade: "B++",
      nirfRank: 91,
      placementAvgSalary: 700000,
      placementHighestSalary: 2200000,
      placementPercent: 75,
      exam: 'JEE_MAIN',
      cutoffs: { General: [35000, 60000], OBC: [20000, 35000], SC: [15000, 25000] } // Tier 3 >40k
    },
    {
      name: "Symbiosis Institute of Technology",
      location: "Pune",
      state: "Maharashtra",
      type: "Private",
      category: "Engineering",
      fees: 300000,
      rating: 4.0,
      established: 2008,
      imageUrl: "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&q=80&w=800",
      overview: "A reputed private engineering college in Pune known for industry connections.",
      naacGrade: "A",
      nirfRank: null,
      placementAvgSalary: 600000,
      placementHighestSalary: 1500000,
      placementPercent: 80,
      exam: 'JEE_MAIN',
      cutoffs: { General: [60000, 100000], OBC: [35000, 60000], SC: [25000, 50000] } // Tier 3
    },

    // MEDICAL (NEET)
    {
      name: "All India Institute of Medical Sciences (AIIMS) Delhi",
      location: "New Delhi",
      state: "Delhi",
      type: "Government",
      category: "Medical",
      fees: 6000,
      rating: 5.0,
      established: 1956,
      imageUrl: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&q=80&w=800",
      overview: "AIIMS Delhi is the most prestigious medical college and hospital in India.",
      naacGrade: "A++",
      nirfRank: 1,
      placementAvgSalary: 1800000,
      placementHighestSalary: 3500000,
      placementPercent: 100,
      exam: 'NEET',
      cutoffs: { General: [1, 50], OBC: [51, 150], SC: [100, 500] }
    },
    {
      name: "Christian Medical College (CMC) Vellore",
      location: "Vellore",
      state: "Tamil Nadu",
      type: "Private",
      category: "Medical",
      fees: 50000,
      rating: 4.8,
      established: 1900,
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      overview: "CMC Vellore is renowned for its excellence in medical education and healthcare services.",
      naacGrade: "A++",
      nirfRank: 3,
      placementAvgSalary: 1200000,
      placementHighestSalary: 2500000,
      placementPercent: 98,
      exam: 'NEET',
      cutoffs: { General: [51, 300], OBC: [151, 500], SC: [501, 1500] }
    },
    {
      name: "Grant Medical College (GMC) Mumbai",
      location: "Mumbai",
      state: "Maharashtra",
      type: "Government",
      category: "Medical",
      fees: 120000,
      rating: 4.6,
      established: 1845,
      imageUrl: "https://images.unsplash.com/photo-1538100657962-4b2072183c50?auto=format&fit=crop&q=80&w=800",
      overview: "One of the oldest premier medical institutions in Asia, located in South Mumbai.",
      naacGrade: "A",
      nirfRank: 15,
      placementAvgSalary: 1000000,
      placementHighestSalary: 2000000,
      placementPercent: 95,
      exam: 'NEET',
      cutoffs: { General: [1000, 5000], OBC: [2000, 8000], SC: [5000, 20000] }
    },

    // MANAGEMENT (CAT)
    {
      name: "Indian Institute of Management (IIM) Ahmedabad",
      location: "Ahmedabad",
      state: "Gujarat",
      type: "Government",
      category: "Management",
      fees: 2500000,
      rating: 4.9,
      established: 1961,
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
      overview: "IIM Ahmedabad is the gold standard for management education in India.",
      naacGrade: "A++",
      nirfRank: 1,
      placementAvgSalary: 3200000,
      placementHighestSalary: 11500000,
      placementPercent: 100,
      exam: 'CAT',
      cutoffs: { General: [1, 500], OBC: [1, 1000], SC: [1, 2000] } // For CAT, rank representation
    },
    {
      name: "Faculty of Management Studies (FMS) Delhi",
      location: "New Delhi",
      state: "Delhi",
      type: "Government",
      category: "Management",
      fees: 200000,
      rating: 4.8,
      established: 1954,
      imageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
      overview: "FMS provides one of the highest ROIs in management education globally.",
      naacGrade: "A+",
      nirfRank: null,
      placementAvgSalary: 3400000,
      placementHighestSalary: 8000000,
      placementPercent: 100,
      exam: 'CAT',
      cutoffs: { General: [500, 1500], OBC: [1000, 2500], SC: [2000, 4000] }
    },

    // LAW (CLAT)
    {
      name: "National Law School of India University (NLSIU)",
      location: "Bangalore",
      state: "Karnataka",
      type: "Government",
      category: "Law",
      fees: 350000,
      rating: 4.9,
      established: 1986,
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
      overview: "NLSIU Bangalore is consistently ranked as the top law school in India.",
      naacGrade: "A++",
      nirfRank: 1,
      placementAvgSalary: 1600000,
      placementHighestSalary: 4500000,
      placementPercent: 95,
      exam: 'CLAT',
      cutoffs: { General: [1, 100], OBC: [1, 500], SC: [1, 1000] }
    },
    {
      name: "NALSAR University of Law",
      location: "Hyderabad",
      state: "Telangana",
      type: "Government",
      category: "Law",
      fees: 320000,
      rating: 4.8,
      established: 1998,
      imageUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=800",
      overview: "NALSAR offers rigorous legal education and boasts exceptional corporate placements.",
      naacGrade: "A++",
      nirfRank: 3,
      placementAvgSalary: 1400000,
      placementHighestSalary: 3500000,
      placementPercent: 92,
      exam: 'CLAT',
      cutoffs: { General: [101, 300], OBC: [501, 1000], SC: [1001, 2500] }
    }
  ];

  for (const c of realColleges) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    await prisma.college.create({
      data: {
        name: c.name,
        slug: slug,
        location: c.location,
        state: c.state,
        type: c.type as any,
        category: c.category as any,
        fees: c.fees,
        rating: c.rating,
        established: c.established,
        imageUrl: c.imageUrl,
        overview: c.overview,
        naacGrade: c.naacGrade,
        nirfRank: c.nirfRank,
        placementAvgSalary: c.placementAvgSalary,
        placementHighestSalary: c.placementHighestSalary,
        placementPercent: c.placementPercent,
        courses: {
          create: [
            {
              name: c.category === 'Engineering' ? 'B.Tech Core' : c.category === 'Medical' ? 'MBBS' : c.category === 'Management' ? 'MBA' : 'BA LLB',
              duration: c.category === 'Medical' || c.category === 'Law' ? '5 Years' : c.category === 'Management' ? '2 Years' : '4 Years',
              fees: c.fees,
              seats: Math.floor(Math.random() * 100) + 60,
            }
          ]
        },
        reviews: {
          create: [
            {
              author: "Aditya Sharma",
              rating: c.rating,
              content: `Amazing experience at ${c.name}. The faculty is very supportive and placements are top-notch.`,
              batch: 2024
            },
            {
              author: "Priya Patel",
              rating: c.rating - 0.2,
              content: `The campus life is great, but academics are highly rigorous. Overall a 10/10 recommendation for ${c.category}.`,
              batch: 2023
            }
          ]
        },
        cutoffs: {
          create: Object.entries(c.cutoffs).map(([cat, range]) => ({
            exam: c.exam as any,
            category: cat,
            rankFrom: range[0],
            rankTo: range[1],
          }))
        }
      }
    });
  }

  console.log('Seeding completed successfully with real curated data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
