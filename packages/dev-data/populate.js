import fs from "fs/promises";

import { faker } from "@faker-js/faker";

function createUsers() {
  const users = Array.from({ length: 100 }, (_, i) => {
    const user = {
      id: faker.database.mongodbObjectId(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      createdAt: faker.date.recent(),
      about: faker.lorem.sentence({ max: 20 }),
    };

    const name = user.fullName.split(" ");
    user.username = faker.internet
      .displayName({
        firstName: name[0],
        lastName: name[1],
      })
      .toLowerCase();

    return user;
  });

  return users;
}

function createSpaces(users) {
  const spaces = Array.from({ length: 10 }, (_, i) => {
    const space = {
      id: faker.database.mongodbObjectId(),
      name: faker.lorem.word(),
      avatar: faker.image.avatar(),
      createdAt: faker.date.recent(),
      description: faker.lorem.sentence({ max: 20 }),
    };

    space.members = users
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 10))
      .map((user) => user.id);

    return space;
  });

  return spaces;
}

function createRooms(spaces) {
  const names = [
    "General",
    "Random",
    "Off-topic",
    "Watercooler",
    "Lobby",
    "Main",
    "Lounge",
    "Lunchroom",
    "Breakroom",
    "Cafeteria",
    "Boardroom",
    "Meeting",
    "Conference",
    "Chat",
  ];
  const rooms = Array.from({ length: 40 }, (_, i) => {
    const room = {
      id: faker.database.mongodbObjectId(),
      name: names[Math.floor(Math.random() * names.length)],
      icon: faker.internet.emoji(),
      createdAt: faker.date.recent(),
    };

    room.space = spaces[Math.floor(Math.random() * spaces.length)].id;

    // add radom members from the room's space
    const space = spaces.find((space) => space.id === room.space);
    room.members = space.members
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5));

    return room;
  });

  return rooms;
}

function createMessages(users, rooms) {
  const messages = Array.from({ length: 1000 }, (_, i) => {
    const message = {
      id: faker.database.mongodbObjectId(),
      text: faker.lorem.sentence({ max: 20 }),
      createdAt: faker.date.recent(),
    };

    message.author = users[Math.floor(Math.random() * users.length)].id;
    message.room = rooms[Math.floor(Math.random() * rooms.length)].id;

    return message;
  });

  return messages;
}

async function main() {
  const users = createUsers();
  const spaces = createSpaces(users);
  const rooms = createRooms(spaces);
  const messages = createMessages(users, rooms);

  await fs.writeFile(
    "./data.json",
    JSON.stringify({ users, spaces, rooms, messages }, null, 2)
  );
}

main();
