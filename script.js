// Paste the Web App URL you get from deploying google-apps-script/Code.gs here.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpUp4KpYYiTwtME0Qzj0mPGoj5IdU6mD7a4mR2J4Pw71krtisgx9osCnzJYtYnAo_j0w/exec";

const form = document.getElementById("registration-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const coordinatorFields = document.getElementById("coordinator-fields");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

const BASE_REQUIRED = [
  "category", "institution", "teamName",
  "member1Name", "member1Grade",
  "projectTitle", "abstract", "problem", "aiTools",
];
const COORDINATOR_FIELDS = ["coordName", "coordEmail", "coordPhone"];
const GRADE_LABEL_IDS = ["m1grade-label", "m2grade-label", "m3grade-label"];
const DEGREE_FIELDS = ["member1Degree", "member2Degree", "member3Degree"];
const COLLEGE_REQUIRED_FIELDS = ["member1Degree"];

function currentCategory() {
  return form.querySelector('input[name="category"]:checked')?.value || "";
}

// School teams need a coordinator on record and use "Grade"; college teams
// register themselves, use "Year", and also give a degree name.
function syncCategoryFields() {
  const isSchool = currentCategory() === "School";
  coordinatorFields.hidden = !isSchool;
  if (!isSchool) {
    for (const name of COORDINATOR_FIELDS) {
      form.querySelector(`[name="${name}"]`).value = "";
      setError(name, false);
    }
  }
  for (const id of GRADE_LABEL_IDS) {
    document.getElementById(id).textContent = isSchool ? "Grade" : "Year";
  }
  for (const name of DEGREE_FIELDS) {
    document.getElementById(`${name}-field`).hidden = isSchool;
    if (isSchool) {
      form.querySelector(`[name="${name}"]`).value = "";
      setError(name, false);
    }
  }
}

form.querySelectorAll('input[name="category"]').forEach((radio) => {
  radio.addEventListener("change", syncCategoryFields);
});

function setError(name, show) {
  const msg = form.querySelector(`[data-error-for="${name}"]`);
  const field = msg ? msg.closest(".field") : null;
  if (msg) msg.hidden = !show;
  if (field) field.classList.toggle("invalid", show);
}

function validate(data) {
  let firstInvalid = null;
  const required = currentCategory() === "School"
    ? [...BASE_REQUIRED, ...COORDINATOR_FIELDS]
    : [...BASE_REQUIRED, ...COLLEGE_REQUIRED_FIELDS];

  for (const name of required) {
    const value = (data.get(name) || "").trim();
    const invalid = value === "";
    setError(name, invalid);
    if (invalid && !firstInvalid) firstInvalid = name;
  }

  const email = (data.get("coordEmail") || "").trim();
  if (email && !EMAIL_RE.test(email)) {
    setError("coordEmail", true);
    firstInvalid = firstInvalid || "coordEmail";
  }

  const phone = (data.get("coordPhone") || "").trim();
  if (phone && !PHONE_RE.test(phone)) {
    setError("coordPhone", true);
    firstInvalid = firstInvalid || "coordPhone";
  }

  return firstInvalid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "";

  const data = new FormData(form);
  const firstInvalid = validate(data);

  if (firstInvalid) {
    const field = form.querySelector(`[name="${firstInvalid}"]`);
    if (field) field.focus();
    statusEl.textContent = "Please fix the highlighted fields.";
    statusEl.className = "error";
    return;
  }

  const payload = Object.fromEntries(data.entries());

  submitBtn.disabled = true;
  statusEl.textContent = "Submitting…";
  statusEl.className = "";

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });

    statusEl.textContent = `Registration received. We've logged "${payload.teamName}" for ${payload.institution}.`;
    statusEl.className = "success";
    form.reset();
    syncCategoryFields();
  } catch (err) {
    statusEl.textContent = "Something went wrong sending your registration. Check your connection and try again.";
    statusEl.className = "error";
  } finally {
    submitBtn.disabled = false;
  }
});
