import type { NextPage } from "next";
import { Welcome } from "@/components/Welcome/Welcome";
import { Container } from "@mantine/core";
import { useEffect, useState } from 'react';
import { CreateTestProfile } from "@/components/CreateTestProfile";
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

const Home: NextPage = () => {
   const [postIds, setPostIds] = useState([]);
  const [publicationData, setPublicationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostIds() {
      try {
        const response = await fetch('https://lens-api.k3l.io/feed/popular');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPostIds(data);
        console.log(postIds)
      } catch (error) {
        console.error('Error fetching post IDs:', error);
      }
    }

    fetchPostIds();
  }, []);


  return (
    <>
    <CreateTestProfile/>
    <Welcome />
  
    </>
  );
};

export default Home;
