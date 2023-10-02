import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, oldPassword, newPassword } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if the user with the given email exists
    const [rows]: any = await db.query(
      'SELECT _id, password FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the old password matches the one in the database
    if (oldPassword !== rows[0].password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update the password for the user with the new password
    await db.query('UPDATE user SET password = ? WHERE email = ?', [
      newPassword,
      email,
    ]);

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
