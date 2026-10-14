"use strict";
const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let tipPct = 18;

const num = (s) => {
  const n = Number(String(s).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

function calc() {
  const bill = num($("bill").value);
  const people = Math.max(1, Math.min(99, Math.floor(num($("people").value)) || 1));
  const tip = (bill * tipPct) / 100;
  const total = bill + tip;
  let each = total / people;
  let extra = 0;
  if ($("round").checked && bill > 0) {
    const rounded = Math.ceil(each - 1e-9);
    extra = rounded * people - total;
    each = rounded;
  }
  $("tip").textContent = money.format(tip);
  $("total").textContent = money.format(total + extra);
  $("each").textContent = money.format(each);
  $("extra").textContent = money.format(extra);
  $("extra-row").hidden = extra < 0.005;
}

document.querySelectorAll("[data-tip]").forEach((b) => {
  b.addEventListener("click", () => {
    tipPct = Number(b.dataset.tip);
    $("custom").value = "";
    document.querySelectorAll("[data-tip]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    calc();
  });
});
$("custom").addEventListener("input", () => {
  const v = $("custom").value.trim();
  if (v === "") return;
  tipPct = Math.min(100, num(v));
  document.querySelectorAll("[data-tip]").forEach((x) => x.setAttribute("aria-pressed", "false"));
  calc();
});
const step = (d) => {
  $("people").value = Math.max(1, Math.min(99, (Math.floor(num($("people").value)) || 1) + d));
  calc();
};
$("minus").addEventListener("click", () => step(-1));
$("plus").addEventListener("click", () => step(1));
["bill", "people", "round"].forEach((id) => $(id).addEventListener("input", calc));
$("form").addEventListener("submit", (e) => e.preventDefault());
calc();
$("bill").focus();
