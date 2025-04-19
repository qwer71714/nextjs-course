import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // 다양한 업로드 유형에 대한 경로 정의
  postImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // 이 코드는 업로드 전에 서버에서 실행됩니다
      const { userId } = await auth();
      if (!userId) throw new Error("인증되지 않음");

      // 여기서 반환된 것은 onUploadComplete에서 `metadata`로 접근할 수 있습니다
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        return { fileUrl: file.url };
      } catch (error) {
        console.error("onUploadComplete에서 오류 발생:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
