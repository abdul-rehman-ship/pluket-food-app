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
  const [rows, fields]:any = await connection.execute(sql, params);
  connection.end();
  return rows;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
        const products = await queryDatabase('SELECT * FROM products');
        res.status(200).json({"total":products?.length,products});
      } catch (error) {
        console.error(error);
        res.status(500).end(); 
      }
  }
  if(req.method==='POST'){
    const {id}=req.body
    
    
    
    try {
        const products = await queryDatabase(`SELECT * FROM products WHERE _id='${id}'`);
        res.status(200).json({"total":products?.length,products});
      } catch (error) {
        console.error(error);
        res.status(500).end(); 
      }

  }


}

  
