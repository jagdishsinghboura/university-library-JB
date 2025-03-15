import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import Bookvideo from "@/components/Bookvideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;

  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.5]">
            <section className="flex flex-col gap-7">
                <h3>video</h3>
                <Bookvideo videoUrl={bookDetails.videoUrl}/>
            </section>
            <section className="mt-10 flex flex-col gap-7">
                <h3>summary</h3>
                <div className="spac-y-5 text-xl text-light-100">
                    {bookDetails.summary.split("\n").map((line, i)=>(
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </section>
        </div>

      </div>
    </>
  );
};

export default page;
