// "use client";
// import { useState } from "react";
// import { useOrganization, useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { FileCard } from "./file-card";
// import Image from "next/image";
// import { GridIcon, Loader2, RowsIcon } from "lucide-react";
// import { SearchBar } from "./search-bar";
// import { DataTable } from "./file-table";
// import { columns } from "./columns";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import UploadButton from "./upload-button";
// import { Doc } from "@/convex/_generated/dataModel";
// import { api } from "@/convex/_generated/api";
// import { usePathname } from "next/navigation";

// // Placeholder Component for Empty States
// function Placeholder({
//   context,
// }: {
//   context: "files" | "favorites" | "trash";
// }) {
//   const message = {
//     files: "You have no files, upload one now",
//     favorites: "You have no favorite files yet, add some!",
//     trash: "Your trash is empty, no files have been deleted.",
//   };

//   const imageSrc = {
//     files: "/Empty_State_Mascot_File.svg", // Change to appropriate image for files
//     favorites: "/Empty_State_Mascot_Favorite.svg", // Change to appropriate image for favorites
//     trash: "/Empty_State_Mascot_Trash.svg", // Change to appropriate image for trash
//   };

//   return (
//     <div className="flex flex-col gap-8 w-full items-center mt-24">
//       <Image
//         alt={`An image for ${context} empty state`}
//         width="150"
//         height="150"
//         src={imageSrc[context]}
//       />
//       <div className="text-2xl">{message[context]}</div>
//     </div>
//   );
// }

// // FileBrowser Component
// export function FileBrowser({
//   title,
//   favoritesOnly,
//   deletedOnly,
// }: {
//   title: string;
//   favoritesOnly?: boolean;
//   deletedOnly?: boolean;
// }) {
//   const pathname = usePathname();
//   const context = pathname.includes("/dashboard/favorites")
//     ? "favorites"
//     : pathname.includes("/dashboard/trash")
//       ? "trash"
//       : "files";

//   const organization = useOrganization();
//   const user = useUser();
//   const [query, setQuery] = useState("");
//   const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

//   let orgId: string | undefined = undefined;
//   if (organization.isLoaded && user.isLoaded) {
//     orgId = organization.organization?.id ?? user.user?.id;
//   }

//   const favorites = useQuery(
//     api.files.getAllFavorites,
//     orgId ? { orgId } : "skip"
//   );

//   const files = useQuery(
//     api.files.getFiles,
//     orgId
//       ? {
//           orgId,
//           type: type === "all" ? undefined : type,
//           query,
//           favorites: favoritesOnly,
//           deletedOnly,
//         }
//       : "skip"
//   );
//   const isLoading = files === undefined;

//   const modifiedFiles =
//     files?.map((file) => ({
//       ...file,
//       isFavorited: (favorites ?? []).some(
//         (favorite) => favorite.fileId === file._id
//       ),
//     })) ?? [];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold">{title}</h1>

//         <SearchBar query={query} setQuery={setQuery} />

//         <UploadButton />
//       </div>

//       <Tabs defaultValue="grid">
//         <div className="flex justify-between items-center">
//           <TabsList className="mb-2">
//             <TabsTrigger value="grid" className="flex gap-2 items-center">
//               <GridIcon />
//               Grid
//             </TabsTrigger>
//             <TabsTrigger value="table" className="flex gap-2 items-center">
//               <RowsIcon /> Table
//             </TabsTrigger>
//           </TabsList>

//           <div className="flex gap-2 items-center">
//             <Label htmlFor="type-select">Type Filter</Label>
//             <Select
//               value={type}
//               onValueChange={(newType) => {
//                 setType(newType as any);
//               }}
//             >
//               <SelectTrigger id="type-select" className="w-[180px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="image">Image</SelectItem>
//                 <SelectItem value="csv">CSV</SelectItem>
//                 <SelectItem value="pdf">PDF</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {isLoading && (
//           <div className="flex flex-col gap-8 w-full items-center mt-24">
//             <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
//             <div className="text-2xl">Loading your files...</div>
//           </div>
//         )}

//         <TabsContent value="grid">
//           <div className="grid grid-cols-3 gap-4">
//             {modifiedFiles?.map((file) => {
//               return <FileCard key={file._id} file={file} />;
//             })}
//           </div>
//         </TabsContent>
//         <TabsContent value="table">
//           <DataTable columns={columns} data={modifiedFiles} />
//         </TabsContent>
//       </Tabs>

//       {files?.length === 0 && <Placeholder context={context} />}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import UploadButton from "./upload-button";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";

// Placeholder Component for Empty States
function Placeholder({
  context,
}: {
  context: "files" | "favorites" | "trash";
}) {
  const message = {
    files: "You have no files, upload one now",
    favorites: "You have no favorite files yet, add some!",
    trash: "Your trash is empty, no files have been deleted.",
  };

  const imageSrc = {
    files: "/Empty_State_Mascot_File.svg", // Change to appropriate image for files
    favorites: "/Empty_State_Mascot_Favorite.svg", // Change to appropriate image for favorites
    trash: "/Empty_State_Mascot_Trash.svg", // Change to appropriate image for trash
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt={`An image for ${context} empty state`}
        width="150"
        height="150"
        src={imageSrc[context]}
      />
      <div className="text-2xl">{message[context]}</div>
    </div>
  );
}

// FileBrowser Component
export function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const pathname = usePathname();
  const context = pathname.includes("/dashboard/favorites")
    ? "favorites"
    : pathname.includes("/dashboard/trash")
      ? "trash"
      : "files";

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType: Doc<"files">["type"] | "all") => {
                setType(newType);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder context={context} />}
    </div>
  );
}
