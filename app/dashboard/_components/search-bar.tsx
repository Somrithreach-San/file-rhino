// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, SearchIcon } from "lucide-react";
// import { Dispatch, SetStateAction } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// const formSchema = z.object({
//   query: z.string().min(0).max(200),
// });

// export function SearchBar({
//   query,
//   setQuery,
// }: {
//   query: string;
//   setQuery: Dispatch<SetStateAction<string>>;
// }) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       query: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setQuery(values.query);
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex gap-2 items-center"
//         >
//           <FormField
//             control={form.control}
//             name="query"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <Input {...field} placeholder="your file names" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             size="sm"
//             type="submit"
//             disabled={form.formState.isSubmitting}
//             className="flex gap-1"
//           >
//             {form.formState.isSubmitting && (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             )}
//             <SearchIcon />
//             Search
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

export function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleClear = () => {
    setQuery("");
    form.reset();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex items-center"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormControl>
                  <div className="relative">
                    {/* Search Icon as Submit Button */}
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </button>
                    <Input
                      {...field}
                      placeholder="Search"
                      className="pl-10 pr-10" // Padding for the icons
                    />
                    {/* Clear Icon */}
                    {query && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer h-5 w-5 text-gray-500"
                        onClick={handleClear}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
