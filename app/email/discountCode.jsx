import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Row,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const PlaidVerifyIdentityEmail = ({ caption, text, code, shopData }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* <Link href={`https://${shopData.myshopify_domain}`} style={footer}>
          {shopData.name}
        </Link>{" "} */}
        <Row style={footer}>
          <a
            href={`https://${shopData.myshopify_domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text>{shopData.name}</Text>
          </a>
        </Row>
        <Text style={tertiary}>{caption}</Text>
        <Heading style={secondary}>{text} </Heading>
        <Section style={codeContainer}>
          <Text style={codeStyle}>{code}</Text>
        </Section>
        <Text style={paragraph}>
          Contact{" "}
          <Link href={`https://${shopData.myshopify_domain}`} style={link}>
            {shopData.name}
          </Link>{" "}
          if you did not request this code.
        </Text>
      </Container>
      <Text style={footer}>
        Securely powered by
        <Link href={`https://${shopData.myshopify_domain}`} style={link}>
          {" "}
          {shopData.name}
        </Link>
      </Text>
    </Body>
  </Html>
);

export default PlaidVerifyIdentityEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  width: "360px",
  margin: "0 auto",
  padding: "20px 0 35px",
};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase",
  textAlign: "center",
};

const secondary = {
  color: "#000",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center",
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const codeStyle = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "17px",
  fontWeight: 700,
  letterSpacing: "2px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center",
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center",
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center",
  textTransform: "uppercase",
  justifyContent: "center",
};

const header = {
  color: "#0a85ea",
  fontSize: "30px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1rem",
  textTransform: "uppercase",
};
