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
```javascript
import session from '@sswahn/session'

export const handler = async event => {
  try {
    const cookieName = 'token'
    const data = await session(cookieName, event)
    // ...
    // handle your response:
    // if the token has been refreshed, `data` will have property called `cognito`,
    // use it to set a new HTTP cookie
    // otherwise just respond with a Successful message
  } catch (error) {
    // handle your unauthorized access response
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
