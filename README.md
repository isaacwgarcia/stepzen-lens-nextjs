# Full Stack Application using Stepzen, Lens Protocol and NextJS.

Lens Protocol is a platform to build web3 social applications. In this tutorial we will use Stepzen to easily integrate and automatically fetch and render a social media feed.

## Getting Started

To get started we'll first create and configure the Next.js application.

npx create-next-app stepzen-lens-nextjs

Install Typescript:

npm i --save-dev typescript @types/node

Install MaterialUI:

npm install @mui/material @emotion/react @emotion/styled

## Create your Stepzen account

Copy your account_name and admin_key after you create your account at www.stepzen.com. We'll use it later.

```
MBP: npm install -g stepzen
MBP: stepzen login -a account_name
Enter your Admin Key when prompted
```

## Importing our Lens GraphQL endpoint

Create a stepzen folder:

```
MBP:stepzen-lens-nextjs: mkdir stepzen
MBP:stepzen-lens-nextjs: cd stepzen
MBP:stepzen isaacgarcia$: stepzen import graphql
```

Endpoint URL: https://api.lens.dev  
Prefix to add to all generated type names (leave blank for none)
Add an HTTP header, e.g. Header-Name: header value (leave blank for none)

Type stepzen start

Your API url is going to look like this: https://rogers.stepzen.net/api/goodly-peahen/__graphql

Create a .env.local file in root directory of the project

```
STEPZEN_API_KEY=
STEPZEN_API_URL=
```

## Defining our first query

Let's define our first GraphQL query to get our timeline.

Create a file api.ts inside components/lib directory.

```
export async function getLensTimeline() {
  try {
    const timeline = await fetch(`${process.env.STEPZEN_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
      },

      body: JSON.stringify({
        query: `
          query MyQuery {
            explorePublications(request: {sortCriteria: LATEST}) {
              items {
                ... on Post {
                  appId
                  createdAt
                  metadata {
                    description
                    content
                    image
                  }
                  profile {
                    handle
                    ownedBy
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const info = await timeline.json();
    return info?.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
}
```

## Creating our API

In pages/api/timeline/index.ts

```
import { NextApiRequest, NextApiResponse } from "next";
import { getLensTimeline } from "../../../components/lib/api";
import nc from "next-connect";

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  try {
    const timeline = await getLensTimeline();
    return res.json(timeline);
  } catch (e) {
    return res.json({ status: "error fetching API" });
  }
});
```

Don't forget to install npm i next-connect

The query will fetch a list of latest posts from Lens. For more information about how to use different querys and search criterias you can find more information [https://docs.lens.xyz/docs/explore-publications](here)

## Fetching our API every

Inside pages/index.tsx we will define getServerSideProps() and SWR hooks for data fetching. refreshInterval sets a 20 second auto-refresh interval.

```
import Head from "next/head";
import React from "react";
import { getLensTimeline } from "../components/lib/api";
import useSWR, { SWRConfig } from "swr";
import { Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
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

```
