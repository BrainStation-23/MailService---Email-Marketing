import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { PlaidVerifyIdentityEmail } from "./email/discountCode";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "EmailMarketing.Email.Order@gmail.com",
    pass: "ghwdayetrszgfsmg",
  },
});

const mailOptions = {
  from: "EmailMarketing.Email.Order@gmail.com",
  to: "bsse1111@iit.du.ac.bd",
  subject: "Test mail",
  text: "Test mail from remix server",
  html: "fdas",
};

export const sendMail = async (
  sendMailTo,
  subject,
  message,
  html,
  caption,
  text,
  code,
  shopdata
) => {
  console.log(sendMailTo);
  console.log(shopdata);
  console.log(caption);
  console.log(text);

  mailOptions.to = sendMailTo;
  mailOptions.subject = subject;
  mailOptions.text = message;
  const parseOrDefault = (jsonString, defaultValue = "{}") => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error(`Error parsing JSON: ${error.message}`);
      return JSON.parse(defaultValue);
    }
  };
  mailOptions.html = render(
    <PlaidVerifyIdentityEmail
      caption={caption}
      text={text}
      code={code}
      shopData={parseOrDefault(shopdata)}
    />
  );

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error.message);
  }
};
