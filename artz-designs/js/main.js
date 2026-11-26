(function () {
  "use strict";

  var data = window.PORTFOLIO || {};

  // ---- Mobile menu ----
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- Footer year ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Home page: category cover images ----
  document.querySelectorAll(".cat-card[data-category]").forEach(function (card) {
    var cat = data[card.dataset.category];
    var cover = card.querySelector(".cover");
    if (!cat || !cover) return;
    var src = cat.cover || (cat.items[0] && cat.items[0].src);
    if (src) cover.style.backgroundImage = "url('" + src + "')";
  });

  // ---- Category page: gallery ----
  var gallery = document.querySelector(".gallery[data-category]");
  var items = [];
  if (gallery) {
    var cat = data[gallery.dataset.category] || { items: [] };
    items = cat.items || [];

    if (!items.length) {
      // Placeholder tiles with varied heights for a masonry feel
      var ratios = ["4 / 5", "3 / 2", "1 / 1", "4 / 3", "3 / 4", "16 / 10"];
      ratios.forEach(function (r) {
        var t = document.createElement("div");
        t.className = "tile placeholder reveal";
        t.innerHTML = '<div class="frame" style="aspect-ratio:' + r + '">Image coming soon</div>';
        gallery.appendChild(t);
      });
    } else if (cat.layout === "projects") {
      gallery.classList.add("projects");
      items = renderProjects(cat.items, gallery);
    } else {
      items.forEach(function (item, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tile reveal";
        b.setAttribute("aria-label", "View " + (item.title || "image " + (i + 1)));

        var frame = document.createElement("div");
        frame.className = "frame";
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title || "";
        img.loading = "lazy";
        frame.appendChild(img);
        b.appendChild(frame);

        if (item.title || item.year) {
          var meta = document.createElement("div");
          meta.className = "meta";
          var s = document.createElement("strong");
          s.textContent = item.title || "";
          var y = document.createElement("small");
          y.textContent = item.year || "";
          meta.appendChild(s);
          meta.appendChild(y);
          b.appendChild(meta);
        }

        b.addEventListener("click", function () { openLightbox(i); });
        gallery.appendChild(b);
      });
    }
  }

  // ---- Project rows (photos + story, with view toggles) ----
  // Returns a flat list of every photo on the page for the lightbox.
  function renderProjects(projects, root) {
    var flat = [];
    var ICONS = { play: "▶︎", sun: "☀︎", moon: "☾︎", snow: "❄︎", leaf: "❦︎", star: "✦︎" };

    projects.forEach(function (p) {
      var views = p.views || [{ src: p.src }];
      var firstIndex = flat.length;
      views.forEach(function (v) {
        flat.push({
          src: v.src,
          video: v.video || "",
          title: p.title + (v.label && views.length > 1 ? " — " + v.label : ""),
          caption: v.note || p.caption || "",
          year: p.year || "",
        });
      });

      var art = document.createElement("article");
      art.className = "project reveal";

      // Media: all views stacked, cross-fading
      var media = document.createElement("button");
      media.type = "button";
      media.className = "project-media";
      media.setAttribute("aria-label", "Open " + p.title + " full screen");
      views.forEach(function (v, j) {
        var img;
        if (v.video) {
          // Short looping clip; plays only while its view is selected
          img = document.createElement("video");
          img.src = v.video;
          img.poster = v.src;
          img.muted = true; img.loop = true; img.playsInline = true;
          img.preload = "metadata";
          img.setAttribute("aria-label", p.title + (v.label ? " — " + v.label : ""));
          media.appendChild(img);
          return;
        }
        img = document.createElement("img");
        img.src = v.src;
        img.alt = p.title + (v.label ? " — " + v.label : "");
        img.loading = "lazy";
        if (v.position) img.style.objectPosition = v.position;
        if (j === 0) {
          img.className = "on";
          img.addEventListener("load", function () {
            media.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
          });
        }
        media.appendChild(img);
      });
      var active = 0;
      media.addEventListener("click", function () { openLightbox(firstIndex + active); });

      // Text
      var text = document.createElement("div");
      text.className = "project-text";
      if (p.meta) {
        var meta = document.createElement("div");
        meta.className = "eyebrow";
        meta.textContent = p.meta;
        text.appendChild(meta);
      }
      var h = document.createElement("h2");
      h.textContent = p.title;
      text.appendChild(h);
      if (p.caption) {
        var cap = document.createElement("p");
        cap.textContent = p.caption;
        text.appendChild(cap);
      }

      if (views.length > 1) {
        var note = document.createElement("p");
        note.className = "view-note";
        note.setAttribute("aria-live", "polite");

        var tabs = document.createElement("div");
        tabs.className = "view-toggle";
        tabs.setAttribute("role", "group");
        tabs.setAttribute("aria-label", "Change view");
        var imgs = media.querySelectorAll("img, video");

        var select = function (j) {
          active = j;
          imgs.forEach(function (im, k) {
            im.classList.toggle("on", k === j);
            if (im.tagName === "VIDEO") {
              if (k === j) { var pr = im.play(); if (pr && pr.catch) pr.catch(function () {}); }
              else im.pause();
            }
          });
          tabs.querySelectorAll("button").forEach(function (b, k) {
            b.setAttribute("aria-pressed", String(k === j));
          });
          art.dataset.mood = views[j].mood || "";
          note.textContent = views[j].note || "";
          note.hidden = !views[j].note;
        };

        views.forEach(function (v, j) {
          var b = document.createElement("button");
          b.type = "button";
          b.innerHTML = (ICONS[v.icon] ? '<span aria-hidden="true">' + ICONS[v.icon] + "</span> " : "");
          b.appendChild(document.createTextNode(v.label || "View " + (j + 1)));
          b.addEventListener("click", function () { select(j); });
          tabs.appendChild(b);
        });
        text.appendChild(tabs);
        text.appendChild(note);
        select(0);
      }

      art.appendChild(media);
      art.appendChild(text);
      root.appendChild(art);
    });
    return flat;
  }

  // ---- Lightbox ----
  var lb, lbImg, lbVid, lbCap, current = 0, lastFocus;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous">&larr;</button>' +
      '<figure><img alt=""><video controls loop playsinline muted hidden></video><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="Next">&rarr;</button>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector("img");
    lbVid = lb.querySelector("video");
    lbCap = lb.querySelector("figcaption");
    lb.querySelector(".lb-close").onclick = closeLightbox;
    lb.querySelector(".lb-prev").onclick = function () { show(current - 1); };
    lb.querySelector(".lb-next").onclick = function () { show(current + 1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  }

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    if (item.video) {
      lbImg.hidden = true; lbImg.removeAttribute("src");
      lbVid.hidden = false; lbVid.poster = item.src; lbVid.src = item.video;
      var pr = lbVid.play(); if (pr && pr.catch) pr.catch(function () {});
    } else {
      lbVid.pause(); lbVid.hidden = true; lbVid.removeAttribute("src");
      lbImg.hidden = false;
      lbImg.src = item.src;
    }
    lbImg.alt = item.title || "";
    lbCap.textContent = "";
    if (item.title) {
      var t = document.createElement("div");
      t.textContent = item.title + (item.year ? " — " + item.year : "");
      lbCap.appendChild(t);
    }
    if (item.caption) {
      var c = document.createElement("small");
      c.textContent = item.caption;
      lbCap.appendChild(c);
    }
    var multi = items.length > 1;
    lb.querySelector(".lb-prev").hidden = !multi;
    lb.querySelector(".lb-next").hidden = !multi;
  }

  function openLightbox(i) {
    if (!lb) buildLightbox();
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }

  function closeLightbox() {
    if (lbVid) lbVid.pause();
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("keydown", function (e) {
    if (!lb || !lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Swipe on touch devices
  var touchX = null;
  document.addEventListener("touchstart", function (e) {
    if (lb && lb.classList.contains("open")) touchX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
