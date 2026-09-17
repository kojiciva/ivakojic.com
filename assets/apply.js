// Tri pitanja pa kalendar. Odgovori idu u Calendly kao prva napomena (a1),
// pa Iva na razgovor dolazi sa brojkama umesto sa pitanjima.
(function () {
  const CALENDLY = "https://calendly.com/ivakoj/1-1-session";

  const form = document.getElementById("apply");
  const box = document.getElementById("calendar-box");
  const frame = document.getElementById("calendar");
  const fallback = document.getElementById("calendar-link");
  if (!form) return;

  const labels = JSON.parse(form.dataset.labels);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const missing = ["q1", "q2", "q3"].filter((k) => !(data.get(k) || "").trim());
    const warn = document.getElementById("warn");
    if (missing.length) {
      warn.hidden = false;
      document.getElementById(missing[0]).focus();
      return;
    }
    warn.hidden = true;

    const summary = ["q1", "q2", "q3"]
      .map((k, i) => `${labels[i]}: ${data.get(k).trim()}`)
      .join(" · ");

    const url = new URL(CALENDLY);
    url.searchParams.set("a1", summary);
    fallback.href = url.toString();

    url.searchParams.set("embed_domain", location.hostname || "ivakojic.com");
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_gdpr_banner", "1");
    frame.src = url.toString();

    form.hidden = true;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
