// import productSimple from "./images/productSimple.png";

import {
  Body,
  Container,
  Column,
  Head,
  Heading,
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

export const NikeReceiptEmail = ({
  offertext,
  subtext,
  shopData,
  selectedProduct,
  selectedProductImages,
  offetTextDesign,
}) => (
  <Html>
    <Head />
    <Preview>Get your order summary, estimated delivery date and more</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={message}>
          <Img
            src={`${baseUrl}/static/nike-logo.png`}
            width="66"
            height="22"
            alt="Nike"
            style={{ margin: "auto" }}
          />
          <Heading style={offetTextDesign}>{offertext} </Heading>
          <Text style={global.text}>{subtext} </Text>
        </Section>

        <Hr style={global.hr} />
        <Section style={paddingY}>
          <Text style={global.heading}>Top Picks For You</Text>

          <Row style={recomendations.container}>
            {/* <Column
              style={{ ...recomendations.product, paddingLeft: "4px" }}
              align="center"
            >
              <Img
                src={`${baseUrl}/static/nike-recomendation-1.png`}
                alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                width="100%"
              />
              <Text style={recomendations.title}>
                USWNT 2022/23 Stadium Home
              </Text>
              <Text style={recomendations.text}>
                Women's Nike Dri-FIT Soccer Jersey
              </Text>
            </Column>
            <Column style={recomendations.product} align="center">
              <Img
                src={`${baseUrl}/static/nike-recomendation-2.png`}
                alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                width="100%"
              />
              <Text style={recomendations.title}>
                Brazil 2022/23 Stadium Goalkeeper
              </Text>
              <Text style={recomendations.text}>
                Men's Nike Dri-FIT Short-Sleeve Football Shirt
              </Text>
            </Column>
            <Column style={recomendations.product} align="center">
              <Img
                src={`${baseUrl}/static/nike-recomendation-4.png`}
                alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                width="100%"
              />
              <Text style={recomendations.title}>FFF</Text>
              <Text style={recomendations.text}>Women's Soccer Jacket</Text>
            </Column>
            <Column
              style={{ ...recomendations.product, paddingRight: "4px" }}
              align="center"
            >
              <Img
                src={`${baseUrl}/static/nike-recomendation-4.png`}
                alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                width="100%"
              />
              <Text style={recomendations.title}>FFF</Text>
              <Text style={recomendations.text}>
                Women's Nike Pre-Match Football Top
              </Text>
            </Column>
             */}

            {selectedProduct.length == 0 ? (
              <Column
                style={{ ...recomendations.product, paddingLeft: "4px" }}
                align="center"
              >
                <Img alt="" width="100%" height="100%" />
              </Column>
            ) : (
              selectedProduct?.map((data, index) => {
                const rowLEn = selectedProduct.length;
                return (
                  <Column
                    key={index}
                    style={{ ...recomendations.product, paddingLeft: "4px" }}
                    align="center"
                  >
                    {selectedProductImages
                      .filter((imageData) => imageData.product_id === data.id)
                      .map((filteredImageData, index) => (
                        <Img
                          alt=""
                          width="180px"
                          height="200px"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          src={filteredImageData.src}
                          key={index}
                        />
                      ))}
                    <Text style={recomendations.title}>{data.title}</Text>
                    <Text style={recomendations.title}>
                      {data.variants[0]?.price}{" "}
                    </Text>
                  </Column>
                );
              })
            )}
          </Row>
        </Section>

        <Hr style={{ ...global.hr, marginTop: "12px" }} />
        <Section style={paddingY}>
          <Row style={footer.policy}>
            <Text style={global.heading}>{shopData.name}</Text>
          </Row>
          <Text style={footer.text}>{shopData.email}</Text>
          <Text style={footer.text}>
            {shopData.city},{"-"} {shopData.zip}. {shopData.country_name},
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default NikeReceiptEmail;

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  },
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  },
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  border: "1px solid #E5E5E5",
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
};

const adressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const recomendationsText = {
  margin: "0",
  fontSize: "15px",
  lineHeight: "1",
  paddingLeft: "10px",
  paddingRight: "10px",
};

const recomendations = {
  container: {
    padding: "20px 0",
    width: "465px",
    overflow: "auto",
  },
  product: {
    verticalAlign: "top",
    textAlign: "left",
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  title: { ...recomendationsText, paddingTop: "12px", fontWeight: "500" },
  text: {
    ...recomendationsText,
    paddingTop: "4px",
    color: "#747474",
  },
};

const menu = {
  container: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
    backgroundColor: "#F7F7F7",
  },
  content: {
    ...paddingY,
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  title: {
    paddingLeft: "20px",
    paddingRight: "20px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "13.5px",
    marginTop: 0,
    fontWeight: 500,
    color: "#000",
  },
  tel: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "32px",
    paddingBottom: "22px",
  },
};

const categories = {
  container: {
    width: "370px",
    margin: "auto",
    paddingTop: "12px",
  },
  text: {
    fontWeight: "500",
    color: "#000",
  },
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  },
};
