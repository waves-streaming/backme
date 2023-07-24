import { useState } from "react";
import { Nav } from "@/components/Navbar";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { cn } from "@/lib/utils";
import {
  Post as PostType,
  Comment,
  usePublication,
  PublicationId,
  useComments,
  useActiveProfile,
  useCreateComment,
  ContentFocus,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import { MediaRenderer, useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";

const PostPage = () => {
  // Get the post ID from the URL
  const router = useRouter();
  const { id } = router.query;

  const sdk = useSDK();
  const { toast } = useToast();

  const [comment, setComment] = useState<string>("");

  const activeProfile = useLensHookSafely(useActiveProfile);

  const publication = useLensHookSafely(usePublication, {
    publicationId: id as PublicationId,
  });

  const comments = useLensHookSafely(useComments, {
    // @ts-ignore: TODO, it could be not found.
    commentsOf: publication?.data?.id,
  });

  const createComment = useLensHookSafely(useCreateComment, {
    // @ts-ignore: TODO, publisher may not be signedi n
    publisher: activeProfile?.data,
    // TODO: SDK may be defined, we are forcing !
    upload: (data: unknown) => sdk!.storage.upload(data),
  });

  console.log("Comment:", createComment);

  if (publication?.error) {
    return (
      <>
        <Nav />

        <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Post not found
          </h1>
          <p className="leading-7">
            Sorry, that post doesn't exist, or it has been deleted.
          </p>

          <Button className="mt-2" onClick={() => router.push("/feed")}>
            Back to Feed
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
        {!!publication?.data && (
          <Post
            post={publication?.data as PostType | Comment}
            className={cn("h-auto")}
          />
        )}

        <div className="flex flex-row items-center border border-solid p-4 w-full rounded-md">
          <MediaRenderer
            // @ts-ignore
            src={activeProfile?.data?.picture?.original?.url || ""}
            alt={`${activeProfile?.data?.name || ""}'s profile picture`}
            height="40px"
            width="40px"
            className="rounded-full mr-4"
          />
          <Input
            type="text"
            placeholder="Enter your comment"
            className="border-0 h-full m-0 w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="ml-3"
            onClick={() => {
              try {
                if (!publication?.data) return;

                createComment?.execute({
                  contentFocus: ContentFocus.TEXT_ONLY,
                  publicationId: publication.data.id,
                  locale: "en",
                  content: comment,
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Failed to create comment",
                  description: `Something went wrong creating your comment. Please try again.`,
                });
              }
            }}
          >
            Comment
          </Button>
        </div>

        {!publication?.loading &&
          publication?.data &&
          !comments?.loading &&
          comments?.data && (
            <>
              <InfiniteScroll
                dataLength={comments?.data?.length || 0}
                next={() => comments?.next()}
                hasMore={comments?.hasMore}
                loader={
                  <>
                    {Array.from({
                      length:
                        (publication.data as PostType | Comment).stats
                          .totalAmountOfComments || 4,
                    }).map((_, i) => (
                      <Skeleton
                        className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                        key={i}
                      />
                    ))}
                  </>
                }
              >
                {comments?.data?.map((post: PostType | Comment) => (
                  <Post key={post.id} post={post} />
                ))}
              </InfiniteScroll>
            </>
          )}
      </section>
    </>
  );
};

export default PostPage;