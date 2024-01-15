import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { sendMailOrder } from "../orderEmail.server";

// import {
//   CLOCK_ICON,
//   CUSTOMER_ICON,
//   SHIPPING_ICON,
//   ORDER_ICON,
// } from "utils/icon/clock";

import {
  Spinner,
  Box,
  Card,
  Grid,
  LegacyCard,
  Select,
  BlockStack,
  Divider,
  Button,
  PageActions,
  DatePicker,
  Page,
  Text,
  Layout,
  Icon,
} from "@shopify/polaris";

import { authenticate } from "~/shopify.server";
import { useEffect, useState, useCallback } from "react";

export const loader = async ({ request, params }) => {
  const { admin, session } = await authenticate.admin(request);

  const shopData = await admin.rest.resources.Shop.all({ session: session });

  const shopID = String(shopData.data[0].id);

  const ID = params.id;
  // console.log(ID);

  const orderData = await admin.rest.resources.Order.find({
    session: session,
    id: parseInt(ID),
  });

  // console.log(orderData);

  // const metafield = await admin.rest.resources.Metafield.find({
  //   session: session,
  //   id: 39747778085141,
  // });

  return json({
    order: orderData,

    shopInfo: shopData?.data[0],
  });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };

  console.log(data.destinationMail);
  console.log(data.order);
  console.log(data.shopData);
  console.log(data.order.id);
  const OrderData = JSON.parse(data.order);

  const email = OrderData.email;
  const id = OrderData.id;
  const orderName = OrderData.name;
  const orderDate = OrderData.created_at;
  const discount = OrderData.total_discounts;
  const money = OrderData.current_total_price_set.shop_money.currency_code;
  const address = OrderData.customer.default_address.address1;
  const city = OrderData.customer.default_address.city;
  const zip = OrderData.customer.default_address.zip;
  const LineItem = OrderData.fulfillments;

  console.log(id);
  console.log(email);
  console.log(orderName);
  console.log(orderDate);
  console.log(discount);
  console.log(money);
  console.log(address);
  console.log(city);
  console.log(zip);
  console.log(LineItem);

  sendMailOrder(email, data.order, data.shopData);
  console.log(JSON.parse(data.order));
  return null;
};

export default function OrderDetailPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  console.log(loaderData.shopInfo);
  console.log(loaderData.order);
  console.log(actionData);
  const [selectedStatus, setSelectedStatus] = useState("");
  const nav = useNavigate();
  const [lode, setlode] = useState(false);
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const shopDomain = loaderData.shopInfo.domain;

  const handleGoSotreButtonClick = () => {
    const openUrl = `https://${shopDomain}/admin/themes/current/editor?template=customers/order&activateAppId=52fb08cb-27c9-46da-aadd-5a873b3c5e9d/order_tracking_status`;
    window.open(openUrl, "_blank");
  };
  let delavaryMonth;
  let delavaryYear;

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  // console.log(loaderData.metafieldOrder);
  // console.log("eee" + loaderData.metafieldDelaviryDate);

  const orderID = parseInt(loaderData.ID);

  const handelSendMailClick = () => {
    submit(
      {
        action: "sendmail",
        destinationMail: loaderData.order.customer_email,
        order: JSON.stringify(loaderData.order),
        shopData: JSON.stringify(loaderData.shopInfo),
      },
      { method: "POST" }
    );
  };

  return (
    <Page fullWidth>
      <PageActions
        primaryAction={
          <Button
            primary
            tone="success"
            variant="primary"
            onClick={() => {
              navigate("/app/orders");
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
            onClick={handelSendMailClick}
          >
            Send
          </Button>
        }
      />

      <Layout>
        <Layout.Section>
          <div style={{ margin: "auto", width: "70%" }}>
            <Card>
              <BlockStack gap="300">
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    alignContent: "center",
                    justifyContent: "space-between",
                    width: "80%",
                    margin: "auto",
                    marginBottom: "1rem",
                  }}
                >
                  <Text variant="headingLg" as="h1">
                    {loaderData?.shopInfo?.name}
                  </Text>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "300",
                      color: "#888888",
                    }}
                  >
                    Receipt
                  </p>
                </div>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <Text variant="headingMd" as="h1" fontWeight="regular">
                    Save {loaderData?.order?.total_discounts}{" "}
                    {
                      loaderData?.order?.current_total_price_set?.shop_money
                        ?.currency_code
                    }{" "}
                    on your purchases
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "15rem",
                    justifyContent: "center",
                    background: "#fafafa",
                    width: "80%",
                    margin: "auto",
                    padding: "1rem",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <Text>Order No</Text>
                      <Text>{loaderData?.order?.name}</Text>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <Text as="h1" variant="headingSm" fontWeight="regular">
                        Order placed
                      </Text>
                      <Text as="h1" variant="headingSm" fontWeight="regular">
                        {formatDate(loaderData?.order?.created_at)}
                      </Text>
                    </div>

                    <div style={{ marginBottom: "5px" }}>
                      <Text>Order Id</Text>
                      <Text>{loaderData?.order?.id}</Text>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <Text>Address</Text>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <Text as="h2" variant="headingSm" fontWeight="regular">
                        {loaderData?.order?.customer?.default_address?.address1
                          ? loaderData?.order?.customer?.default_address
                              ?.address1
                          : "---"}
                      </Text>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      {" "}
                      <Text as="h2" variant="headingSm" fontWeight="regular">
                        {loaderData?.order?.customer?.default_address?.zip
                          ? loaderData?.order?.customer?.default_address?.zip
                          : "---"}
                        -
                        {loaderData?.order?.customer?.default_address?.city
                          ? loaderData?.order?.customer?.default_address?.city
                          : "---"}
                      </Text>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      {" "}
                      <Text as="h2" variant="headingSm" fontWeight="regular">
                        {loaderData?.order?.customer?.default_address
                          ?.country_name
                          ? loaderData?.order?.customer?.default_address
                              ?.country_name
                          : "---"}
                      </Text>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginTop: "1rem",
                    background: "#fafafa",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <Text as="h1" variant="headingLg" fontWeight="regular">
                    {" "}
                    Order Item
                  </Text>
                </div>

                {loaderData?.order?.line_items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      width: "80%",
                      margin: "auto",
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #b7b2b2",
                    }}
                  >
                    <div>
                      <Text as="h1" variant="headingLg">
                        {item.title}
                      </Text>
                      <Text as="h4" variant="headingSm" fontWeight="regular">
                        Price: {item.price}{" "}
                        {item.price_set.shop_money.currency_code}
                      </Text>
                      <Text as="h4" variant="headingSm" fontWeight="regular">
                        x{item.quantity}{" "}
                      </Text>
                    </div>{" "}
                    <div>
                      <Text as="h3" variant="headingMd">
                        {item.price_set.shop_money.currency_code}{" "}
                        {item.price * item.quantity}
                      </Text>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    width: "80%",
                    margin: "auto",
                    textAlign: "end",
                  }}
                >
                  {" "}
                  <Text variant="headingMd" as="h3">
                    Total: {loaderData?.order.total_price}
                  </Text>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "5px" }}>
                    <a
                      href={`https://${loaderData?.shopInfo?.myshopify_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text variant="heading2xl" as="h1">
                        {loaderData?.shopInfo?.name}
                      </Text>
                    </a>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      width: "80%",
                      margin: "auto",
                    }}
                  >
                    <Text variant="headingSm" as="h5">
                      {loaderData?.shopInfo?.email} {"•  "}
                      {loaderData?.shopInfo?.city} {"-"}
                      {loaderData?.shopInfo?.country_name}
                    </Text>
                  </div>
                </div>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
