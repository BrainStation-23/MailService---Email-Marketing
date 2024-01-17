import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { AppleReceiptEmail } from "./email/orderRecipt";

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
  subject: "Your Order Information",
  text: "Test mail from remix server",
  html: "fdas",
};

export const sendMailOrder = async (sendMailTo, order, shopData) => {
  // console.log(sendMailTo);
  console.log(order);
  console.log(shopData);
  console.log(sendMailTo);
  mailOptions.to = sendMailTo;

  const parseOrDefault = (jsonString, defaultValue = "{}") => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error(`Error parsing JSON: ${error.message}`);
      return JSON.parse(defaultValue);
    }
  };
  // mailOptions.html = render();
  // <AppleReceiptEmail
  //   order={parseOrDefault(order)}
  //   shopData={parseOrDefault(shopData)}
  // />;

  mailOptions.html = render(
    <AppleReceiptEmail
      order={parseOrDefault(order)}
      shopData={parseOrDefault(shopData)}
    />
  );

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error.message);
  }
};
