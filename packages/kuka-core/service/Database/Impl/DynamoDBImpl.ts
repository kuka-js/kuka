import { DynamoDB, config, SharedIniFileCredentials, AWSError } from "aws-sdk"
import { DatabaseImpl } from "../DatabaseFactory"
import {
  CreateUserResponse,
  GetUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "../Responses"
import { UserModel } from "../../../models/UserModel"
import { UserDoesNotExistException } from "../../../exceptions/UserDoesNotExistException"
import { DBConnectionException } from "../../../exceptions/DBConncetionException"
import { VerificationModel } from "../../../models/VerificationModel"
import { PasswordResetModel } from "../../../models/PasswordResetModel"
import UserService from "../../User"
import { CouldNotGetItemException } from "../../../exceptions/CouldNotGetItemException"
import { DBQueryFailedException } from "../../../exceptions/DBQueryFailedException"
import { UserObject } from "../../User"
import * as logg from "loglevel"

const log = logg.getLogger("DynamoDBImpl")
log.setLevel("debug")

if (process.env.STAGE == "local") {
  const credentials = new SharedIniFileCredentials({ profile: "kuka-dynamo" })
  config.credentials = credentials
}

config.update({ region: "eu-north-1" })

const docClient = new DynamoDB.DocumentClient()
const tableName = process.env.TABLE_NAME

export class DynamoDBImpl implements DatabaseImpl {
  async createUser(user: UserModel): Promise<CreateUserResponse> {
    const userModel: UserModelForDynamoDB = this.userModelToDynamoDBModel(user)
    const params = { TableName: tableName, Item: userModel }
    const addEmailSK = {
      TableName: tableName,
      Item: { pk: userModel.pk, sk: "EMAIL#" + userModel.email },
    }
    try {
      await docClient.put(params).promise()
      await docClient.put(addEmailSK).promise()
      return { ok: 1, data: { message: "User succesfully created!" } }
    } catch (e) {
      console.log(e)
      return {
        ok: 0,
        data: {
          message: e.message,
        },
      }
    }
  }

  async getUser(username: string): Promise<UserModel> {
    const pksk = "USER#" + username
    const params = {
      TableName: tableName,
      Key: { pk: pksk, sk: pksk },
    }

    try {
      const result = await docClient.get(params).promise()
      if (!result || !result.Item) {
        throw new UserDoesNotExistException()
      } else {
        const userModel = this.dynamoDBToUserModel(
          result.Item as UserModelForDynamoDB
        )
        return userModel
      }
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async userExists(username: string): Promise<boolean> {
    const key = "USER#" + username
    const params = {
      TableName: tableName,
      Key: { pk: key, sk: key },
    }

    try {
      const result = await docClient.get(params).promise()
      console.log("User exist result")
      console.log(result)
      if (result && result.Item && result.Item.pk === "USER#" + username) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async updateRefreshToken(
    username: string,
    refreshToken: string
  ): Promise<void> {
    try {
      const key = "USER#" + username
      const params = {
        TableName: tableName,
        Key: { pk: key, sk: key },
        UpdateExpression: "set refreshToken = :r",
        ExpressionAttributeValues: {
          ":r": refreshToken,
        },
      }
      await docClient.update(params).promise()
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async deleteUser(username: string): Promise<void> {
    const pksk = "USER#" + username
    const params = {
      TableName: tableName,
      Key: { pk: pksk, sk: pksk },
    }
    try {
      await docClient.delete(params).promise()
    } catch (e) {
      console.log(e)
      throw new DBQueryFailedException()
    }
  }

  async createVerificationLink(verifyObject: VerificationModel): Promise<void> {
    const params = {
      TableName: tableName,
      Item: this.verificationModelToDynamoDBModel(verifyObject),
    }
    try {
      await docClient.put(params).promise()
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async markEmailVerified(verifyLinkId: string): Promise<void> {
    const sk = "VER#" + verifyLinkId
    try {
      let getVerifyParams = {
        TableName: tableName,
        IndexName: "sk-pk-index",
        KeyConditionExpression: "sk = :sk AND begins_with(pk, :pk)",
        ExpressionAttributeValues: {
          ":sk": sk,
          ":pk": "USER#",
        },
      }
      const verifyItem = await docClient.query(getVerifyParams).promise()
      log.debug("verifyItem")
      log.debug(verifyItem)
      if (verifyItem.Items.length != 1) {
        throw new DBQueryFailedException()
      }
      const pk = verifyItem.Items[0].pk
      const emailVerifiedToUserItem = {
        TableName: tableName,
        Key: {
          pk,
          sk,
        },
        UpdateExpression: "set emailVerified = :bool",
        ExpressionAttributeValues: {
          ":bool": true,
        },
      }
      await docClient.update(emailVerifiedToUserItem).promise()
      const emailVerifiedToVerifyItem = {
        TableName: tableName,
        Key: {
          pk,
          sk: pk,
        },
        UpdateExpression: "set emailVerified = :bool",
        ExpressionAttributeValues: {
          ":bool": true,
        },
      }
      await docClient.update(emailVerifiedToVerifyItem).promise()
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async createPasswordReset(
    passwordResetModel: PasswordResetModel
  ): Promise<void> {
    try {
      const { passwordResetId, email, clicked } = passwordResetModel
      const userService = new UserService()
      const username = await userService.emailToUsername(email)
      const date = new Date()
      const creationDate = date.toISOString()
      const passwordResetItem = {
        pk: "USER#" + username,
        sk: "PWRESET#" + passwordResetId,
        email,
        clicked,
        creationDate,
      }
      const params = {
        TableName: tableName,
        Item: passwordResetItem,
      }
      await docClient.put(params).promise()
    } catch (e) {
      throw new DBConnectionException()
    }
  }

  async getPasswordReset(passwordResetId: string): Promise<PasswordResetModel> {
    try {
      let params = {
        TableName: tableName,
        IndexName: "sk-pk-index",
        KeyConditionExpression: "sk = :sk AND begins_with(pk, :pk)",
        ExpressionAttributeValues: {
          ":sk": "PWRESET#" + passwordResetId,
          ":pk": "USER#",
        },
      }
      log.debug("getPasswordReset params")
      log.debug(params)
      const result = await docClient.query(params).promise()
      log.debug("getPWResetResult")
      log.debug(result)
      if (result.Items.length != 1) {
        throw new DBQueryFailedException()
      }
      const resetModel = this.dynamoDBToPasswordResetModel(
        result.Items[0] as PasswordResetModelForDynamoDB
      )
      return resetModel
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async updatePasswordHash(
    username: string,
    passwordHash: string
  ): Promise<void> {
    const pksk = "USER#" + username
    try {
      const params = {
        TableName: tableName,
        Key: {
          pk: pksk,
          sk: pksk,
        },
        UpdateExpression: "set passwordHash = :r",
        ExpressionAttributeValues: {
          ":r": passwordHash,
        },
      }
      log.debug("updatePasswordHash params")
      log.debug(params)
      log.debug("Updating password hash")
      await docClient.update(params).promise()
    } catch (e) {
      throw new DBConnectionException()
    }
  }

  async emailToUsername(email: string): Promise<string> {
    const params = {
      TableName: tableName,
      IndexName: "sk-pk-index",
      KeyConditionExpression: "sk  = :email",
      ExpressionAttributeValues: {
        ":email": "EMAIL#" + email,
      },
      ProjectionExpression: "pk",
    }
    let result
    try {
      result = await docClient.query(params).promise()
    } catch (e) {
      throw new DBConnectionException()
    }

    if (Array.isArray(result.Items) && result.Items.length > 0) {
      const username = result.Items[0].pk.split("#")[1]
      return username
    } else {
      throw new DBQueryFailedException()
    }
  }

  async getScopes(username: string): Promise<string[]> {
    log.debug("getScopes username: " + username)
    const pksk = "USER#" + username
    const params = {
      TableName: tableName,
      Key: { pk: pksk, sk: pksk },
      ProjectionExpression: "scopes",
    }
    let result
    try {
      result = await docClient.get(params).promise()
      log.debug("getScopes result:")
      log.debug(result)
    } catch (e) {
      log.debug(e)
      throw new DBConnectionException()
    }
    const scopes = result.Item.scopes
    log.debug("getScopes scopes var:")
    log.debug(scopes)
    return scopes
  }

  async addScope(username: string, scope: string): Promise<void> {
    const scopes: string[] = await this.getScopes(username)
    for (let item of scopes) {
      if (item == scope) {
        throw new DBQueryFailedException()
      }
    }
    scopes.push(scope)
    const pksk = "USER#" + username
    try {
      const params = {
        TableName: tableName,
        Key: {
          pk: pksk,
          sk: pksk,
        },
        UpdateExpression: "set scopes = :r",
        ExpressionAttributeValues: {
          ":r": scopes,
        },
      }
      await docClient.update(params).promise()
    } catch (e) {
      throw new DBConnectionException()
    }
  }

  async removeScope(username: string, scope: string): Promise<void> {
    const scopes: string[] = await this.getScopes(username)
    const newScopes = scopes.filter((e) => e !== scope)
    const pksk = "USER#" + username
    try {
      const params = {
        TableName: tableName,
        Key: {
          pk: pksk,
          sk: pksk,
        },
        UpdateExpression: "set scopes = :r",
        ExpressionAttributeValues: {
          ":r": newScopes,
        },
      }
      await docClient.update(params).promise()
    } catch (e) {
      throw new DBConnectionException()
    }
  }

  async getUserList(): Promise<UserObject[]> {
    const params = {
      TableName: tableName,
      ProjectionExpression: "pk, scopes, locked",
      FilterExpression: "begins_with(sk, :sk) AND begins_with(pk, :pk)",
      ExpressionAttributeValues: {
        ":sk": "USER#",
        ":pk": "USER#",
      },
    }
    const result = await docClient.scan(params).promise()
    let userList = []
    for (let item of result.Items) {
      let userData = {
        username: item.pk.split("#")[1],
        scopes: item.scopes,
        isLocked: item.locked,
      }
      userList.push(userData)
    }
    return userList
  }

  async getRefreshToken(username: string): Promise<string> {
    const pksk = "USER#" + username
    const params = {
      TableName: tableName,
      ProjectionExpression: "refreshToken",
      Key: { pk: pksk, sk: pksk },
    }

    try {
      const result = await docClient.get(params).promise()
      if (!result || !result.Item) {
        throw new UserDoesNotExistException()
      } else {
        return result.Item.refreshToken
      }
    } catch (e) {
      console.log(e)
      throw new DBConnectionException()
    }
  }

  async lockUser(
    username: string,
    lockedBy: string,
    reason: string | null
  ): Promise<boolean> {
    const lock = {
      pk: "LOCK#" + username,
      sk: "LOCK#" + username,
      lockedBy,
      reason,
    }
    const params = { TableName: tableName, Item: lock }
    try {
      await docClient.put(params).promise()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  private userModelToDynamoDBModel(user: UserModel): UserModelForDynamoDB {
    const {
      username,
      email,
      passwordHash,
      emailVerified,
      refreshToken,
      scopes,
      lockId,
    } = user
    return {
      pk: "USER#" + username,
      sk: "USER#" + username,
      email,
      passwordHash,
      emailVerified,
      refreshToken,
      scopes,
      lockId,
    }
  }

  private dynamoDBToUserModel(user: UserModelForDynamoDB): UserModel {
    const {
      pk,
      email,
      passwordHash,
      emailVerified,
      refreshToken,
      scopes,
      lockId,
    } = user
    return {
      username: pk.split("#")[1],
      email,
      passwordHash,
      emailVerified,
      refreshToken,
      scopes,
      lockId,
    }
  }

  private verificationModelToDynamoDBModel(
    verification: VerificationModel
  ): VerificationModelForDynamoDB {
    return {
      pk: "USER#" + verification.username,
      sk: "VER#" + verification.verifyLinkId,
      emailVerified: verification.clicked,
    }
  }

  private dynamoDBToPasswordResetModel(
    reset: PasswordResetModelForDynamoDB
  ): PasswordResetModel {
    const { pk, sk, email, creationDate, clicked } = reset
    return {
      username: pk.split("#")[1],
      passwordResetId: sk.split("#")[1],
      email,
      creationDate,
      clicked,
    }
  }
}

interface PasswordResetModelForDynamoDB {
  pk: string
  sk: string
  email: string
  creationDate: string
  clicked: boolean
}
interface UserModelForDynamoDB {
  pk: string
  sk: string
  email: string
  passwordHash: string
  emailVerified: boolean
  refreshToken?: string
  scopes: string[]
  lockId?: number
}

interface VerificationModelForDynamoDB {
  pk: string
  sk: string
  emailVerified: boolean
}
