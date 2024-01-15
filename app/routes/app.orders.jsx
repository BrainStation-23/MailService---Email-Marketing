import { useState, useEffect } from "react";
import { DiamondAlertMinor } from "@shopify/polaris-icons";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Page,
  Text,
  IndexTable,
  EmptyState,
  Pagination,
  Button,
  Spinner,
  Badge,
  useIndexResourceState,
  IndexFilters,
  useSetIndexFiltersMode,
  EmptySearchResult,
  Card,
  RadioButton,
  LegacyStack,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

import {
  QUERY_NEXT_ORDERS,
  QUERY_ORDERS,
  QUERY_PREVIOUS_ORDERS,
} from "utils/queries";

const PER_PAGE_ORDER_TO_SHOW = 10;

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  let orders, error;

  try {
    orders = await admin.graphql(QUERY_ORDERS, {
      variables: {
        input: PER_PAGE_ORDER_TO_SHOW,
        query: "",
      },
    });
  } catch (err) {
    return json({
      orders,

      error: "Something went wrong. Please try again !",
    });
  }

  return json({
    orders: await orders.json(),
    error,
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };

  let orders = [];
  let error;

  // @ts-ignore

  const variablesObj = {
    query: data.query,
  };

  try {
    if (data.action === "next") {
      // @ts-ignore
      orders = await admin.graphql(QUERY_NEXT_ORDERS, {
        variables: {
          first: PER_PAGE_ORDER_TO_SHOW,
          after: data.after,
          ...variablesObj,
        },
      });
    } else if (data.action === "previous") {
      // @ts-ignore
      orders = await admin.graphql(QUERY_PREVIOUS_ORDERS, {
        variables: {
          last: PER_PAGE_ORDER_TO_SHOW,
          before: data.before,
          ...variablesObj,
        },
      });
    } else if (data.action === "filter" || data.action === "sort") {
      // @ts-ignore
      orders = await admin.graphql(QUERY_ORDERS, {
        variables: {
          query: data.query,
          input: PER_PAGE_ORDER_TO_SHOW,
        },
      });
    }
  } catch (error) {
    return json({
      orders: [],
      error: "Something went wrong. Please try again !",
    });
  }

  // @ts-ignore
  orders = await orders.json();

  return json({
    orders,
    error,
  });
};

export default function Order() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const nav = useNavigation();

  const [edges, setEdges] = useState([]);
  const [pageInfo, setPageInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const [perPage, setPerpage] = useState(0);
  const [sheet, setSheet] = useState(false);

  const { mode, setMode } = useSetIndexFiltersMode();

  const loaderData = useLoaderData();
  console.log("loaderData" + JSON.stringify(loaderData.orders));
  const actionData = useActionData();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const resourceName = {
    singular: "order",
    plural: "orders",
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
      actionData?.orders?.data?.orders?.edges
        ? actionData?.orders?.data?.orders?.edges?.map((edge) => ({
            ...edge,
            id: edge?.node?.legacyResourceId,
          }))
        : loaderData?.orders?.data?.orders?.edges?.map((edge) => ({
            ...edge,
            id: edge?.node?.legacyResourceId,
          }))
    );

    // setEdges([]);

    setPageInfo(
      actionData?.orders?.data?.orders?.pageInfo
        ? actionData?.orders?.data?.orders?.pageInfo
        : loaderData?.orders?.data?.orders?.pageInfo
    );

    setError(actionData?.error ? actionData?.error : loaderData?.error);

    setLoading(false);
    setTableLoading(false);
  }, [
    loaderData?.orders?.data?.orders?.edges,
    loaderData?.orders?.data?.orders?.pageInfo,
    actionData?.orders?.data?.orders?.edges,
    actionData?.orders?.data?.orders?.pageInfo,
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
    FULFILLED: "success",
    IN_PROGRESS: "attention",
    ON_HOLD: "attention",
    OPEN: "info",
    PARTIALLY_FULFILLED: "info",
    PENDING_FULFILLMENT: "info",
    RESTOCKED: "critical",
    SCHEDULED: "attention",
    UNFULFILLED: "warning",
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
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Order
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Date
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Customer
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Total
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Payment status
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Fulfillment status
                </span>
              ),
            },
            {
              title: (
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Send Email
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
                    node: order,
                  },
                  index
                ) => (
                  <IndexTable.Row
                    key={index}
                    id={
                      // @ts-ignore
                      order?.legacyResourceId
                    }
                    position={index}
                    // @ts-ignore
                    selected={selectedResources?.includes(
                      // @ts-ignore
                      order?.legacyResourceId
                    )}
                  >
                    {renderTableCell(
                      // @ts-ignore
                      order?.name
                    )}

                    {renderTableCell(
                      `${
                        // @ts-ignore
                        order?.createdAt
                      }`
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      `${order?.customer?.firstName || ""} ${
                        // @ts-ignore
                        order?.customer?.lastName || ""
                      }`
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      `${order?.currentTotalPriceSet?.shopMoney?.amount} ${order?.currencyCode}`
                    )}

                    {renderTableCell(
                      // @ts-ignore

                      // <Badge
                      // // @ts-ignore
                      // >
                      //   {
                      //     // @ts-ignore
                      //     order?.displayFinancialStatus
                      //   }
                      // </Badge>
                      <Badge
                        tone={getBadgeColor(order?.displayFinancialStatus)}
                      >
                        {order?.displayFinancialStatus}
                      </Badge>
                    )}

                    {renderTableCell(
                      // @ts-ignore
                      <Badge
                        tone={getBadgeColorFulfillment(
                          order?.displayFulfillmentStatus
                        )}
                      >
                        {order?.displayFulfillmentStatus}
                      </Badge>
                    )}

                    <IndexTable.Cell>
                      {/* <HorizontalStack align="end"> */}
                      <Button
                        textAlign="end"
                        primary
                        variant="primary"
                        tone="success"
                        onClick={() => {
                          setLoading(true);

                          navigate(
                            `/app/order/${
                              // @ts-ignore
                              order?.legacyResourceId
                            }`
                          );
                        }}
                      >
                        Send Email
                      </Button>
                      {/* </HorizontalStack> */}
                    </IndexTable.Cell>
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
        heading="No order is placed in this store."
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      ></EmptyState>
    );
  };

  const renderEmptyTable = () => {
    return (
      <EmptySearchResult
        title={"No orders with the applied filters"}
        description={" Changing the search term and try again"}
        withIllustration
      />
    );
  };

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
          <Spinner size="large" accessibilityLabel="Loading" />
        </div>
      ) : error ? (
        <Page style={{ padding: "10px", backgroundColor: "#db1111" }}>
          <Card style={{ padding: "10px", backgroundColor: "#db1111" }}>
            {/* Something went wrong */}
            <Spinner accessibilityLabel="Spinner example" size="large" />;
          </Card>
        </Page>
      ) : edges?.length || queryValue ? (
        <Page fullWidth={true}>
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
                  label="Orders"
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
}
