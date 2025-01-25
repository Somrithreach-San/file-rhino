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

// import { Doc } from "@/convex/_generated/dataModel";
// import { api } from "@/convex/_generated/api";
// import { usePathname } from "next/navigation";
// import UploadButton from "./upload-button";

// // Placeholder Component for Empty States
// function Placeholder({
//   context,
// }: {
//   context: "files" | "favorites" | "trash";
// }) {
//   const message = {
//     files: "A place for all your files",
//     favorites: "No favorites files",
//     trash: "Nothing in trash",
//   };

//   const imageSrc = {
//     files: "/Empty_State_Mascot_File.svg", // Change to appropriate image for files
//     favorites: "/Empty_State_Mascot_Favorite.svg", // Change to appropriate image for favorites
//     trash: "/Empty_State_Mascot_Trash.svg", // Change to appropriate image for trash
//   };

//   const subMessage = {
//     files: 'Use the "New" button to upload a file',
//     favorites: "Add favorite to files that you want to easily find later",
//     trash: "Files in trash will be deleted forever after 30 days",
//   };

//   return (
//     <div className="flex flex-col gap-4 w-full items-center mt-24">
//       {" "}
//       {/* Reduced gap */}
//       <Image
//         alt={`An image for ${context} empty state`}
//         width="150"
//         height="150"
//         src={imageSrc[context]}
//       />
//       <div className="text-2xl">{message[context]}</div>
//       <div className="text-gray-500 text-xl">{subMessage[context]}</div>
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
//                 <SelectValue placeholder="Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="image">Image</SelectItem>
//                 <SelectItem value="csv">CSV</SelectItem>
//                 <SelectItem value="pdf">PDF</SelectItem>
//                 <SelectItem value="video">Video</SelectItem>
//                 <SelectItem value="audio">Audio</SelectItem>
//                 <SelectItem value="text">Plain Text</SelectItem>
//                 <SelectItem value="doc">Word</SelectItem>
//                 <SelectItem value="ppt">Power Point</SelectItem>
//                 <SelectItem value="excel">Excel</SelectItem>
//                 <SelectItem value="zip">ZIP</SelectItem>
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

// import { Doc } from "@/convex/_generated/dataModel";
// import { api } from "@/convex/_generated/api";
// import { usePathname } from "next/navigation";
// import UploadButton from "./upload-button";

// // Placeholder Component for Empty States
// function Placeholder({
//   context,
// }: {
//   context: "files" | "favorites" | "trash" | "noResults";
// }) {
//   const message = {
//     files: "A place for all your files",
//     favorites: "No favorites files",
//     trash: "Nothing in trash",
//     noResults: "No results found",
//   };

//   const imageSrc = {
//     files: "/Empty_State_Mascot_File.svg", // Change to appropriate image for files
//     favorites: "/Empty_State_Mascot_Favorite.svg", // Change to appropriate image for favorites
//     trash: "/Empty_State_Mascot_Trash.svg", // Change to appropriate image for trash
//     noResults: "/Empty_State_Mascot_NoSearchFound.svg", // Change to appropriate image for no results
//   };

//   const subMessage = {
//     files: 'Use the "New" button to upload a file',
//     favorites: "Add favorite to files that you want to easily find later",
//     trash: "Files in trash will be deleted forever after 30 days",
//     noResults: "Try adjusting your search",
//   };

//   return (
//     <div className="flex flex-col gap-4 w-full items-center mt-24">
//       {" "}
//       {/* Reduced gap */}
//       <Image
//         alt={`An image for ${context} empty state`}
//         width="150"
//         height="150"
//         src={imageSrc[context]}
//       />
//       <div className="text-2xl">{message[context]}</div>
//       <div className="text-gray-500 text-xl">{subMessage[context]}</div>
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

//   const noResults = query && modifiedFiles.length === 0;

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold">{title}</h1>

//         <SearchBar query={query} setQuery={setQuery} />
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
//                 <SelectValue placeholder="Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="image">Image</SelectItem>
//                 <SelectItem value="csv">CSV</SelectItem>
//                 <SelectItem value="pdf">PDF</SelectItem>
//                 <SelectItem value="video">Video</SelectItem>
//                 <SelectItem value="audio">Audio</SelectItem>
//                 <SelectItem value="text">Plain Text</SelectItem>
//                 <SelectItem value="doc">Word</SelectItem>
//                 <SelectItem value="ppt">Power Point</SelectItem>
//                 <SelectItem value="excel">Excel</SelectItem>
//                 <SelectItem value="zip">ZIP</SelectItem>
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

//         {!isLoading && noResults && <Placeholder context="noResults" />}

//         {!isLoading && !noResults && (
//           <>
//             <TabsContent value="grid">
//               <div className="grid grid-cols-3 gap-4">
//                 {modifiedFiles?.map((file) => {
//                   return <FileCard key={file._id} file={file} />;
//                 })}
//               </div>
//             </TabsContent>
//             <TabsContent value="table">
//               <DataTable columns={columns} data={modifiedFiles} />
//             </TabsContent>
//           </>
//         )}
//       </Tabs>

//       {!isLoading && !query && files?.length === 0 && (
//         <Placeholder context={context} />
//       )}
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

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import UploadButton from "./upload-button";

// Placeholder Component for Empty States
function Placeholder({
  context,
}: {
  context: "files" | "favorites" | "trash" | "noResults";
}) {
  const message = {
    files: "A place for all your files",
    favorites: "No favorites files",
    trash: "Nothing in trash",
    noResults: "No results found",
  };

  const imageSrc = {
    files: "/Empty_State_Mascot_File.svg", // Change to appropriate image for files
    favorites: "/Empty_State_Mascot_Favorite.svg", // Change to appropriate image for favorites
    trash: "/Empty_State_Mascot_Trash.svg", // Change to appropriate image for trash
    noResults: "/Empty_State_Mascot_NoSearchFound.svg", // Change to appropriate image for no results
  };

  const subMessage = {
    files: 'Use the "New" button to upload a file',
    favorites: "Add favorite to files that you want to easily find later",
    trash: "Files in trash will be deleted forever after 30 days",
    noResults: "Try adjusting your search",
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center mt-24">
      <Image
        alt={`An image for ${context} empty state`}
        width="150"
        height="150"
        src={imageSrc[context]}
      />
      <div className="text-2xl">{message[context]}</div>
      <div className="text-gray-500 text-xl">{subMessage[context]}</div>
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
  const [selectedUser, setSelectedUser] = useState<string | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const users = useQuery(api.users.getAllUsers);

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
          userId: selectedUser === "all" ? undefined : selectedUser,
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

  const noResults = query && modifiedFiles.length === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />
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
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="text">Plain Text</SelectItem>
                <SelectItem value="doc">Word</SelectItem>
                <SelectItem value="ppt">Power Point</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="zip">ZIP</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="user-select">People Filter</Label>
            <Select
              value={selectedUser}
              onValueChange={(newUser) => {
                setSelectedUser(newUser);
              }}
            >
              <SelectTrigger id="user-select" className="w-[180px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
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

        {!isLoading && noResults && <Placeholder context="noResults" />}

        {!isLoading && !noResults && (
          <>
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
          </>
        )}
      </Tabs>

      {!isLoading && !query && files?.length === 0 && (
        <Placeholder context={context} />
      )}
    </div>
  );
}
