import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function LensCardPost({
  appId,
  createdAt,
  description,
  content,
  image,
  handle,
  ownedBy,
}) {
  if (image?.indexOf("ipfs://") == 0) {
    //IPFS CID
    const fullUrl = image.replace("ipfs://", "https://ipfs.io/ipfs/");
    image = fullUrl;
  }

  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardMedia
        component="img"
        image={image ? image : "https://picsum.photos/200"}
      />
      <CardContent sx={{ flexWrap: "wrap" }}>
        <Typography gutterBottom variant="body2" component="div">
          <b> {appId}</b> - {handle} <br />
          {description}
        </Typography>

        <Typography gutterBottom variant="body2" component="p" fontSize="10px">
          {ownedBy}
          <br />
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {content}
          <br />
          {createdAt.toString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
