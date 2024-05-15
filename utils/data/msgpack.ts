"use server"
import { readFileSync } from "fs"
import { unpack } from "msgpackr"
import { ungzip } from "node-gzip"
/**
 * Reads a MessagePack file and returns its content as a JavaScript object.
 * @param {string} filePath - Path to the MessagePack file.
 * @returns {Promise<any>} A promise that resolves with the unpacked data.
 */
export async function readMsgPackFile<T extends any>(filePath: string, compressed: boolean = false) {
  const contents = readFileSync(filePath)
  const unpackedData = compressed ? unpack(await ungzip(contents)) : unpack(contents)
  return unpackedData as T
}

export async function readRemoteMsgPackFile<T extends any>(url: string, compressed: boolean = false) {
  const r = await fetch(url)
  const buffer = await r.arrayBuffer()
  const dataBuffer = Buffer.from(buffer)
  const unpackedData = compressed ? unpack(await ungzip(dataBuffer)) : unpack(dataBuffer)
  return unpackedData as T
}