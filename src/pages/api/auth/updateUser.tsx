import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, username } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    
    const [rows]: any = await db.query(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ user: 'Invalid email or password' });
    }

    
    await db.query('UPDATE user SET name = ? WHERE email = ?', [username, email]);

    
    const [updatedRows]: any = await db.query(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    return res.status(200).json({ user: updatedRows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
