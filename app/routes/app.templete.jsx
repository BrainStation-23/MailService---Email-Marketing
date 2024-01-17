import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  Button,
  Banner,
  Modal,
  TextField,
  Divider,
  PageActions,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { sendMail } from "../codeEmail.server";
import { EmailMajor } from "@shopify/polaris-icons";

import discountCodeTemplete from "./images/discountCodeTemplete.png";
import { useState, useCallback } from "react";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shoepData = await admin.rest.resources.Shop.all({ session: session });
  console.log(shoepData);

  return json({
    shopData: shoepData.data[0],
  });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };

  console.log(data.destinationMail);
  console.log(data.caption);
  console.log(data.text);
  console.log(data.code);
  if (data.action == "sendmail") {
    sendMail(
      data.destinationMail,
      data.subject,
      data.previewText,
      data.maildiv,
      data.caption,
      data.text,
      data.code,
      data.shopData
    );
  }

  return null;
};

export default function AdditionalPage() {
  const loaderData = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedTemplete, setSelectedTemplete] = useState("");
  const [caption, setCaption] = useState("GET YOUR DUSCOUNT CODE");
  const [text, setText] = useState("Enter the following code to get 20% off");
  const [code, setCode] = useState("BloomWinter20");
  const [destinationMail, setDestinationMail] = useState("");
  const [subject, setSubject] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const handleChangePreviewText = useCallback((newValue) =>
    setPreviewText(newValue)
  );

  const [modal, setModal] = useState(false);

  const handleCloseModal = () => {
    setModal(false);
  };
  const handelDiscountCodeTemplete = () => {
    setModal(true);
    setSelectedTemplete("discount");
  };

  const handleCaption = useCallback((newValue) => setCaption(newValue));
  const handleText = useCallback((newValue) => setText(newValue));
  const handleCode = useCallback((newValue) => setCode(newValue));
  const handleMail = useCallback((newValue) => setDestinationMail(newValue));
  const handleChangeSubject = useCallback((newValue) => setSubject(newValue));
  const shopData = {
    name: loaderData?.shopData?.name,
    city: loaderData?.shopData?.city,
    zip: loaderData?.shopData?.zip,
    country_name: loaderData?.shopData?.country_name,
    email: loaderData?.shopData?.email,
    myshopify_domain: loaderData?.shopData?.myshopify_domain,
  };
  const handelSendMailCode = () => {
    submit(
      {
        action: "sendmail",
        destinationMail,
        subject,
        previewText,
        maildiv: "<h1>fasas</h1>",
        caption,
        text,
        code,
        shopData: JSON.stringify(shopData),
      },
      {
        method: "POST",
      }
    );
  };

  return (
    <Page>
      <ui-title-bar title="Template page" />
      <PageActions
        primaryAction={
          <Button
            primary
            tone="success"
            variant="primary"
            onClick={() => {
              navigate("/app");
            }}
          >
            Back
          </Button>
        }
        secondaryActions={
          <Button
            primary
            tone="success"
            variant="primary"
            icon={EmailMajor}
            onClick={handelSendMailCode}
          >
            Send mail
          </Button>
        }
      />
      <div style={{ marginBottom: "2rem" }}>
        <Banner title="Template">
          <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
            <TextField
              label="Destination Email"
              placeholder="Enter your mail "
              value={destinationMail}
              onChange={handleMail}
              autoComplete="off"
            />
            <TextField
              label="Subject"
              value={subject}
              onChange={handleChangeSubject}
              autoComplete="off"
              placeholder="Subject"
            />
          </div>
          <div>
            <TextField
              label="Preview Text"
              value={previewText}
              onChange={handleChangePreviewText}
              multiline={4}
              autoComplete="off"
            />
          </div>
        </Banner>
      </div>

      <InlineGrid gap="400">
        <BlockStack>
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",

                marginTop: "1rem",
                marginBottom: "1rem",
                justifyContent: "space-around",
              }}
            >
              <div style={{ marginLeft: "1rem", width: "60%" }}>
                <Card>
                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <a
                      href={`https://${loaderData?.shopData?.myshopify_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text variant="heading2xl" as="h1">
                        {loaderData?.shopData?.name}
                      </Text>
                    </a>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      color: "#50a3fc",
                    }}
                  >
                    <Text variant="headingMd" as="h4">
                      {caption}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Text variant="headingLg" as="h3">
                      {text}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      background: "#f2f2f2",
                      width: "250px",
                      height: "50px",
                      margin: "auto",
                      alignItems: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <Text variant="headingSm" as="h3">
                      {code}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <Text variant="headingMd" as="h5" fontWeight="regular">
                      Contact{" "}
                      <u style={{ fontWeight: "600", cursor: "pointer" }}>
                        {loaderData?.shopData?.name}{" "}
                      </u>
                      if you did not access this code.
                    </Text>
                  </div>
                  <Divider borderColor="border-inverse" />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      textTransform: "uppercase",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <Text>
                      SECURELY POWERED BY {loaderData?.shopData?.name}
                    </Text>
                  </div>
                </Card>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Caption"
                    value={caption}
                    onChange={handleCaption}
                    autoComplete="off"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Text"
                    value={text}
                    onChange={handleText}
                    autoComplete="off"
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Discound code"
                    value={code}
                    onChange={handleCode}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </div>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
