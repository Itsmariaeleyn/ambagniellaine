function setNav(el) {
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  el.classList.add("active");
}

function handleSignOut() {
  showToast("You have been signed out.", "success");
}

function removeTag(btn) {
  btn.closest(".tag").remove();
}

function showTagInput() {
  document.getElementById("tagAddBtn").style.display = "none";
  document.getElementById("tagInputWrap").style.display = "flex";
  document.getElementById("tagInputField").focus();
}

function addTag() {
  const input = document.getElementById("tagInputField");
  const val = input.value.trim();
  if (!val) return;
  const container = document.getElementById("tagContainer");
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.dataset.name = val;
  tag.innerHTML = val + ' <span class="tag-remove" onclick="removeTag(this)">&#x2715;</span>';
  container.insertBefore(tag, document.getElementById("tagAddBtn"));
  input.value = "";
  document.getElementById("tagInputWrap").style.display = "none";
  document.getElementById("tagAddBtn").style.display = "";
}

function tagKeydown(e) {
  if (e.key === "Enter") addTag();
  if (e.key === "Escape") {
    document.getElementById("tagInputWrap").style.display = "none";
    document.getElementById("tagAddBtn").style.display = "";
  }
}

function validate() {
  let ok = true;
  [["fieldPatient","errPatient"],["fieldDob","errDob"],["fieldChart","errChart"],["fieldPhysician","errPhysician"]].forEach(([id, err]) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(err);
    if (!el.value.trim()) {
      el.classList.add("invalid");
      errEl.classList.add("show");
      ok = false;
    } else {
      el.classList.remove("invalid");
      errEl.classList.remove("show");
    }
  });
  const tags = document.querySelectorAll("#tagContainer .tag");
  const errTags = document.getElementById("errTags");
  if (tags.length === 0) { errTags.classList.add("show"); ok = false; }
  else { errTags.classList.remove("show"); }
  const tech = document.getElementById("fieldTech");
  const errTech = document.getElementById("errTech");
  if (!tech.value) { errTech.classList.add("show"); ok = false; }
  else { errTech.classList.remove("show"); }
  return ok;
}

document.querySelectorAll(".field-input").forEach(el => {
  el.addEventListener("input", () => {
    el.classList.remove("invalid");
    const errId = "err" + el.id.replace("field", "");
    const errEl = document.getElementById(errId);
    if (errEl) errEl.classList.remove("show");
  });
});

function handleConfirm() {
  if (!validate()) { showToast("Please fill in all required fields.", "error"); return; }
  const tech = document.getElementById("fieldTech").value;
  document.getElementById("successSub").textContent = "REQ-2026001 has been assigned to " + tech + ".";
  document.getElementById("successOverlay").classList.add("visible");
}

function handleCancel() {
  if (confirm("Discard changes and close this request?")) {
    showToast("Request cancelled.", "success");
    document.getElementById("successOverlay").classList.remove("visible");
  }
}

function resetForm() {
  document.getElementById("successOverlay").classList.remove("visible");
  showToast("Request marked as Processing!", "success");
}

let toastTimer;
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  document.getElementById("toastMsg").textContent = msg;
  toast.className = "toast " + type;
  if (type === "success") {
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  } else {
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
