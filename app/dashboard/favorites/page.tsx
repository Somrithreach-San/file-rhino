"use client";
import { useQuery } from "convex/react";
import { FileBrowser } from "../_components/file-browser";

export default function FavoritesPage() {
  // const files = useQuery(api.files.getFiles, {
  //   orgId:,
  //   favorites: true,
  //   query: ''
  // })
  return (
    <div>
      <FileBrowser title="Favorites" favorites />
    </div>
  );
}
