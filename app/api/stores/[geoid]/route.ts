// "use server"
// import path from "path";
// import { ParquetReader } from "@dsnp/parquetjs"

export type ReqParams = {
  params: {
    geoid: string
  }
}

// const dataPath = path.join(process.cwd(), "public", "data");
// const storePath = path.join(dataPath, "___grocery_store_sales.parquet");

// const loadParquet = async (path:string) => {
  
//   try {
//     const t0 = performance.now();
//     console.log('reading file')
//     // const r = readFileSync(path);
//     let reader = await ParquetReader.openFile(path);

//     // create a new cursor
//     let i =0
//     let cursor = reader.getCursor();
//     // read all records from the file and print them
//     let record = null;
//     while (record = await cursor.next() && i < 10) {
//       i ++;
//       console.log(record);
//     }
//     return null
//   } catch (error) {
//     console.log("Error reading file")
//     console.error(error);
//     return null;
//   }
// }

export async function GET(request: Request, reqParams: ReqParams) {
  const geoid = reqParams.params.geoid
  // const data = await loadParquet(storePath);
  // console.log(data)
  return new Response(`${geoid}`, {})
}