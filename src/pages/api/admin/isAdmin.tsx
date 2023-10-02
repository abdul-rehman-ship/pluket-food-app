import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2/promise';

const dbConfig: any = {
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function queryDatabase(sql: string, params?: any[]) {
  const connection = await createConnection(dbConfig);
  const [rows]:any = await connection.execute(sql, params);
  connection.end();
  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method==='POST'){
        
        try {
            const admin_key = await queryDatabase(`SELECT * FROM admin `);
            
              
            
            res.status(200).json({admin_key:admin_key[0].key});
          } catch (error) {
            console.error(error);
            res.status(500).end(); 
          }
    
      }
}