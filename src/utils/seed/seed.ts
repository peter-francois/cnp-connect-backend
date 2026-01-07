import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
const prisma = new PrismaClient();

async function resetIfNeeded() {
  const countLines = await prisma.line.count();
  const countTrains = await prisma.train.count();
  const assignedLine = await prisma.assignedLine.count();
  const countUsers = await prisma.user.count();
  const countTravels = await prisma.travel.count();
  const countTrainTravels = await prisma.trainTravel.count()

  if (
    countLines > 0 ||
    countTrains > 0 ||
    countUsers ||
    assignedLine ||
    countTravels > 0 ||
    countTrainTravels > 0
  ) {
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE Train;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE Line;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE User;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE Travel;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE TrainTravel;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE AssignedLine;`);
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

  const lines = [
    {
      ligne: 1,
      aller: "La Défense",
      retour: "Château de Vincennes",
    },
    {
      ligne: 2,
      aller: "Porte Dauphine",
      retour: "Nation",
    },
    {
      ligne: 3,
      aller: "Pont de Levallois - Bécon",
      retour: "Gallieni",
    },
    {
      ligne: 4,
      aller: "Gambetta",
      retour: "Porte des Lilas",
    },
    {
      ligne: 5,
      aller: "Porte de Clignancourt",
      retour: "Bagneux-Lucie Aubrac",
    },
    {
      ligne: 6,
      aller: "Place d'Italie",
      retour: "Bobigny - Pablo Picasso",
    },
    {
      ligne: 7,
      aller: "Charles de Gaulle - Étoile",
      retour: "Nation",
    },
    {
      ligne: 8,
      aller: "Villejuif - Louis Aragon",
      retour: "La Courneuve - 8 Mai 1945",
    },
    {
      ligne: 9,
      aller: "Louis Blanc",
      retour: "Pré-Saint-Gervais",
    },
    {
      ligne: 10,
      aller: "Balard",
      retour: "Créteil (Pointe du Lac)",
    },
    {
      ligne: 11,
      aller: "Mairie de Montreuil",
      retour: "Pont de Sèvres",
    },
    {
      ligne: 12,
      aller: "Gare d'Austerlitz",
      retour: "Boulogne - Pont de Saint-Cloud",
    },
    {
      ligne: 13,
      aller: "Châtelet",
      retour: "Mairie des Lilas",
    },
    {
      ligne: 14,
      aller: "Mairie d'Aubervilliers",
      retour: "Mairie d'Issy",
    },
    {
      ligne: 15,
      aller: "Saint-Denis - Université",
      retour: "Châtillon - Montrouge",
    },
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
      },
    });
  }

  await prisma.user.create({
    data: {
      email: "nicolassam33@gmail.com",
      password: password,
      firstName: "Nicolas",
      lastName: "Sam",
      role: "SUPERVISOR",
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
      status: "CONFIRMED",
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
      role: "DRIVER",
      status: "CONFIRMED",
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

  for (let i = 0; i < letters.length; i++) {
    await prisma.travel.createMany({
      data: {
        stationOne: lines[i].aller,
        stationTwo: lines[i].retour,
        duration: Math.floor(Math.random() * 30) + 30,
        lineId: lines[i].ligne,
      },
    });
    await prisma.travel.create({
      data: {
        stationOne: lines[i].retour,
        stationTwo: lines[i].aller,
        duration: Math.floor(Math.random() * 30) + 30,
        lineId: lines[i].ligne,
      },
    });
  }

  const travels = await prisma.travel.findMany();
  const drivers = await prisma.user.findMany({ where: { role: "DRIVER" } });
  const trains = await prisma.train.findMany();

  const now = new Date();

  for (let i = 0; i < drivers.length; i++) {
    // -------- ALLER --------
    const travelAller = travels[Math.floor(Math.random() * travels.length)];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const train = trains[travelAller.lineId];

    const startAller = new Date(
      now.getTime() + Math.floor(Math.random() * 24 * 60) * 60 * 1000,
    );

    await prisma.trainTravel.create({
      data: {
        userId: driver.id,
        trainId: train.id,
        travelId: travelAller.id,
        startTime: startAller,
      },
    });

    // -------- RETOUR --------
    const travelRetour = travels.find(
      (t) =>
        t.stationOne === travelAller.stationTwo &&
        t.stationTwo === travelAller.stationOne &&
        t.lineId === travelAller.lineId,
    );

    if (!travelRetour) continue;

    const startRetour = new Date(
      startAller.getTime() + (travelAller.duration + 10) * 60 * 1000, // durée + pause 10 min
    );

    await prisma.trainTravel.create({
      data: {
        userId: driver.id,
        trainId: train.id,
        travelId: travelRetour.id,
        startTime: startRetour,
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
