import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/next";

const f = createUploadthing();

const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Optional: Add authentication check
      // const { userId } = auth();
      // if (!userId) throw new Error("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
      return { uploadedBy: "user" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export the handlers for Next.js App Router
const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export { GET, POST };