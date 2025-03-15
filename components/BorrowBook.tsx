"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const route = useRouter();

  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (!isEligible) {
      toast(message);
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });
      if (result.success) {
        toast("Book borrowed successfully");
        route.push("/my-profile");
      } else {
        toast(result?.error);
      }
    } catch (error) {
      console.log(error);
      toast("An error occurred while borrowing the book");
    } finally {
      setBorrowing(false);
    }
  };
  return (
    <div>
      <Button className="book-overview_btn" onClick={handleBorrow } disabled={borrowing}>
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-babas-neue text-xl text-dark-100">{borrowing ?"Borrowing...":"Borrow Book"}</p>
      </Button>
    </div>
  );
};

export default BorrowBook;
