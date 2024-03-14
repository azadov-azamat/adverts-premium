const fs = require('fs');
const path = require('path');


function findKeyByValue(searchValue) {
    const dirPath = path.join(__dirname, '..', 'translations');
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        // Faylni to'liq yo'li
        const filePath = path.join(dirPath, file);
        // Fayl kontentini JSON sifatida o'qish
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const foundKey = findKeyInObject(translations, searchValue);
        if (foundKey) {
            // return { key: foundKey, language: path.basename(filePath, '.json') };
            return foundKey
        }
    }
    return searchValue;
}

function findKeyInObject(obj, searchValue) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            // Agar qiymat yana bir ob'ekt bo'lsa, rekursiv davom ettirish
            const result = findKeyInObject(value, searchValue);
            if (result) return result;
        } else if (value === searchValue) {
            return key;
        }
    }

    return null;
}

module.exports = {findKeyByValue}