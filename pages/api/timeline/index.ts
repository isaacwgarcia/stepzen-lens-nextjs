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
