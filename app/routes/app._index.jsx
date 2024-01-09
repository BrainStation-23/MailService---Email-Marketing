import { useEffect, useCallback, useState } from "react";
import { json } from "@remix-run/node";
import { sendMail } from "../email.server";
// import { render } from "@react-email/render";
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
  MediaCard,
  Modal,
  InlineStack,
} from "@shopify/polaris";
import { EmailMajor, ImageMajor } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import productSimple from "./images/productSimple.png";

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
// export const action = async ({ request }) => {
//   const { admin, session } = await authenticate.admin(request);

//   const data = {
//     ...Object.fromEntries(await request.formData()),
//   };
//   console.log(data);
//   let products;
//   let error;

//   // @ts-ignore

//   let selectedProduct;
//   let selectedProductImages = [];
//   let imagesForProduct;
//   const variablesObj = {
//     query: data.query,
//   };

//   try {
//     if (data.action === "selected") {
//       console.log("selected");
//       const selectedResources = data.selectedResources.split(",");
//       selectedProduct = await admin.rest.resources.Product.all({
//         session: session,
//         ids: selectedResources.join(","),
//       });
//       selectedProductImages = await Promise.all(
//         selectedResources.map(async (productId) => {
//           imagesForProduct = await admin.rest.resources.Image.all({
//             session: session,
//             product_id: productId,
//           });
//           return imagesForProduct;
//         })
//       );

//       console.log(selectedProductImages);
//       console.log(selectedProduct);
//     } else if (data.action === "next") {
//       console.log("YES next it is ");
//       // @ts-ignore
//       products = await admin.graphql(QUERY_NEXT_ORDERS, {
//         variables: {
//           first: PER_PAGE_PRODUCT_TO_SHOW,
//           after: data.after,
//           ...variablesObj,
//         },
//       });
//       console.log(products);
//     } else if (data.action === "previous") {
//       console.log("YES previous it is ");
//       // @ts-ignore
//       products = await admin.graphql(QUERY_PREVIOUS_ORDERS, {
//         variables: {
//           last: PER_PAGE_PRODUCT_TO_SHOW,
//           before: data.before,
//           ...variablesObj,
//         },
//       });
//     } else if (data.action === "filter" || data.action === "sort") {
//       // @ts-ignore
//       products = await admin.graphql(QUERY_PRODUCT, {
//         variables: {
//           query: data.query,
//           input: PER_PAGE_PRODUCT_TO_SHOW,
//         },
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return json({
//       products: [],
//       error: "Something went wrong. Please try again !",
//     });
//   }

//   console.log(JSON.stringify(products));

//   // @ts-ignore
//   console.log(products);

//   console.log("products == " + products);
//   console.log(selectedProduct?.data);
//   console.log(imagesForProduct?.data);
//   console.log(JSON.stringify(selectedProductImages?.data));
//   console.log(selectedProductImages?.data);
//   console.log(selectedProductImages);
//   return json({
//     products: await products?.json(),
//     selectedProduct: selectedProduct?.data,
//     selectedProductImages: selectedProductImages?.data,
//     error,
//   });
// };
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  console.log(data.destinationMail);
  console.log(data.shopData);
  console.log(data.selectedProduct);

  if (data.action == "sendmail") {
    sendMail(
      data.destinationMail,
      data.subject,
      data.previewText,
      data.maildiv,
      data.offertext,
      data.subtext,
      data.shopData,
      data.selectedProduct,
      data.selectedProductImages,
      data.offetTextDesign
    );
  }

  console.log(data);
  let products;
  let error;

  // @ts-ignore

  let selectedProduct;
  let selectedProductImages = [];
  let imagesForProduct;
  const variablesObj = {
    query: data.query,
  };

  try {
    if (data.action === "selected") {
      console.log("selected");
      const selectedResources = data.selectedResources.split(",");
      selectedProduct = await admin.rest.resources.Product.all({
        session: session,
        ids: selectedResources.join(","),
      });
      selectedProductImages = await Promise.all(
        selectedResources.map(async (productId) => {
          imagesForProduct = await admin.rest.resources.Image.all({
            session: session,
            product_id: productId,
          });
          return imagesForProduct.data[0]; // Get the first image source
        })
      );

      console.log(selectedProductImages);
      console.log(selectedProduct);
    } else if (data.action === "next") {
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
      error: "Something went wrong. Please try again!",
    });
  }

  console.log(JSON.stringify(products));

  // @ts-ignore
  console.log(products);

  console.log("products == " + products);
  console.log(selectedProduct?.data);
  console.log(imagesForProduct?.data);
  console.log(JSON.stringify(selectedProductImages));
  console.log(selectedProductImages);
  return json({
    products: await products?.json(),
    selectedProduct: selectedProduct?.data,
    selectedProductImages: selectedProductImages,
    error,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  console.log("actionData" + actionData);
  console.log(
    "the selected product " + JSON.stringify(actionData?.selectedProduct)
  );
  console.log(
    "the selected product images " +
      JSON.stringify(actionData?.selectedProductImages)
  );
  console.log(JSON.stringify(actionData?.products));
  const submit = useSubmit();
  const loaderData = useLoaderData();
  console.log(loaderData);
  console.log(loaderData.shopData.name);
  // console.log(loaderData.selectedProduct);
  // State
  const [subject, setSubject] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [offertext, setOffertext] = useState("UP TO 30% OFF");
  const [subtext, setSubtext] = useState(
    "To kick off the New Year on a high note, we're thrilled to announce our Warehouse Liquidation Event"
  );
  const [destinationMail, setDestinationMail] = useState();
  // main text
  const [fontSize, setFontSize] = useState(60);
  const [lineHeight, setLineHeight] = useState(110);
  const [sheetDiscount, setSheetDiscount] = useState(false);
  const [mailActive, setMailActve] = useState(false);
  // subtext

  const [fontSizeSubtext, setFontSizeSubtext] = useState(15);
  const [lineHeightSubtext, setLineHeightSubtext] = useState(125);
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
  const handleChangeDestinationMail = useCallback((newValue) =>
    setDestinationMail(newValue)
  );
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
  const handleChangeMailActive = () => {
    setMailActve(false);
  };
  const openSendMail = () => {
    setMailActve(true);
  };

  // const handleSendMail = () => {
  //   const maildiv =
  //     document.getElementsByClassName("email__marketing")[0].innerHTML;
  //   console.log(maildiv);
  //   sendMail(destinationMail, subject, previewText, maildiv);

  //   console.log("send mail");
  // };

  const shopData = {
    name: loaderData?.shopData?.name,
    city: loaderData?.shopData?.city,
    zip: loaderData?.shopData?.zip,
    country_name: loaderData?.shopData?.country_name,
    email: loaderData?.shopData?.email,
  };

  const handleSendMail = () => {
    const maildiv =
      document.getElementsByClassName("email__marketing")[0].innerHTML;
    console.log(maildiv);
    // sendMail(destinationMail, subject, previewText, maildiv);
    submit(
      {
        action: "sendmail",
        destinationMail,
        subject,
        previewText,
        maildiv,
        offertext,
        subtext,
        shopData: JSON.stringify(shopData),
        selectedProduct: JSON.stringify(actionData?.selectedProduct),
        selectedProductImages: JSON.stringify(
          actionData?.selectedProductImages
        ),
        offetTextDesign: JSON.stringify(offetTextDesign),
      },
      {
        method: "POST",
        // action: "/send",
      }
    );

    console.log("send mail");
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
  const handleSelectedProduct = () => {
    submit(
      // @ts-ignore
      {
        action: "selected",
        selectedResources,
        // @ts-ignore
      },
      { method: "POST" }
    );
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
          // selectable={false}
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
  const offertextP = {
    fontSize: `${fontSize}px`,
    lineHeight: "1",
  };
  const offetTextDesign = {
    background: `rgba(${color.hue}, ${color.saturation * 100}, ${
      color.brightness * 100
    }, ${color.alpha})`,
    margin: "auto",
    marginTop: "1rem",
    height: `${lineHeight}px`,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    padding: "1rem 0",
    ...offertextP,
  };

  return (
    <Page>
      {/* <p>{selectedResources}</p> */}

      <div style={{ marginBottom: "1rem" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              variant="primary"
              tone="success"
              icon={EmailMajor}
              onClick={openSendMail}
            >
              Send email
            </Button>
          </div>{" "}
          <div className="send-mail__modal">
            <Modal
              open={mailActive}
              onClose={handleChangeMailActive}
              title="Destination email"
              primaryAction={{
                content: "Send",
                onAction: handleSendMail,
              }}
            >
              <Modal.Section>
                <TextField
                  placeholder="Destination email"
                  value={destinationMail}
                  onChange={handleChangeDestinationMail}
                  autoComplete="off"
                />
              </Modal.Section>
            </Modal>
          </div>
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
                <div className="email__marketing">
                  <BlockStack gap="300">
                    {productModal && (
                      <Modal
                        open={productModal}
                        onClose={handleChangeProductModal}
                        title="Reach more shoppers with Instagram product tags"
                        primaryAction={{
                          content: "Save",
                          onAction: handleSelectedProduct,
                        }}
                      >
                        {renderProductModal()}
                      </Modal>
                    )}

                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Text variant="headingLg" as="h1">
                        {loaderData?.shopData?.name}
                      </Text>
                    </div>
                  </BlockStack>
                  <div style={offetTextDesign} onClick={handleClick}>
                    <BlockStack gap={"200"}>
                      <Tooltip active content="Click here to chenge the text">
                        <Text variant="headingLg" as="h5">
                          <p style={offertextP}> {offertext}</p>
                        </Text>
                      </Tooltip>{" "}
                    </BlockStack>
                  </div>

                  <div
                    style={{
                      background: `rgba(${colorSubtext.hue}, ${
                        colorSubtext.saturation * 100
                      }, ${colorSubtext.brightness * 100}, ${
                        colorSubtext.alpha
                      })`,
                      margin: "auto",
                      // marginTop: "1rem",
                      height: `${lineHeightSubtext}px`,
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      textAlign: "center",
                      paddingTop: "2rem",
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

                  <Tooltip active content="Click here to add the product">
                    {" "}
                    <div
                      style={{
                        margin: "1rem 0 1rem 0",
                        cursor: "pointer",
                      }}
                      onClick={handleClickProduct}
                    >
                      {selectedResources.length == 0 ? (
                        <div style={{ border: "1px solid black" }}>
                          <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={productSimple}
                          />
                        </div>
                      ) : (
                        actionData?.selectedProduct?.map((data, index) => (
                          <div
                            style={{
                              border: "1px solid black",
                              marginBottom: "1rem",
                              padding: "1rem",
                              gap: "2rem",
                              alignItems: "center",
                            }}
                            key={data.id}
                          >
                            <InlineStack gap={"800"}>
                              <InlineStack gap="200">
                                {" "}
                                <div>
                                  {actionData?.selectedProductImages
                                    .filter(
                                      (imageData) =>
                                        imageData.product_id === data.id
                                    )
                                    .map((filteredImageData, index) => (
                                      <img
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
                                </div>
                              </InlineStack>
                              <InlineStack gap="200" blockAlign="center">
                                {" "}
                                <div style={{ lineHeight: "1.5" }}>
                                  <h1
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {data.title}
                                  </h1>
                                  <h3
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {" "}
                                    {loaderData?.shopData?.currency}{" "}
                                    {data.variants[0]?.price}{" "}
                                  </h3>
                                </div>
                              </InlineStack>
                            </InlineStack>
                          </div>
                        ))
                      )}
                    </div>
                  </Tooltip>

                  <div
                    className="footer"
                    style={{
                      // display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                      flexDirection: "column",
                      background: "black",
                      color: "white",
                      padding: "1rem",
                    }}
                  >
                    <BlockStack gap={"200"}>
                      <Text variant="headingLg" as="h1">
                        {loaderData?.shopData?.name}
                      </Text>
                      <Text variant="headingSm" as="h2" fontWeight="regular">
                        {loaderData?.shopData?.city},{" "}
                        {loaderData?.shopData?.zip}
                      </Text>
                      <Text variant="headingSm" as="h2" fontWeight="regular">
                        {loaderData?.shopData?.country_name}
                      </Text>
                      <Text variant="headingSm" as="h2" fontWeight="regular">
                        {loaderData?.shopData?.email}
                      </Text>
                      <Text variant="headingSm" as="h2" fontWeight="regular">
                        {loaderData?.shopData?.phone}
                      </Text>
                    </BlockStack>
                  </div>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
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
                    <Button onClick={toggleSheetActiveSubtext}>Cancel</Button>
                  </div>
                </Sheet>
              </div>
            )}
            <BlockStack gap="200"></BlockStack>

            <BlockStack gap="200"></BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
