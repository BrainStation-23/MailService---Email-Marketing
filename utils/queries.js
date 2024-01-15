export const SHOP_DETAILS = `query fetchShopDetails {
  shop {
    id
  }
}`;

export const QUERY_PRODUCT = `query GetProducts ($input: Int, $query: String!) {
  products(first: $input, query: $query) {
    edges {
      node {
        id
        title
        vendor
        totalInventory
        status
        legacyResourceId
        featuredImage {
          id
          url
        }
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;
export const QUERY_NEXT_PRODUCT = `query GetProducts($first: Int, $after: String, $query: String!) {
  products(first: $first, after: $after,  query: $query) {
    edges {
      node {
        id
        title
        vendor
        totalInventory
        status
        legacyResourceId
          featuredImage {
          id
          url
        }
        
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;

export const QUERY_PREVIOUS_PRODUCT = `query GetProducts($last: Int, $before: String, $query: String!) {
  products(last: $last, before: $before, query: $query) {
    edges {
      node {
        id
        title
        vendor
        totalInventory
        status
        legacyResourceId
        featuredImage {
          id
          url
        }
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;

export const QUERY_ORDERS = `query GetOrders($input: Int, $query: String!) {
  orders(first: $input, query: $query) {
    edges {
      node {
        id
        name
        legacyResourceId
        createdAt
        currencyCode
        customer {
          firstName
          lastName
        }
        currentTotalPriceSet {
          shopMoney {
            amount
          }
        }
        displayFinancialStatus
        displayFulfillmentStatus
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;
export const QUERY_NEXT_ORDERS = `query GetOrders($first: Int, $after: String, $query: String!) {
  orders(first: $first, after: $after,  query: $query) {
    edges {
      node {
        id
        name
        legacyResourceId
        createdAt
        currencyCode
        customer {
          firstName
          lastName
        }
        currentTotalPriceSet {
          shopMoney {
            amount
          }
        }
        displayFinancialStatus
        displayFulfillmentStatus
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;

export const QUERY_PREVIOUS_ORDERS = `query GetOrders($last: Int, $before: String, $query: String!) {
  orders(last: $last, before: $before, query: $query) {
    edges {
      node {
        id
        name
        legacyResourceId
        createdAt
        currencyCode
        customer {
          firstName
          lastName
        }
        currentTotalPriceSet {
          shopMoney {
            amount
          }
        }
        displayFinancialStatus
        displayFulfillmentStatus
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;
