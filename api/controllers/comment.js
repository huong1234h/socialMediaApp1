import jwt from "jsonwebtoken";
import moment from "moment";
import { db } from "../connect.js";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic,
  (SELECT COUNT(*) FROM comments c2 WHERE c2.parentId = c.id) AS reply_count
FROM comments AS c
JOIN users AS u ON (u.id = c.userId)
WHERE c.postId = ?  AND c.parentId IS NULL
ORDER BY c.createdAt DESC;
    `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getReplyComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic,
  (SELECT COUNT(*) FROM comments c2 WHERE c2.parentId = c.id) AS reply_count
FROM comments AS c
JOIN users AS u ON (u.id = c.userId)
WHERE c.parentId =?
ORDER BY c.createdAt DESC;`;
db.query(q, [req.query.commentId], (err, data) => {
  if (err) return res.status(500).json(err);
  return res.status(200).json(data);
});
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const addReplyComment = (req,res)=>{
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`,`parentId`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
      req.body.parentId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
}

export const updateComment = (req,res)=>{
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("Token is not valid!");
    const q = "UPDATE comments SET `desc` = ?,`updatedAt`= ? WHERE `id`=? AND `userId` = ?";
    db.query(q,
    [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.commentId,
      userInfo.id,
    ],
    (err,data)=>{
      if(err) res.status(500).json(err);
      if(data.affectedRows > 0) return res.json("Comment has been updated!");
      return res.status(403).json("You can update only your comment!")
    })
  })
}

export const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

   
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";
    
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};
