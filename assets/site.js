/* Loopdesk AI — shared site script */

// ── Settings ──────────────────────────────────────────────────────────────
// Live demo line, e.g. "+1 (437) 555-0199". Leave empty until the line is live.
const DEMO_NUMBER = "";
// Where trial and contact form submissions are sent (POSTed as JSON).
// TODO: set this once the lead email / endpoint is ready (e.g. a Formspree URL
// or your own backend). While empty, the visitor still sees the thank-you page,
// but the details are NOT sent anywhere.
const LEAD_ENDPOINT = "";

(function () {
  // Mobile menu
  const nav = document.querySelector("nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false");
    }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { nav.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); } });
  }

  // Scroll reveals (content stays visible without JS or with reduced motion)
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".reveal, #brain .chat");
  if (reduce || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); }
  else {
    const io = new IntersectionObserver((list) => list.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
    setTimeout(() => els.forEach((e) => e.classList.add("in")), 6000);
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Demo number
  document.querySelectorAll("[data-demo-number]").forEach((el) => {
    if (DEMO_NUMBER) { el.textContent = DEMO_NUMBER; el.setAttribute("href", "tel:" + DEMO_NUMBER.replace(/[^\d+]/g, "")); el.hidden = false; }
  });
  document.querySelectorAll("[data-demo-live]").forEach((el) => (el.hidden = !DEMO_NUMBER));
  document.querySelectorAll("[data-demo-pending]").forEach((el) => (el.hidden = !!DEMO_NUMBER));

  // Pre-select the plan from ?plan=… (pricing buttons link here)
  const params = new URLSearchParams(location.search);
  const planSel = document.getElementById("plan");
  if (planSel && params.get("plan")) {
    const v = params.get("plan").toUpperCase();
    if ([...planSel.options].some((o) => o.value === v)) planSel.value = v;
  }
  const notes = document.getElementById("notes");
  if (notes && params.get("demo")) notes.value = "I'd like to hear the demo line first.";

  // Forms
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  document.querySelectorAll("form[data-lead]").forEach((form) => {
    const msg = form.querySelector(".msg");
    const btn = form.querySelector("button[type=submit]");
    const label = btn ? btn.textContent : "";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));
      const data = Object.fromEntries(new FormData(form).entries());
      for (const k of Object.keys(data)) data[k] = String(data[k]).trim().slice(0, 1000);
      const missing = [...form.querySelectorAll("[required]")].filter((el) => !String(el.value).trim());
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      if (phone && phone.value && phone.value.replace(/\D/g, "").length < 10) missing.push(phone);
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) missing.push(email);
      if (missing.length) {
        missing.forEach((el) => el.classList.add("field-error"));
        msg.className = "msg warn"; msg.hidden = false;
        msg.innerHTML = "Please fill in the highlighted fields. Phone numbers need at least 10 digits.";
        missing[0].focus();
        return;
      }
      data.form = form.dataset.lead;
      data.page = location.pathname;
      data.submittedAt = new Date().toISOString();
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      let ok = true;
      if (LEAD_ENDPOINT) {
        try {
          const r = await fetch(LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          ok = r.ok;
        } catch (err) { ok = false; }
      }
      if (btn) { btn.disabled = false; btn.textContent = label; }
      if (!ok) {
        msg.className = "msg warn"; msg.hidden = false;
        msg.innerHTML = "Sorry, that didn't go through. Please try again in a moment.";
        return;
      }
      try { sessionStorage.setItem("loopdesk_lead", JSON.stringify(data)); } catch (err) {}
      location.href = "thank-you.html?type=" + encodeURIComponent(form.dataset.lead);
    });
  });

  // Thank-you page
  const thanks = document.getElementById("thanks");
  if (thanks) {
    let d = null;
    try { d = JSON.parse(sessionStorage.getItem("loopdesk_lead") || "null"); } catch (err) {}
    const type = params.get("type") || (d && d.form) || "trial";
    const h = document.getElementById("thanks-title");
    const p = document.getElementById("thanks-text");
    if (type === "contact") {
      h.textContent = d && d.name ? `Thanks, ${d.name}.` : "Thanks for your message.";
      p.textContent = "We'll reply within one business day.";
    } else {
      h.textContent = d && d.name ? `Got it, ${d.name}.` : "Your trial request is in.";
      p.innerHTML = d && d.phone ? `We'll call <b>${esc(d.phone)}</b> within one business day to set up ${esc(d.business || "your business")}.` : "We'll call you within one business day to set up your free trial.";
    }
  }
})();
