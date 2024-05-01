import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  port:"3306",
  user: "root",
  password: "123456789",
  database: "social",
  charset: 'utf8mb4',
});