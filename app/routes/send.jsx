import { send } from "process";
import { sendMail } from "../email.server";

export const loader = async ({ request }) => {
  sendMail("joy.matubber.41959@gmail.com", "test", "fsdfsdf", "<h1>hi</h1>");
  return null;
};
