import { __awaiter, __generator } from "tslib";
export var createEvents = function (mysql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mysql.execute("\n        CREATE TABLE `events` (\n            `id` INT NOT NULL AUTO_INCREMENT,\n            `teamId` INT NOT NULL,\n            `checkpoint` VARCHAR(256) NOT NULL,\n            `eventType` VARCHAR(256) NOT NULL,\n            `timestamp` VARCHAR(256) NOT NULL,\n        PRIMARY KEY (`id`));")];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
//# sourceMappingURL=03_createEvents.js.map