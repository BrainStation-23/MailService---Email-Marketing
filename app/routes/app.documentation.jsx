import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Badge,
} from "@shopify/polaris";

export default function AdditionalPage() {
  const videoStyle = {
    height: "500px",
    width: "100%",
    borderRadius: "10px",
  };
  return (
    <Page>
      <ui-title-bar title="How to set up the app " />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                <b>
                  Follow these video tutorial to set up the "Email:
                  Marketing-Order Receipt" app and manage everything
                </b>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text as="h1" variant="bodyLg" style={{ fontSize: "20px" }}>
              <b>Full Set Up Instraction in One Video</b>
            </Text>
            <Badge status="attention"> </Badge>
            <Card>
              <iframe
                title="Email: Marketing-Order Receipt app set up isnstruction Video"
                style={videoStyle}
                src="https://youtu.be/uB_qCJ69sZM"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Card>
          </Card>
        </Layout.Section>
      </Layout>
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
