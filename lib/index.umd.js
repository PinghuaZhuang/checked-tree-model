(function (n, r) {
  typeof exports == 'object' && typeof module < 'u'
    ? (module.exports = r())
    : typeof define == 'function' && define.amd
    ? define(r)
    : ((n = typeof globalThis < 'u' ? globalThis : n || self),
      (n.CheckedTreeModel = r()));
})(this, function () {
  'use strict';
  function n(f, e, t, i) {
    if (t === 'a' && !i)
      throw new TypeError('Private accessor was defined without a getter');
    if (typeof e == 'function' ? f !== e || !i : !e.has(f))
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it',
      );
    return t === 'm' ? i : t === 'a' ? i.call(f) : i ? i.value : e.get(f);
  }
  function r(f, e, t, i, s) {
    if (i === 'm') throw new TypeError('Private method is not writable');
    if (i === 'a' && !s)
      throw new TypeError('Private accessor was defined without a setter');
    if (typeof e == 'function' ? f !== e || !s : !e.has(f))
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it',
      );
    return i === 'a' ? s.call(f, t) : s ? (s.value = t) : e.set(f, t), t;
  }
  var a, l, h, c;
  let u = {};
  function m(f, ...e) {
    e.forEach((t) => {
      var i;
      for (const s in t) {
        const d = t[s];
        d !== null &&
          (typeof d != 'object'
            ? (f[s] = d)
            : ((f[s] = (i = f[s]) !== null && i !== void 0 ? i : {}),
              m(f[s], d)));
      }
    });
  }
  class o {
    constructor(e, t) {
      a.set(this, !1),
        l.set(this, !1),
        h.set(this, !1),
        c.set(this, !1),
        Object.defineProperty(this, 'id', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'pId', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'level', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'options', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'name', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'childList', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'parent', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'className', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, 'map', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.options = Object.assign({}, e)),
        (this.name = e.name),
        (this.className = e.className),
        (this.id = e.id),
        (this.pId = e.pId),
        (this.parent = t),
        (this.level = t == null ? 0 : t.level + 1),
        (this.map = t == null ? { [this.id]: this } : t.map),
        (this.childList = e.childList.map((i) => {
          const s = new o(i, this);
          return (this.map[s.id] = s), s;
        }));
    }
    isRoot() {
      return this.level === 0;
    }
    get checked() {
      return n(this, a, 'f');
    }
    get indeterminate() {
      return n(this, h, 'f');
    }
    diff() {
      let e = u[this.id];
      return (
        n(this, l, 'f') !== n(this, a, 'f') &&
          ((e = e != null ? e : {}),
          (e.checked = n(this, a, 'f')),
          n(this, a, 'f') && (e.indeterminate = !1)),
        n(this, c, 'f') !== n(this, h, 'f') &&
          ((e = e != null ? e : {}), (e.indeterminate = n(this, h, 'f'))),
        e && (u[this.id] = e),
        e
      );
    }
    setChecked(e, t) {
      return (
        r(this, l, n(this, a, 'f'), 'f'),
        r(this, a, e, 'f'),
        e && this.setIndeterminate(!1, !0),
        this.diff() && this.parent && !t && this.calcParentStatus(),
        e
          ? this.each((i) => {
              i.setIndeterminate(!1, !0), i.setChecked(!0, !0);
            })
          : this.indeterminate ||
            this.each((i) => {
              i.setIndeterminate(!1, !0), i.setChecked(!1, !0);
            }),
        this
      );
    }
    setIndeterminate(e, t) {
      return (
        r(this, c, n(this, h, 'f'), 'f'),
        r(this, h, e, 'f'),
        e &&
          !t &&
          (r(this, l, n(this, a, 'f'), 'f'),
          r(this, a, !1, 'f'),
          this.parent && this.parent.setIndeterminate(!0)),
        t || this.diff(),
        this
      );
    }
    setCheckedByIdReturnDiff(e, t) {
      u = {};
      const i = this.map[e != null ? e : this.id];
      if (i == null) return {};
      i.setChecked(t != null ? t : !0);
      const s = Object.assign({}, u);
      return (u = {}), s;
    }
    selectKeys(e) {
      const t = this.clean();
      return (
        e.forEach((i) => {
          m(t, this.setCheckedByIdReturnDiff(i));
        }),
        t
      );
    }
    getSelectKeys() {
      const e = [];
      return (
        Object.values(this.map).forEach((t) => {
          t.checked && e.push(t.id);
        }),
        e
      );
    }
    calcParentStatus() {
      const { parent: e } = this;
      if (e == null) return;
      const { childList: t } = e,
        { length: i } = t;
      if (i <= 0) return;
      r(e, l, n(e, a, 'f'), 'f'), r(e, c, n(e, h, 'f'), 'f');
      const s = t.filter((p) => p.checked).length;
      return (
        s === i
          ? (r(e, a, !0, 'f'), r(e, h, !1, 'f'))
          : s > 0
          ? (e.setIndeterminate(!0), r(e, a, !1, 'f'))
          : (r(e, h, !1, 'f'), r(e, a, !1, 'f')),
        e.diff() && !e.indeterminate && e.calcParentStatus(),
        this
      );
    }
    clean() {
      const e = {};
      return (
        Object.values(this.map).forEach((t) => {
          let i = e[t.id];
          t.checked && ((i = i != null ? i : {}), (i.checked = !1)),
            t.indeterminate &&
              ((i = i != null ? i : {}), (i.indeterminate = !1)),
            i && (e[t.id] = i),
            r(t, l, r(t, a, !1, 'f'), 'f'),
            r(t, c, r(t, h, !1, 'f'), 'f');
        }),
        e
      );
    }
    each(e) {
      return (
        this.childList.forEach((t, i) => {
          e(t, this, i);
        }),
        this
      );
    }
    eachDeep(e) {
      return (
        this.childList.forEach((t, i) => {
          e(t, this, i), t.eachDeep(e);
        }),
        this
      );
    }
    eachDeepAfter(e) {
      return (
        this.childList.forEach((t, i) => {
          t.eachDeep(e), e(t, this, i);
        }),
        this
      );
    }
  }
  return (
    (a = new WeakMap()),
    (l = new WeakMap()),
    (h = new WeakMap()),
    (c = new WeakMap()),
    o
  );
});
