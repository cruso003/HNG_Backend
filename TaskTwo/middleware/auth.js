const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "WRorycNEfwjCAaeUsQkwWVrsGfOcoPWq";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorisation;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "No token provided"
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { userId: decoded.userId } });

    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid token"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: "Unauthorized",
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;
