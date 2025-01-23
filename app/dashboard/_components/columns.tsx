"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "./file-actions";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

// export const columns: ColumnDef<
//   Doc<"files"> & { url: string; isFavorited: boolean }
// >[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     header: "User",
//     cell: ({ row }) => {
//       return <UserCell userId={row.original.userId} />;
//     },
//   },
//   {
//     header: "Uploaded On",
//     cell: ({ row }) => {
//       return (
//         <div>
//           {formatRelative(new Date(row.original._creationTime), new Date())}
//         </div>
//       );
//     },
//   },
//   {
//     header: "Actions",
//     cell: ({ row }) => {
//       return (
//         <div>
//           <FileCardActions
//             file={row.original}
//             isFavorited={row.original.isFavorited}
//           />
//         </div>
//       );
//     },
//   },
// ];
export const columns: ColumnDef<{
  isFavorited: boolean;
  url: string | null;
  _id: Id<"files">;
  _creationTime: number;
  shouldDelete?: boolean;
  type: "image" | "csv" | "pdf";
  name: string;
  orgId: string;
  fileId: Id<"_storage">;
  userId: Id<"users">;
}>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => info.getValue(),
  },
  {
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions
            file={row.original}
            isFavorited={row.original.isFavorited}
          />
        </div>
      );
    },
  },
];
