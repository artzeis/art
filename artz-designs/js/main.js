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

  // ---- Lightbox ----
  var lb, lbImg, lbCap, current = 0, lastFocus;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous">&larr;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="Next">&rarr;</button>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector("img");
    lbCap = lb.querySelector("figcaption");
    lb.querySelector(".lb-close").onclick = closeLightbox;
    lb.querySelector(".lb-prev").onclick = function () { show(current - 1); };
    lb.querySelector(".lb-next").onclick = function () { show(current + 1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  }

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.src;
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
