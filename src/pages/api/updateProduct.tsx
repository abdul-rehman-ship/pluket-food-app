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

  if(req.method==='POST'){
    const {_id,stock}=req.body
    try {
        // update stock in product
        await queryDatabase(`UPDATE products SET stock='${stock}' WHERE _id='${_id}'`);
        res.status(200).json({msg:"updated"});
      } catch (error) {
        console.error(error);
        res.status(500).end(); 
      }

  }


}

  
