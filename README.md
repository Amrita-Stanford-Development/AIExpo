# AI Expo Registration Page

A static registration page for the AI Expo. School and college teams (1-3
students, unlimited teams per institution) register here; entries are stored
as rows in a Google Sheet.

## Deploy

**1. Create the sheet**
Create a new Google Sheet. This will hold every registration as a row.

**2. Add the Apps Script**
In the sheet: `Extensions > Apps Script`. Delete the placeholder code and
paste in the contents of `google-apps-script/Code.gs`. Save.

**3. Deploy as a web app**
`Deploy > New deployment` → type: **Web app** → Execute as **Me** → Who has
access: **Anyone**. Deploy, authorize the permissions Google asks for, and
copy the Web App URL it gives you.

**4. Wire up the frontend**
Open `script.js` and paste that URL into `APPS_SCRIPT_URL` at the top of the
file.

**5. Publish**
Push this repo to GitHub, then enable GitHub Pages (`Settings > Pages`,
serve from the branch root). Your registration page is live at the URL
GitHub Pages gives you.

## Viewing registrations

Just open the Google Sheet — every submission appends a row, with a header
row added automatically on the first entry.
