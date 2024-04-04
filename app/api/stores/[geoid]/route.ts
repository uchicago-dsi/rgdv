"use server"
import path from "path";
import fs from "fs";
import { unpack } from 'msgpackr';

export type ReqParams = {
  params: {
    geoid: string
  }
}

const isochorones: Record<string, Record<string, {geometry:any}>> = {}

const getIsochrone = async (geoid: string) => {
  const state =  geoid.slice(0, 2)
  if (isochorones[state] === undefined) {
    const isochroneFile = path.join(process.cwd(), "public", "data", "isochrones", `isochrones${state}.msgpack`)
    const buffer = fs.readFileSync(isochroneFile)
    let data = unpack(buffer);
    isochorones[state] = data
  }
  return isochorones[state]![geoid]
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
  if (!geoid || geoid == 'null') {
    return new Response("Not found", { status: 404 });
  }
  const data = await getIsochrone(geoid);
  // console.log(data)
  // @ts-ignore
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  })
}