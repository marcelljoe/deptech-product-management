import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
});

export async function exeQuery(query: string, values: any[]): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await db.query(query, values);
      await db.end();
      resolve(results);
    } catch (error) {
      console.log(error);

      reject({ error });
    }
  });

  // export async function exeQuery(query: string, values: any[]) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const results = await db.query(query, values);
  //       await db.end();
  //       resolve(results);
  //     } catch (error) {
  //       reject({ error });
  //     }
  //   });
  // try {
  //     const results = await db.query(query, values);
  //     await db.end();
  //     return results;
  // } catch (error) {
  //     return { error };
  // }
}
