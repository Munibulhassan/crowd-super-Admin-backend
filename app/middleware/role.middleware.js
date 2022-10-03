const compose = require("composable-middleware");

class RoleMiddleware {
    isAdmin() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.role.name == 'ADMIN') {
                        next();
                    } else {
                        res.status(400).send({ success: false, status: 400, msg: "Insufficient privileges." });
                        return
                    }
                })
        )
    }
    isUser() {
        return (
            compose()
                // Attach user to request
                .use((req, res, next) => {
                    if (req.user.role.name == 'USER' || req.user.role.name == 'ADMIN' || req.user.role.name == null) {
                        next();
                    } else {
                        res.status(400).send({ success: false, status: 400, msg: "Insufficient privileges." });
                        return
                    }
                })
        )
    }
}

module.exports.roleMiddleware = new RoleMiddleware();