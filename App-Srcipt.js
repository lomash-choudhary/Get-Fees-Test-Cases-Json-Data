function IMPORTJSON(url, query, parseOptions) {
  try {
    // Fetch JSON
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());

    var path = typeof query !== "undefined" ? query.split(".") : [];
    var data = traverse(json, path);

    // If it's an array of objects → flatten into rows
    if (Array.isArray(data)) {
      if (typeof data[0] === "object") {
        var headers = Object.keys(data[0]);
        var output = [headers];
        data.forEach(function(item) {
          var row = headers.map(function(header) {
            return item[header];
          });
          output.push(row);
        });
        return output;
      } else {
        return data.map(function(v) { return [v]; });
      }
    }

    // If it's a single object → return as 2D array
    if (typeof data === "object") {
      var headers = Object.keys(data);
      var values = headers.map(function(h) { return data[h]; });
      return [headers, values];
    }

    return [[data]];
  } catch (e) {
    return [["Error: " + e.message]];
  }
}

function traverse(obj, path) {
  return path.reduce(function(acc, key) {
    return acc && acc[key] !== undefined ? acc[key] : null;
  }, obj);
}
