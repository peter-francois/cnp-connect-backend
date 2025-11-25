import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

async function resetIfNeeded() {
  const countLines = await prisma.line.count();
  const countTrains = await prisma.train.count();
  const assignedLine = await prisma.assignedLine.count();
  const assignedTrain = await prisma.assignedTrain.count();
  const countUsers = await prisma.user.count();

  if (
    countLines > 0 ||
    countTrains > 0 ||
    countUsers ||
    assignedLine ||
    assignedTrain > 0
  ) {
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE Train;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE Line;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE User;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE AssignedLine;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE AssignedTrain;`);
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
}

async function main() {
  await resetIfNeeded();
  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
  ];

  const password: string = await argon2.hash("Password123!");

  for (let i = 0; i < letters.length; i++) {
    await prisma.line.create({
      data: {
        name: `${letters[i]}`,
      },
    });
  }

  for (let i = 0; i < 50; i++) {
    await prisma.train.create({
      data: {
        name: `Train ${i + 1}`,
        lineId: Math.floor(Math.random() * letters.length) + 1,
      },
    });
  }

  await prisma.user.create({
    data: {
      email: "nicolassam33@gmail.com",
      password: password,
      firstName: "Nicolas",
      lastName: "Sam",
      role: "COORDINATOR",
      status: "CONFIRMED",
      avatarUrl: faker.image.avatar(),
      hiredAt: new Date(),
      assignedLines: {
        create: [
          { lineId: 1, assignmentStartDate: new Date() },
          { lineId: 2, assignmentStartDate: new Date() },
          { lineId: 3, assignmentStartDate: new Date() },
          { lineId: 4, assignmentStartDate: new Date() },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "claireroyer57@gmail.com",
      password: password,
      firstName: "Claire",
      lastName: "Royer",
      role: "COORDINATOR",
      avatarUrl: faker.image.avatar(),
      hiredAt: new Date(),
      assignedLines: {
        create: [
          { lineId: 5, assignmentStartDate: new Date() },
          { lineId: 6, assignmentStartDate: new Date() },
          { lineId: 7, assignmentStartDate: new Date() },
          { lineId: 8, assignmentStartDate: new Date() },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "furty51@hotmail.fr",
      password: password,
      firstName: "Peter",
      lastName: "Francois",
      role: "COORDINATOR",
      avatarUrl: faker.image.avatar(),
      hiredAt: new Date(),
      assignedLines: {
        create: [
          { lineId: 9, assignmentStartDate: new Date() },
          { lineId: 10, assignmentStartDate: new Date() },
          { lineId: 11, assignmentStartDate: new Date() },
          { lineId: 12, assignmentStartDate: new Date() },
        ],
      },
    },
  });

  for (let i = 0; i < 30; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: password,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: "DRIVER",
        avatarUrl: faker.image.avatar(),
        hiredAt: new Date(),
        assignedTrains: {
          create: [{ trainId: i + 1, assignmentStartDate: new Date() }],
        },
      },
    });
  }

  const Lines = await prisma.line.findMany();

  for (let i = 0; i < 2; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: password,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: "SUPERVISOR",
        avatarUrl: faker.image.avatar(),
        hiredAt: new Date(),
        assignedLines: {
          create: Lines.map((line) => ({
            lineId: line.id,
            assignmentStartDate: new Date(),
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
