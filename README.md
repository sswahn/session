# Session · [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sswahn/session/blob/main/LICENSE) ![npm version](https://img.shields.io/npm/v/@sswahn/session)

This library provides a simple and efficient way to manage user sessions using AWS Cognito for authentication.

## Features
- **Efficient Session Management:** Simplify user session management in your AWS Cognito-authenticated applications.
- **Token Refresh Handling:** The library seamlessly handles token refreshes, allowing you to update HTTP cookies when necessary.
- **Intuitive API:** Provides a straightforward interface for managing sessions, making it easy to integrate into your Lambda functions.
- **Environment Variable Configuration:** Utilize environment variables for flexible configuration.
- **DynamoDB Integration:** Designed to work seamlessly with DynamoDB, the library assumes at least a minimal table design for storing session information.

  
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

## Example
Note that if a token has been refreshed, you should set a new HTTP cookie. If a token has been refreshed, the session function's response will have a propety called `cognito`.
```javascript
import session from '@sswahn/session'

export const handler = async event => {
  try {
    const data = await session('token', event)
    const { AccessToken } = data.cognito?.AuthenticationResult
    const cookie = AccessToken ? { 'Set-Cookie': `token=${AccessToken}; HttpOnly;` } : {}
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request successful' }),
      headers: {
        'Content-Type': 'application/json',
        ...cookie,
      }
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}
```

## Environmental Variables
Ensure the following environmental variables are set in your Lambda function:

- SESSION_TABLE: The name of your DynamoDB table for storing session information.
- PARTITION_KEY: The name of the partition key of your DynamoDB session table.
- CLIENT_ID: The AWS Cognito client ID.

## Database Design
- This library assumes a DynamoDB table for storing session information. 
- The table's partition key must be the user's sub (subject) obtained from the decoded JWT token and should be stored when the user initially logs in, and removed when the user logs out.
- The login and logout process is out of the scope of this library.
- Then minimum requirements for the session table design should be as follows:
```plaintext
Table Name: your_session_table

Attributes:
- partition_key (String)
- token (String)
- timestamp (Number)
```

For the initial authentication with cognito you can implement your own system or use [@sswahn/cognito](https://www.npmjs.com/package/@sswahn/cognito).

## License
Session is [MIT Licensed](https://github.com/sswahn/session/blob/main/LICENSE)
