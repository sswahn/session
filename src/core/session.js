import { CognitoIdentityProviderClient, GetUserCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import { DynamoDBClient, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const decodeToken = token => {
  const base64url = token.split('.')[1]
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const decoded = Buffer.from(base64, 'base64').toString('utf-8')
  return JSON.parse(decoded)
}

const deleteSession = token => {
  try {
    const values = {
      TableName: process.env.SESSION_TABLE,
      Key: {
        [process.env.PARTITION_KEY]: { S: decodeToken(token).sub },
      },
    }
    const client = new DynamoDBClient()
    const command = new DeleteItemCommand(values)
    return client.send(command)
  } catch (error) {
    throw new Error(error)
  }
}

const getSession = token => {
  try {
    const values = {
      TableName: process.env.SESSION_TABLE,
      Key: {
        partition_key: { S: decodeToken(token).sub }
      }
    }
    const client = new DynamoDBClient()
    const command = new GetItemCommand(values)
    return client.send(command)
  } catch (error) {
    throw new Error(error)
  }
}

const refreshSession = async token => {
  try {
    const data = await getSession(token)
    const values = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: data.Item.token.S
      }
    }
    const client = new CognitoIdentityProviderClient()
    const command = new InitiateAuthCommand(values)
    const response = await client.send(command)
    return { 
      dynamoDB: data,
      cognito: response
    }
  } catch (error) {
    throw new Error(error)
  }
}

const handleInvalideSession = async token => {
  try {
    return refreshSession(token)
  } catch (error) {
    deleteSession(token)
    throw new Error('Unauthorized')
  }
}

const validateSession = async token => {
  try {
    const client = new CognitoIdentityProviderClient()
    const command = new GetUserCommand({ AccessToken: token })
    return client.send(command)
  } catch (error) {
    return handleInvalideSession(token)
  }
}

const session = (cookieName, event) => {
  try {
    if (!event.headers.Cookie || !event.headers.Cookie.includes(`${cookieName}=`)) {
      throw new Error('Unauthorized')
    }
    const token = event.headers.Cookie.split(`${cookieName}=`)[1].split(';')[0]
    return validateSession(token)
  } catch (error) {
    throw new Error(error)
  }
}

export default session
