import { useEffect, useCallback, useState } from "react";
import { json } from "@remix-run/node";
// import { Switch, FormControl, FormLabel } from "@chakra-ui/react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  Form,
} from "@remix-run/react";
import {
  Page,
  Layout,
  RangeSlider,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Divider,
  Sheet,
  TextField,
  Tooltip,
  ColorPicker,
  Icon,
  EmptySearchResult,
  IndexFilters,
  useSetIndexFiltersMode,
  IndexTable,
  useIndexResourceState,
  Badge,
  Thumbnail,
  EmptyState,
  Pagination,
  Spinner,
  Modal,
} from "@shopify/polaris";
import { EmailMajor, ImageMajor } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import {
  QUERY_NEXT_ORDERS,
  QUERY_PRODUCT,
  QUERY_PREVIOUS_ORDERS,
} from "utils/queries";
const PER_PAGE_PRODUCT_TO_SHOW = 10;

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const shoepData = await admin.rest.resources.Shop.all({ session: session });
  console.log(shoepData);
  let products, error;

  try {
    products = await admin.graphql(QUERY_PRODUCT, {
      variables: {
        input: PER_PAGE_PRODUCT_TO_SHOW,
        query: "",
      },
    });
  } catch (err) {
    return json({
      products,
      error: "Something went wrong. Please try again !",
    });
  }
  // products = await products.json();
  console.log(products);
  return json({
    products: await products.json(),
    error,
    shopData: shoepData.data[0],
  });
};

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);

//   return null;
// };
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  console.log(data);
  let products;
  let error;

  // @ts-ignore

  const variablesObj = {
    query: data.query,
  };

  try {
    // if (data.action === "initial") {
    //   console.log("It is inital ");
    //   products = await admin.graphql(QUERY_PRODUCT, {
    //     variables: {
    //       input: PER_PAGE_PRODUCT_TO_SHOW,
    //       ...variablesObj,
    //     },
    //   });
    //   console.log(products);
    // } else
    if (data.action === "next") {
      console.log("YES next it is ");
      // @ts-ignore
      products = await admin.graphql(QUERY_NEXT_ORDERS, {
        variables: {
          first: PER_PAGE_PRODUCT_TO_SHOW,
          after: data.after,
          ...variablesObj,
        },
      });
      console.log(products);
    } else if (data.action === "previous") {
      console.log("YES previous it is ");
      // @ts-ignore
      products = await admin.graphql(QUERY_PREVIOUS_ORDERS, {
        variables: {
          last: PER_PAGE_PRODUCT_TO_SHOW,
          before: data.before,
          ...variablesObj,
        },
      });
    } else if (data.action === "filter" || data.action === "sort") {
      // @ts-ignore
      products = await admin.graphql(QUERY_PRODUCT, {
        variables: {
          query: data.query,
          input: PER_PAGE_PRODUCT_TO_SHOW,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return json({
      products: [],
      error: "Something went wrong. Please try again !",
    });
  }

  console.log(JSON.stringify(products));

  // @ts-ignore
  console.log(products);
  products = await products.json();
  console.log("products == " + products);
  return json({
    products,
    error,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  console.log(JSON.stringify(actionData?.products));
  const submit = useSubmit();
  const loaderData = useLoaderData();
  console.log(loaderData);
  console.log(loaderData.shopData.name);
  // State
  const [subject, setSubject] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [offertext, setOffertext] = useState("UP TO 30% OFF");
  const [subtext, setSubtext] = useState(
    "To kick off the New Year on a high note, we're thrilled to announce our Warehouse Liquidation Event"
  );
  // main text
  const [fontSize, setFontSize] = useState(60);
  const [lineHeight, setLineHeight] = useState(150);
  const [sheetDiscount, setSheetDiscount] = useState(false);
  // subtext

  const [fontSizeSubtext, setFontSizeSubtext] = useState(15);
  const [lineHeightSubtext, setLineHeightSubtext] = useState(150);
  const [sheetSubtext, setSheetSubtext] = useState(false);
  const [productModal, setProductModal] = useState(false);

  const [color, setColor] = useState({
    hue: 300,
    brightness: 1,
    saturation: 0.7,
    alpha: 0.7,
  });
  const [colorSubtext, setColorSubtext] = useState({
    hue: 100,
    brightness: 0,
    saturation: 0.1,
    alpha: 0.1,
  });
  // new
  const [edges, setEdges] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const { mode, setMode } = useSetIndexFiltersMode();

  // function

  const handleChangeSubject = useCallback((newValue) => setSubject(newValue));
  const handleRangeFontSizeChange = useCallback((value) => setFontSize(value));
  const handleRangeFontSizeChangeSubtext = useCallback((value) =>
    setFontSizeSubtext(value)
  );
  const handleRangeLineHEightChange = useCallback((value) =>
    setLineHeight(value)
  );
  const handleRangeLineHEightChangeSubtext = useCallback((value) =>
    setLineHeightSubtext(value)
  );
  const toggleSheetActive = useCallback(
    () => setSheetDiscount((sheetDiscount) => !sheetDiscount),
    []
  );
  const toggleSheetActiveSubtext = useCallback(
    () => setSheetSubtext((sheetSubtext) => !sheetSubtext),
    []
  );
  const handleChangePreviewText = useCallback((newValue) =>
    setPreviewText(newValue)
  );

  const handleClick = () => {
    setSheetDiscount(true);
  };
  const handleClickSubtext = () => {
    setSheetSubtext(true);
  };
  const handleClickProduct = () => {
    setProductModal(true);
    // submit({ action: "initial", query: "" }, { method: "POST" });
  };
  const handleChangeProductModal = () => {
    setProductModal(false);
  };
  const handelOfferText = useCallback((newValue) => setOffertext(newValue));
  const handelSubtext = useCallback((newValue) => setSubtext(newValue));

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const resourceName = {
    singular: "product",
    plural: "products",
  };
  const [value, setValue] = useState(0);
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const filters = [];
  const tabs = [];
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(edges);
  const handleFiltersQueryChange = (value) => {
    setQueryValue(value);
    setTableLoading(true);
    submit(
      {
        action: "filter",
        query: value,
        // @ts-ignore
        after: pageInfo?.endCursor,
      },
      {
        method: "POST",
      }
    );

    if (value === "") {
      setLoading(true);
    }
  };

  useEffect(() => {
    setEdges(
      actionData?.products?.data?.products?.edges
        ? actionData?.products?.data?.products?.edges?.map((edge) => ({
            ...edge,
            id: edge?.node?.legacyResourceId,
          }))
        : loaderData?.products?.data?.products?.edges?.map((edge) => ({
            ...edge,
            id: edge?.node?.legacyResourceId,
          }))
    );

    // setEdges([]);

    setPageInfo(
      actionData?.products?.data?.products?.pageInfo
        ? actionData?.products?.data?.products?.pageInfo
        : loaderData?.products?.data?.products?.pageInfo
    );

    setError(actionData?.error ? actionData?.error : loaderData?.error);

    setLoading(false);
    setTableLoading(false);
  }, [
    loaderData?.products?.data?.products?.edges,
    loaderData?.products?.data?.products?.pageInfo,
    actionData?.products?.data?.products?.edges,
    actionData?.products?.data?.products?.pageInfo,
    actionData?.error,
    loaderData?.error,
  ]);

  const renderTableCell = (value) => {
    return (
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {value}
        </Text>
      </IndexTable.Cell>
    );
  };
  const FINANCIAL_STATUS = {
    AUTHORIZED: "info",
    EXPIRED: "critical",
    PAID: "success",
    PARTIALLY_PAID: "info",
    PARTIALLY_REFUNDED: "info",
    PENDING: "attention",
    REFUNDED: "info",
    VOIDED: "info",
  };

  const STATUS = {
    ACTIVE: "success",
    DRAFT: "attention",
  };

  const getBadgeColor = (order) => {
    // const financialStatus = order?.displayFinancialStatus;
    // console.log(order);
    return FINANCIAL_STATUS[order];
  };
  const getBadgeColorFulfillment = (order) => {
    // const financialStatus = order?.displayFinancialStatus;
    // console.log(order);
    return STATUS[order];
  };

  const renderOrdersTable = () => {
    return (
      <>
        <IndexFilters
          mode={mode}
          setMode={setMode}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          filters={filters}
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => {
            handleFiltersQueryChange("");
            setQueryValue("");
          }}
          // @ts-ignore

          tabs={tabs}
          onClearAll={() => {}}
          cancelAction={{
            onAction: () => {},
            disabled: false,
            loading: false,
          }}
          loading={tableLoading}
        />

        <IndexTable
          headings={[
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}></span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Product
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Status
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Inventory
                </span>
              ),
            },
          ]}
          itemCount={edges?.length}
          resourceName={resourceName}
          selectable={false}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources?.length
          }
          onSelectionChange={handleSelectionChange}
        >
          {edges?.length
            ? edges.map(
                (
                  {
                    // @ts-ignore
                    node: product,
                  },
                  index
                ) => (
                  <IndexTable.Row
                    key={index}
                    id={
                      // @ts-ignore
                      product?.legacyResourceId
                    }
                    position={index}
                    // @ts-ignore
                    selected={selectedResources?.includes(
                      // @ts-ignore
                      product?.legacyResourceId
                    )}
                  >
                    {renderTableCell(
                      <div>
                        {product?.featuredImage && (
                          <Thumbnail
                            source={product.featuredImage.url}
                            alt={product.title}
                            size="small"
                          />
                        )}
                      </div>
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      product?.title
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      // product?.status

                      <Badge tone={getBadgeColorFulfillment(product?.status)}>
                        {product?.status}
                      </Badge>
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      product?.totalInventory <= 0 ? (
                        <p
                          style={{ color: "red" }}
                        >{`${product?.totalInventory} in stock`}</p>
                      ) : product?.totalInventory <= 9 ? (
                        <p
                          style={{ color: "orange" }}
                        >{`${product?.totalInventory} in stock`}</p>
                      ) : (
                        <p
                          style={{ color: "green" }}
                        >{`${product?.totalInventory} in stock`}</p>
                      )
                    )}
                  </IndexTable.Row>
                )
              )
            : renderEmptyTable()}
        </IndexTable>
      </>
    );
  };

  const renderOrdersEmptyState = () => {
    return (
      <EmptyState
        heading="No products is placed in this store."
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      ></EmptyState>
    );
  };

  const renderEmptyTable = () => {
    return (
      <EmptySearchResult
        title={"No products with the applied filters"}
        description={" Changing the search term and try again"}
        withIllustration
      />
    );
  };

  const renderProductModal = () => {
    return (
      <>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absulate",
              top: "50%",
              color: "red",
            }}
          >
            <Spinner size="small" accessibilityLabel="Loading" />
          </div>
        ) : error ? (
          <Page style={{ padding: "10px", backgroundColor: "#db1111" }}>
            <Card style={{ padding: "10px", backgroundColor: "#db1111" }}>
              {/* Something went wrong */}
              <Spinner accessibilityLabel="Spinner example" size="small" />;
            </Card>
          </Page>
        ) : edges?.length || queryValue ? (
          <Page fullWidth={true}>
            <div
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {/* <Card>Products data</Card> */}
            </div>

            <br />

            {renderOrdersTable()}

            <br />

            {edges.length && (
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {" "}
                <Form>
                  <Pagination
                    label="Products"
                    // @ts-ignore
                    hasPrevious={pageInfo?.hasPreviousPage}
                    onPrevious={() => {
                      setTableLoading(true);
                      submit(
                        // @ts-ignore
                        {
                          action: "previous",
                          // @ts-ignore
                          before: pageInfo?.startCursor,
                          query: queryValue,
                        },
                        { method: "POST" }
                      );
                    }}
                    // @ts-ignore
                    hasNext={pageInfo?.hasNextPage}
                    onNext={() => {
                      setTableLoading(true);
                      submit(
                        // @ts-ignore
                        {
                          action: "next",
                          // @ts-ignore
                          after: pageInfo?.endCursor,
                          query: queryValue,
                        },
                        { method: "POST" }
                      );
                    }}
                  />
                </Form>
              </div>
            )}
          </Page>
        ) : (
          renderOrdersEmptyState()
        )}
      </>
    );
  };

  return (
    <Page>
      <div style={{ marginBottom: "1rem" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button variant="primary" tone="success" icon={EmailMajor}>
              Send email
            </Button>
          </div>{" "}
        </Card>
      </div>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ width: "40%" }}>
                    <TextField
                      label="Subject"
                      value={subject}
                      onChange={handleChangeSubject}
                      autoComplete="off"
                      placeholder="Subject"
                    />
                  </div>

                  <div style={{ width: "55%" }}>
                    <p>{previewText}</p>

                    <TextField
                      label="Preview Text"
                      value={previewText}
                      onChange={handleChangePreviewText}
                      multiline={4}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <Divider borderColor="border" />
                <BlockStack gap="300">
                  {productModal && (
                    <Modal
                      open={productModal}
                      onClose={handleChangeProductModal}
                      title="Reach more shoppers with Instagram product tags"
                      primaryAction={{
                        content: "Save",
                        onAction: handleChange,
                      }}
                    >
                      {renderProductModal()}
                    </Modal>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <Text variant="headingLg" as="h2">
                      {loaderData?.shopData?.name}
                    </Text>
                    {/* <Text variant="headingSm" as="h6" fontWeight="regular">
                      {loaderData?.shopData?.shop_owner}
                    </Text>
                    <Text variant="headingSm" as="h6" fontWeight="regular">
                      {loaderData?.shopData?.country_name}
                    </Text> */}
                  </div>
                </BlockStack>
                <div
                  style={{
                    background: `rgba(${color.hue}, ${
                      color.saturation * 100
                    }, ${color.brightness * 100}, ${color.alpha})`,
                    margin: "auto",
                    marginTop: "1rem",
                    height: `${lineHeight}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  <Tooltip active content="Click here to chenge the text">
                    <div>
                      <Text variant="headingLg" as="h5">
                        <p
                          style={{ fontSize: `${fontSize}px`, lineHeight: "1" }}
                        >
                          {" "}
                          {offertext}
                        </p>
                      </Text>
                    </div>
                  </Tooltip>
                </div>

                <div
                  style={{
                    background: `rgba(${colorSubtext.hue}, ${
                      colorSubtext.saturation * 100
                    }, ${colorSubtext.brightness * 100}, ${
                      colorSubtext.alpha
                    })`,
                    margin: "auto",
                    marginTop: "1rem",
                    height: `${lineHeightSubtext}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={handleClickSubtext}
                >
                  <Tooltip active content="Click here to chenge the text">
                    <div>
                      <Text variant="headingLg" as="h5">
                        <p
                          style={{
                            fontSize: `${fontSizeSubtext}px`,
                            lineHeight: "1.3",
                          }}
                        >
                          {" "}
                          {subtext}
                        </p>
                      </Text>
                    </div>
                  </Tooltip>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "3rem",
                    marginTop: "2rem",
                  }}
                  onClick={handleClickProduct}
                >
                  <div className="test">
                    <Icon
                      source={ImageMajor}
                      tone="base"
                      style={{ height: "200px", width: "200px" }}
                    />
                  </div>
                  <div>
                    <p>Title</p>
                    <p>Price</p>
                    <p>In stock</p>
                  </div>
                </div>
                <div
                  className="footer"
                  style={{
                    display: "flex",
                    alignContent: "center",
                    textAlign: "center",
                    flexDirection: "column",
                    background: "black",
                    color: "white",
                    padding: "1rem",
                  }}
                >
                  <Text variant="headingLg" as="h2">
                    {loaderData?.shopData?.name}
                  </Text>
                  <Text variant="headingSm" as="h6" fontWeight="regular">
                    {loaderData?.shopData?.city}, {loaderData?.shopData?.zip}
                  </Text>
                  <Text variant="headingSm" as="h6" fontWeight="regular">
                    {loaderData?.shopData?.country_name}
                  </Text>
                  <Text variant="headingSm" as="h6" fontWeight="regular">
                    {loaderData?.shopData?.email}
                  </Text>
                  <Text variant="headingSm" as="h6" fontWeight="regular">
                    {loaderData?.shopData?.phone}
                  </Text>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            {/* <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Enable email alerts?
              </FormLabel>
              <Switch id="email-alerts" />
            </FormControl> */}
            {sheetDiscount && (
              <div>
                <Sheet
                  open={sheetDiscount}
                  onClose={toggleSheetActive}
                  accessibilityLabel="Manage sales channels"
                >
                  <div
                    style={{ margin: "auto", marginTop: "2rem", width: "90%" }}
                  >
                    <TextField
                      label="Text"
                      value={offertext}
                      onChange={handelOfferText}
                      autoComplete="off"
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <RangeSlider
                      output
                      label="Line height (px) "
                      min={100}
                      max={200}
                      value={lineHeight}
                      onChange={handleRangeLineHEightChange}
                      suffix={
                        <p
                          style={{
                            minWidth: "24px",
                            textAlign: "right",
                          }}
                        >
                          {lineHeight}
                        </p>
                      }
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <RangeSlider
                      output
                      label="Text size (px) "
                      min={20}
                      max={70}
                      value={fontSize}
                      onChange={handleRangeFontSizeChange}
                      suffix={
                        <p
                          style={{
                            minWidth: "24px",
                            textAlign: "right",
                          }}
                        >
                          {fontSize}
                        </p>
                      }
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <p style={{ marginBottom: "6px" }}>Backgraound color</p>
                    <ColorPicker
                      label="Backgraound color"
                      onChange={setColor}
                      color={color}
                      allowAlpha
                    />
                  </div>

                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "1rem",
                      width: "100%",
                    }}
                  >
                    <Button onClick={toggleSheetActive}>Cancel</Button>
                  </div>
                </Sheet>
              </div>
            )}
            {sheetSubtext && (
              <div>
                <Sheet
                  open={sheetSubtext}
                  onClose={toggleSheetActiveSubtext}
                  accessibilityLabel="Manage sales channels"
                >
                  <div
                    style={{ margin: "auto", marginTop: "2rem", width: "90%" }}
                  >
                    <TextField
                      label="Text"
                      value={subtext}
                      onChange={handelSubtext}
                      autoComplete="off"
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <RangeSlider
                      output
                      label="Line height (px) "
                      min={100}
                      max={500}
                      value={lineHeightSubtext}
                      onChange={handleRangeLineHEightChangeSubtext}
                      suffix={
                        <p
                          style={{
                            minWidth: "24px",
                            textAlign: "right",
                          }}
                        >
                          {lineHeightSubtext}
                        </p>
                      }
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <RangeSlider
                      output
                      label="Text size (px) "
                      min={12}
                      max={25}
                      value={fontSizeSubtext}
                      onChange={handleRangeFontSizeChangeSubtext}
                      suffix={
                        <p
                          style={{
                            minWidth: "24px",
                            textAlign: "right",
                          }}
                        >
                          {fontSizeSubtext}
                        </p>
                      }
                    />
                  </div>
                  <div
                    style={{ margin: "auto", marginTop: "1rem", width: "90%" }}
                  >
                    <p style={{ marginBottom: "6px" }}>Backgraound color</p>
                    <ColorPicker
                      label="Backgraound color"
                      onChange={setColorSubtext}
                      color={colorSubtext}
                      allowAlpha
                    />
                  </div>

                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "1rem",
                      width: "100%",
                    }}
                  >
                    <Button onClick={toggleSheetActive}>Cancel</Button>
                  </div>
                </Sheet>
              </div>
            )}
            <BlockStack gap="200"></BlockStack>

            <BlockStack gap="200"></BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* <div style={{ marginBottom: "1rem" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button variant="primary" tone="success" icon={EmailMajor}>
              Send email
            </Button>
          </div>{" "}
        </Card>
      </div> */}

      {/* <div>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div style={{ width: "40%" }}>
              <p>{subject}</p>
              <TextField
                label="Subject"
                value={subject}
                onChange={handleChangeSubject}
                autoComplete="off"
                placeholder="Subject"
              />
            </div>

            <div style={{ width: "55%" }}>
              <p>{previewText}</p>

              <TextField
                label="Preview Text"
                value={previewText}
                onChange={handleChangePreviewText}
                multiline={4}
                autoComplete="off"
              />
            </div>
          </div>
          <Divider borderColor="border" />
          <div
            style={{
              background: "#faf6f3",
              width: "80%",
              margin: "auto",
              marginTop: "1rem",
              height: "200px",
              fontSize: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <p>{offertext}</p>
            </div>
          </div>
        </Card>
      </div> */}
    </Page>
  );
}
