/*
    This module adds an authentication layer to a request for which authentication is needed
    If a userId is passed, we need to check if the resource is being requested for the correct user
    In other cases, it could happen that no userId is specified and we only need to check for session cookie presence
*/

exports.requiresLogin = function requiresLogin(req,userId) {
    if (req.session && req.session.userId) {
        if (userId) {
            if (userId == req.session.userId) {
                return {
                    response: "User logged in",
                    status: 200
                }
            } else {
                return {
                    error: "You must request this resource for the currently logged user",
                    status: 401
                  }
            }
        } else {
            return {
                response: "User logged in",
                status: 200
            }
        }
    } else {
        return {
            error: "You must be logged in to access this resource",
            status: 401
          }
    }
}