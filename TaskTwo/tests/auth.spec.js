const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany(); // Clear users before starting tests
  await prisma.organisation.upsert({
    where: { orgId: 'jV8T1MGn99oePf3vPkx9qaxtpxo3TiOr' },
    update: {},
    create: { name: 'Default Organisation' }
  });
  
});

afterAll(async () => {
  await prisma.$disconnect();
});


describe('Auth Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a user successfully with default organisation', async () => {
      const firstName = 'John';
      const lastName = 'Doe';
      const email = 'john.doe@example.com';
      const password = 'password';
      const phone = '1234567890';

      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName,
          lastName,
          email,
          password,
          phone
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).toMatchObject({
        firstName,
        lastName,
        email,
        phone
      });

      // Verify default organization name dynamically
      const expectedOrgName = `${firstName}'s Organisation`;
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organisations: true }
      });
      expect(user).toBeDefined();
      expect(user.organisations.length).toBe(1);
      expect(user.organisations[0].name).toBe(expectedOrgName);
    },10000);

    it('should fail registration if firstName is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          phone: '1234567890'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual([
        { field: "firstName", message: "First name is required" }
      ]);
    });

    it('should fail registration if lastName is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          email: 'john.doe@example.com',
          password: 'password',
          phone: '1234567890'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual([
        { field: "lastName", message: "Last name is required" }
      ]);
    });

    it('should fail registration if email is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: 'password',
          phone: '1234567890'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual([
        { field: "email", message: "Email is required" }
      ]);
    });

    it('should fail registration if password is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual([
        { field: "password", message: "Password is required" }
      ]);
    });

    it('should fail if email already exists', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          phone: '1234567890'
        });

      // Duplicate registration
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          phone: '0987654321'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('message', 'Registration unsuccessful, user already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          phone: '1234567890'
        });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'password'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).toMatchObject({
        email: 'john.doe@example.com'
      });
    });

    it('should fail login if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toEqual([
        { field: "password", message: "Password is required" }
      ]);
    });

    it('should fail if authentication fails', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('status', 'Unauthorized');
      expect(res.body).toHaveProperty('message', 'Authentication failed');
    });
  });
});
