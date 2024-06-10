import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getRelationships = (req,res)=>{
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    });
}

export const getNumberFollower = (req,res)=>{
  const userId = req.params.userId;
  const q  = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;
  db.query(q,[userId],(err,data)=>{
    if(err) return res.status(500).json(err);
    return res.status(200).json(data);
  })
}

export const getNumberFollowed = (req,res)=>{
  const userId = req.params.userId;
  const q  = `SELECT followedUserId FROM relationships WHERE followerUserId = ?`;
  db.query(q,[userId],(err,data)=>{
    if(err) return res.status(500).json(err);
    return res.status(200).json(data);
  })
}




export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};