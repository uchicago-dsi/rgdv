"use client"
import {ungzip} from 'pako';
import { unpack } from "msgpackr"
import { useEffect, useRef, useState } from 'react';
import { MemoryMonitor } from 'components/dev/MemoryMonitor';
import Dexie from 'dexie';

async function fetchAndUnzip(url: string) {
  try {
      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }

      // Retrieve the data as a Blob
      const blob = await response.blob();

      // Use FileReader to read the blob as an ArrayBuffer
      const buffer = await blob.arrayBuffer();

      // Use pako to decompress the data
      const decompressed = ungzip(new Uint8Array(buffer));

      // Handle the uncompressed data
      return decompressed;
  } catch (error) {
      console.error('There was an error:', error);
  }
}

async function getMsgpack(url:string, compressed:boolean){
  const t0 = performance.now()
  const data = compressed ? await fetchAndUnzip(url) : await fetch(url)
  console.log('fetched in', performance.now() - t0, 'ms')
  const unpacked = unpack(data)
  console.log('unpacked in', performance.now() - t0, 'ms')
  return unpacked
}

let staticValues: any  = []

// Function to transform the 2D array into a list of objects
function transformArrayToObject(data: any[][], keys: string[]) {
  return data.map(subArray => {
      let obj = {};
      subArray.forEach((item, index) => {
          if (index < keys.length) { // Make sure the index exists in the keys array
            // @ts-ignore
              obj[keys[index]] = item;
          }
      });
      return obj;
  });
}

export default function Playground() {
  // useEffect(() => {
  //   const main = async () => {
  //     console.log('Fetching data...')
  //     const data = await getMsgpack('/data/tract_full.min.msgpack.gz', true)
  //     const tobjectify = performance.now()
  //     const outData = []
  //     const idbKeys = []
  //     const columns = data.columns
  //     console.log(columns)
  //     const keys = Object.keys(columns)
  //     for (let i = 1; i < keys.length; i++) {
  //       const row = data[keys[i]]
  //       if (!row) {
  //         console.log('No data for', keys[i], row)
  //         continue
  //       }
  //       idbKeys.push(row[0])
  //       const obj = {}
  //       for (let j = 0; j < columns.length; j++) {
  //         const column = columns[j]
  //         obj[column] = row[j]
  //         outData.push(obj)
  //       }
  //     }

  //     const tDexie = performance.now()

  //     const db = new Dexie('MyDatabase');
  //     console.log(data.columns.map((c:string) => `"${c}"`).join(','))
  //     db.version(1).stores({
  //         tracts: data.columns.map((c:string) => `"${c}"`).join(',')
  //     })
  //     console.log('Dexie loaded')
  //     db.tracts.bulkAdd(outData, idbKeys).then(function(lastKey: any) {
  //         console.log("Done adding 100,000 raindrops all over the place");
  //         console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
  //     }).catch(Dexie.BulkError, function (e) {
  //         // Explicitly catching the bulkAdd() operation makes those successful
  //         // additions commit despite that there were errors.
  //         console.error ("Some raindrops did not succeed. However, " +
  //           100000-e.failures.length + " raindrops was added successfully");
  //     });
  //     console.log('Transformed in', performance.now() - tDexie, 'ms')
  //     // const res = alasql.queryArray('SELECT "GEOID"',[staticValues]);
  //     // console.log('Query took', performance.now() - t0, 'ms')
  //     // console.log(res)
  //     // const tQuery = performance.now()
  //     // const res = alasql('SELECT * FROM ? LIMIT 10',[staticValues]);
  //     // console.log(res);
  //     // console.log('Query took', performance.now() - tQuery, 'ms')
  //   }
  //   main()
  // },[])

return <div>
    <MemoryMonitor />
    <h1>Playground</h1>
  </div>
}