import moment from "moment";
import { db } from "../connect.js";

export const sendMessage = (req,res) =>{
    const q = "INSERT INTO messages (`sendUserId`,`receiveUserId`,`contentMessage`,`zoomId`,`createAt`) VALUE (?)";
    const values = [
        req.body.sendUserId,
        req.body.receiveUserId,
        req.body.contentMessage,
        req.body.zoomId,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q,[values],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Message has been sended!");
    });
}

export const getAllMessages = (req,res)=>{
    const zoomId = req.params.zoomId ;
    const q = "SELECT * FROM messages WHERE zoomId = ?";
    db.query(q,[zoomId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}



