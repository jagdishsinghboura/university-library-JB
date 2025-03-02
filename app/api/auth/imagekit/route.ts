import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

if (!config || !config.env || !config.env.imagekit) {
  throw new Error("ImageKit configuration is missing!");
}


const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

console.log(publicKey);
console.log(privateKey);
console.log(urlEndpoint);
const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  
  return NextResponse.json(imagekit.getAuthenticationParameters());
}