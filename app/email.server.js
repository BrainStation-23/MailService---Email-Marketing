import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { NikeReceiptEmail } from "./email/emailSend";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email.marketing.bs23@gmail.com",
    pass: "ihvrkbkxrwmiorrv",
  },
});

const mailOptions = {
  from: "email.marketing.bs23@gmail.com",
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
  offertext,
  subtext,
  shopdata,
  selectedProduct,
  selectedProductImages,
  offetTextDesign,
  subtextDesign,
  footerDesign,
  productCaption
) => {
  console.log(sendMailTo);
  console.log(html);
  console.log(shopdata);
  console.log(selectedProduct);
  console.log(productCaption);

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
    <NikeReceiptEmail
      offertext={offertext}
      subtext={subtext}
      shopData={parseOrDefault(shopdata)}
      selectedProduct={parseOrDefault(selectedProduct)}
      selectedProductImages={parseOrDefault(selectedProductImages)}
      offetTextDesign={parseOrDefault(offetTextDesign)}
      subtextDesign={parseOrDefault(subtextDesign)}
      footerDesign={parseOrDefault(footerDesign)}
      productCaption={productCaption}
    />
  );

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error(error.message);
  }
};
