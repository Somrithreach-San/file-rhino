"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
//import Image from "next/image";

export default function Home() {
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SignedIn>
          <SignOutButton>
            <Button>Sign Out</Button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>

        {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>;
        })}

        <Button
          onClick={() => {
            createFile({
              name: "Hello world",
            });
          }}
        >
          Click me
        </Button>
      </main>
    </div>
  );
}
