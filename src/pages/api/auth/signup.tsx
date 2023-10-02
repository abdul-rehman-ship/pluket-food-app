import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {name, email, password } = req.body;
  const _id=new Date().getTime().toString()

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if the email already exists
    const [rows]:any = await db.query(
      'SELECT _id FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create a new user
    await db.query('INSERT INTO user (_id, name,email,password) VALUES (?, ?, ?, ?)', [
      _id,
      name,
      email,
      password,
    ]);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
