import type { NextApiRequest, NextApiResponse } from 'next'
import { apiGet } from "../../../utils/fetch-utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL



  if (backendUrl) {
    res.send(req.query)
  }
}
