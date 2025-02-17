// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { formatRelative } from "date-fns";

// import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
// import { ReactNode } from "react";
// import { useQuery } from "convex/react";

// import Image from "next/image";
// import { FileCardActions } from "./file-actions";
// import { Doc } from "@/convex/_generated/dataModel";
// import { api } from "@/convex/_generated/api";

// export function FileCard({
//   file,
// }: {
//   file: Doc<"files"> & { isFavorited: boolean; url: string | null };
// }) {
//   const userProfile = useQuery(api.users.getUserProfile, {
//     userId: file.userId,
//   });

//   const typeIcons = {
//     image: <ImageIcon />,
//     pdf: <FileTextIcon />,
//     csv: <GanttChartIcon />,
//   } as Record<Doc<"files">["type"], ReactNode>;

//   return (
//     <Card>
//       <CardHeader className="relative">
//         <CardTitle className="flex gap-2 text-base font-normal">
//           <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
//           {file.name}
//         </CardTitle>
//         <div className="absolute top-2 right-2">
//           <FileCardActions isFavorited={file.isFavorited} file={file} />
//         </div>
//       </CardHeader>
//       <CardContent className="h-[200px] flex justify-center items-center">
//         {file.type === "image" && file.url && (
//           <Image alt={file.name} width="100" height="100" src={file.url} />
//         )}

//         {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
//         {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
//           <Avatar className="w-6 h-6">
//             <AvatarImage src={userProfile?.image} />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           {userProfile?.name}
//         </div>
//         <div className="text-xs text-gray-700">
//           Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
/// ORIGINAL CODE ABOVE

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  FileIcon,
  FileVideo,
  FileAudio,
  FileArchive,
  FileImage,
  FileCode,
  FileChartPie,
  FileChartColumn,
  FileType,
} from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import Image from "next/image";
import { FileCardActions } from "./file-actions";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

// Function to fetch the preview content of text-based files
async function fetchTextPreview(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  return text.slice(0, 200); // Preview the first 200 characters
}

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean; url: string | null };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <FileImage />,
    pdf: <FileTextIcon />,
    doc: <FileTextIcon />,
    excel: <FileChartColumn />,
    ppt: <FileChartPie />,
    zip: <FileArchive />,
    audio: <FileAudio />,
    video: <FileVideo />,
    text: <FileType />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {/* {file.type === "image" && file.url && (
          <div className="relative w-full h-full flex justify-center items-center">
            <Image
              alt={file.name}
              width={150} // Fixed width
              height={150} // Fixed height
              className="object-contain max-w-full max-h-full "
              src={file.url}
            />
          </div>
        )} */}
        {file.type === "image" && file.url && (
          <div className="relative w-full h-48 flex justify-center items-center rounded-md overflow-hidden">
            <Image
              alt={file.name}
              width={150} // Fixed width
              height={150} // Fixed height
              className="object-contain max-w-full max-h-full"
              src={file.url}
            />
          </div>
        )}
        {file.type === "video" && file.url && (
          <video controls width="200">
            <source src={file.url} />
            Your browser does not support the video element.
          </video>
        )}
        {file.type === "audio" && file.url && (
          <audio controls>
            <source src={file.url} />
            Your browser does not support the audio element.
          </audio>
        )}
        {/* {!["image", "audio", "video"].includes(file.type) && (
          <div className="text-center">
            {typeIcons[file.type] ?? <FileIcon />}
          </div>
        )} */}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
        {file.type === "doc" && <FileTextIcon className="w-20 h-20" />}
        {file.type === "csv" && <FileTextIcon className="w-20 h-20" />}
        {file.type === "excel" && <FileChartColumn className="w-20 h-20" />}
        {file.type === "ppt" && <FileChartPie className="w-20 h-20" />}
        {file.type === "zip" && <FileArchive className="w-20 h-20" />}
        {file.type === "text" && <FileType className="w-20 h-20" />}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
