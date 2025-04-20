# Bulk Questions API Documentation

This document describes the API endpoint and JSON format required for bulk question uploads. The format supports multiple question types (MCQ, Fill in the Gap, and Essay) in a single request.

## API Endpoint

```
POST /api/v1/bulk-questions
```

### Headers

- `Authorization`: Bearer token (required)
- `Content-Type`: application/json

### Authentication

- Only members of the academic committee can create questions
- A valid JWT token must be provided in the Authorization header

## Request Format

```json
{
  "questions": [
    {
      "type": "mcq",
      "question": "What is the capital of France?",
      "imgURL": "optional-image-url",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "answer": ["Paris"],
      "courseCode": "GEO101",
      "level": "100",
      "year": "2023",
      "tags": ["geography", "capitals"],
      "lecturer": "Dr. Smith"
    },
    {
      "type": "fitg",
      "question": "The capital of France is ____.",
      "imgURL": "optional-image-url",
      "answer": "Paris",
      "courseCode": "GEO101",
      "level": "100",
      "year": "2023",
      "tags": ["geography", "capitals"],
      "lecturer": "Dr. Smith"
    },
    {
      "type": "essay",
      "question": "Discuss the importance of geography in modern education.",
      "imgURL": "optional-image-url",
      "answer": "Optional model answer",
      "courseCode": "GEO101",
      "level": "100",
      "year": "2023",
      "tags": ["geography", "education"],
      "lecturer": "Dr. Smith"
    }
  ]
}
```

## Field Descriptions

### Common Fields (All Question Types)

- `type` (string, required): The type of question. Must be one of: "mcq", "fitg", or "essay"
- `question` (string, required): The question text
- `imgURL` (string, optional): URL to an associated image
- `courseCode` (string, required): The course code
- `level` (string, required): The academic level
- `year` (string, required): The academic year
- `tags` (array, optional): Array of tags
- `lecturer` (string, optional): Name of the lecturer

### MCQ-Specific Fields

- `options` (array, required): Array of possible answers
- `answer` (array, required): Array of correct answers (can be multiple for multiple correct answers)

### Fill in the Gap (FITG) Specific Fields

- `answer` (string, required): The correct answer

### Essay-Specific Fields

- `answer` (string, optional): Model answer (optional)

## Response Format

### Success Response (201 Created)

```json
{
  "message": "Bulk questions processed",
  "results": {
    "success": [
      {
        "id": "question-id-1",
        "type": "mcq"
      },
      {
        "id": "question-id-2",
        "type": "fitg"
      }
    ],
    "errors": [
      {
        "question": "Invalid question text",
        "error": "Missing required fields"
      }
    ]
  }
}
```

### Error Responses

- 400 Bad Request: Invalid request format
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User is not a member of the academic committee
- 500 Internal Server Error: Server-side error

## Example Usage

### Using cURL

```bash
curl -X POST http://your-api/api/v1/bulk-questions \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d @bulk-questions.json
```

### Using JavaScript (Fetch API)

```javascript
const response = await fetch("http://your-api/api/v1/bulk-questions", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    questions: [
      {
        type: "mcq",
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        answer: ["Paris"],
        courseCode: "GEO101",
        level: "100",
        year: "2023",
      },
    ],
  }),
});

const data = await response.json();
```

## Notes

1. All questions must have a valid `type` field
2. Required fields must be present for each question type
3. The `imgURL` field is optional for all question types
4. The `answer` field is optional for essay questions but required for MCQ and FITG
5. For MCQ questions, the `answer` field must contain at least one correct answer
6. The `tags` field is optional and can be an empty array
7. The API will process all questions in the request, even if some fail
8. The response will include both successful and failed question uploads
