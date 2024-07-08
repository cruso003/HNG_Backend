const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || "WRorycNEfwjCAaeUsQkwWVrsGfOcoPWq";

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

 // Check if required fields are missing
 const errors = [];
 if (!firstName) errors.push({ field: "firstName", message: "First name is required" });
 if (!lastName) errors.push({ field: "lastName", message: "Last name is required" });
 if (!email) errors.push({ field: "email", message: "Email is required" });
 if (!password) errors.push({ field: "password", message: "Password is required" });
 if (!phone) errors.push({ field: "phone", message: "Phone is required" });

 if (errors.length > 0) {
   return res.status(422).json({ status: "Bad request", errors });
 }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        status: 'Bad request',
        message: 'Registration unsuccessful, user already exists'
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, phone });

    // Assign user to default organisation
    const organisation = await Organisation.findOne({ where: { name: 'Default Organisation' } });
    if (!organisation) {
      return res.status(422).json({
        status: 'Bad request',
        message: 'Registration unsuccessful, default organisation not found'
      });
    }
    await user.addOrganisation(organisation);

    // Generate JWT
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      status: 'success',
      data: {
        accessToken: token,
        user
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Internal server error',
      message: 'Registration unsuccessful'
    });
  }
};




const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      errors: [
        ...(email ? [] : [{ field: "email", message: "Email is required" }]),
        ...(password ? [] : [{ field: "password", message: "Password is required" }])
      ]
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Authentication failed",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Authentication failed",
      });
    }

    const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal server error",
      message: "Login unsuccessful",
    });
  }
};

module.exports = {
  register,
  login
};
