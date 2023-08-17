import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }
  
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      //1. we are going to load every conversation that has currentUser.Id
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      //2. populate field, and populating properties in properties
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          }
        },
      }
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
