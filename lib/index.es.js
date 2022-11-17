var y = Object.defineProperty;
var E = (h, e, t) => e in h ? y(h, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[e] = t;
var l = (h, e, t) => (E(h, typeof e != "symbol" ? e + "" : e, t), t), I = (h, e, t) => {
  if (!e.has(h))
    throw TypeError("Cannot " + t);
};
var a = (h, e, t) => (I(h, e, "read from private field"), t ? t.call(h) : e.get(h)), u = (h, e, t) => {
  if (e.has(h))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(h) : e.set(h, t);
}, n = (h, e, t, i) => (I(h, e, "write to private field"), i ? i.call(h, t) : e.set(h, t), t);
let p = {};
function L(h, ...e) {
  e.forEach((t) => {
    var i;
    for (const s in t) {
      const d = t[s];
      d !== null && (typeof d != "object" ? h[s] = d : (h[s] = (i = h[s]) != null ? i : {}, L(h[s], d)));
    }
  });
}
var r, f, c, m;
const o = class {
  constructor(e, t) {
    u(this, r, !1);
    u(this, f, !1);
    u(this, c, !1);
    u(this, m, !1);
    l(this, "id");
    l(this, "pId");
    l(this, "level");
    l(this, "options");
    l(this, "name");
    l(this, "childList");
    l(this, "parent");
    l(this, "className");
    l(this, "map");
    this.options = Object.assign({}, e), this.name = e.name, this.className = e.className, this.id = e.id, this.pId = e.pId, this.parent = t, this.level = t == null ? 0 : t.level + 1, this.map = t == null ? { [this.id]: this } : t.map, this.childList = e.childList.map((i) => {
      const s = new o(i, this);
      return this.map[s.id] != null && console.warn(`the same id. id: ${s.id}`), this.map[s.id] = s, s;
    });
  }
  isRoot() {
    return this.level === 0;
  }
  get checked() {
    return a(this, r);
  }
  get indeterminate() {
    return a(this, c);
  }
  diff() {
    let e = p[this.id];
    return a(this, f) !== a(this, r) && (e = e != null ? e : {}, e.checked = a(this, r), a(this, r) && (e.indeterminate = !1)), a(this, m) !== a(this, c) && (e = e != null ? e : {}, e.indeterminate = a(this, c)), e && (p[this.id] = e), e;
  }
  setChecked(e, t, i) {
    return n(this, f, a(this, r)), n(this, r, e), e && this.setIndeterminate(!1, !0), this.diff() && this.parent && !t && this.calcParentStatus(), i || (e ? this.each((s) => {
      s.setIndeterminate(!1, !0), s.setChecked(!0, !0);
    }) : this.indeterminate || this.each((s) => {
      s.setIndeterminate(!1, !0), s.setChecked(!1, !0);
    })), this;
  }
  setIndeterminate(e, t) {
    return n(this, m, a(this, c)), n(this, c, e), e && !t && (n(this, f, a(this, r)), n(this, r, !1), this.parent && this.parent.setIndeterminate(!0)), t || this.diff(), this;
  }
  setCheckedByIdReturnDiff(e, t, i) {
    p = {};
    const s = this.map[e != null ? e : this.id];
    if (s == null)
      return {};
    s.setChecked(t != null ? t : !0, !1, i);
    const d = Object.assign({}, p);
    return p = {}, d;
  }
  selectKeys(e, t) {
    const i = this.clean();
    return e.forEach((s) => {
      L(i, this.setCheckedByIdReturnDiff(s, !0, t));
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
    n(e, f, a(e, r)), n(e, m, a(e, c));
    const s = t.filter((k) => k.checked).length;
    return s === i ? (n(e, r, !0), n(e, c, !1)) : s > 0 || t.some((k) => k.indeterminate) ? (e.setIndeterminate(!0), n(e, r, !1)) : (n(e, c, !1), n(e, r, !1)), e.diff() && !e.indeterminate && e.calcParentStatus(), this;
  }
  clean() {
    const e = {};
    return Object.values(this.map).forEach((t) => {
      let i = e[t.id];
      t.checked && (i = i != null ? i : {}, i.checked = !1), t.indeterminate && (i = i != null ? i : {}, i.indeterminate = !1), i && (e[t.id] = i), n(t, f, n(t, r, !1)), n(t, m, n(t, c, !1));
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
};
let g = o;
r = new WeakMap(), f = new WeakMap(), c = new WeakMap(), m = new WeakMap();
export {
  g as default
};
