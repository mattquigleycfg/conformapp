# Excel Calculation Server

This server provides an API to perform Excel-based calculations using the Con-form Estimator Excel file. It uses VBScript to automate Excel operations and exposes the results via a REST API.

## Features

- REST API for Excel-based calculations
- Support for multiple product types
- Error handling and logging
- Authentication

## Setup

1. Ensure Excel is installed on the server
2. Install Node.js and npm
3. Clone the repository
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```

## API Usage

### Calculate Product

**Endpoint:** `POST /api/calculate`

**Authentication Required:** Basic Auth

**Request Body:**
```json
{
  "productType": "EasyMechMR",
  "params": {
    "width": 2.4,
    "length": 3.6,
    "loadRating": "Light Duty",
    "location": "Perth"
  }
}
```

**Response:**
```json
{
  "productType": "EasyMechMR",
  "platformCost": 2160.00,
  "labourCost": 432.00,
  "packagingCost": 108.00,
  "contingency": 54.00,
  "totalCost": 2754.00,
  "salePrice": 3442.50,
  "weight": 180.00,
  "manDays": 1.5
}
```

## Excel VBA Requirements

The Excel file must have the following VBA macros:

1. `SetInputs(productType, jsonParams)` - Sets input parameters
2. `Calculate<ProductType>()` - Runs calculations for a specific product
3. `GetResults()` - Returns calculation results as JSON

## Development

For local development:

```
npm run dev
```

## Deployment

This server should be deployed on a Windows machine with Excel installed.

## License

Proprietary - Con-form Group
