const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        organisations: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal server error",
      message: "Could not retrieve user"
    });
  }
};

module.exports = {
  getUserById
};
