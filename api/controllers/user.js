import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const getFriends = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT distinct r.followedUserId, u.id AS userId, name, profilePic
FROM relationships AS r
LEFT JOIN users AS u ON (r.followerUserId = ? AND u.id = r.followedUserId ) WHERE u.id != ?`;
    const values =
      userId !== "undefined" ? [userId, userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const findUser = (req, res) => {
  const name = req.params.name;
  const q = "SELECT * FROM users WHERE name=? LIMIT 5";

  db.query(q, [name], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getSearchedUsers = (req, res) => {
  const name = req.params.name;
  const q = "SELECT * FROM users WHERE name=?";
  db.query(q, [name], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getAllUser = (req, res) => {
  const userId = req.params.id;
  const q = "SELECT * FROM users WHERE id <> ? LIMIT 2";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

export const getRecommendUser = (req, res) => {
  const userId = req.params.id;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT u.id, u.name, u.profilePic
    FROM users AS u
    WHERE u.id NOT IN (
        SELECT followedUserId
        FROM relationships
        WHERE followerUserId = ?
    )
    AND u.id != ?`;
    const values =
      userId !== "undefined" ? [userId, userId] : [userInfo.id, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
