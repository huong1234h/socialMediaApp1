import { db } from "../connect.js";

export const addConversations = (req,res)=>{
    const att1Id = req.body.att1Id;
    const att2Id = req.body.att2Id;

    const q = "SELECT * FROM conversations WHERE attendant1 = ? AND attendant2 = ?" ;
    db.query(q,[att1Id,att2Id],(err,data)=>{
        if(err) return res.status(500).json.err;
        if(data.length) return res.status(200).json(data) ;

        const q = "INSERT INTO conversations (`attendant1` , `attendant2`) VALUE (?)";
        const value = [
            att1Id,
            att2Id,
        ];
        db.query(q,[value],(err,data)=>{
            if(err) return res.status(500).json(err);
            const q = "SELECT * FROM conversations WHERE attendant1 = ? AND attendant2 = ?" ;
            db.query(q,[att1Id,att2Id],(err,data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json(data);
            })
        });
    });
};

export const getConversations = (req,res)=>{
    const userId = req.params.userId ;
    const q = "SELECT * FROM conversations WHERE attendant1 = ? OR attendant2 = ?";
    db.query(q,[userId,userId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
}




