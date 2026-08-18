const st = typeof document != "undefined" ? document : null;
function f(e, t = st) {
  return t ? Array.from(t.querySelectorAll(e)) : [];
}
function d(e, t, n, o) {
  return e ? (e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o)) : () => {
  };
}
function se(e) {
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(e) : setTimeout(e, 0);
}
function x(e, t = {}, n = []) {
  const o = st.createElement(e);
  return Object.entries(t).forEach(([i, a]) => {
    i === "class" ? o.className = a : i === "text" ? o.textContent = a : i === "html" ? o.innerHTML = a : i.startsWith("on") ? o.addEventListener(i.slice(2), a) : o.setAttribute(i, a);
  }), n.forEach((i) => {
    i instanceof Element ? o.appendChild(i) : o.appendChild(st.createTextNode(String(i)));
  }), o;
}
function pt(e) {
  const t = e.getBoundingClientRect();
  return {
    top: t.top,
    left: t.left,
    width: t.width,
    height: t.height,
    bottom: t.bottom,
    right: t.right
  };
}
const m = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End"
};
function K(e, t, n) {
  if (e.length === 0) return -1;
  let o = t + n;
  o = (o + e.length) % e.length;
  let i = e.length;
  for (; i-- > 0; ) {
    const a = e[o];
    if (a && !a.hasAttribute("disabled") && a.getAttribute("aria-disabled") !== "true")
      return o;
    o = (o + n + e.length) % e.length;
  }
  return t;
}
const re = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "audio[controls]",
  "video[controls]"
].join(",");
function ce(e) {
  return Array.from(e.querySelectorAll(re)).filter(
    (t) => t.offsetParent !== null || t === document.activeElement
  );
}
function de(e) {
  const t = e.ownerDocument || document, n = t.activeElement, o = (i) => {
    if (i.key !== "Tab") return;
    const a = ce(e);
    if (a.length === 0) {
      i.preventDefault();
      return;
    }
    const s = a[0], r = a[a.length - 1], c = t.activeElement;
    i.shiftKey && (c === s || !e.contains(c)) ? (i.preventDefault(), r.focus()) : !i.shiftKey && (c === r || !e.contains(c)) && (i.preventDefault(), s.focus());
  };
  return t.addEventListener("keydown", o, !0), {
    restore() {
      t.removeEventListener("keydown", o, !0), n && typeof n.focus == "function" && n.focus();
    }
  };
}
let U = 0;
const j = /* @__PURE__ */ new Map();
function le() {
  if (typeof document == "undefined") return 0;
  const e = document.createElement("div");
  e.style.cssText = "width:100px;height:100px;overflow:scroll;position:absolute;opacity:0", document.body.appendChild(e);
  const t = e.offsetWidth - e.clientWidth;
  return document.body.removeChild(e), t;
}
const ue = { overflow: "hidden" };
function Rt(e = document.body) {
  if (typeof document == "undefined") return () => {
  };
  if (!e || e === document.body) {
    if (U += 1, U === 1) {
      const t = le();
      t && (document.body.style.paddingRight = `${t}px`), document.body.classList.add("fx-scroll-lock");
    }
    return () => Nt();
  }
  return j.set(e, e.style.overflow), Object.assign(e.style, ue), () => {
    const t = j.get(e);
    e.style.overflow = t || "", j.delete(e);
  };
}
function Nt(e = document.body) {
  if (!e || e === document.body) {
    U = Math.max(0, U - 1), U === 0 && (document.body.classList.remove("fx-scroll-lock"), document.body.style.paddingRight = "");
    return;
  }
  const t = j.get(e);
  e.style.overflow = t || "", j.delete(e);
}
let E = null;
function fe(e) {
  return E || (E = e.body.querySelector("[data-fx-live-region]"), E) || (E = e.createElement("div"), E.setAttribute("data-fx-live-region", ""), E.setAttribute("class", "fx-visually-hidden"), E.setAttribute("aria-live", "polite"), E.setAttribute("aria-atomic", "true"), e.body.appendChild(E)), E;
}
function X(e, { polite: t = !0, dir: n } = {}) {
  if (typeof document == "undefined") return;
  const o = fe(document);
  o.setAttribute("aria-atomic", "true"), o.setAttribute("aria-live", t ? "polite" : "assertive"), n && (o.dir = n), o.textContent = "", o.textContent = e;
}
function ht() {
  return typeof window == "undefined" || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const L = 8;
function xt(e) {
  return e.startsWith("top") || e.startsWith("bottom") ? "y" : "x";
}
function pe(e) {
  const t = e.split("-")[0];
  return t === "auto" ? null : t;
}
function et(e, t, n, o, i) {
  const a = o.startsWith("top") || o === "start" || o === "end", s = ["top", "bottom"].includes(pe(o)) || o === "auto", r = { left: 0, top: 0, width: t, height: n };
  if (s) {
    const c = o.startsWith("top");
    r.top = c ? e.top - n - i : e.bottom + i;
    const l = o.endsWith("-start") ? "start" : o.endsWith("-end") ? "end" : "center";
    l === "start" ? r.left = e.left : l === "end" ? r.left = e.right - t : r.left = e.left + e.width / 2 - t / 2;
  } else {
    const c = o.startsWith("start") || o === "left";
    r.left = c ? e.left - t - i : e.right + i;
    const l = o.endsWith("-start") ? "start" : o.endsWith("-end") ? "end" : "center";
    l === "start" ? r.top = e.top : l === "end" ? r.top = e.bottom - n : r.top = e.top + e.height / 2 - n / 2;
  }
  return { box: r, top: a };
}
function mt(e) {
  const t = e.split("-")[0], o = { top: "bottom", bottom: "top", start: "end", end: "start", left: "right", right: "left" }[t] || t, i = e.includes("-") ? `-${e.split("-")[1]}` : "";
  return o + i;
}
function he(e, t, n = {}) {
  const {
    placement: o = "bottom-start",
    offset: i = 4,
    autoFlip: a = !0,
    autoShift: s = !0,
    strategy: r = "absolute"
  } = n, c = pt(e), l = t.offsetWidth || 0, p = t.offsetHeight || 0;
  let u = o;
  (u === "auto" || u.startsWith("auto-")) && (u = "bottom-start");
  const h = window.innerWidth || document.documentElement.clientWidth, w = window.innerHeight || document.documentElement.clientHeight;
  let { box: g } = et(c, l, p, u, i);
  if (a && xt(u) === "y") {
    const b = g.top + p > w - L && c.top > w / 2, y = g.top < L && c.bottom < w / 2;
    (b || y) && (u = mt(u), g = et(c, l, p, u, i).box);
  }
  if (a && xt(u) === "x") {
    const b = g.left + l > h - L && c.left > h / 2, y = g.left < L && c.right < h / 2;
    (b || y) && (u = mt(u), g = et(c, l, p, u, i).box);
  }
  if (s && (g.left = Math.max(L, Math.min(g.left, h - l - L)), g.top = Math.max(L, Math.min(g.top, w - p - L))), r === "absolute" && t.offsetParent) {
    const b = pt(t.offsetParent);
    g.left -= b.left, g.top -= b.top;
  }
  return { left: g.left, top: g.top, placement: u };
}
function J(e, t, n = {}) {
  const { left: o, top: i, placement: a } = he(e, t, n);
  return t.style.left = `${o}px`, t.style.top = `${i}px`, t.setAttribute("data-placement", a), { left: o, top: i, placement: a };
}
const H = [];
function ct(e, { scrollLock: t = !0, announcer: n = () => {
} } = {}) {
  const o = e.ownerDocument || document, i = o.activeElement;
  let a = null, s = null, r = !1;
  t && (s = Rt()), a = de(e), e.setAttribute("data-fx-open", "true"), X(n() || e.getAttribute("aria-label") || "Dialog opened");
  const c = (h) => {
    if (h.key !== "Escape") return;
    const w = H[H.length - 1];
    w && w.panel === e && (h.preventDefault(), u());
  };
  o.addEventListener("keydown", c, !0);
  const l = e.querySelector("[data-fx-autofocus]") || e.querySelector(
    'input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"]), button, a[href]'
  );
  l && l.focus(), u.panel = e;
  const p = { panel: e, close: u };
  H.push(p), e.dispatchEvent(new CustomEvent("fx:opened", { bubbles: !0 }));
  function u() {
    if (r) return;
    r = !0;
    const h = H.indexOf(p);
    h > -1 && H.splice(h, 1), o.removeEventListener("keydown", c, !0), a && a.restore(), s && s(), e.setAttribute("data-fx-open", "false"), i && o.contains(i) && i.focus(), X(e.getAttribute("aria-label") || "Dialog closed"), e.dispatchEvent(new CustomEvent("fx:closed", { bubbles: !0 }));
  }
  return e.addEventListener("fx:close", (h) => {
    h.preventDefault(), u();
  }), { close: u };
}
function P(e) {
  return Array.from(
    e.querySelectorAll('[role="menuitem"], [role="option"], .fx-menu-item, .fx-command-item')
  ).filter((t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true");
}
function xe({
  menu: e,
  onActivate: t,
  shouldActivateOnEnter: n = !0,
  initialFocusItem: o = null
}) {
  const i = {
    [m.ARROW_DOWN]: (r, c, l) => {
      var u;
      r.preventDefault();
      const p = K(P(e), l, 1);
      (u = a()[p]) == null || u.focus();
    },
    [m.ARROW_UP]: (r, c, l) => {
      var u;
      r.preventDefault();
      const p = K(P(e), l, -1);
      (u = a()[p]) == null || u.focus();
    },
    [m.HOME]: (r) => {
      var c;
      r.preventDefault(), (c = a()[0]) == null || c.focus();
    },
    [m.END]: (r) => {
      var c;
      r.preventDefault(), (c = a()[a().length - 1]) == null || c.focus();
    },
    [m.ENTER]: (r, c) => {
      n && (r.preventDefault(), typeof t == "function" && t(c));
    }
  };
  function a() {
    return P(e);
  }
  const s = d(e, "keydown", (r) => {
    const c = P(e), l = c.indexOf(document.activeElement), p = i[r.key];
    if (p) {
      if (r.key === m.ENTER) {
        const u = c.find((h) => h === document.activeElement);
        u && p(r, u);
        return;
      }
      p(r, document.activeElement, l);
    }
  });
  return o && o.focus(), { menuItems: a, cleanup: s };
}
const Q = [];
function A(e) {
  e && typeof e.bind == "function" && !Q.includes(e) && Q.push(e);
}
function me(e = document) {
  if (!(!e || typeof e.querySelectorAll != "function"))
    return Q.forEach((t) => {
      try {
        t.bind(e);
      } catch (n) {
        typeof window != "undefined" && window.__FX_DEBUG__ && console.error(`[Fluxa] ${t.name || "component"} failed to init:`, n);
      }
    }), e;
}
function be() {
  return Q.slice();
}
const W = /* @__PURE__ */ new WeakSet(), It = /* @__PURE__ */ new WeakMap();
function Bt(e) {
  return typeof e == "string" ? document.querySelector(e) : e;
}
function bt(e) {
  const t = Bt(e);
  if (!t || t.getAttribute("data-fx-open") === "true") return;
  if (!t.hasAttribute("role")) {
    t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true");
    const o = t.querySelector(".fx-modal-title") || t.querySelector(".fx-drawer-title");
    o && o.id && t.setAttribute("aria-labelledby", o.id);
  }
  const n = ct(t, {
    announcer: () => t.getAttribute("aria-label") || "Dialog opened"
  });
  It.set(t, n);
}
function nt(e) {
  const t = Bt(e);
  if (!t) return;
  const n = It.get(t);
  n && n.close();
}
const _t = {
  name: "Modal",
  open: bt,
  close: nt,
  bind(e) {
    f("[data-fx-modal]", e).forEach((t) => {
      !t || W.has(t) || (W.add(t), d(t, "click", () => bt(t.getAttribute("data-fx-modal"))));
    }), f(".fx-modal", e).forEach((t) => {
      if (!t || W.has(t)) return;
      W.add(t), t.setAttribute("data-fx-open", "false"), f(".fx-modal-close, [data-fx-modal-close]", t).forEach((o) => {
        !o || W.has(o) || (W.add(o), d(o, "click", () => nt(t)));
      });
      const n = t.querySelector(".fx-modal-backdrop");
      n && d(n, "click", () => nt(t));
    });
  }
};
A(_t);
const D = /* @__PURE__ */ new WeakSet(), Ht = /* @__PURE__ */ new WeakMap();
function Pt(e) {
  return typeof e == "string" ? document.querySelector(e) : e;
}
function yt(e) {
  const t = Pt(e);
  if (!t || t.getAttribute("data-fx-open") === "true") return;
  if (!t.hasAttribute("role")) {
    t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true");
    const o = t.querySelector(".fx-drawer-title") || t.querySelector(".fx-modal-title");
    o && o.id && t.setAttribute("aria-labelledby", o.id);
  }
  const n = ct(t, { scrollLock: !0 });
  Ht.set(t, n);
}
function ot(e) {
  const t = Pt(e);
  if (!t) return;
  const n = Ht.get(t);
  n && n.close();
}
const Ft = {
  name: "Drawer",
  open: yt,
  close: ot,
  bind(e) {
    f("[data-fx-drawer]", e).forEach((t) => {
      !t || D.has(t) || (D.add(t), d(t, "click", () => yt(t.getAttribute("data-fx-drawer"))));
    }), f(".fx-drawer", e).forEach((t) => {
      if (!t || D.has(t)) return;
      D.add(t), t.setAttribute("data-fx-open", "false"), f(".fx-drawer-close, [data-fx-drawer-close]", t).forEach((o) => {
        !o || D.has(o) || (D.add(o), d(o, "click", () => ot(t)));
      });
      const n = t.querySelector(".fx-drawer-backdrop");
      n && d(n, "click", () => ot(t));
    });
  }
};
A(Ft);
const O = /* @__PURE__ */ new WeakSet(), B = /* @__PURE__ */ new Map();
function ye(e) {
  return e.querySelector(".fx-dropdown-trigger") || e.querySelector("[data-fx-dropdown-toggle]") || e.querySelector(":scope > button") || e.querySelector("button");
}
function Ae(e, t, n) {
  return !!(e && e.contains(n) || t && t.contains(n));
}
function z() {
  B.forEach((e) => e && e.close());
}
function G(e, t, n) {
  const o = B.get(t);
  o && o.close(), t.setAttribute("data-fx-open", "true"), t.style.visibility = "";
  const i = () => {
    J(e, t, {
      placement: typeof n == "string" ? n : "bottom-start",
      offset: 6,
      strategy: "absolute"
    });
  };
  ge(i);
  const a = [];
  a.push(
    d(window, "resize", () => {
      t.getAttribute("data-fx-open") === "true" && i();
    })
  ), a.push(
    d(window, "scroll", i, !0)
  );
  const s = () => {
    t.setAttribute("data-fx-open", "false"), t.style.visibility = "hidden", B.delete(t), a.forEach((l) => l());
  }, r = d(document, "mousedown", (l) => {
    Ae(e, t, l.target) || s();
  });
  a.push(r);
  const c = d(document, "keydown", (l) => {
    l.key === m.ESCAPE && (l.stopPropagation(), s(), e && document.contains(e) && e.focus());
  }, !0);
  return a.push(c), xe({
    menu: t,
    initialFocusItem: P(t)[0],
    onActivate(l) {
      l.click(), s(), e && document.contains(e) && e.focus();
    }
  }), B.set(t, { close: s, menu: t, open: !0 }), { close: s };
}
function ge(e) {
  typeof requestAnimationFrame == "function" ? requestAnimationFrame(e) : setTimeout(e, 0);
}
function At(e) {
  const t = e.closest(".fx-dropdown");
  t && t.setAttribute("data-fx-open", e.getAttribute("data-fx-open") === "true" ? "true" : "false");
}
const Ut = {
  name: "Dropdown",
  open: G,
  closeAll: z,
  bind(e) {
    f(".fx-dropdown", e).forEach((t) => {
      if (O.has(t)) return;
      const n = ye(t), o = t.querySelector(ke);
      !o || !n || (O.add(t), t.setAttribute("data-fx-open", "false"), d(n, "click", (i) => {
        if (i.stopPropagation(), o.getAttribute("data-fx-open") === "true") {
          const a = B.get(o);
          a && a.close(), At(o);
          return;
        }
        z(), G(n, o, t.getAttribute("data-fx-placement") || "bottom-start"), At(o);
      }));
    }), f("[data-fx-dropdown]", e).forEach((t) => {
      if (!t || !t.getAttribute || t.closest(".fx-dropdown") || O.has(t)) return;
      const n = document.querySelector(t.getAttribute("data-fx-dropdown"));
      n && (O.add(t), d(t, "click", (o) => {
        if (o.stopPropagation(), n.getAttribute("data-fx-open") === "true") {
          const i = B.get(n);
          i && i.close();
          return;
        }
        z(), G(t, n, t.getAttribute("data-fx-placement") || "bottom-end");
      }));
    }), f("[data-fx-context]", e).forEach((t) => {
      if (O.has(t)) return;
      const n = document.querySelector(t.getAttribute("data-fx-context"));
      n && (O.add(t), d(t, "contextmenu", (o) => {
        o.preventDefault(), z(), G(t, n, "bottom-start"), n.style.position = "fixed", ve(o, n);
      }));
    });
  }
};
function ve(e, t) {
  const n = Math.min(e.clientX, window.innerWidth - t.offsetWidth - 8), o = Math.min(e.clientY, window.innerHeight - t.offsetHeight - 8);
  t.style.left = `${Math.max(8, n)}px`, t.style.top = `${Math.max(8, o)}px`;
}
const ke = ".fx-dropdown-menu, .fx-menu";
A(Ut);
const gt = /* @__PURE__ */ new WeakSet(), jt = {
  name: "Alert",
  dismiss(e) {
    const t = e.closest(".fx-alert");
    !t || t.getAttribute("data-fx-leaving") || (t.setAttribute("data-fx-leaving", ""), t.addEventListener(
      "transitionend",
      () => {
        t.remove(), t.dispatchEvent(new CustomEvent("fx:dismissed", { bubbles: !0 }));
      },
      { once: !0 }
    ), setTimeout(() => {
      t.isConnected && (t.remove(), t.dispatchEvent(new CustomEvent("fx:dismissed", { bubbles: !0 })));
    }, 350));
  },
  bind(e) {
    f(".fx-alert", e).forEach((t) => {
      gt.has(t) || (gt.add(t), f(".fx-alert-dismiss, [data-fx-alert-close]", t).forEach((n) => {
        d(n, "click", () => this.dismiss(n));
      }));
    });
  }
};
A(jt);
const vt = /* @__PURE__ */ new WeakSet(), Ee = 80, we = 60;
function Se(e) {
  let t = document.getElementById(`fx-tooltip-${e.dataset.fxTooltipId || ""}`) || null;
  return t || (t = x("div", {
    class: "fx-tooltip",
    role: "tooltip"
  }), t.textContent = e.getAttribute("data-fx-tooltip"), e.dataset.fxTooltipId = e.dataset.fxTooltipId || Math.random().toString(36).slice(2, 8), t.id = `fx-tooltip-${e.dataset.fxTooltipId}`), t.isConnected || document.body.appendChild(t), t;
}
function it(e) {
  const t = Se(e);
  t.setAttribute("data-fx-open", "true"), J(e, t, {
    placement: e.getAttribute("data-fx-placement") || "top",
    offset: 6 + e.getAttribute("data-fx-offset") || 6,
    strategy: "fixed"
  });
}
function kt(e) {
  const t = document.getElementById(`fx-tooltip-${e.dataset.fxTooltipId || ""}`);
  t && t.setAttribute("data-fx-open", "false");
}
const Kt = {
  name: "Tooltip",
  express(e, t) {
    e.setAttribute("data-fx-tooltip", t), it(e);
  },
  bind(e) {
    f("[data-fx-tooltip]", e).forEach((t) => {
      if (vt.has(t)) return;
      vt.add(t);
      let n = null, o = null;
      const i = () => {
        clearTimeout(n), clearTimeout(o);
      };
      d(t, "mouseenter", () => {
        i(), n = setTimeout(() => it(t), ht() ? 0 : Ee);
      }), d(t, "mouseleave", () => {
        i(), o = setTimeout(() => kt(t), ht() ? 0 : we);
      }), d(t, "focus", () => {
        i(), it(t);
      }), d(t, "blur", () => {
        i(), kt(t);
      });
    });
  }
};
A(Kt);
const Et = /* @__PURE__ */ new WeakSet();
function zt(e, t) {
  const n = t.tablist.querySelector('.fx-tab[aria-selected="true"]');
  n && (n.setAttribute("aria-selected", "false"), n.tabIndex = -1, n.classList.remove("is-active")), e.setAttribute("aria-selected", "true"), e.tabIndex = 0, e.classList.add("is-active");
  const o = e.getAttribute("aria-controls");
  f('[role="tabpanel"]', t.root).forEach((i) => {
    i.hidden = i.getAttribute("id") !== o;
  });
}
function wt(e, t) {
  const o = Array.from(e.querySelectorAll(".fx-tab"))[t];
  o && !o.hasAttribute("disabled") && (zt(o, { root: e.parentElement, tablist: e }), o.focus());
}
const Gt = {
  name: "Tabs",
  activate(e, t) {
    wt(e, t);
  },
  bind(e) {
    f(".fx-tabs", e).forEach((t) => {
      if (Et.has(t)) return;
      Et.add(t);
      const n = t.querySelector(".fx-tablist") || t, o = Array.from(n.querySelectorAll(".fx-tab"));
      o.forEach((i) => {
        var s;
        if (d(i, "click", () => {
          zt(i, { root: t, tablist: n });
        }), i.getAttribute("aria-selected")) return;
        const a = i.classList.contains("is-active") || i.hasAttribute("aria-controls") && ((s = document.getElementById(i.getAttribute("aria-controls"))) == null ? void 0 : s.hidden) === !1;
        i.setAttribute("aria-selected", a ? "true" : "false"), i.setAttribute("role", "tab"), i.tabIndex = a ? 0 : -1;
      }), f('[role="tabpanel"]', t).forEach((i) => {
        const a = o.find((r) => r.getAttribute("aria-controls") === i.id), s = a && a.getAttribute("aria-selected") === "true";
        i.hidden = !s;
      }), d(n, "keydown", (i) => {
        const a = Array.from(n.querySelectorAll(".fx-tab")), s = a.indexOf(document.activeElement);
        let r = -1;
        i.key === m.ARROW_RIGHT || i.key === m.ARROW_DOWN ? r = K(a, s === -1 ? -1 : s, 1) : i.key === m.ARROW_LEFT || i.key === m.ARROW_UP ? r = K(a, s === -1 ? 0 : s, -1) : i.key === m.HOME ? r = 0 : i.key === m.END && (r = a.length - 1), r > -1 && (i.preventDefault(), wt(n, r));
      });
    });
  }
};
A(Gt);
const St = /* @__PURE__ */ new WeakSet(), Ct = 4;
function rt(e, t, n = !0) {
  if (!n) {
    e.style.height = t ? "auto" : "0px", e.style.opacity = t ? "1" : "0";
    return;
  }
  if (t) {
    e.style.height = `${e.scrollHeight + Ct}px`, e.style.opacity = "1";
    const o = () => {
      e.style.height = "auto", e.removeEventListener("transitionend", o);
    };
    e.addEventListener("transitionend", o, { once: !0 });
  } else
    e.style.height = `${e.scrollHeight + Ct}px`, se(() => {
      e.style.height = "0px", e.style.opacity = "0";
    });
}
function Lt(e, t, { multiple: n = !1, animate: o = !0 } = {}) {
  const i = Array.from(t.querySelectorAll(".fx-accordion-item")), a = e.querySelector(".fx-accordion-trigger"), s = e.querySelector(".fx-accordion-content");
  if (!a || !s) return;
  const r = a.getAttribute("aria-expanded") !== "true";
  r && !n && i.forEach((c) => {
    if (c === e) return;
    const l = c.querySelector(".fx-accordion-trigger"), p = c.querySelector(".fx-accordion-content");
    l && p && l.getAttribute("aria-expanded") === "true" && (l.setAttribute("aria-expanded", "false"), c.removeAttribute("data-fx-open"), rt(p, !1, o));
  }), r ? (e.setAttribute("data-fx-open", ""), a.setAttribute("aria-expanded", "true")) : (e.removeAttribute("data-fx-open"), a.setAttribute("aria-expanded", "false")), rt(s, r, o);
}
const Yt = {
  name: "Accordion",
  toggle(e) {
    const t = e.closest(".fx-accordion");
    t && Lt(e, t, { multiple: t.hasAttribute("data-fx-multiple") });
  },
  bind(e) {
    f(".fx-accordion", e).forEach((t) => {
      St.has(t) || (St.add(t), f(".fx-accordion-item", t).forEach((n) => {
        const o = n.querySelector(".fx-accordion-trigger"), i = n.querySelector(".fx-accordion-content");
        !o || !i || (o.setAttribute("aria-expanded", n.hasAttribute("data-fx-open") ? "true" : "false"), o.setAttribute("aria-controls", i.id || o.getAttribute("aria-controls")), i.id || (i.id = `fx-acc-${Math.random().toString(36).slice(2, 9)}`), rt(i, o.getAttribute("aria-expanded") === "true", !1), d(o, "click", () => {
          Lt(n, t, { multiple: t.hasAttribute("data-fx-multiple") });
        }));
      }), d(t, "keydown", (n) => {
        const o = f(".fx-accordion-trigger", t).filter(
          (a) => !a.hasAttribute("disabled")
        ), i = o.indexOf(document.activeElement);
        n.key === m.ARROW_DOWN && i > -1 && i < o.length - 1 ? (n.preventDefault(), o[i + 1].focus()) : n.key === m.ARROW_UP && i > 0 && (n.preventDefault(), o[i - 1].focus());
      }));
    });
  }
};
A(Yt);
const Mt = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
};
let M = null;
function Ce() {
  return M && M.isConnected || (M = document.body.querySelector(".fx-toast-region"), M || (M = x("div", { class: "fx-toast-region", "aria-live": "polite" }), document.body.appendChild(M))), M;
}
function $({ title: e, body: t = "", type: n = "success", duration: o = 4200, onClose: i }) {
  const a = x("div", { class: `fx-toast fx-toast-${n}`, role: "status" }), s = x("span", { class: "fx-toast-icon" });
  s.innerHTML = Mt[n] || Mt.info;
  const r = x("div", { class: "fx-toast-content" });
  e && r.appendChild(x("div", { class: "fx-toast-title", text: e })), t && r.appendChild(x("div", { class: "fx-toast-body", text: t }));
  const c = x("button", {
    class: "fx-toast-close",
    type: "button",
    "aria-label": "Dismiss notification"
  });
  c.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>', a.appendChild(s), a.appendChild(r), a.appendChild(c), Ce().appendChild(a);
  function l() {
    a.getAttribute("data-fx-leaving") || (a.setAttribute("data-fx-leaving", ""), a.addEventListener("animationend", () => {
      a.remove(), typeof i == "function" && i(a);
    }));
  }
  let p = null;
  return o > 0 && (p = setTimeout(l, o)), d(c, "click", () => {
    clearTimeout(p), l();
  }), a;
}
const Vt = {
  name: "Toast",
  show({ title: e, body: t, type: n = "info", duration: o, onClose: i } = {}) {
    return $({ title: e, body: t || "", type: n, duration: o, onClose: i });
  },
  success(e, t, n) {
    return $({ title: e, body: t || "", type: "success", duration: n });
  },
  danger(e, t, n) {
    return $({ title: e, body: t || "", type: "danger", duration: n });
  },
  warning(e, t, n) {
    return $({ title: e, body: t || "", type: "warning", duration: n });
  },
  info(e, t, n) {
    return $({ title: e, body: t || "", type: "info", duration: n });
  },
  bind(e) {
    f("[data-fx-toast]", e).forEach((t) => {
      t.dataset.fxToastBound !== "" && (t.dataset.fxToastBound = "", d(t, "click", () => {
        const n = t.getAttribute("data-fx-toast-title") || t.getAttribute("data-fx-toast") || "";
        $({
          title: n,
          body: t.getAttribute("data-fx-toast-body") || "",
          type: t.getAttribute("data-fx-toast-type") || "info",
          duration: Number(t.getAttribute("data-fx-toast-duration")) || 4200
        }), X(n || "Notification");
      }));
    });
  }
};
A(Vt);
let R = null, q = null, qt = [];
const Le = [
  {
    label: "Actions",
    items: [
      {
        label: "Toggle theme",
        hint: "Ctrl K",
        action: () => {
          const e = document.documentElement, t = e.getAttribute("data-theme") === "dark" ? "light" : "dark";
          e.setAttribute("data-theme", t);
        }
      },
      {
        label: "Print page",
        hint: "",
        action: () => window.print()
      }
    ]
  }
];
function Me(e) {
  const t = x("div", { class: "fx-command", "data-fx-open": "true" }), n = x("div", { class: "fx-command-backdrop" }), o = x("div", {
    class: "fx-command-dialog",
    role: "dialog",
    "aria-label": "Command palette"
  }), i = x("div", { class: "fx-command-input-wrap" }), a = x("span", { class: "fx-command-search-icon" });
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
  const s = x("input", {
    class: "fx-command-input",
    type: "text",
    placeholder: "Search commands…",
    autocomplete: "off",
    spellcheck: "false"
  });
  i.appendChild(a), i.appendChild(s);
  const r = x("kbd", { class: "fx-command-escape", text: "ESC" });
  i.appendChild(r);
  const c = x("div", {
    class: "fx-command-empty",
    text: "No matching commands."
  });
  c.style.display = "none";
  const l = x("div", { class: "fx-command-list" }), p = x("div", { class: "fx-command-footer" });
  p.innerHTML = '<span class="fx-command-kbd"><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span class="fx-command-kbd"><kbd>↵</kbd> select</span>', o.appendChild(i), o.appendChild(c), o.appendChild(l), o.appendChild(p), t.appendChild(n), t.appendChild(o);
  function u() {
    return Array.from(l.querySelectorAll(".fx-command-item"));
  }
  function h(b) {
    const y = u();
    y.forEach((k, C) => {
      C === b ? k.setAttribute("data-highlighted", "") : k.removeAttribute("data-highlighted");
    });
    const v = y[b];
    v && (v.scrollIntoView({ block: "nearest" }), document.activeElement === s && s.setAttribute("aria-activedescendant", v.id || ""));
  }
  function w(b) {
    l.innerHTML = "", qt = [];
    const y = (b || "").toLowerCase().trim();
    let v = 0;
    e.groups.forEach((k) => {
      const C = k.items.filter((S) => {
        const tt = `${S.label} ${S.keywords || ""} ${S.hint || ""}`.toLowerCase();
        return !y || tt.includes(y);
      });
      if (C.length === 0) return;
      const ae = x("div", { class: "fx-command-group-label", text: k.label });
      l.appendChild(ae), C.forEach((S) => {
        const tt = `fx-command-item-${v}`, T = x("button", {
          class: "fx-command-item",
          id: tt,
          type: "button",
          role: "option"
        });
        if (T.dataset.index = String(v), S.icon) {
          const ft = x("span", { class: "fx-command-item-icon" });
          ft.innerHTML = S.icon, T.appendChild(ft);
        }
        T.appendChild(x("span", { class: "fx-command-item-label", text: S.label })), S.hint && T.appendChild(x("span", { class: "fx-command-item-shortcut", text: S.hint })), T.addEventListener("click", () => {
          g(S);
        }), l.appendChild(T), qt.push(S), v += 1;
      });
    }), c.style.display = v === 0 ? "" : "none", l.style.display = v === 0 ? "none" : "", h(0);
  }
  function g(b) {
    const y = b.action;
    dt.close(), y && y();
  }
  return d(s, "input", () => w(s.value)), d(s, "keydown", (b) => {
    const y = u(), v = y.findIndex((C) => C.getAttribute("data-highlighted") === "");
    let k = v;
    if (b.key === m.ARROW_DOWN)
      b.preventDefault(), k = v + 1, k >= y.length && (k = 0), h(k);
    else if (b.key === m.ARROW_UP)
      b.preventDefault(), k = v - 1, k < 0 && (k = y.length - 1), h(k);
    else if (b.key === m.ENTER) {
      b.preventDefault();
      const C = y[k] || y[0];
      C && C.click();
    } else b.key === m.HOME ? (b.preventDefault(), h(0)) : b.key === m.END && (b.preventDefault(), h(y.length - 1));
  }), t.addEventListener("mousedown", (b) => {
    b.target === n && close();
  }), w(""), { dialog: t, dialogEl: o, input: s, render: w };
}
const dt = {
  name: "Command",
  open(e = {}) {
    if (q) return q;
    const t = {
      groups: e.groups || Le
    }, n = Me(t);
    return R = n.dialog, document.body.appendChild(R), q = ct(R, { scrollLock: !0 }), n.input.focus(), q;
  },
  close() {
    q && (q.close(), q = null, R && (R.remove(), R = null));
  },
  toggle(e) {
    q ? this.close() : this.open(e);
  },
  bind(e) {
    f("[data-fx-command]", e).forEach((t) => {
      t.dataset.fxCommandBound !== "" && (t.dataset.fxCommandBound = "", d(t, "click", () => {
        const n = t.getAttribute("data-fx-command-groups");
        if (n)
          try {
            this.open({ groups: JSON.parse(n) });
            return;
          } catch {
          }
        this.open();
      }));
    }), d(document, "keydown", (t) => {
      (t.metaKey || t.ctrlKey) && t.key.toLowerCase() === "k" && (t.preventDefault(), this.toggle());
    });
  }
};
A(dt);
const Tt = /* @__PURE__ */ new WeakSet();
function _(e) {
  const t = e.querySelector(".fx-menu");
  return t ? Array.from(t.querySelectorAll('[role="option"]')).filter(
    (n) => !n.hasAttribute("disabled")
  ) : [];
}
function lt(e) {
  return e.querySelector(".fx-menu");
}
function Xt(e, t) {
  _(e).forEach((o) => o.removeAttribute("data-highlighted")), t && t.setAttribute("data-highlighted", "");
  const n = e.querySelector("[data-fx-combobox-input]");
  n && t && n.setAttribute("aria-activedescendant", t.id || "");
}
function Jt(e) {
  const t = e.querySelector("[data-fx-combobox-input]"), n = (t ? t.value : "").toLowerCase().trim();
  _(e).forEach((o) => {
    const i = o.textContent.toLowerCase();
    o.hidden = !!n && !i.includes(n);
  }), Xt(e, _(e).find((o) => !o.hidden));
}
function Y(e) {
  const t = lt(e), n = e.querySelector("[data-fx-combobox-input]");
  !t || !n || (e.setAttribute("data-fx-open", "true"), n.setAttribute("aria-expanded", "true"), Jt(e));
}
function F(e) {
  const t = lt(e), n = e.querySelector("[data-fx-combobox-input]");
  e.setAttribute("data-fx-open", "false"), n && n.setAttribute("aria-expanded", "false"), t && _(e).forEach((o) => o.removeAttribute("data-highlighted"));
}
function Wt(e, t) {
  const n = e.querySelector("[data-fx-combobox-input]"), o = t.getAttribute("data-value") || t.textContent.trim();
  if (e.hasAttribute("data-fx-multiple")) {
    const i = t.getAttribute("data-value"), a = e.querySelector(".fx-combobox-tags");
    if (a && !e.querySelector(`[data-tag="${i}"]`)) {
      const s = document.createElement("span");
      s.className = "fx-tag", s.dataset.tag = i, s.textContent = t.textContent.trim();
      const r = document.createElement("button");
      r.className = "fx-tag-remove", r.type = "button", r.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>', r.setAttribute("aria-label", `Remove ${s.textContent}`), r.addEventListener("click", () => s.remove()), s.appendChild(r), a.appendChild(s);
    }
    n && (n.value = "");
  } else
    n && (n.value = o), F(e);
  t.setAttribute("aria-selected", "true"), e.dispatchEvent(new CustomEvent("fx:select", { bubbles: !0, detail: { value: o } })), e.dispatchEvent(new CustomEvent("change", { bubbles: !0 }));
}
const Qt = {
  name: "Combobox",
  bind(e) {
    f(".fx-combobox", e).forEach((t) => {
      if (Tt.has(t)) return;
      Tt.add(t);
      const n = t.querySelector("[data-fx-combobox-input]"), o = t.querySelector(".fx-combobox-chevron"), i = lt(t);
      n && (n.setAttribute("role", "combobox"), n.setAttribute("aria-expanded", "false"), i && n.setAttribute("aria-controls", i.id || ""), d(n, "click", () => {
        t.getAttribute("data-fx-open") === "true" ? F(t) : Y(t);
      }), d(n, "input", () => {
        t.getAttribute("data-fx-open") !== "true" && Y(t), Jt(t);
      }), d(n, "keydown", (a) => {
        const s = _(t);
        if (s.length)
          if (a.key === m.ARROW_DOWN || a.key === m.ARROW_UP) {
            if (a.preventDefault(), t.getAttribute("data-fx-open") !== "true") {
              Y(t);
              return;
            }
            const r = s.filter((h) => !h.hidden), c = r.findIndex((h) => h.getAttribute("data-highlighted") === ""), l = a.key === m.ARROW_DOWN ? 1 : -1, p = K(r, c, l), u = r[p];
            Xt(t, u), u && n.setAttribute("aria-activedescendant", u.id || "");
          } else if (a.key === m.ENTER) {
            a.preventDefault();
            const r = s.filter((l) => !l.hidden), c = r.find((l) => l.getAttribute("data-highlighted") === "") || r[0];
            c && Wt(t, c);
          } else a.key === m.ESCAPE && F(t);
      }), o && d(o, "click", () => {
        t.getAttribute("data-fx-open") === "true" ? F(t) : (Y(t), n.focus());
      }), _(t).forEach((a) => {
        d(a, "mousedown", (s) => s.preventDefault()), d(a, "click", () => Wt(t, a));
      }), d(document, "mousedown", (a) => {
        !t.contains(a.target) && t.getAttribute("data-fx-open") === "true" && F(t);
      }));
    });
  }
};
A(Qt);
const I = /* @__PURE__ */ new WeakSet(), Zt = {
  name: "Navbar",
  bind(e) {
    f(".fx-navbar", e).forEach((t) => {
      if (I.has(t)) return;
      I.add(t);
      const n = t.querySelector(".fx-navbar-toggle"), o = t.querySelector(".fx-navbar-nav");
      !n || !o || (n.setAttribute("aria-expanded", "false"), o.id || (o.id = `fx-nav-${Math.random().toString(36).slice(2, 8)}`), n.setAttribute("aria-controls", o.id), d(n, "click", () => {
        const i = o.classList.toggle("open");
        n.setAttribute("aria-expanded", String(i));
      }), d(document, "keydown", (i) => {
        i.key === m.ESCAPE && o.classList.contains("open") && (o.classList.remove("open"), n.setAttribute("aria-expanded", "false"), n.focus());
      }), f(".fx-navbar-link", o).forEach((i) => {
        d(i, "click", () => {
          o.classList.remove("open"), n.setAttribute("aria-expanded", "false");
        });
      }));
    });
  }
}, te = {
  name: "Sidebar",
  bind(e) {
    f(".fx-sidebar", e).forEach((t) => {
      if (I.has(t)) return;
      I.add(t);
      const n = t.closest(".fx-sidebar-context") || t.parentElement;
      f("[data-fx-sidebar-toggle]", e).filter((i) => {
        const a = i.getAttribute("data-fx-sidebar-toggle");
        return !a || a === `#${t.id}`;
      }).forEach((i) => {
        if (I.has(i)) return;
        I.add(i);
        const a = qe(n);
        let s = null;
        d(i, "click", () => {
          const r = t.getAttribute("data-fx-open") !== "true";
          t.setAttribute("data-fx-open", String(r)), r ? (s = document.activeElement, a.style.pointerEvents = "auto", a.style.opacity = "1") : (a.style.opacity = "0", a.style.pointerEvents = "none", s && document.contains(s) && s.focus());
        }), d(a, "click", () => {
          t.setAttribute("data-fx-open", "false"), a.style.opacity = "0", a.style.pointerEvents = "none";
        }), d(document, "keydown", (r) => {
          r.key === m.ESCAPE && t.getAttribute("data-fx-open") === "true" && (t.setAttribute("data-fx-open", "false"), a.style.opacity = "0", a.style.pointerEvents = "none", s && document.contains(s) && s.focus());
        });
      });
    });
  }
};
function qe(e) {
  let t = e.querySelector(".fx-sidebar-backdrop");
  return t || (t = document.createElement("div"), t.className = "fx-sidebar-backdrop", e.appendChild(t)), t;
}
A(Zt);
A(te);
const Z = /* @__PURE__ */ new WeakSet();
function Te(e) {
  if (!e) return "0 B";
  const t = ["B", "KB", "MB", "GB"], n = Math.min(t.length - 1, Math.floor(Math.log(e) / Math.log(1024)));
  return `${(e / 1024 ** n).toFixed(n ? 1 : 0)} ${t[n]}`;
}
const ee = {
  name: "Uploader",
  bind(e) {
    f(".fx-uploader-wrap", e).forEach((t) => {
      if (Z.has(t)) return;
      Z.add(t);
      const n = t.querySelector(".fx-uploader"), o = t.querySelector('input[type="file"]'), i = t.querySelector(".fx-uploader-filelist");
      if (!n || !o) return;
      const a = (s) => {
        i && Array.from(s).forEach((r) => {
          const c = x("div", { class: "fx-uploader-file" }), l = x("span", { class: "fx-uploader-file-icon" });
          l.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>';
          const p = x("span", { class: "fx-uploader-file-name", text: r.name }), u = x("span", { class: "fx-uploader-file-size", text: Te(r.size) }), h = x("button", {
            class: "fx-uploader-file-remove",
            type: "button",
            "aria-label": `Remove ${r.name}`
          });
          h.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>', h.addEventListener("click", () => c.remove()), c.appendChild(l), c.appendChild(p), c.appendChild(u), c.appendChild(h), i.appendChild(c);
        });
      };
      d(n, "click", () => o.click()), d(n, "keydown", (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), o.click());
      }), d(o, "change", () => {
        a(o.files), o.value = "";
      }), ["dragenter", "dragover"].forEach((s) => {
        d(n, s, (r) => {
          r.preventDefault(), n.setAttribute("data-dragging", "true");
        });
      }), ["dragleave", "drop"].forEach((s) => {
        d(n, s, (r) => {
          r.preventDefault(), n.setAttribute("data-dragging", "false");
        });
      }), d(n, "drop", (s) => {
        a(s.dataTransfer ? s.dataTransfer.files : []);
      });
    });
  }
}, ne = {
  name: "Slider",
  bind(e) {
    f(".fx-slider", e).forEach((t) => {
      if (Z.has(t)) return;
      Z.add(t);
      const n = () => {
        const o = Number(t.min || 0), i = Number(t.max || 100), a = Number(t.value), s = i > o ? (a - o) / (i - o) * 100 : 0;
        t.style.setProperty("--fx-slider-fill", `${s}%`);
        const r = document.getElementById(
          t.getAttribute("data-fx-slider-display") || ""
        );
        r && (r.textContent = t.getAttribute("data-fx-slider-format") ? t.getAttribute("data-fx-slider-format").replace("{value}", String(a)) : String(a));
      };
      n(), d(t, "input", n), d(t, "change", n);
    });
  }
};
A(ee);
A(ne);
const Dt = "fx-theme";
function Ot() {
  return typeof window == "undefined" || !window.matchMedia ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function oe(e) {
  return e === "system" ? Ot() : e || Ot();
}
function at(e, t) {
  document.documentElement.setAttribute("data-theme", e), f("[data-fx-theme-toggle]").forEach((o) => {
    o.setAttribute("aria-pressed", oe(e) === "dark" ? "true" : "false");
  }), document.dispatchEvent(new CustomEvent("fx:theme", { detail: { theme: e } }));
}
const ut = {
  name: "Theme",
  get() {
    return document.documentElement.getAttribute("data-theme") || "system";
  },
  set(e) {
    const t = e === "dark" || e === "light" ? e : "system";
    try {
      localStorage.setItem(Dt, t);
    } catch {
    }
    return at(t), t;
  },
  toggle() {
    const e = oe(this.get()) === "dark" ? "light" : "dark";
    return this.set(e), e;
  },
  init() {
    let e = "system";
    try {
      e = localStorage.getItem(Dt) || "system";
    } catch {
    }
    if (at(e), typeof window != "undefined" && window.matchMedia) {
      const t = window.matchMedia("(prefers-color-scheme: dark)"), n = () => {
        this.get() === "system" && at("system");
      };
      typeof t.addEventListener == "function" ? t.addEventListener("change", n) : typeof t.addListener == "function" && t.addListener(n);
    }
  },
  bind(e) {
    f("[data-fx-theme-toggle]", e).forEach((t) => {
      t.dataset.fxThemeBound !== "" && (t.dataset.fxThemeBound = "", t.setAttribute("role", "button"), d(t, "click", () => this.toggle()));
    });
  }
};
A(ut);
const V = /* @__PURE__ */ new WeakSet(), N = /* @__PURE__ */ new Map(), ie = {
  name: "Popover",
  open(e, t, n) {
    const o = N.get(t);
    o && o.close(), t.setAttribute("data-fx-open", "true"), J(e, t, {
      placement: n || "bottom-start",
      offset: 8,
      strategy: "fixed"
    });
    const i = [
      d(window, "resize", () => {
        t.getAttribute("data-fx-open") === "true" && J(e, t, {
          placement: n || "bottom-start",
          offset: 8,
          strategy: "fixed"
        });
      })
    ], a = () => {
      t.setAttribute("data-fx-open", "false"), N.delete(t), i.forEach((s) => s());
    };
    return i.push(
      d(document, "mousedown", (s) => {
        !e.contains(s.target) && !t.contains(s.target) && a();
      })
    ), i.push(
      d(document, "keydown", (s) => {
        s.key === m.ESCAPE && (s.stopPropagation(), a(), e.focus());
      }, !0)
    ), N.set(t, { close: a }), { close: a };
  },
  closeAll() {
    N.forEach((e) => e && e.close());
  },
  bind(e) {
    f("[data-fx-popover]", e).forEach((t) => {
      if (V.has(t)) return;
      const n = document.querySelector(t.getAttribute("data-fx-popover"));
      n && (V.add(t), d(t, "click", (o) => {
        if (o.stopPropagation(), n.getAttribute("data-fx-open") === "true") {
          const i = N.get(n);
          i && i.close();
          return;
        }
        this.closeAll(), this.open(t, n, t.getAttribute("data-fx-placement"));
      }));
    }), f(".fx-popover", e).forEach((t) => {
      V.has(t) || (V.add(t), f(".fx-popover-close, [data-fx-popover-close]", t).forEach((n) => {
        d(n, "click", () => {
          t.setAttribute("data-fx-open", "false"), N.delete(t);
        });
      }));
    });
  }
};
A(ie);
const We = "1.0.0", $t = {
  version: We,
  Modal: _t,
  Drawer: Ft,
  Dropdown: Ut,
  Alert: jt,
  Tooltip: Kt,
  Tabs: Gt,
  Accordion: Yt,
  Toast: Vt,
  Command: dt,
  Combobox: Qt,
  Popover: ie,
  Navbar: Zt,
  Sidebar: te,
  Uploader: ee,
  Slider: ne,
  Theme: ut,
  /** Re-scan a subtree for declarative components */
  init(e) {
    return me(e);
  },
  register: A,
  getComponents: be,
  announce: X,
  lockScroll: Rt,
  unlockScroll: Nt,
  /* Escape hatch to read a single DOM node */
  $: (e, t) => t.querySelector(e),
  $$: (e, t) => Array.from(t.querySelectorAll(e))
};
if (typeof document != "undefined") {
  const e = () => {
    ut.init(), $t.init(document), document.dispatchEvent(new CustomEvent("fx:ready", { detail: { Fluxa: $t } }));
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e, { once: !0 }) : e();
}
export {
  $t as Fluxa,
  We as VERSION,
  $t as default
};
//# sourceMappingURL=fluxa.js.map
