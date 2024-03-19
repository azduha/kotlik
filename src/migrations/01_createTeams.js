import { __awaiter, __generator } from "tslib";
export var createTeams = function (mysql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mysql.execute("\n        CREATE TABLE `teams` (\n            `id` INT NOT NULL AUTO_INCREMENT,\n            `key` INT NOT NULL,\n            `name` VARCHAR(256) NOT NULL,\n            `teamState` TEXT NULL,\n            `appState` TEXT NULL,\n        PRIMARY KEY (`id`));")];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
//# sourceMappingURL=01_createTeams.js.map