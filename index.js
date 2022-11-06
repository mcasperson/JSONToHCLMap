function jsonToHclMap(jsonString) {
    if (!jsonString || !jsonString.trim()) {
        return "jsonencode()";
    }

    let fixedString = decodeString(jsonString);
    let jsonObject = JSON.parse(fixedString);
    console.log(encodeAsHcl(jsonObject, ""));
    
}

function encodeAsHcl(input, output) {
    if (!output) {
        output = ""
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
    for (entry of entries) {
        output += entry[0] + ": ";
        output += encodeAsHcl(entry[1]);
        output += ",\n";
    }

    output += "}"
    return output;
}

function encodeOtherAsHcl(other, output) {
    return output + other;
}

function encodeStringAsHcl(string, output) {
    output += "\"" + string.replace(/"/g, "\\\"") + "\"";
    return output;
}

function encodeArrayAsHcl(array, output) {
    output += "[\n";
    for (item of array) {
        output += encodeAsHcl(item);
        output += ",\n";
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

jsonToHclMap("[{\"name\":\"grpc\",\"port\":\"9555\",\"targetPort\":\"9555\"}]")