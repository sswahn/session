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

## Example
Note that if a token has been refreshed, you should set a new HTTP cookie. If a token has been refreshed, the session function's response will have a propety called `cognito`.
```javascript
import session from '@sswahn/session'

export const handler = async event => {
  try {
    const cookieName = 'token'
    const data = await session(cookieName, event)
    
    const cookie = data.cognito ? {
      'Set-Cookie': `token=${data.cognito.AuthenticationResult.AccessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; max-age=${86400}`
    } : {}
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request successful' }),
      headers: {
        'Content-Type': 'application/json',
        ...cookie
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
This library assumes a DynamoDB table for storing session information. Then minimum required table design should be as follows:
```plaintext
Table Name: your_session_table

Attributes:
- partition_key (String)
- token (String)
- timestamp (Number)
```

## License
Session is [MIT Licensed](https://github.com/sswahn/session/blob/main/LICENSE)
