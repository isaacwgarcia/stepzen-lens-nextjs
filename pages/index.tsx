import Head from "next/head";
import React from "react";
import { getLensTimeline } from "../components/lib/api";
import useSWR, { SWRConfig } from "swr";
import { Box, LinearProgress } from "@mui/material";
import LensCardPost from "../components/ItemCardLens";
import Image from "next/image";

function Home({ fallback }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const revalidationOptions = {
    refreshInterval: process.env
      .REFRESH_MILISECONDS_INTERVAL as unknown as number,
  };
  const { data } = useSWR("api/timeline", fetcher, revalidationOptions);

  return (
    <div>
      <Head>
        <title>Lens Feed</title>
        <meta name="description" content="Stepzen - Lens Feed" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig value={{ fallback }}>
        {data ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row", color: "green" }}>
              <Image
                width="50"
                height="50"
                alt="Lens Logo"
                src="https://files.readme.io/a0959e6-lens-logo1.svg"
              />
              <h1>Feed</h1>
            </Box>
            <Box padding="1vw">
              {data.explorePublications ? (
                data.explorePublications?.items?.map((post, i) => {
                  if (post) {
                    var date = new Date(post.createdAt);
                    return (
                      <div key={i}>
                        <LensCardPost
                          key={i}
                          appId={post.appId}
                          createdAt={date}
                          description={post.description}
                          content={post.metadata.content}
                          image={post.metadata.image}
                          handle={post.profile.handle}
                          ownedBy={post.profile.ownedBy}
                        />
                        <br />
                      </div>
                    );
                  }
                })
              ) : (
                <>Something happened!</>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: "100%" }} mt="25%">
            <LinearProgress color="success" />
          </Box>
        )}
      </SWRConfig>
    </div>
  );
}

export async function getServerSideProps() {
  const timeline = await getLensTimeline();
  return {
    props: {
      fallback: {
        "api/timeline": timeline,
      },
    },
  };
}
export default Home;
