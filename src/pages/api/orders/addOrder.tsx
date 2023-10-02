import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const{_id,userEmail,productId,amount,paymentMethod,shippingAddress,total,paid_status,date}=req.body


      
      await db.query('INSERT INTO orders (_id,productId,amount,paymentMethod,shippingAddress,total,paid_status,date,userEmail) VALUES (?, ?, ?, ?,?, ?, ?, ?,?)', [
        _id,productId,amount,paymentMethod,shippingAddress,total,paid_status,date,userEmail
      ]);
      return res.json({ message: 'Order placed successfully' });


} catch (error:any) {
    return res.status(500).json({ message: 'Internal server error',error:error });


    
}

}