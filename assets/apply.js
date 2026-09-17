// Tri pitanja pa kalendar. Odgovori idu u Calendly kao prva napomena (a1),
// pa Iva na razgovor dolazi sa brojkama umesto sa pitanjima.
// Kalendar se učitava zvaničnim Calendly widgetom, tek posle trećeg odgovora.
(function () {
  const CALENDLY = "https://calendly.com/ivakoj/1-1-session";
  const WIDGET = "https://assets.calendly.com/assets/external/widget.js";

  const form = document.getElementById("apply");
  const box = document.getElementById("calendar-box");
  const mount = document.getElementById("calendar");
  const fallback = document.getElementById("calendar-link");
  if (!form) return;

  const labels = JSON.parse(form.dataset.labels);

  function loadWidget() {
    return new Promise((resolve, reject) => {
      if (window.Calendly) return resolve();
      const s = document.createElement("script");
      s.src = WIDGET;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const warn = document.getElementById("warn");
    const missing = ["q1", "q2", "q3"].filter((k) => !(data.get(k) || "").trim());
    if (missing.length) {
      warn.hidden = false;
      document.getElementById(missing[0]).focus();
      return;
    }
    warn.hidden = true;

    const summary = ["q1", "q2", "q3"]
      .map((k, i) => `${labels[i]}: ${data.get(k).trim()}`)
      .join(" · ");

    const direct = new URL(CALENDLY);
    direct.searchParams.set("a1", summary);
    fallback.href = direct.toString();

    form.hidden = true;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      await loadWidget();
      window.Calendly.initInlineWidget({
        url: CALENDLY + "?hide_gdpr_banner=1",
        parentElement: mount,
        prefill: { customAnswers: { a1: summary } },
      });
    } catch (err) {
      // Widget nije stigao, ostaje link za novi prozor.
      mount.hidden = true;
    }
  });
})();
