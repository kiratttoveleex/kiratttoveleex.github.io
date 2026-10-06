const fs = require("fs");

const WORDS_FILE = "main/language/English/list.js";
const WORDS_VAR = "list";
const LIST_FILE = "main/repository/Trend/list.js";

const load = (file, name) =>
  new Function(fs.readFileSync(file, "utf8") + `;return ${name};`)();

const words = load(WORDS_FILE, WORDS_VAR);
const data = load(LIST_FILE, "scoreData");

const d = new Date(Date.now() + 8 * 3600 * 1000 - 24 * 3600 * 1000);
const date = d.toISOString().slice(2, 10);

const last = data[data.length - 1];
if (last && last.date === date) {
  last.score = words.length;
} else {
  data.push({ date, score: words.length });
}

const lines = data
  .map(e => `\t{date: "${e.date}", score: ${e.score}},`)
  .join("\n");
fs.writeFileSync(LIST_FILE, `scoreData = [\n${lines}\n];\n`);