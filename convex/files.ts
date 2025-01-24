// // // // import { ConvexError, v } from "convex/values";
// // // // import {
// // // //   internalMutation,
// // // //   mutation,
// // // //   MutationCtx,
// // // //   query,
// // // //   QueryCtx,
// // // // } from "./_generated/server";
// // // // import { getUser } from "./users";
// // // // import { fileTypes } from "./schema";
// // // // import { Id } from "./_generated/dataModel";

// // // // export const generateUploadUrl = mutation(async (ctx) => {
// // // //   const identity = await ctx.auth.getUserIdentity();

// // // //   if (!identity) {
// // // //     throw new ConvexError("You must be logged in to upload a file");
// // // //   }
// // // //   return await ctx.storage.generateUploadUrl();
// // // // });

// // // // async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
// // // //   const identity = await ctx.auth.getUserIdentity();
// // // //   if (!identity) {
// // // //     return null;
// // // //   }

// // // //   const user = await ctx.db
// // // //     .query("users")
// // // //     .withIndex("by_tokenIdentifier", (q) =>
// // // //       q.eq("tokenIdentifier", identity.tokenIdentifier)
// // // //     )
// // // //     .first();

// // // //   if (!user) {
// // // //     return null;
// // // //   }

// // // //   const hasAccess =
// // // //     user.orgIds.some((item) => item.orgId === orgId) ||
// // // //     user.tokenIdentifier.includes(orgId);
// // // //   if (!hasAccess) {
// // // //     return null;
// // // //   }
// // // //   return { user };
// // // // }

// // // // // export const createFile = mutation({
// // // // //   args: {
// // // // //     name: v.string(),
// // // // //     fileId: v.id("_storage"),
// // // // //     orgId: v.string(),
// // // // //     type: fileTypes,
// // // // //   },
// // // // //   async handler(ctx, args) {
// // // // //     const hasAccess = await hasAccessToOrg(
// // // // //       ctx,

// // // // //       args.orgId
// // // // //     );

// // // // //     if (!hasAccess) {
// // // // //       throw new ConvexError("You do not have access to this org");
// // // // //     }

// // // // //     await ctx.db.insert("files", {
// // // // //       name: args.name,
// // // // //       orgId: args.orgId,
// // // // //       fileId: args.fileId,
// // // // //       type: args.type,
// // // // //     });
// // // // //   },
// // // // // });

// // // // // This createFile function paste from ChatGPT it work for personal account upload
// // // // export const createFile = mutation({
// // // //   args: {
// // // //     name: v.string(),
// // // //     fileId: v.id("_storage"),
// // // //     orgId: v.string(),
// // // //     type: v.optional(fileTypes), // Make `type` optional
// // // //   },
// // // //   async handler(ctx, args) {
// // // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // // //     if (!hasAccess) {
// // // //       throw new ConvexError("You do not have access to this org");
// // // //     }

// // // //     // Default the type if not provided
// // // //     const fileType = args.type || "image";

// // // //     await ctx.db.insert("files", {
// // // //       name: args.name,
// // // //       orgId: args.orgId,
// // // //       fileId: args.fileId,
// // // //       type: fileType,
// // // //       userId: hasAccess.user._id,
// // // //     });
// // // //   },
// // // // });

// // // // export const getFiles = query({
// // // //   args: {
// // // //     orgId: v.string(),
// // // //     query: v.optional(v.string()),
// // // //     favorites: v.optional(v.boolean()),
// // // //     deletedOnly: v.optional(v.boolean()),
// // // //   },
// // // //   async handler(ctx, args) {
// // // //     const identity = await ctx.auth.getUserIdentity();

// // // //     if (!identity) {
// // // //       return [];
// // // //     }

// // // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // // //     if (!hasAccess) {
// // // //       return [];
// // // //     }

// // // //     let files = await ctx.db
// // // //       .query("files")
// // // //       .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
// // // //       .collect();

// // // //     const query = args.query;

// // // //     if (query) {
// // // //       files = files.filter((file) =>
// // // //         file.name.toLowerCase().includes(query.toLowerCase())
// // // //       );
// // // //     }
// // // //     if (args.favorites) {
// // // //       const favorites = await ctx.db
// // // //         .query("favorites")
// // // //         .withIndex("by_userId_orgId_fileId", (q) =>
// // // //           q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// // // //         )
// // // //         .collect();

// // // //       files = files.filter((file) =>
// // // //         favorites.some((favorite) => favorite.fileId === file._id)
// // // //       );
// // // //     }

// // // //     if (args.deletedOnly) {
// // // //       files = files.filter((file) => file.shouldDelete);
// // // //     } else {
// // // //       files = files.filter((file) => !file.shouldDelete);
// // // //     }
// // // //     return files;
// // // //   },
// // // // });

// // // // export const restoreFile = mutation({
// // // //   args: { fileId: v.id("files") },
// // // //   async handler(ctx, args) {
// // // //     const access = await hasAccessToFile(ctx, args.fileId);

// // // //     if (!access) {
// // // //       throw new ConvexError("no access to file");
// // // //     }

// // // //     const isAdmin =
// // // //       access.user.orgIds.find((org) => org.orgId === access.file.orgId)
// // // //         ?.role === "admin";

// // // //     if (!isAdmin) {
// // // //       throw new ConvexError("You have no admin access to delete");
// // // //     }
// // // //     await ctx.db.patch(args.fileId, {
// // // //       shouldDelete: false,
// // // //     });
// // // //   },
// // // // });

// // // // export const deleteAllFiles = internalMutation({
// // // //   args: {},
// // // //   async handler(ctx) {
// // // //     const files = await ctx.db
// // // //       .query("files")
// // // //       .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
// // // //       .collect();

// // // //     await Promise.all(
// // // //       files.map(async (file) => {
// // // //         await ctx.storage.delete(file.fileId);
// // // //         return await ctx.db.delete(file._id);
// // // //       })
// // // //     );
// // // //   },
// // // // });

// // // // export const deleteFile = mutation({
// // // //   args: { fileId: v.id("files") },
// // // //   async handler(ctx, args) {
// // // //     const access = await hasAccessToFile(ctx, args.fileId);

// // // //     if (!access) {
// // // //       throw new ConvexError("no access to file");
// // // //     }

// // // //     const isAdmin =
// // // //       access.user.orgIds.find((org) => org.orgId === access.file.orgId)
// // // //         ?.role === "admin";

// // // //     if (!isAdmin) {
// // // //       throw new ConvexError("You have no admin access to delete");
// // // //     }
// // // //     await ctx.db.patch(args.fileId, {
// // // //       shouldDelete: true,
// // // //     });
// // // //   },
// // // // });

// // // // export const toggleFavorite = mutation({
// // // //   args: { fileId: v.id("files") },
// // // //   async handler(ctx, args) {
// // // //     const access = await hasAccessToFile(ctx, args.fileId);

// // // //     if (!access) {
// // // //       throw new ConvexError("no access to file");
// // // //     }

// // // //     const favorites = await ctx.db
// // // //       .query("favorites")
// // // //       .withIndex("by_userId_orgId_fileId", (q) =>
// // // //         q
// // // //           .eq("userId", access.user._id)
// // // //           .eq("orgId", access.file.orgId)
// // // //           .eq("fileId", access.file._id)
// // // //       )
// // // //       .first();

// // // //     if (!favorites) {
// // // //       await ctx.db.insert("favorites", {
// // // //         fileId: access.file._id,
// // // //         userId: access.user._id,
// // // //         orgId: access.file.orgId,
// // // //       });
// // // //     } else {
// // // //       await ctx.db.delete(favorites._id);
// // // //     }
// // // //   },
// // // // });

// // // // export const getAllFavorites = query({
// // // //   args: { orgId: v.string() },
// // // //   async handler(ctx, args) {
// // // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // // //     if (!hasAccess) {
// // // //       return [];
// // // //     }

// // // //     const favorites = await ctx.db
// // // //       .query("favorites")
// // // //       .withIndex("by_userId_orgId_fileId", (q) =>
// // // //         q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// // // //       )
// // // //       .collect();
// // // //     return favorites;
// // // //   },
// // // // });

// // // // async function hasAccessToFile(
// // // //   ctx: QueryCtx | MutationCtx,
// // // //   fileId: Id<"files">
// // // // ) {
// // // //   const file = await ctx.db.get(fileId);

// // // //   if (!file) {
// // // //     return null;
// // // //   }

// // // //   const hasAccess = await hasAccessToOrg(ctx, file.orgId);

// // // //   if (!hasAccess) {
// // // //     return null;
// // // //   }

// // // //   return { user: hasAccess.user, file };
// // // // }

// // // import { ConvexError, v } from "convex/values";
// // // import {
// // //   MutationCtx,
// // //   QueryCtx,
// // //   internalMutation,
// // //   mutation,
// // //   query,
// // // } from "./_generated/server";
// // // import { getUser } from "./users";
// // // import { fileTypes } from "./schema";
// // // import { Doc, Id } from "./_generated/dataModel";

// // // export const generateUploadUrl = mutation(async (ctx) => {
// // //   const identity = await ctx.auth.getUserIdentity();

// // //   if (!identity) {
// // //     throw new ConvexError("you must be logged in to upload a file");
// // //   }

// // //   return await ctx.storage.generateUploadUrl();
// // // });

// // // export async function hasAccessToOrg(
// // //   ctx: QueryCtx | MutationCtx,
// // //   orgId: string
// // // ) {
// // //   const identity = await ctx.auth.getUserIdentity();

// // //   if (!identity) {
// // //     return null;
// // //   }

// // //   const user = await ctx.db
// // //     .query("users")
// // //     .withIndex("by_tokenIdentifier", (q) =>
// // //       q.eq("tokenIdentifier", identity.tokenIdentifier)
// // //     )
// // //     .first();

// // //   if (!user) {
// // //     return null;
// // //   }

// // //   const hasAccess =
// // //     user.orgIds.some((item) => item.orgId === orgId) ||
// // //     user.tokenIdentifier.includes(orgId);

// // //   if (!hasAccess) {
// // //     return null;
// // //   }

// // //   return { user };
// // // }

// // // export const createFile = mutation({
// // //   args: {
// // //     name: v.string(),
// // //     fileId: v.id("_storage"),
// // //     orgId: v.string(),
// // //     type: fileTypes,
// // //   },
// // //   async handler(ctx, args) {
// // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // //     if (!hasAccess) {
// // //       throw new ConvexError("you do not have access to this org");
// // //     }

// // //     await ctx.db.insert("files", {
// // //       name: args.name,
// // //       orgId: args.orgId,
// // //       fileId: args.fileId,
// // //       type: args.type,
// // //       userId: hasAccess.user._id,
// // //     });
// // //   },
// // // });

// // // export const getFiles = query({
// // //   args: {
// // //     orgId: v.string(),
// // //     query: v.optional(v.string()),
// // //     favorites: v.optional(v.boolean()),
// // //     deletedOnly: v.optional(v.boolean()),
// // //     type: v.optional(fileTypes),
// // //   },
// // //   async handler(ctx, args) {
// // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // //     if (!hasAccess) {
// // //       return [];
// // //     }

// // //     let files = await ctx.db
// // //       .query("files")
// // //       .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
// // //       .collect();

// // //     const query = args.query;

// // //     if (query) {
// // //       files = files.filter((file) =>
// // //         file.name.toLowerCase().includes(query.toLowerCase())
// // //       );
// // //     }

// // //     if (args.favorites) {
// // //       const favorites = await ctx.db
// // //         .query("favorites")
// // //         .withIndex("by_userId_orgId_fileId", (q) =>
// // //           q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// // //         )
// // //         .collect();

// // //       files = files.filter((file) =>
// // //         favorites.some((favorite) => favorite.fileId === file._id)
// // //       );
// // //     }

// // //     if (args.deletedOnly) {
// // //       files = files.filter((file) => file.shouldDelete);
// // //     } else {
// // //       files = files.filter((file) => !file.shouldDelete);
// // //     }

// // //     if (args.type) {
// // //       files = files.filter((file) => file.type === args.type);
// // //     }

// // //     const filesWithUrl = await Promise.all(
// // //       files.map(async (file) => ({
// // //         ...file,
// // //         url: await ctx.storage.getUrl(file.fileId),
// // //       }))
// // //     );

// // //     return filesWithUrl;
// // //   },
// // // });

// // // export const deleteAllFiles = internalMutation({
// // //   args: {},
// // //   async handler(ctx) {
// // //     const files = await ctx.db
// // //       .query("files")
// // //       .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
// // //       .collect();

// // //     await Promise.all(
// // //       files.map(async (file) => {
// // //         await ctx.storage.delete(file.fileId);
// // //         return await ctx.db.delete(file._id);
// // //       })
// // //     );
// // //   },
// // // });

// // // function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
// // //   const canDelete =
// // //     file.userId === user._id ||
// // //     user.orgIds.find((org) => org.orgId === file.orgId)?.role === "admin";

// // //   if (!canDelete) {
// // //     throw new ConvexError("you have no acces to delete this file");
// // //   }
// // // }

// // // export const deleteFile = mutation({
// // //   args: { fileId: v.id("files") },
// // //   async handler(ctx, args) {
// // //     const access = await hasAccessToFile(ctx, args.fileId);

// // //     if (!access) {
// // //       throw new ConvexError("no access to file");
// // //     }

// // //     assertCanDeleteFile(access.user, access.file);

// // //     await ctx.db.patch(args.fileId, {
// // //       shouldDelete: true,
// // //     });
// // //   },
// // // });

// // // export const restoreFile = mutation({
// // //   args: { fileId: v.id("files") },
// // //   async handler(ctx, args) {
// // //     const access = await hasAccessToFile(ctx, args.fileId);

// // //     if (!access) {
// // //       throw new ConvexError("no access to file");
// // //     }

// // //     assertCanDeleteFile(access.user, access.file);

// // //     await ctx.db.patch(args.fileId, {
// // //       shouldDelete: false,
// // //     });
// // //   },
// // // });

// // // export const toggleFavorite = mutation({
// // //   args: { fileId: v.id("files") },
// // //   async handler(ctx, args) {
// // //     const access = await hasAccessToFile(ctx, args.fileId);

// // //     if (!access) {
// // //       throw new ConvexError("no access to file");
// // //     }

// // //     const favorite = await ctx.db
// // //       .query("favorites")
// // //       .withIndex("by_userId_orgId_fileId", (q) =>
// // //         q
// // //           .eq("userId", access.user._id)
// // //           .eq("orgId", access.file.orgId)
// // //           .eq("fileId", access.file._id)
// // //       )
// // //       .first();

// // //     if (!favorite) {
// // //       await ctx.db.insert("favorites", {
// // //         fileId: access.file._id,
// // //         userId: access.user._id,
// // //         orgId: access.file.orgId,
// // //       });
// // //     } else {
// // //       await ctx.db.delete(favorite._id);
// // //     }
// // //   },
// // // });

// // // export const getAllFavorites = query({
// // //   args: { orgId: v.string() },
// // //   async handler(ctx, args) {
// // //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// // //     if (!hasAccess) {
// // //       return [];
// // //     }

// // //     const favorites = await ctx.db
// // //       .query("favorites")
// // //       .withIndex("by_userId_orgId_fileId", (q) =>
// // //         q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// // //       )
// // //       .collect();

// // //     return favorites;
// // //   },
// // // });

// // // async function hasAccessToFile(
// // //   ctx: QueryCtx | MutationCtx,
// // //   fileId: Id<"files">
// // // ) {
// // //   const file = await ctx.db.get(fileId);

// // //   if (!file) {
// // //     return null;
// // //   }

// // //   const hasAccess = await hasAccessToOrg(ctx, file.orgId);

// // //   if (!hasAccess) {
// // //     return null;
// // //   }

// // //   return { user: hasAccess.user, file };
// // // }

// // import { ConvexError, v } from "convex/values";
// // import {
// //   MutationCtx,
// //   QueryCtx,
// //   internalMutation,
// //   mutation,
// //   query,
// // } from "./_generated/server";
// // import { getUser } from "./users";
// // import { fileTypes } from "./schema";
// // import { Doc, Id } from "./_generated/dataModel";

// // export const generateUploadUrl = mutation(async (ctx) => {
// //   const identity = await ctx.auth.getUserIdentity();

// //   if (!identity) {
// //     throw new ConvexError("you must be logged in to upload a file");
// //   }

// //   return await ctx.storage.generateUploadUrl();
// // });

// // export async function hasAccessToOrg(
// //   ctx: QueryCtx | MutationCtx,
// //   orgId: string
// // ) {
// //   const identity = await ctx.auth.getUserIdentity();

// //   if (!identity) {
// //     return null;
// //   }

// //   const user = await ctx.db
// //     .query("users")
// //     .withIndex("by_tokenIdentifier", (q) =>
// //       q.eq("tokenIdentifier", identity.tokenIdentifier)
// //     )
// //     .first();

// //   if (!user) {
// //     return null;
// //   }

// //   const hasAccess =
// //     user.orgIds.some((item) => item.orgId === orgId) ||
// //     user.tokenIdentifier.includes(orgId);

// //   if (!hasAccess) {
// //     return null;
// //   }

// //   return { user };
// // }

// // export const createFile = mutation({
// //   args: {
// //     name: v.string(),
// //     fileId: v.id("_storage"),
// //     orgId: v.string(),
// //     type: fileTypes,
// //   },
// //   async handler(ctx, args) {
// //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// //     if (!hasAccess) {
// //       throw new ConvexError("you do not have access to this org");
// //     }

// //     await ctx.db.insert("files", {
// //       name: args.name,
// //       orgId: args.orgId,
// //       fileId: args.fileId,
// //       type: args.type,
// //       userId: hasAccess.user._id,
// //     });
// //   },
// // });

// // export const getFiles = query({
// //   args: {
// //     orgId: v.string(),
// //     query: v.optional(v.string()),
// //     favorites: v.optional(v.boolean()),
// //     deletedOnly: v.optional(v.boolean()),
// //     type: v.optional(fileTypes),
// //   },
// //   async handler(ctx, args) {
// //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// //     if (!hasAccess) {
// //       return [];
// //     }

// //     let files = await ctx.db
// //       .query("files")
// //       .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
// //       .collect();

// //     const query = args.query;

// //     if (query) {
// //       files = files.filter((file) =>
// //         file.name.toLowerCase().includes(query.toLowerCase())
// //       );
// //     }

// //     if (args.favorites) {
// //       const favorites = await ctx.db
// //         .query("favorites")
// //         .withIndex("by_userId_orgId_fileId", (q) =>
// //           q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// //         )
// //         .collect();

// //       files = files.filter((file) =>
// //         favorites.some((favorite) => favorite.fileId === file._id)
// //       );
// //     }

// //     if (args.deletedOnly) {
// //       files = files.filter((file) => file.shouldDelete);
// //     } else {
// //       files = files.filter((file) => !file.shouldDelete);
// //     }

// //     if (args.type) {
// //       files = files.filter((file) => file.type === args.type);
// //     }

// //     const filesWithUrl = await Promise.all(
// //       files.map(async (file) => ({
// //         ...file,
// //         url: await ctx.storage.getUrl(file.fileId),
// //       }))
// //     );

// //     return filesWithUrl;
// //   },
// // });

// // export const deleteAllFiles = internalMutation({
// //   args: {},
// //   async handler(ctx) {
// //     const files = await ctx.db
// //       .query("files")
// //       .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
// //       .collect();

// //     await Promise.all(
// //       files.map(async (file) => {
// //         await ctx.storage.delete(file.fileId);
// //         return await ctx.db.delete(file._id);
// //       })
// //     );
// //   },
// // });

// // function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
// //   const canDelete =
// //     file.userId === user._id ||
// //     user.orgIds.find((org) => org.orgId === file.orgId)?.role === "admin";

// //   if (!canDelete) {
// //     throw new ConvexError("you have no acces to delete this file");
// //   }
// // }

// // export const deleteFile = mutation({
// //   args: { fileId: v.id("files") },
// //   async handler(ctx, args) {
// //     const access = await hasAccessToFile(ctx, args.fileId);

// //     if (!access) {
// //       throw new ConvexError("no access to file");
// //     }

// //     assertCanDeleteFile(access.user, access.file);

// //     await ctx.db.patch(args.fileId, {
// //       shouldDelete: true,
// //     });
// //   },
// // });

// // export const restoreFile = mutation({
// //   args: { fileId: v.id("files") },
// //   async handler(ctx, args) {
// //     const access = await hasAccessToFile(ctx, args.fileId);

// //     if (!access) {
// //       throw new ConvexError("no access to file");
// //     }

// //     assertCanDeleteFile(access.user, access.file);

// //     await ctx.db.patch(args.fileId, {
// //       shouldDelete: false,
// //     });
// //   },
// // });

// // export const toggleFavorite = mutation({
// //   args: { fileId: v.id("files") },
// //   async handler(ctx, args) {
// //     const access = await hasAccessToFile(ctx, args.fileId);

// //     if (!access) {
// //       throw new ConvexError("no access to file");
// //     }

// //     const favorite = await ctx.db
// //       .query("favorites")
// //       .withIndex("by_userId_orgId_fileId", (q) =>
// //         q
// //           .eq("userId", access.user._id)
// //           .eq("orgId", access.file.orgId)
// //           .eq("fileId", access.file._id)
// //       )
// //       .first();

// //     if (!favorite) {
// //       await ctx.db.insert("favorites", {
// //         fileId: access.file._id,
// //         userId: access.user._id,
// //         orgId: access.file.orgId,
// //       });
// //     } else {
// //       await ctx.db.delete(favorite._id);
// //     }
// //   },
// // });

// // export const getAllFavorites = query({
// //   args: { orgId: v.string() },
// //   async handler(ctx, args) {
// //     const hasAccess = await hasAccessToOrg(ctx, args.orgId);

// //     if (!hasAccess) {
// //       return [];
// //     }

// //     const favorites = await ctx.db
// //       .query("favorites")
// //       .withIndex("by_userId_orgId_fileId", (q) =>
// //         q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
// //       )
// //       .collect();

// //     return favorites;
// //   },
// // });

// // async function hasAccessToFile(
// //   ctx: QueryCtx | MutationCtx,
// //   fileId: Id<"files">
// // ) {
// //   const file = await ctx.db.get(fileId);

// //   if (!file) {
// //     return null;
// //   }

// //   const hasAccess = await hasAccessToOrg(ctx, file.orgId);

// //   if (!hasAccess) {
// //     return null;
// //   }

// //   return { user: hasAccess.user, file };
// // }

// import { ConvexError, v } from "convex/values";
// import {
//   MutationCtx,
//   QueryCtx,
//   internalMutation,
//   mutation,
//   query,
// } from "./_generated/server";
// import { getUser } from "./users";
// import { fileTypes } from "./schema";
// import { Doc, Id } from "./_generated/dataModel";

// // Default organization for personal files
// const defaultOrgId = "personal";

// // Generate upload URL mutation (remains the same)
// export const generateUploadUrl = mutation(async (ctx) => {
//   const identity = await ctx.auth.getUserIdentity();

//   if (!identity) {
//     throw new ConvexError("you must be logged in to upload a file");
//   }

//   return await ctx.storage.generateUploadUrl();
// });

// // Check if the user has access to a given org (modified for personal uploads)
// async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
//   const identity = await ctx.auth.getUserIdentity();

//   if (!identity) {
//     return null;
//   }

//   const user = await ctx.db
//     .query("users")
//     .withIndex("by_tokenIdentifier", (q) =>
//       q.eq("tokenIdentifier", identity.tokenIdentifier)
//     )
//     .first();

//   if (!user) {
//     return null;
//   }

//   const hasAccess =
//     user.orgIds.some((item) => item.orgId === orgId) ||
//     user.tokenIdentifier.includes(orgId);

//   if (!hasAccess) {
//     return null;
//   }

//   return { user };
// }

// // Create file mutation (no orgId required, default to "personal" orgId)
// export const createFile = mutation({
//   args: {
//     name: v.string(),
//     fileId: v.id("_storage"),
//     type: fileTypes,
//   },
//   async handler(ctx, args) {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new ConvexError("You must be logged in to upload a file.");
//     }

//     // Default to "personal" if no orgId is provided
//     const orgId = defaultOrgId;

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_tokenIdentifier", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier)
//       )
//       .first();

//     if (!user) {
//       throw new ConvexError("User not found.");
//     }

//     // Insert file with the userId and default orgId
//     await ctx.db.insert("files", {
//       name: args.name,
//       fileId: args.fileId,
//       orgId, // Default "personal" orgId
//       type: args.type,
//       userId: user._id, // Associate file with the user
//     });
//   },
// });

// // Get files query (modified for personal file access)
// export const getFiles = query({
//   args: {
//     orgId: v.string(),
//     query: v.optional(v.string()),
//     favorites: v.optional(v.boolean()),
//     deletedOnly: v.optional(v.boolean()),
//     type: v.optional(fileTypes),
//   },
//   async handler(ctx, args) {
//     // No access check for orgId; using the "personal" orgId
//     const orgId = args.orgId || defaultOrgId;

//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       return [];
//     }

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_tokenIdentifier", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier)
//       )
//       .first();

//     if (!user) {
//       return [];
//     }

//     let files = await ctx.db
//       .query("files")
//       .withIndex("by_orgId", (q) => q.eq("orgId", orgId)) // Using default orgId
//       .collect();

//     const query = args.query;

//     if (query) {
//       files = files.filter((file) =>
//         file.name.toLowerCase().includes(query.toLowerCase())
//       );
//     }

//     if (args.favorites) {
//       const favorites = await ctx.db
//         .query("favorites")
//         .withIndex("by_userId_orgId_fileId", (q) =>
//           q.eq("userId", user._id).eq("orgId", orgId)
//         )
//         .collect();

//       files = files.filter((file) =>
//         favorites.some((favorite) => favorite.fileId === file._id)
//       );
//     }

//     if (args.deletedOnly) {
//       files = files.filter((file) => file.shouldDelete);
//     } else {
//       files = files.filter((file) => !file.shouldDelete);
//     }

//     if (args.type) {
//       files = files.filter((file) => file.type === args.type);
//     }

//     const filesWithUrl = await Promise.all(
//       files.map(async (file) => ({
//         ...file,
//         url: await ctx.storage.getUrl(file.fileId),
//       }))
//     );

//     return filesWithUrl;
//   },
// });

// // Delete all files mutation
// export const deleteAllFiles = internalMutation({
//   args: {},
//   async handler(ctx) {
//     const files = await ctx.db
//       .query("files")
//       .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
//       .collect();

//     await Promise.all(
//       files.map(async (file) => {
//         await ctx.storage.delete(file.fileId);
//         return await ctx.db.delete(file._id);
//       })
//     );
//   },
// });

// // Delete file mutation (checks for file access)
// export const deleteFile = mutation({
//   args: { fileId: v.id("files") },
//   async handler(ctx, args) {
//     const access = await hasAccessToFile(ctx, args.fileId);

//     if (!access) {
//       throw new ConvexError("no access to file");
//     }

//     assertCanDeleteFile(access.user, access.file);

//     await ctx.db.patch(args.fileId, {
//       shouldDelete: true,
//     });
//   },
// });

// // Restore file mutation
// export const restoreFile = mutation({
//   args: { fileId: v.id("files") },
//   async handler(ctx, args) {
//     const access = await hasAccessToFile(ctx, args.fileId);

//     if (!access) {
//       throw new ConvexError("no access to file");
//     }

//     assertCanDeleteFile(access.user, access.file);

//     await ctx.db.patch(args.fileId, {
//       shouldDelete: false,
//     });
//   },
// });

// // Toggle favorite mutation
// export const toggleFavorite = mutation({
//   args: { fileId: v.id("files") },
//   async handler(ctx, args) {
//     const access = await hasAccessToFile(ctx, args.fileId);

//     if (!access) {
//       throw new ConvexError("no access to file");
//     }

//     const favorite = await ctx.db
//       .query("favorites")
//       .withIndex("by_userId_orgId_fileId", (q) =>
//         q
//           .eq("userId", access.user._id)
//           .eq("orgId", access.file.orgId)
//           .eq("fileId", access.file._id)
//       )
//       .first();

//     if (!favorite) {
//       await ctx.db.insert("favorites", {
//         fileId: access.file._id,
//         userId: access.user._id,
//         orgId: access.file.orgId,
//       });
//     } else {
//       await ctx.db.delete(favorite._id);
//     }
//   },
// });

// // Get all favorites query
// export const getAllFavorites = query({
//   args: { orgId: v.string() },
//   async handler(ctx, args) {
//     const orgId = args.orgId || defaultOrgId;
//     const hasAccess = await hasAccessToOrg(ctx, orgId);

//     if (!hasAccess) {
//       return [];
//     }

//     const favorites = await ctx.db
//       .query("favorites")
//       .withIndex("by_userId_orgId_fileId", (q) =>
//         q.eq("userId", hasAccess.user._id).eq("orgId", orgId)
//       )
//       .collect();

//     return favorites;
//   },
// });

// // Helper function to check access to file
// async function hasAccessToFile(
//   ctx: QueryCtx | MutationCtx,
//   fileId: Id<"files">
// ) {
//   const file = await ctx.db.get(fileId);

//   if (!file) {
//     return null;
//   }

//   const hasAccess = await hasAccessToOrg(ctx, file.orgId);

//   if (!hasAccess) {
//     return null;
//   }

//   return { user: hasAccess.user, file };
// }

// // Helper function to assert file deletion permissions
// function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
//   const canDelete =
//     file.userId === user._id ||
//     user.orgIds.find((org) => org.orgId === file.orgId)?.role === "admin";

//   if (!canDelete) {
//     throw new ConvexError("you have no access to delete this file");
//   }
// }

import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      userId: hasAccess.user._id,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        )
        .collect();

      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      );
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );

    return filesWithUrl;
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        return await ctx.db.delete(file._id);
      })
    );
  },
});

function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
  const canDelete =
    file.userId === user._id ||
    user.orgIds.find((org) => org.orgId === file.orgId)?.role === "admin";

  if (!canDelete) {
    throw new ConvexError("you have no acces to delete this file");
  }
}

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    assertCanDeleteFile(access.user, access.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });
  },
});

export const restoreFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    assertCanDeleteFile(access.user, access.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
});

export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getAllFavorites = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
      )
      .collect();

    return favorites;
  },
});

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
}
