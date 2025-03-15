import ImageKit from "imagekit";
import dummyBooks from "../dummybooks.json";
// import { db } from "./drizzle";
import { books } from "./schema";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({
    path:".env.local"
})

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({client:sql});


const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEy!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName: fileName,
      folder: folder,
    });
    return response.filePath;
  } catch (error) {
    console.log("Error uploading image to iMageKit", error);
  }
};
const seed = async () => {
  console.log("Sending data...");

  try {
    for (const book of dummyBooks) {

        
      const coverUrl = await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/covers"
      ) as string;


      const videoUrl = await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        "/books/video"
      ) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      })
    }

    console.log("data seeded successfully /...");
    
    
  } catch (error) {
    console.error("Error sending data: ", error);
  }
};


seed();