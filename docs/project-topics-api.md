# Project Topics API Documentation

This document provides detailed information about the Project Topics API endpoints and their usage.

## Base URL

All API endpoints are prefixed with `/api/v1/project-topics`

## Authentication

Some endpoints require student authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Create Project Topic (Student)

- **URL**: `/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new project topic (only for 500L students)
- **Request Body**:
  ```json
  {
    "year": 2023,
    "topic": "Your project topic",
    "supervisor": {
      "name": "Supervisor Name",
      "title": "Dr."
    }
  }
  ```
- **Response**:
  ```json
  {
    "projectTopic": {
      "author": {
        "name": "Student Name",
        "matricNumber": "123456"
      },
      "year": 2023,
      "topic": "Your project topic",
      "supervisor": {
        "name": "Supervisor Name",
        "title": "Dr."
      },
      "_id": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

### Update Project Topic (Student)

- **URL**: `/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Update your own project topic
- **Request Body**:
  ```json
  {
    "topic": "Updated topic",
    "supervisor": {
      "name": "New Supervisor",
      "title": "Prof."
    }
  }
  ```

### Delete Project Topic (Student)

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete your own project topic

### Get Student's Project Topics

- **URL**: `/my-topics`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get all project topics for the authenticated student
- **Response**:
  ```json
  {
    "count": 2,
    "projectTopics": [
      {
        "author": {
          "name": "Student Name",
          "matricNumber": "123456"
        },
        "year": 2023,
        "topic": "Project Topic",
        "supervisor": {
          "name": "Supervisor Name",
          "title": "Dr."
        },
        "_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

### Create Bulk Project Topics (Admin)

- **URL**: `/bulk`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Create multiple project topics at once
- **Request Body**:
  ```json
  {
    "topics": [
      {
        "author": {
          "name": "Student Name",
          "matricNumber": "123456"
        },
        "year": 2023,
        "topic": "Project Topic",
        "supervisor": {
          "name": "Supervisor Name",
          "title": "Dr."
        }
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "created": [
      {
        "author": {
          "name": "Student Name",
          "matricNumber": "123456"
        },
        "year": 2023,
        "topic": "Project Topic",
        "supervisor": {
          "name": "Supervisor Name",
          "title": "Dr."
        },
        "_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "duplicates": [
      {
        "author": {
          "name": "Existing Student",
          "matricNumber": "789012"
        },
        "year": 2023,
        "topic": "Existing Topic",
        "supervisor": {
          "name": "Supervisor Name",
          "title": "Dr."
        },
        "reason": "Project topic already exists for Existing Student (789012) in year 2023"
      }
    ],
    "message": "Successfully created 1 topics. 1 topics were skipped as they already exist."
  }
  ```

### Update Project Topic (Admin)

- **URL**: `/admin/:id`
- **Method**: `PATCH`
- **Auth Required**: No
- **Description**: Update any project topic

### Delete Project Topic (Admin)

- **URL**: `/admin/:id`
- **Method**: `DELETE`
- **Auth Required**: No
- **Description**: Delete any project topic

### Delete Bulk Project Topics (Admin)

- **URL**: `/admin/bulk`
- **Method**: `DELETE`
- **Auth Required**: No
- **Description**: Delete multiple project topics
- **Request Body**:
  ```json
  {
    "ids": ["id1", "id2", "id3"]
  }
  ```

### Get All Project Topics

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get all project topics with optional filtering
- **Query Parameters**:
  - `year`: Filter by year
  - `supervisor`: Filter by supervisor name
  - `author`: Filter by author matric number
- **Response**:
  ```json
  {
    "count": 2,
    "projectTopics": [
      {
        "author": {
          "name": "Student Name",
          "matricNumber": "123456"
        },
        "year": 2023,
        "topic": "Project Topic",
        "supervisor": {
          "name": "Supervisor Name",
          "title": "Dr."
        },
        "_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

### Get Single Project Topic

- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get a specific project topic by ID

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message"
}
```

Common status codes:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found (resource not found)
- `500`: Internal Server Error

## Notes

1. Supervisor titles are automatically normalized to one of: "Dr.", "Prof.", "Mr.", "Miss", "Mrs."
2. Students can only have one project topic per year
3. Only 500L students can create project topics
4. Students can only modify or delete their own project topics
5. Bulk operations will process valid entries and skip duplicates
