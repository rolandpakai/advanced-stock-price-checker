import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClient = new PrismaClient()
  .$extends(withAccelerate());

export default prismaClient;
