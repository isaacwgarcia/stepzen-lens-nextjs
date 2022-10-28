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
