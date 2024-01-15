import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}
export const AppleReceiptEmail = ({ order, shopData }) => (
  <Html>
    <Head />
    <Preview>Order Receipt</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Column>
            <a
              href={`https://${shopData?.myshopify_domain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={headingName}
            >
              <Text style={headingName}>{shopData?.name}</Text>
            </a>
            {/* <Text style={headingName}>{shopData.name}</Text> */}
          </Column>

          <Column align="right" style={tableCell}>
            <Text style={heading}>Receipt</Text>
          </Column>
        </Section>
        <Section>
          <Text style={cupomText}>
            Save {order.total_discounts}{" "}
            {order.current_total_price_set.shop_money.currency_code} on your
            purchases
          </Text>
        </Section>
        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Order No</Text>
                  <Text style={informationTableLabel}>{order.name}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Order placed</Text>
                  <Text style={informationTableValue}>
                    {" "}
                    {formatDate(order.created_at)}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>Order Id</Text>
                  <Text style={informationTableLabel}>{order.id}</Text>
                </Column>
              </Row>
            </Column>
            <Column style={informationTableColumn} colSpan={2}>
              <Text style={informationTableLabel}>Address</Text>
              <Text style={informationTableValue}>
                {order?.customer?.default_address?.address1
                  ? order?.customer?.default_address?.address1
                  : "---"}{" "}
              </Text>
              <Text style={informationTableValue}>
                {order?.customer?.default_address?.zip
                  ? order?.customer?.default_address?.zip
                  : "---"}
                -
                {order?.customer?.default_address?.city
                  ? order?.customer?.default_address?.city
                  : "---"}
              </Text>
              <Text style={informationTableValue}>
                {order?.customer?.default_address?.country_name
                  ? order?.customer?.default_address?.country_name
                  : "---"}{" "}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Order Item</Text>
        </Section>
        {order?.line_items.map((item, index) => (
          <Section
            key={index}
            style={{ borderBottom: "1px solid  #b7b2b2", padding: "10px 0" }}
          >
            <React.Fragment>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>{item.title}</Text>
                <Text style={productDescription}>
                  Price: {item.price} {item.price_set.shop_money.currency_code}{" "}
                </Text>
                <Text style={productDescription}>x{item.quantity} </Text>
              </Column>

              <Column style={productPriceWrapper} align="right">
                <Text style={productPrice}>
                  {item.price_set.shop_money.currency_code}{" "}
                  {item.price * item.quantity}
                </Text>
              </Column>
            </React.Fragment>
          </Section>
        ))}
        <Hr style={productPriceLine} />
        <Section align="right">
          <Column style={tableCell} align="right">
            <Text style={productPriceTotal}>TOTAL</Text>
          </Column>
          <Column style={productPriceVerticalLine}></Column>
          <Column style={productPriceLargeWrapper}>
            <Text style={productPriceLarge}> {order.total_price}</Text>
          </Column>
        </Section>
        <Hr style={productPriceLineBottom} />
      </Container>
    </Body>
  </Html>
);

export default AppleReceiptEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};
const headingName = {
  fontSize: "32px",
  fontWeight: "300",
};
const cupomText = {
  textAlign: "center",
  margin: "36px 0 40px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
};

const informationTable = {
  borderCollapse: "collapse",
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right",
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap",
  textAlign: "right",
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const walletBottomLine = { margin: "65px 0 20px 0" };

const footerIcon = { display: "block", margin: "40px 0 0 0", fontSize: "32px" };

const footerLinksWrapper = {
  textAlign: "center",
  fontSize: "12px",
  justifuContent: "center",
  display: "flex",
};
