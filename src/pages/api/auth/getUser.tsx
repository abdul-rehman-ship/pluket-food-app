import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if the user with the given email exists
    const [rows]:any = await db.query(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ user: 'Invalid email or password' });
    }

    
    

   
    
    return res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
