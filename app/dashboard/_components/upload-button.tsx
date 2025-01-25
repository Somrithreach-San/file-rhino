"use client";
import { Button } from "@/components/ui/button";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const formSchema = z.object({
  title: z.string().min(1).max(100),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

export default function UploadButton() {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const createFile = useMutation(api.files.createFile);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(values.file);
    if (!orgId) return;
    const postUrl = await generateUploadUrl();

    const fileType = values.file[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    const types = {
      "image/png": "image",
      "image/jpeg": "image",
      "image/gif": "image",
      "image/bmp": "image",
      "image/webp": "image",
      "image/tiff": "image",
      "image/svg+xml": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "application/zip": "zip",
      "application/x-zip-compressed": "zip",
      "audio/mpeg": "audio",
      "audio/wav": "audio",
      "video/mp4": "video",
      "video/webm": "video",
      "text/plain": "text",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "doc",
      "application/vnd.ms-excel": "excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "excel",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "ppt",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: types[fileType],
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Now everyone can view your file",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your file could not be uploaded, try again",
      });
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => {}}>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your file here</DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={fileName}
                          onChange={(e) => {
                            setFileName(e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...form.register("file")}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setFileName(e.target.files[0].name);
                              form.setValue("title", e.target.files[0].name);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
