import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method==="GET"){
    try {
      const db = await mysql.createConnection({
        host: process.env.DB_HOST ,
        user: process.env.DB_USER ,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        });
        const orders=   await db.query(`SELECT * FROM orders`);
        return res.json({ orders:orders[0] });
    } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error });
      
    }
 
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      });
      const{userEmail}=req.body


      
   const orders=   await db.query(`SELECT * FROM orders WHERE userEmail='${userEmail}'`);
      return res.json({ orders:orders[0] });


} catch (error:any) {
    return res.status(500).json({ message: 'Internal server error',error:error });


    
}

}