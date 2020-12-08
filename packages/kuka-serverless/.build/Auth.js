var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
// Policy helper function
var generatePolicy = function (principalId, effect, resource) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = "2012-10-17";
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = "execute-api:Invoke";
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};
module.exports.getScopes = function (event, context, callback) {
    console.log(event);
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        console.log(decoded);
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("getScopes")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.addScope = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("addScope")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.removeScope = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("removeScope")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.getUserList = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("getUserList")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.getUserData = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("getUserData")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.deleteUser = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("deleteUser")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
module.exports.lockUser = function (event, context, callback) {
    // check header or url parameters or post parameters for token
    var full_token = event.authorizationToken;
    if (!full_token)
        return callback(null, "Unauthorized");
    var token = full_token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err)
            return callback(null, "Unauthorized");
        var scopes = decoded.scopes;
        if (scopes.includes("root") || scopes.includes("lockUser")) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(decoded.username, "Allow", event.methodArn));
        }
        else {
            return callback(null, "Unauthorized");
        }
    });
};
