import jwt from 'jsonwebtoken';
import moment from 'moment';
import { db } from '../connect.js';


export const broadcastNotification = (req,res)=>{
    const q = "INSERT INTO notifications (`senderId`,`receiverId`,`type`,`createAt`) VALUE (?)";
    const values = [
        req.body.senderId,
        req.body.receiverId,
        req.body.type,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q,[values],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Notification has been sended!");
    });
};

export const getNotifications = (req,res)=>{
    const userId = req.params.userId;
    const q = `SELECT n.*, u.id AS userId, name, profilePic FROM notifications AS n JOIN users AS u ON (u.id = n.senderId)
    WHERE n.receiverId = ? ORDER BY n.createAt DESC
    `;
    db.query(q,[userId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const deleteNotification = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM notifications WHERE `id`=? AND `receiverId` = ?"; ;
        db.query(q,[req.params.id, userInfo.id],(err,data)=>{
            if(err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Notification has been seen!");
        })
    })
}