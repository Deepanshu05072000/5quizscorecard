const CUTOFF = 30; // overall cut-off only for Vocab + CA (20 + 20 = 40)

const SECTIONAL_CUTOFF = {
  vocab: 15,
  ca: 15
  // desc, banking, computer excluded
};

const USERS = {
  "9151701": { password: "91517001", dob:"05-07-2000", name:"Deepanshu Yadav",
    vocab:{scored:16,total:20}, ca:{scored:17,total:20} },

  "8504002": { password: "85040002", dob:"25-11-2004", name:"Nikita Soni",
    vocab:{scored:20,total:20}, ca:{scored:20,total:20} },

  "8756203": { password: "87562003", dob:"10-08-2002", name:"Jyoti Yadav",
    vocab:{scored:20,total:20}, ca:{scored:15,total:20} },

  "6001104": { password: "60011004", dob:"29-11-1999", name:"Priyanka Dev",
    vocab:{scored:20,total:20}, ca:{scored:15,total:20} },

  "6205705": { password: "62057005", dob:"25-12-2003", name:"Priyanka Verma",
    vocab:{scored:20,total:20}, ca:{scored:14,total:20} },

  "8303906": { password: "83039006", dob:"27-07-2003", name:"Adweta Sen",
    vocab:{scored:20,total:20}, ca:{scored:15,total:20} }
};

function genCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  document.getElementById("captchaText").textContent = s;
  return s;
}

let CURRENT_CAPTCHA = "";
window.onload = () => CURRENT_CAPTCHA = genCaptcha();

function login() {
  const roll = document.getElementById("roll").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const captchaInput = document.getElementById("captchaInput").value.trim();
  const err = document.getElementById("error");

  if (!roll || !password || !dob || !captchaInput) {
    err.textContent = "Please fill all fields.";
    return;
  }
  if (captchaInput !== CURRENT_CAPTCHA) {
    err.textContent = "Invalid CAPTCHA.";
    CURRENT_CAPTCHA = genCaptcha();
    return;
  }
  if (!USERS[roll] || USERS[roll].password !== password || USERS[roll].dob !== dob) {
    err.textContent = "Invalid credentials.";
    CURRENT_CAPTCHA = genCaptcha();
    return;
  }

  const u = USERS[roll];

  const totalObtained = (u.vocab.scored + u.ca.scored).toFixed(1);

  const vocabClear = u.vocab.scored >= SECTIONAL_CUTOFF.vocab;
  const caClear = u.ca.scored >= SECTIONAL_CUTOFF.ca;
  const overallClear = totalObtained >= CUTOFF;

  const finalStatus = vocabClear && caClear && overallClear;

  document.getElementById("name").textContent = u.name;
  document.getElementById("rollShow").textContent = roll;

  // ⭐ Star mark only for Vocab & CA
  document.getElementById("vocab").textContent = `${u.vocab.scored}/${u.vocab.total}${vocabClear ? "" : " *"}`;
  document.getElementById("ca").textContent = `${u.ca.scored}/${u.ca.total}${caClear ? "" : " *"}`;

  document.getElementById("total").textContent = `${totalObtained} / 40`;
  document.getElementById("cutoff").textContent = CUTOFF;

  const statusEl = document.getElementById("status");
  statusEl.textContent = finalStatus ? "Qualified" : "Not Qualified";
  statusEl.className = finalStatus ? "pass" : "fail";

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  ["roll","password","dob","captchaInput"].forEach(id => document.getElementById(id).value = "");
  CURRENT_CAPTCHA = genCaptcha();
}
