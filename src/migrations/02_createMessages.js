import { __awaiter, __generator } from "tslib";
export var createMessages = function (mysql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mysql.execute("\n        CREATE TABLE `messages` (\n            `id` INT NOT NULL AUTO_INCREMENT,\n            `teamId` INT NOT NULL,\n            `timestamp` VARCHAR(256) NOT NULL,\n            `message` TEXT NOT NULL,\n            `type` VARCHAR(256) NOT NULL,\n        PRIMARY KEY (`id`));")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mysql.execute("\n        CREATE TABLE `prompts` (\n            `id` INT NOT NULL AUTO_INCREMENT,\n            `teamId` INT NOT NULL,\n            `timestamp` VARCHAR(256) NOT NULL,\n            `prompt` TEXT NOT NULL,\n        PRIMARY KEY (`id`));")];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
//# sourceMappingURL=02_createMessages.js.map