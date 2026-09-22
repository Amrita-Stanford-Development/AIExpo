// Paste this into the Apps Script editor bound to your Google Sheet
// (Extensions > Apps Script), then Deploy > New deployment > Web app.
// Execute as: Me. Who has access: Anyone.

const HEADERS = [
  "Timestamp", "Category", "Institution", "Team Name",
  "Member 1 Name", "Member 1 Grade", "Member 1 Degree",
  "Member 2 Name", "Member 2 Grade", "Member 2 Degree",
  "Member 3 Name", "Member 3 Grade", "Member 3 Degree",
  "Coordinator Name", "Coordinator Email", "Coordinator Phone",
  "Project Title", "Abstract", "Problem", "AI Tools", "Link",
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.category || "",
    data.institution || "",
    data.teamName || "",
    data.member1Name || "",
    data.member1Grade || "",
    data.member1Degree || "",
    data.member2Name || "",
    data.member2Grade || "",
    data.member2Degree || "",
    data.member3Name || "",
    data.member3Grade || "",
    data.member3Degree || "",
    data.coordName || "",
    data.coordEmail || "",
    data.coordPhone || "",
    data.projectTitle || "",
    data.abstract || "",
    data.problem || "",
    data.aiTools || "",
    data.link || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
