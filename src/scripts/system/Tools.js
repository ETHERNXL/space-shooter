"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
class Tools {
    static massiveRequire(req) {
        const files = [];
        req.keys().forEach((key) => {
            files.push({
                key, data: req(key)
            });
        });
        return files;
    }
}
exports.Tools = Tools;
