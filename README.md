# Session

This library provides a simple and efficient way to manage user sessions using AWS Cognito for authentication.

## Installation
Using npm.
```bash
npm install @sswahn/session
```

## Usage
Import Session.  
```javascript
import session from '@sswahn/session'
```

Call the session function passing a cookie name and the Lambda event parameter.
```javascript
const response = await session(cookieName, event)
```

## Environmental Variables
Ensure the following environmental variables are set in your Lambda function:

- SESSION_TABLE: The name of your DynamoDB table for storing session information.
- CLIENT_ID: The AWS Cognito client ID.

## Database Design
This library assumes a DynamoDB table design for storing session information. The table should have a partition key named partition_key. The session data can be associated with the user's sub (subject) obtained from the decoded JWT token.
```plaintext
Table Name: your_session_table

Attributes:
- partition_key (String)
- token (String)
- timestamp (Number)
```
