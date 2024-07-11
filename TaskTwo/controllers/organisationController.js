const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Organisation name is required",
      statusCode: 400,
      errors: [{ field: "name", message: "Organisation name is required" }]
    });
  }

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name,
        description
      }
    });

    return res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: organisation
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400
      });
    }
    return res.status(500).json({
      status: "Internal server error",
      message: "Organisation creation unsuccessful"
    });
  }
};


const getUserOrganisations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userWithOrganisations = await prisma.user.findUnique({
      where: { userId },
      include: { organisations: true }
    });

    if (!userWithOrganisations) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found"
      });
    }

    const organisations = userWithOrganisations.organisations.map(org => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description || ''
    }));

    return res.status(200).json({
      status: "success",
      message: "User organisations retrieved successfully",
      data: {
        organisations
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal server error",
      message: "Could not retrieve organisations"
    });
  }
};


const getOrganisation = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await prisma.organisation.findUnique({
      where: { orgId }
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description || ''
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal server error",
      message: "Could not retrieve organisation"
    });
  }
};


const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await prisma.organisation.update({
      where: { orgId },
      data: {
        users: {
          connect: { userId }
        }
      }
    });

    return res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
      data: organisation
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal server error",
      message: "Could not add user to organisation"
    });
  }
};

module.exports = {
  createOrganisation,
  getUserOrganisations,
  getOrganisation,
  addUserToOrganisation
};