// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   FileIcon,
//   MoreVertical,
//   StarHalf,
//   StarIcon,
//   TrashIcon,
//   UndoIcon,
// } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useState } from "react";
// import { useMutation, useQuery } from "convex/react";

// import { Protect } from "@clerk/nextjs";
// import { Doc } from "@/convex/_generated/dataModel";
// import { useToast } from "@/hooks/use-toast";
// import { api } from "@/convex/_generated/api";

// export function FileCardActions({
//   file,
//   isFavorited,
// }: {
//   file: Doc<"files"> & { url: string | null };
//   isFavorited: boolean;
// }) {
//   const deleteFile = useMutation(api.files.deleteFile);
//   const restoreFile = useMutation(api.files.restoreFile);
//   const toggleFavorite = useMutation(api.files.toggleFavorite);
//   const { toast } = useToast();
//   const me = useQuery(api.users.getMe);

//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);

//   return (
//     <>
//       <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action will mark the file for our deletion process. Files are
//               deleted periodically
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={async () => {
//                 await deleteFile({
//                   fileId: file._id,
//                 });
//                 toast({
//                   variant: "default",
//                   title: "File marked for deletion",
//                   description: "Your file will be deleted soon",
//                 });
//               }}
//             >
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <MoreVertical />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             onClick={() => {
//               if (!file.url) return;
//               window.open(file.url, "_blank");
//             }}
//             className="flex gap-1 items-center cursor-pointer"
//           >
//             <FileIcon className="w-4 h-4" /> Download
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => {
//               toggleFavorite({
//                 fileId: file._id,
//               });
//             }}
//             className="flex gap-1 items-center cursor-pointer"
//           >
//             {isFavorited ? (
//               <div className="flex gap-1 items-center">
//                 <StarIcon className="w-4 h-4" /> Unfavorite
//               </div>
//             ) : (
//               <div className="flex gap-1 items-center">
//                 <StarHalf className="w-4 h-4" /> Favorite
//               </div>
//             )}
//           </DropdownMenuItem>

//           <Protect
//             condition={(check) => {
//               return (
//                 check({
//                   role: "org:admin",
//                 }) || file.userId === me?._id
//               );
//             }}
//             fallback={<></>}
//           >
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={() => {
//                 if (file.shouldDelete) {
//                   restoreFile({
//                     fileId: file._id,
//                   });
//                 } else {
//                   setIsConfirmOpen(true);
//                 }
//               }}
//               className="flex gap-1 items-center cursor-pointer"
//             >
//               {file.shouldDelete ? (
//                 <div className="flex gap-1 text-green-600 items-center cursor-pointer">
//                   <UndoIcon className="w-4 h-4" /> Restore
//                 </div>
//               ) : (
//                 <div className="flex gap-1 text-red-600 items-center cursor-pointer">
//                   <TrashIcon className="w-4 h-4" /> Delete
//                 </div>
//               )}
//             </DropdownMenuItem>
//           </Protect>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   FileIcon,
//   MoreVertical,
//   StarHalf,
//   StarIcon,
//   TrashIcon,
//   UndoIcon,
//   EditIcon,
//   PencilLine,
//   PenLine,
// } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useState } from "react";
// import { useMutation, useQuery } from "convex/react";

// import { Protect } from "@clerk/nextjs";
// import { Doc } from "@/convex/_generated/dataModel";
// import { useToast } from "@/hooks/use-toast";
// import { api } from "@/convex/_generated/api";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export function FileCardActions({
//   file,
//   isFavorited,
// }: {
//   file: Doc<"files"> & { url: string | null };
//   isFavorited: boolean;
// }) {
//   const deleteFile = useMutation(api.files.deleteFile);
//   const restoreFile = useMutation(api.files.restoreFile);
//   const toggleFavorite = useMutation(api.files.toggleFavorite);
//   const renameFile = useMutation(api.files.renameFile);
//   const { toast } = useToast();
//   const me = useQuery(api.users.getMe);

//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
//   const [newFileName, setNewFileName] = useState(file.name);

//   return (
//     <>
//       <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action will mark the file for our deletion process. Files are
//               deleted periodically
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={async () => {
//                 await deleteFile({
//                   fileId: file._id,
//                 });
//                 toast({
//                   variant: "default",
//                   title: "File marked for deletion",
//                   description: "Your file will be deleted soon",
//                 });
//               }}
//             >
//               Continue
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Rename File</DialogTitle>
//           </DialogHeader>
//           <form
//             onSubmit={async (e) => {
//               e.preventDefault();
//               await renameFile({
//                 fileId: file._id,
//                 newName: newFileName,
//               });
//               setIsRenameDialogOpen(false);
//               toast({
//                 variant: "default",
//                 title: "File renamed",
//                 description: `File has been renamed to ${newFileName}`,
//               });
//             }}
//           >
//             <Input
//               value={newFileName}
//               onChange={(e) => setNewFileName(e.target.value)}
//               placeholder="New file name"
//             />
//             <Button type="submit" className="mt-4">
//               Rename
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <MoreVertical />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             onClick={() => {
//               if (!file.url) return;
//               window.open(file.url, "_blank");
//             }}
//             className="flex gap-1 items-center cursor-pointer"
//           >
//             <FileIcon className="w-4 h-4" /> Download
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => {
//               toggleFavorite({
//                 fileId: file._id,
//               });
//             }}
//             className="flex gap-1 items-center cursor-pointer"
//           >
//             {isFavorited ? (
//               <div className="flex gap-1 items-center">
//                 <StarIcon className="w-4 h-4" /> Unfavorite
//               </div>
//             ) : (
//               <div className="flex gap-1 items-center">
//                 <StarHalf className="w-4 h-4" /> Favorite
//               </div>
//             )}
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => {
//               setIsRenameDialogOpen(true);
//             }}
//             className="flex gap-1 items-center cursor-pointer"
//           >
//             <PenLine className="w-4 h-4" /> Rename
//           </DropdownMenuItem>

//           <Protect
//             condition={(check) => {
//               return (
//                 check({
//                   role: "org:admin",
//                 }) || file.userId === me?._id
//               );
//             }}
//             fallback={<></>}
//           >
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={() => {
//                 if (file.shouldDelete) {
//                   restoreFile({
//                     fileId: file._id,
//                   });
//                 } else {
//                   setIsConfirmOpen(true);
//                 }
//               }}
//               className="flex gap-1 items-center cursor-pointer"
//             >
//               {file.shouldDelete ? (
//                 <div className="flex gap-1 text-green-600 items-center cursor-pointer">
//                   <UndoIcon className="w-4 h-4" /> Restore
//                 </div>
//               ) : (
//                 <div className="flex gap-1 text-red-600 items-center cursor-pointer">
//                   <TrashIcon className="w-4 h-4" /> Delete
//                 </div>
//               )}
//             </DropdownMenuItem>
//           </Protect>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { Protect } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files"> & { url: string | null };
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const renameFile = useMutation(api.files.renameFile);
  const permanentlyDeleteFile = useMutation(api.files.permanentlyDeleteFile);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isPermanentDeleteConfirmOpen, setIsPermanentDeleteConfirmOpen] =
    useState(false);
  const [newFileName, setNewFileName] = useState(file.name);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "default",
                  title: "File marked for deletion",
                  description: "Your file will be deleted soon",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isPermanentDeleteConfirmOpen}
        onOpenChange={setIsPermanentDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the file. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await permanentlyDeleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "default",
                  title: "File permanently deleted",
                  description: "Your file has been permanently deleted",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await renameFile({
                fileId: file._id,
                newName: newFileName,
              });
              setIsRenameDialogOpen(false);
              toast({
                variant: "default",
                title: "File renamed",
                description: `File has been renamed to ${newFileName}`,
              });
            }}
          >
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="New file name"
            />
            <Button type="submit" className="mt-4">
              Rename
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!file.shouldDelete && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  if (!file.url) return;
                  window.open(file.url, "_blank");
                }}
                className="flex gap-1 items-center cursor-pointer"
              >
                <FileIcon className="w-4 h-4" /> Download
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  toggleFavorite({
                    fileId: file._id,
                  });
                }}
                className="flex gap-1 items-center cursor-pointer"
              >
                {isFavorited ? (
                  <div className="flex gap-1 items-center">
                    <StarIcon className="w-4 h-4" /> Unfavorite
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    <StarHalf className="w-4 h-4" /> Favorite
                  </div>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setIsRenameDialogOpen(true);
                }}
                className="flex gap-1 items-center cursor-pointer"
              >
                <EditIcon className="w-4 h-4" /> Rename
              </DropdownMenuItem>

              <Protect
                condition={(check) => {
                  return (
                    check({
                      role: "org:admin",
                    }) || file.userId === me?._id
                  );
                }}
                fallback={<></>}
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setIsConfirmOpen(true);
                  }}
                  className="flex gap-1 items-center cursor-pointer text-red-600"
                >
                  <TrashIcon className="w-4 h-4" /> Move to Trash
                </DropdownMenuItem>
              </Protect>
            </>
          )}

          {file.shouldDelete && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  restoreFile({
                    fileId: file._id,
                  });
                }}
                className="flex gap-1 items-center cursor-pointer text-green-600"
              >
                <UndoIcon className="w-4 h-4" /> Restore
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setIsPermanentDeleteConfirmOpen(true);
                }}
                className="flex gap-1 items-center cursor-pointer text-red-600"
              >
                <Trash2Icon className="w-4 h-4" /> Permanently Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
