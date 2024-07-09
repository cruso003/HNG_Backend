import pg from 'pg';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://default:dHuMgma5t3eX@ep-shy-truth-a4ziuvid-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require', {
  dialectModule: pg
});

module.exports = sequelize;
