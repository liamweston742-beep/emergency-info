const MAX_ATTEMPTS = 4;
const LOCK_TIME_MS = 10 * 60 * 1000;

let attempts = 0;
let lockedUntil = null;

const params = new URLSearchParams(window.location.search);
const id = params.get("id")?.toLowerCase();

function togglePassphrase() {
  const input = document.getElementById("passphrase");
  input.type = input.type === "password" ? "text" : "password";
}

function unlock() {
  const input = document.getElementById("passphrase").value;
  const error = document.getElementById("error");
  const now = Date.now();

  // Check if locked
  if (lockedUntil && now < lockedUntil) {
    error.textContent = "Too many incorrect attempts. Please try again later.";
    return;
  }

  // Check valid ID
  if (!people[id]) {
    error.textContent = "Invalid emergency tag.";
    return;
  }

  // Correct passphrase
  if (input === people[id].passphrase) {
    attempts = 0;
    lockedUntil = null;

    document.getElementById("info").classList.remove("hidden");

    document.getElementById("name").textContent = people[id].name;
    document.getElementById("nationality").textContent = people[id].nationality;
    document.getElementById("allergies").textContent = people[id].allergies;
    document.getElementById("medical").textContent = people[id].medical;
    document.getElementById("medications").textContent = people[id].medications;
    document.getElementById("blood").textContent = people[id].blood;
    document.getElementById("contact").textContent = people[id].contact;
    document.getElementById("contact2").textContent = people[id].contact2;
    document.getElementById("languages").textContent = people[id].languages;

    error.textContent = "";
  } else {
    attempts++;
    if (attempts >= MAX_ATTEMPTS) {
      lockedUntil = now + LOCK_TIME_MS;
      error.textContent = "Too many incorrect attempts. Access temporarily locked.";
    } else {
      error.textContent = `Incorrect passphrase. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`;
    }
  }
}

window.addEventListener("load", () => {
  const field = document.getElementById("passphrase");
  field.focus();
  field.addEventListener("keydown", e => {
    if (e.key === "Enter") unlock();
  });
});
