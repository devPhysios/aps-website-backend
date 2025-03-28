# Election API Documentation

This document provides information about the Election API endpoints available for fetching student information.

## Base URL

```
https://your-api-domain.com/api/v1/election
```

## Endpoints

### 1. Get All Students

Retrieves a list of all students with their election-relevant information.

**Endpoint:** `GET /students`

**Response:**

```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "middleName": "Smith",
      "matricNumber": "123456",
      "gender": "male",
      "classSet": "2023/2024",
      "level": "300"
    }
    // ... more students
  ]
}
```

**Status Codes:**

- `200 OK`: Successfully retrieved students
- `500 Internal Server Error`: Server error occurred

### 2. Get Student by Matric Number

Retrieves information for a specific student using their matric number.

**Endpoint:** `GET /students/:matricNumber`

**Parameters:**

- `matricNumber` (path parameter): The matriculation number of the student

**Response:**

```json
{
  "success": true,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Smith",
    "matricNumber": "123456",
    "gender": "male",
    "classSet": "2023/2024",
    "level": "300"
  }
}
```

**Status Codes:**

- `200 OK`: Successfully retrieved student
- `404 Not Found`: Student not found
- `500 Internal Server Error`: Server error occurred

## Example Usage

### Fetching All Students

```javascript
const response = await fetch(
  "https://your-api-domain.com/api/v1/election/students"
);
const data = await response.json();
```

### Fetching Student by Matric Number

```javascript
const matricNumber = "123456";
const response = await fetch(
  `https://your-api-domain.com/api/v1/election/students/${matricNumber}`
);
const data = await response.json();
```

## Notes

- All endpoints return only the necessary fields for election purposes
- The API follows RESTful conventions
- All responses include a `success` boolean flag
- Error responses include an `error` message field
