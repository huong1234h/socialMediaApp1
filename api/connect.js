import mysql from "mysql";

export const db = mysql.createConnection({
  host: "social.cd6ck8ggant5.us-west-1.rds.amazonaws.com",
  port:"3306",
  user: "social",
  password: "30042002hH*",
  database: "social"
});