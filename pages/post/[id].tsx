import { useState } from "react";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ReferencePolicyType,
  CollectPolicyType,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";
import useUpload from "@/lib/useUpload";
import { Paper, UnstyledButton, Avatar, Spoiler, Tooltip, ActionIcon, Text } from "@mantine/core";
import { IconScriptPlus, IconScriptMinus, IconRecycle, IconStack3, IconMessageCircle } from "@tabler/icons-react";
import { Container, Link, Group, Space, Box } from "lucide-react";

const PostPage = () => {
  // Get the post ID from the URL
  const router = useRouter();
  const { id } = router.query;

  const upload = useUpload();
  const { toast } = useToast();

  const [comment, setComment] = useState<string>("");

  const activeProfile = useActiveProfile();

  const publication = usePublication({
    publicationId: id as PublicationId,
  });

  const comments = useComments({
    // @ts-ignore: TODO, it could be not found.
    commentsOf: publication?.data?.id,
  });

  const createComment = useCreateComment({
    // @ts-ignore: TODO, publisher may not be signed in
    publisher: activeProfile?.data,
    upload: (data: unknown) => upload(data),
  });

  if (publication?.loading) {
    return (
      <>
       
        <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
          <Skeleton className="h-[120px] animate-pulse bg-muted mt-3 w-full" />
          <Skeleton className="h-[64px] animate-pulse bg-muted mt-3 w-full" />
        </section>
      </>
    );
  }

  if (publication?.error) {
    return (
      <>

        <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Post not found
          </h1>
          <p className="leading-7">
            Sorry, that post doesn&rsquo;t exist, or it has been deleted.
          </p>

          <Button className="mt-2" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
    

      <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
        {!!publication?.data && activeProfile.data && (
          <Post
            post={publication?.data as PostType | Comment}
            className={cn("h-auto")}
            activeProfile={activeProfile?.data}
          />
        )}

        <div className="flex flex-row items-center border border-solid p-4 w-full rounded-md">
          <MediaRenderer
            src={
              // @ts-ignore
              activeProfile?.data?.picture?.original?.url || "/user.png" || ""
            }
            alt={`${
              activeProfile?.data?.name || activeProfile?.data?.handle || ""
            }'s profile picture`}
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
            onClick={async () => {
              try {
                if (!publication?.data) return;

                const result = await createComment?.execute({
                  contentFocus: ContentFocus.TEXT_ONLY,
                  publicationId: publication.data.id,
                  locale: "en",
                  content: comment,
                  collect: {
                    type: CollectPolicyType.NO_COLLECT,
                  },
                  reference: {
                    type: ReferencePolicyType.ANYONE,
                  },
                });

                if (result?.isFailure()) {
                  throw new Error("Failed to create comment");
                }

                setComment("");
                toast({
                  title: "Comment created.",
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
                        (publication.data as PostType | Comment)?.stats
                          ?.totalAmountOfComments || 4,
                    }).map((_, i) => (
                      <Skeleton
                        className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                        key={i}
                      />
                    ))}
                  </>
                }
              >
                {activeProfile.data &&
                  activeProfile.data !== null &&
                  comments?.data?.map((post: PostType | Comment) => (
                    <Post
                      key={post.id}
                      post={post}
                      activeProfile={activeProfile?.data!}
                    />
                  ))}
              </InfiniteScroll>
            </>
          )}
      </section>
    </>
  );
};

export default PostPage;
