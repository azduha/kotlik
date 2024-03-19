import { __awaiter, __generator } from "tslib";
export var createScheduled = function (mysql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mysql.execute("\n        CREATE TABLE `scheduled` (\n            `id` INT NOT NULL AUTO_INCREMENT,\n            `teamId` INT NOT NULL,\n            `identifier` VARCHAR(256) NOT NULL,\n            `callback` VARCHAR(256) NOT NULL,\n            `executeAt` VARCHAR(256) NOT NULL,\n            `queued` TINYINT(1) NOT NULL,\n        PRIMARY KEY (`id`));")];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
//# sourceMappingURL=04_createScheduled.js.map