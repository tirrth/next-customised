"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fileExists = fileExists;
var _fs = require("fs");
async function fileExists(fileName, type) {
    try {
        if (type === 'file') {
            const stats = await _fs.promises.stat(fileName);
            return stats.isFile();
        } else if (type === 'directory') {
            const stats = await _fs.promises.stat(fileName);
            return stats.isDirectory();
        } else {
            await _fs.promises.access(fileName, _fs.constants.F_OK);
        }
        return true;
    } catch (err) {
        if (err.code === 'ENOENT' || err.code === 'ENAMETOOLONG') {
            return false;
        }
        throw err;
    }
}

//# sourceMappingURL=file-exists.js.map