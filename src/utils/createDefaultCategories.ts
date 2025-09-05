import prisma from "./prismaClient";

export async function createDefaultCategories(userId: string) {
  const defaults = ["Inbox", "Education", "Work", "Home"];

  await prisma.category.createMany({
    data: defaults.map(name => ({
      name,
      userId
    })),
  });
}
