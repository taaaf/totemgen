import { useEffect, useMemo } from "react";

// Function to determine the delimiter
function determineDelimiter(line) {
  const delimiters = [",", ";", "|", "\t"];
  return delimiters.find(delimiter => line.includes(delimiter));
}

// Function to parse a line, handling quoted sections
function parseLine(line, delimiter) {
  const regex = new RegExp(`(${delimiter}|^)("(?:(?:"")*[^"]*)*"|[^${delimiter}"]+|(?!${delimiter}"?))`, 'g');
  const values = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    let value = match[2];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/,/g, '.').replace(/""/g, '"');
    }
    values.push(value);
  }
  return values;
}

function ParseVertexData(props) {
  const { file, onTableReady } = props;

  const table = useMemo(() => {
    const lines = file.split(/\r?\n/);
    const rows = [];

    // Find the delimiter from the first non-empty line
    const firstLine = lines.find(line => line.trim() !== "");
    const delimiter = determineDelimiter(firstLine) || ","; // Default to comma if none found

    lines.forEach(line => {
      line = line.trim();
      if (line === "") return;
      rows.push(parseLine(line, delimiter));
    });

    return rows;
  }, [file]);

  useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
    console.log(table);
  }, [onTableReady, table]);

  // Component does not render anything
  return null;
}

export default ParseVertexData;
