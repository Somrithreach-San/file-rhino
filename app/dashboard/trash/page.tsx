"use client";
import { useQuery } from "convex/react";
import { FileBrowser } from "../_components/file-browser";

export default function FavoritesPage() {
  return (
    <div>
      <FileBrowser title="Trash" deletedOnly />
    </div>
  );
}
