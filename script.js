// TODO: replace with the real Darsiga Garments enquiry address.
const ENQUIRY_EMAIL = "enquiries@example.com";

const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNavOpen(open) {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

navToggle.addEventListener("click", () => {
  setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});

const form = document.getElementById("enquiry-form");
const formError = document.getElementById("form-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const missing = ["name", "phone", "details"].find((key) => !data[key].trim());
  formError.hidden = !missing;
  if (missing) {
    form.elements[missing].focus();
    return;
  }

  const subject = `Enquiry: ${data.range} (${data.type})`;
  const body = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Enquiring as: ${data.type}`,
    `Range: ${data.range}`,
    "",
    "Requirements:",
    data.details,
  ].join("\n");

  window.location.href =
    `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

// Motion: scroll reveals, header state and hero parallax.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");

// Stagger siblings that reveal together.
document.querySelectorAll("[data-stagger]").forEach((group) => {
  [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
        // Drop the reveal classes once settled so the stagger delay doesn't lag hover effects.
        const delay = Number(getComputedStyle(el).getPropertyValue("--i") || 0) * 80;
        setTimeout(() => el.classList.remove("reveal", "reveal-img", "is-visible"), delay + 1300);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
}

const header = document.querySelector(".site-header");
const parallaxEls = reduceMotion ? [] : [...document.querySelectorAll("[data-parallax]")];
let ticking = false;

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  parallaxEls.forEach((el) => {
    const rect = el.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * Number(el.dataset.parallax);
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
  });
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  },
  { passive: true }
);
onScroll();
