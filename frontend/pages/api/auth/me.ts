import { axiosClient } from "@lib/axios-client";
import { NextApiRequest, NextApiResponse } from "next/types";
import consoleRender from "../../../helpers/console-helper";
import { UserInterface } from "../../../interfaces/cmsInterfaces";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      const response = await axiosClient.get(
        "http://backend:8000/api/auth/user",
        {
          headers: { Authorization: `JWT ${JSON.parse(body).token}` },
        }
      );
      consoleRender("response", response);
      const user: UserInterface = response.data;
      res.status(200).json(user);
      break;
    case "PUT":
      res.status(200).json({ put: "oK" });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
