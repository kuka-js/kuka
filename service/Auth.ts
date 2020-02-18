const jwt = require("jsonwebtoken") // used to create, sign, and verify tokens
// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse: any = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument: any = {}
    policyDocument.Version = "2012-10-17"
    policyDocument.Statement = []
    const statementOne: any = {}
    statementOne.Action = "execute-api:Invoke"
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

module.exports.auth = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")

    // if everything is good, save to request for use in other routes
    return callback(
      null,
      generatePolicy(decoded.username, "Allow", event.methodArn)
    )
  })
}

module.exports.getScopes = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")
    const {scopes} = decoded
    if (scopes.includes("root") || scopes.includes("getScopes")) {
      // if everything is good, save to request for use in other routes
      return callback(
        null,
        generatePolicy(decoded.username, "Allow", event.methodArn)
      )
    } else {
      return callback(null, "Unauthorized")
    }
  })
}

module.exports.addScope = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")
    const {scopes} = decoded
    if (scopes.includes("root") || scopes.includes("addScope")) {
      // if everything is good, save to request for use in other routes
      return callback(
        null,
        generatePolicy(decoded.username, "Allow", event.methodArn)
      )
    } else {
      return callback(null, "Unauthorized")
    }
  })
}
module.exports.removeScope = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")
    const {scopes} = decoded
    if (scopes.includes("root") || scopes.includes("removeScope")) {
      // if everything is good, save to request for use in other routes
      return callback(
        null,
        generatePolicy(decoded.username, "Allow", event.methodArn)
      )
    } else {
      return callback(null, "Unauthorized")
    }
  })
}

module.exports.getUserList = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")
    const {scopes} = decoded
    if (scopes.includes("root") || scopes.includes("getUserList")) {
      // if everything is good, save to request for use in other routes
      return callback(
        null,
        generatePolicy(decoded.username, "Allow", event.methodArn)
      )
    } else {
      return callback(null, "Unauthorized")
    }
  })
}

module.exports.deleteUser = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const full_token = event.authorizationToken
  if (!full_token) return callback(null, "Unauthorized")
  const token = full_token.split(" ")[1]

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return callback(null, "Unauthorized")
    const {scopes} = decoded
    if (scopes.includes("root") || scopes.includes("deleteUser")) {
      // if everything is good, save to request for use in other routes
      return callback(
        null,
        generatePolicy(decoded.username, "Allow", event.methodArn)
      )
    } else {
      return callback(null, "Unauthorized")
    }
  })
}
