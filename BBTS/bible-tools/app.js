const sourceText = document.getElementById("sourceText");
const resultText = document.getElementById("resultText");
const statusText = document.getElementById("status");

const setStatus = (message) => {
  statusText.textContent = message;
};

const normalizeText = (input) => {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const toQuoteFormat = (input) => {
  const clean = normalizeText(input);
  if (!clean) return "";
  return clean
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `> ${line}`)
    .join("\n");
};

const extractReferences = (input) => {
  const clean = normalizeText(input);
  if (!clean) return "";

  const patterns = [
    /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s+\d+:\d+(?:-\d+)?\b/gi
  ];

  const hitSet = new Set();
  patterns.forEach((pattern) => {
    const matches = clean.match(pattern) || [];
    matches.forEach((m) => hitSet.add(m));
  });

  const hits = Array.from(hitSet);
  if (hits.length === 0) return "No verse references found.";
  return hits.join("\n");
};

document.querySelectorAll("button[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const input = sourceText.value || "";

    if (action === "clear") {
      sourceText.value = "";
      resultText.value = "";
      setStatus("Cleared.");
      return;
    }

    if (!input.trim()) {
      setStatus("Please enter some text first.");
      return;
    }

    if (action === "normalize") {
      resultText.value = normalizeText(input);
      setStatus("Text cleaned.");
      return;
    }

    if (action === "toQuote") {
      resultText.value = toQuoteFormat(input);
      setStatus("Converted to quote format.");
      return;
    }

    if (action === "extractRefs") {
      resultText.value = extractReferences(input);
      setStatus("References extracted.");
    }
  });
});

document.getElementById("copyResult").addEventListener("click", async () => {
  if (!resultText.value) {
    setStatus("Nothing to copy yet.");
    return;
  }
  try {
    await navigator.clipboard.writeText(resultText.value);
    setStatus("Result copied.");
  } catch {
    setStatus("Copy failed. Please copy manually.");
  }
});
