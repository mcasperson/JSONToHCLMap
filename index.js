function jsonToHclMap(jsonString) {
    if (!jsonString || !jsonString.trim()) {
        return "jsonencode()";
    }

    let fixedString = decodeString(jsonString);
    let jsonObject = JSON.parse(fixedString);
    console.log("jsonencode(" + encodeAsHcl(jsonObject, "") + ")");
    
}

function encodeAsHcl(input, output) {
    if (!output) {
        output = ""
    }

    if (input === null) {
        return encodeNullAsHcl(input, output);
    }

    if (Array.isArray(input)) {
        return encodeArrayAsHcl(input, output);
    }
    
    if (typeof(input) === "object") {
        return encodeObjectAsHcl(input, output);
    } 
    
    if (typeof(input) === "string") {
        return encodeStringAsHcl(input, output);
    } 
    
    return encodeOtherAsHcl(input, output);
}

function encodeObjectAsHcl(jsonObject, output) {
    output += "{\n";

    let entries = Object.entries(jsonObject);
    let entryCount = entries.length;
    for (const [index, entry] of entries.entries()) {
        output += entry[0] + " : ";
        output += encodeAsHcl(entry[1]);
        if (index != entryCount - 1) {
            output += ",";
        }
        output += "\n";
    }

    output += "}"
    return output;
}

function encodeOtherAsHcl(other, output) {
    return output + other;
}

function encodeNullAsHcl(other, output) {
    return output + "null";
}

function encodeStringAsHcl(string, output) {
    output += "\"" + string.replace(/"/g, "\\\"") + "\"";
    return output;
}

function encodeArrayAsHcl(array, output) {    
    output += "[\n";

    let entryCount = array.length;
    for (const [index, item] of array.entries()) {
        output += encodeAsHcl(item);
        if (index != entryCount - 1) {
            output += ",";
        }
        output += "\n";
    }
    output += "]";
    return output;
}

function stringSurroundedBy(input, character) {
    return input.indexOf(character) == 0 && fixedString.split("").reverse().join("").indexOf(character) == 0;
}

function decodeString(jsonString) {
    if (!jsonString || !jsonString.trim()) {
        throw "Invalid jsonString";
    }

    let fixedString = jsonString.trim();

    if (stringSurroundedBy(fixedString, "\"")) {
        let unquotedString = fixedString.substring(1, fixedString.length() - 2);
        return unquotedString.replace(/\\"/g, "\"");
    }

    if (stringSurroundedBy(fixedString, "'")) {
        let unquotedString = fixedString.substring(1, fixedString.length() - 2);
        return unquotedString.replace(/\\'/g, "'");
    }
    
    return fixedString;
}

const myArgs = process.argv.slice(2);
if (myArgs.length != 0) {
    jsonToHclMap(myArgs[0])
} else {
    console.log("Pass the JSON to be converted as the first argument, e.g.");
    console.log("node index.js \"{\\\"key\\\": \\\"value\\\"}\"");
}