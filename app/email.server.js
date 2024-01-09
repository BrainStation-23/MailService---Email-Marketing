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
  offetTextDesign
) => {
  console.log(sendMailTo);
  console.log(html);
  console.log(shopdata);
  console.log(selectedProduct);
  mailOptions.to = sendMailTo;
  mailOptions.subject = subject;
  mailOptions.text = message;
  mailOptions.html = render(
    <NikeReceiptEmail
      offertext={offertext}
      subtext={subtext}
      shopData={JSON.parse(shopdata)}
      selectedProduct={JSON.parse(selectedProduct)}
      selectedProductImages={JSON.parse(selectedProductImages)}
      offetTextDesign={JSON.parse(offetTextDesign)}
    />
  );

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfull");
  } catch (error) {
    console.error(error.message);
  }
};
