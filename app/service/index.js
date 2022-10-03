const gameService = require("./game.service");
const userService = require("./user.service");
const ObjectId = require('mongoose').Types.ObjectId;
const checkMongoId = (id) => {
    const checkId = ObjectId.isValid(id);
    if (checkId) return id
    else return undefined

}

module.exports = {
    checkMongoId
}