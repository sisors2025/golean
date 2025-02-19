(function () {
  const z = !!window.DlocalGo,
    s = z
      ? document.querySelector(
          'script[src="https://static.dlocalgo.com/dlocalgo.min.js"]'
        )
      : document.createElement("script");
  z ||
    ((s.src = "https://static.dlocalgo.com/dlocalgo.min.js"),
    (s.async = !0),
    document.body.appendChild(s));
  s.addEventListener("load", () => {
    const e = document.querySelector(
        'script[data-reference-id="e2e71d9c-c21a-4864-aa42-2bf81b699fec"]'
      ),
      t = e.parentNode,
      n = "dp-btn-e2e71d9c-c21a-4864-aa42-2bf81b699fec",
      c = document.createElement("div");
    (c.id = n), t.insertBefore(c, e);
    new DlocalGo("sRuITfydBHkflJGgrnTuOEUkUUBOzsWX").createCheckout(n, {
      subType: "BUTTON",
      country: "",
      currency: "USD",
      amount: "50",
      lang: "",
      text: "Pagar ahora",
    });
  });
})();
