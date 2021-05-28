export interface MailImpl {
  sendMail(email: string, subject: string, message: string): Promise<void>
}

export enum DatabaseTypes {
  DYNAMODB,
  TYPEORM,
}

export function convert(provider: string): DatabaseTypes {
  // If you are wondering the "... as keyof typeof ...". Read about it here:
  // https://stackoverflow.com/questions/36316326/typescript-ts7015-error-when-accessing-an-enum-using-a-string-type-parameter
  return DatabaseTypes[provider.toUpperCase() as keyof typeof DatabaseTypes]
}

export function CreateDBAdapter(type: DatabaseTypes) {
  switch (type) {
    case DatabaseTypes.DYNAMODB:
      return new DynamoDBImpl()
      break
    case DatabaseTypes.TYPEORM:
      return new TypeORMImpl()
      break
    default:
      throw "an error"
  }
}
