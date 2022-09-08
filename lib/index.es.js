function h(n, e, t, i) {
  if (t === "a" && !i)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !i : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? i : t === "a" ? i.call(n) : i ? i.value : e.get(n);
}
function s(n, e, t, i, r) {
  if (i === "m")
    throw new TypeError("Private method is not writable");
  if (i === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return i === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}
var a, c, l, u;
let d = {};
function m(n, ...e) {
  e.forEach((t) => {
    var i;
    for (const r in t) {
      const f = t[r];
      f !== null && (typeof f != "object" ? n[r] = f : (n[r] = (i = n[r]) !== null && i !== void 0 ? i : {}, m(n[r], f)));
    }
  });
}
class b {
  constructor(e, t) {
    a.set(this, !1), c.set(this, !1), l.set(this, !1), u.set(this, !1), Object.defineProperty(this, "id", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "pId", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "level", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "options", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "childList", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "parent", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "map", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.options = Object.assign({}, e), this.name = e.name, this.className = e.className, this.id = e.id, this.pId = e.pId, this.parent = t, this.level = t == null ? 0 : t.level + 1, this.map = t == null ? { [this.id]: this } : t.map, this.childList = e.childList.map((i) => {
      const r = new b(i, this);
      return this.map[r.id] != null && console.warn(`the same id. id: ${r.id}`), this.map[r.id] = r, r;
    });
  }
  isRoot() {
    return this.level === 0;
  }
  get checked() {
    return h(this, a, "f");
  }
  get indeterminate() {
    return h(this, l, "f");
  }
  diff() {
    let e = d[this.id];
    return h(this, c, "f") !== h(this, a, "f") && (e = e != null ? e : {}, e.checked = h(this, a, "f"), h(this, a, "f") && (e.indeterminate = !1)), h(this, u, "f") !== h(this, l, "f") && (e = e != null ? e : {}, e.indeterminate = h(this, l, "f")), e && (d[this.id] = e), e;
  }
  setChecked(e, t, i) {
    if (s(this, c, h(this, a, "f"), "f"), s(this, a, e, "f"), e && this.setIndeterminate(!1, !0), this.diff() && this.parent && !t && this.calcParentStatus(), e) {
      if (i)
        return;
      this.each((r) => {
        r.setIndeterminate(!1, !0), r.setChecked(!0, !0);
      });
    } else
      this.indeterminate || this.each((r) => {
        r.setIndeterminate(!1, !0), r.setChecked(!1, !0);
      });
    return this;
  }
  setIndeterminate(e, t) {
    return s(this, u, h(this, l, "f"), "f"), s(this, l, e, "f"), e && !t && (s(this, c, h(this, a, "f"), "f"), s(this, a, !1, "f"), this.parent && this.parent.setIndeterminate(!0)), t || this.diff(), this;
  }
  setCheckedByIdReturnDiff(e, t, i) {
    d = {};
    const r = this.map[e != null ? e : this.id];
    if (r == null)
      return {};
    r.setChecked(t != null ? t : !0, !1, i);
    const f = Object.assign({}, d);
    return d = {}, f;
  }
  selectKeys(e, t) {
    const i = this.clean();
    return e.forEach((r) => {
      m(i, this.setCheckedByIdReturnDiff(r, !0, t));
    }), i;
  }
  getSelectKeys() {
    const e = [];
    return Object.values(this.map).forEach((t) => {
      t.checked && e.push(t.id);
    }), e;
  }
  calcParentStatus() {
    const { parent: e } = this;
    if (e == null)
      return this;
    const { childList: t } = e, { length: i } = t;
    if (i <= 0)
      return this;
    s(e, c, h(e, a, "f"), "f"), s(e, u, h(e, l, "f"), "f");
    const r = t.filter((o) => o.checked || o.indeterminate).length;
    return r === i ? (s(e, a, !0, "f"), s(e, l, !1, "f")) : r > 0 ? (e.setIndeterminate(!0), s(e, a, !1, "f")) : (s(e, l, !1, "f"), s(e, a, !1, "f")), e.diff() && !e.indeterminate && e.calcParentStatus(), this;
  }
  clean() {
    const e = {};
    return Object.values(this.map).forEach((t) => {
      let i = e[t.id];
      t.checked && (i = i != null ? i : {}, i.checked = !1), t.indeterminate && (i = i != null ? i : {}, i.indeterminate = !1), i && (e[t.id] = i), s(t, c, s(t, a, !1, "f"), "f"), s(t, u, s(t, l, !1, "f"), "f");
    }), e;
  }
  each(e) {
    return this.childList.forEach((t, i) => {
      e(t, this, i);
    }), this;
  }
  eachDeep(e) {
    return this.childList.forEach((t, i) => {
      e(t, this, i), t.eachDeep(e);
    }), this;
  }
  eachDeepAfter(e) {
    return this.childList.forEach((t, i) => {
      t.eachDeep(e), e(t, this, i);
    }), this;
  }
}
a = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap();
export {
  b as default
};
