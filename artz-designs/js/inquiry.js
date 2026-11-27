/* ==========================================================
   START A PROJECT — inquiry form

   SETUP: paste your form service endpoint below to receive
   submissions (with photos) by email, e.g. a Formspree form URL
   like "https://formspree.io/f/abcdwxyz". Until it is set, the
   form opens the visitor's email app with their answers filled in
   and asks them to attach their photos.
   ========================================================== */
var INQUIRY_ENDPOINT = "";
var INQUIRY_EMAIL = "hello@artzdesigns.com"; // placeholder — replace with your real address

(function () {
  "use strict";
  var form = document.getElementById("inquiry");
  if (!form) return;

  var MAX_PHOTOS = 10, MAX_SIDE = 2000;
  var input = document.getElementById("photos");
  var drop = document.getElementById("drop");
  var thumbs = document.getElementById("thumbs");
  var msg = document.getElementById("formMsg");
  var photos = []; // {file, url}

  function say(text, kind) {
    msg.textContent = text;
    msg.className = "form-msg" + (kind ? " " + kind : "");
  }

  function addFiles(list) {
    var added = 0;
    Array.prototype.forEach.call(list, function (f) {
      if (!/^image\//.test(f.type)) return;
      if (photos.length >= MAX_PHOTOS) return;
      photos.push({ file: f, url: URL.createObjectURL(f) });
      added++;
    });
    if (list.length > added && photos.length >= MAX_PHOTOS) say("Up to " + MAX_PHOTOS + " photos can be added.", "warn");
    else say("");
    render();
  }

  function render() {
    thumbs.textContent = "";
    photos.forEach(function (p, i) {
      var li = document.createElement("li");
      var img = document.createElement("img");
      img.src = p.url; img.alt = "Photo " + (i + 1);
      var rm = document.createElement("button");
      rm.type = "button"; rm.className = "rm";
      rm.setAttribute("aria-label", "Remove photo " + (i + 1));
      rm.textContent = "×";
      rm.addEventListener("click", function () {
        URL.revokeObjectURL(p.url);
        photos.splice(i, 1);
        render();
      });
      li.appendChild(img); li.appendChild(rm);
      thumbs.appendChild(li);
    });
    drop.classList.toggle("has-photos", photos.length > 0);
  }

  input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); });
  });
  drop.addEventListener("drop", function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

  // Shrink large phone photos before upload (keeps submissions fast and under size limits)
  function shrink(file) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        if (s === 1 && file.size < 2.5e6) return resolve(file);
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          resolve(b ? new File([b], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file);
        }, "image/jpeg", 0.85);
      };
      img.onerror = function () { resolve(file); };
      img.src = URL.createObjectURL(file);
    });
  }

  function summary(fd) {
    var lines = [
      "Project type: " + (fd.get("project_type") || "-"),
      "Location: " + (fd.get("location") || "-"),
      "Budget: " + (fd.get("budget") || "-"),
      "Timeline: " + (fd.get("timeline") || "-"),
      "", "What I'd like created:", fd.get("description") || "", "",
      "Name: " + fd.get("name"), "Email: " + fd.get("email"), "Phone: " + (fd.get("phone") || "-"),
    ];
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      var bad = form.querySelector(":invalid");
      say("Please fill in the highlighted fields.", "warn");
      form.classList.add("tried");
      if (bad) bad.focus();
      return;
    }
    var fd = new FormData(form);
    fd.delete("photos");
    var btn = form.querySelector(".submit");

    if (!INQUIRY_ENDPOINT) {
      var body = summary(fd) + (photos.length ? "\n\n(I'll attach " + photos.length + " photo" + (photos.length > 1 ? "s" : "") + " of the space to this email.)" : "");
      window.location.href = "mailto:" + INQUIRY_EMAIL +
        "?subject=" + encodeURIComponent("New project: " + (fd.get("project_type") || "inquiry") + " — " + fd.get("name")) +
        "&body=" + encodeURIComponent(body);
      say(photos.length ? "Your email app should open with your details filled in. Please attach your photos there before sending." :
          "Your email app should open with your details filled in.", "ok");
      return;
    }

    btn.disabled = true;
    say("Sending…");
    Promise.all(photos.map(function (p) { return shrink(p.file); })).then(function (files) {
      files.forEach(function (f) { fd.append("photos", f, f.name); });
      fd.append("_subject", "New project: " + (fd.get("project_type") || "inquiry") + " — " + fd.get("name"));
      return fetch(INQUIRY_ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } });
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset(); photos.forEach(function (p) { URL.revokeObjectURL(p.url); }); photos = []; render();
      form.classList.remove("tried");
      say("Thank you! Your project details were sent. We'll be in touch soon.", "ok");
    }).catch(function () {
      say("Something went wrong sending the form. Please try again, or email " + INQUIRY_EMAIL + ".", "warn");
    }).then(function () { btn.disabled = false; });
  });
})();
