import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const types = ['Government', 'Private', 'Deemed'] as const;
const categories = ['Engineering', 'Medical', 'Management', 'Law', 'Arts'] as const;
const exams = ['JEE_MAIN', 'JEE_ADV', 'NEET', 'CAT', 'CLAT', 'CUET'] as const;
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat'];

async function main() {
  console.log('Clearing existing data...');
  await prisma.cutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  console.log('Seeding 50 colleges...');
  
  for (let i = 0; i < 50; i++) {
    const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    let collegeName = faker.company.name() + ' Institute of ' + category;
    
    const college = await prisma.college.create({
      data: {
        name: collegeName,
        slug: faker.helpers.slugify(collegeName).toLowerCase() + '-' + faker.string.alphanumeric(4),
        location: faker.location.city(),
        state: states[faker.number.int({ min: 0, max: states.length - 1 })],
        type: types[faker.number.int({ min: 0, max: types.length - 1 })],
        category: category,
        fees: faker.number.int({ min: 50000, max: 2500000 }),
        rating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
        established: faker.number.int({ min: 1950, max: 2020 }),
        imageUrl: `https://picsum.photos/seed/${i}/800/600`,
        overview: faker.lorem.paragraphs(3),
        website: faker.internet.url(),
        naacGrade: faker.helpers.arrayElement(['A++', 'A+', 'A', 'B++', 'B+', 'B', null]),
        nirfRank: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 200 }), { probability: 0.7 }),
        placementAvgSalary: faker.number.int({ min: 400000, max: 2000000 }),
        placementHighestSalary: faker.number.int({ min: 2500000, max: 10000000 }),
        placementPercent: faker.number.float({ min: 70, max: 100, fractionDigits: 1 }),
        courses: {
          create: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).map(() => ({
            name: faker.person.jobArea() + ' ' + (category === 'Engineering' ? 'B.Tech' : category === 'Medical' ? 'MBBS' : 'Degree'),
            duration: faker.helpers.arrayElement(['3 Years', '4 Years', '5 Years']),
            fees: faker.number.int({ min: 40000, max: 2000000 }),
            seats: faker.number.int({ min: 30, max: 240 }),
          }))
        },
        reviews: {
          create: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => ({
            author: faker.person.fullName(),
            rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
            content: faker.lorem.paragraph(),
            batch: faker.number.int({ min: 2020, max: 2026 }),
          }))
        },
        cutoffs: {
          create: Array.from({ length: 3 }).map(() => {
            const rankFrom = faker.number.int({ min: 100, max: 10000 });
            return {
              exam: exams[faker.number.int({ min: 0, max: exams.length - 1 })],
              category: faker.helpers.arrayElement(['General', 'OBC', 'SC', 'ST']),
              rankFrom: rankFrom,
              rankTo: rankFrom + faker.number.int({ min: 1000, max: 15000 }),
            };
          })
        }
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
