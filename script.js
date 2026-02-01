// ===== Elements =====
const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openLetterBtn");
const envelopeUI = document.getElementById("envelopeUI");
const letterUI = document.getElementById("letterUI");
const message = document.getElementById("message");
const fontSelect = document.getElementById("fontSelect");
const textColor = document.getElementById("textColor");
const fontSize = document.getElementById("fontSize");
const letterBox = document.getElementById("letterBox");
const recipient = document.getElementById("recipient");
const sender = document.getElementById("sender");
const emailInput = document.getElementById("email");
const formatSelect = document.getElementById("format");
const bgMusic = document.getElementById("bgMusic");
const sendBtn = document.getElementById("sendLetterBtn");
const musicBtn = document.getElementById("musicBtn");

// ===== Envelope Animation =====
openBtn.onclick = () => {
  envelope.classList.add("open");
  setTimeout(() => {
    envelopeUI.style.display = "none";
    letterUI.classList.remove("hidden");
  }, 900);
};

// ===== Auto Date =====
document.getElementById("date").innerText = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric"
});

// ===== Background Music per Letter Type =====
const musicFiles = {
  "Love Letter": "kuped.mp3",
  "Formal Letter": "peynknwite.mp3",
  "Informal Letter": "arizonab.mp3",
  "Birthday Letter": "bdaysmegs.mp3",
  "Invitation Letter": "when.mp3"
};

// ===== Apply Styles =====
fontSelect.onchange = () => letterBox.style.fontFamily = fontSelect.value;
textColor.oninput = () => letterBox.style.color = textColor.value;
fontSize.oninput = () => letterBox.style.fontSize = fontSize.value + "px";

// ===== Format Change =====
formatSelect.onchange = () => {
  const type = formatSelect.value;
  document.getElementById("title").innerText = type;
  if (musicFiles[type]) {
    bgMusic.src = musicFiles[type];
    bgMusic.play().catch(()=>console.log("Autoplay blocked"));
  }
};

// ===== Dark Mode =====
document.getElementById("darkBtn").onclick = () => document.body.classList.toggle("dark");

// ===== Reset =====
document.getElementById("resetBtn").onclick = () => {
  localStorage.clear();
  location.reload();
};

// ===== Save Draft =====
document.getElementById("saveDraft").onclick = () => {
  localStorage.setItem("draft", JSON.stringify({
    r: recipient.value,
    m: message.value,
    s: sender.value,
    f: fontSelect.value,
    c: textColor.value,
    sz: fontSize.value
  }));
  alert("Draft saved!");
};

// ===== Load Draft =====
const saved = JSON.parse(localStorage.getItem("draft"));
if(saved){
  recipient.value = saved.r;
  message.value = saved.m;
  sender.value = saved.s;
  fontSelect.value = saved.f;
  textColor.value = saved.c;
  fontSize.value = saved.sz;
  letterBox.style.fontFamily = saved.f;
  letterBox.style.color = saved.c;
  letterBox.style.fontSize = saved.sz + "px";
}

// ===== Music Play/Pause =====
window.addEventListener('load', () => {
  bgMusic.src = musicFiles["Love Letter"];
  bgMusic.play().catch(()=>console.log("Autoplay blocked"));
});

musicBtn.addEventListener("click", () => {
  if(bgMusic.paused){
    bgMusic.play();
    musicBtn.innerText = "Pause Music";
  } else {
    bgMusic.pause();
    musicBtn.innerText = "Play Music";
  }
});

// ===== Send Letter via EmailJS =====
sendBtn.addEventListener("click", () => {
  const toEmail = emailInput.value;
  if (!toEmail) {
    alert("Please enter the recipient's email!");
    return;
  }

  const letterData = {
    recipient_name: recipient.value,
    sender_name: sender.value || "Anonymous",
    message_body: message.value,
    letter_type: formatSelect.value,
    font: fontSelect.value,
    color: textColor.value,
    size: fontSize.value
  };

  const encoded = btoa(JSON.stringify(letterData));
  const viewLink = `${window.location.origin}/view.html?letter=${encoded}`;

  emailjs.send("service_blwhkvs", "template_ka72mdg", {
    to_email: toEmail,
    letter_link: viewLink
  }).then(() => {
    alert("Letter sent successfully!");
  }).catch((err) => {
    console.error(err);
    alert("Failed to send letter. Check EmailJS configuration.");
  });
});
