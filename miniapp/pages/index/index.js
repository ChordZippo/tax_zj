Page({
  data: {
    kpis: [
      {label:'总记录',value:'1,103',sub:'2021.08 — 2026.06',color:'#4C72B0'},
      {label:'月均曝光',value:'19.7',sub:'条/月',color:'#55A868'},
      {label:'覆盖省份',value:'31',sub:'全覆盖',color:'#DD8452'},
      {label:'峰值月',value:'250',sub:'2022年6月',color:'#C44E52'},
      {label:'执法通报',value:'841',sub:'占76.2%',color:'#8172B3'},
      {label:'深度揭秘',value:'115',sub:'占10.4%',color:'#937860'}
    ],
    batches: [
      {date:'2026-06-05',title:'高收入自然人个税专项',count:13},
      {date:'2026-05-22',title:'私户收款偷税（8起）',count:18},
      {date:'2026-04-29',title:'医疗美容行业（6起）',count:14},
      {date:'2026-04-17',title:'消费税偷逃（8起）',count:18},
      {date:'2026-04-09',title:'教育培训行业（4起）',count:10},
      {date:'2026-04-01',title:'虚开增值税发票（5起）',count:12},
      {date:'2026-02-27',title:'骗取出口退税（4起）',count:10},
      {date:'2026-02-06',title:'骗享税费优惠（4起）',count:10},
      {date:'2026-01-14',title:'网络主播偷税（2起）',count:6},
      {date:'2026-01-08',title:'涉税中介违法（6起）',count:14}
    ]
  },

  onLoad: function() {
    var s = wx.getSystemInfoSync();
    this.rw = Math.floor(s.windowWidth * 0.92);
    this.rh = Math.floor(this.rw * 0.5);
  },

  onReady: function() {
    var t = this;
    setTimeout(function() { t.run(); }, 300);
  },

  run: function() {
    var t = this;
    t.dYearly(function() {
      t.dMonthly(function() {
        t.dDay(function() {
          t.dType(function() {
            t.dProv(function() {
              t.dKw(function() {});
            });
          });
        });
      });
    });
  },

  // 网格工具
  grid: function(c, w, h, pl, pt, pb, pr, mv) {
    c.setFillStyle('#f8f9fa');
    c.fillRect(0, 0, w, h);
    var ch = h - pt - pb;
    c.setStrokeStyle('#eee');
    c.setLineWidth(1);
    for (var i = 0; i <= 4; i++) {
      var y = pt + ch - (ch * i / 4);
      c.beginPath();
      c.moveTo(pl, y);
      c.lineTo(w - pr, y);
      c.stroke();
      c.setFillStyle('#999');
      c.setFontSize(11);
      c.setTextAlign('right');
      c.fillText(Math.round(mv * i / 4) + '', pl - 6, y + 4);
    }
  },

  dYearly: function(cb) {
    try {
      var c = wx.createCanvasContext('chartYearly', this);
      var d = [15, 623, 102, 44, 189, 130];
      var lb = ['2021','2022','2023','2024','2025','2026'];
      var w = this.rw, h = this.rh, mv = 700;
      var pl = 50, pr = 15, pt = 30, pb = 40;
      this.grid(c, w, h, pl, pt, pb, pr, mv);
      var cw = w - pl - pr, ch = h - pt - pb, gap = 12;
      var bw = Math.floor((cw - gap * 7) / 6);
      for (var i = 0; i < 6; i++) {
        var x = pl + gap + i * (bw + gap);
        var v = d[i], bh = (v / mv) * ch, y = pt + ch - bh;
        c.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (bh > 1) c.fillRect(x, y, bw, bh);
        c.setFillStyle('#333');
        c.setFontSize(13);
        c.setTextAlign('center');
        c.fillText(v + '', x + bw / 2, y - 8);
        c.setFillStyle('#666');
        c.setFontSize(12);
        c.fillText(lb[i], x + bw / 2, h - 8);
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  },

  dMonthly: function(cb) {
    try {
      var c = wx.createCanvasContext('chartMonthly', this);
      var d = [{m:'22-05',v:162},{m:'22-06',v:250},{m:'22-07',v:133},{m:'22-08',v:40},{m:'22-09',v:9},{m:'23-01',v:11},{m:'23-02',v:4},{m:'23-03',v:7},{m:'23-04',v:13},{m:'23-05',v:8},{m:'23-06',v:12},{m:'23-07',v:12},{m:'23-08',v:4},{m:'23-09',v:19},{m:'23-10',v:7},{m:'23-11',v:5},{m:'24-01',v:7},{m:'24-02',v:6},{m:'24-04',v:5},{m:'24-05',v:6},{m:'24-10',v:6},{m:'24-11',v:8},{m:'24-12',v:6},{m:'25-01',v:8},{m:'25-02',v:8},{m:'25-04',v:20},{m:'25-05',v:8},{m:'25-06',v:10},{m:'25-07',v:20},{m:'25-08',v:12},{m:'25-09',v:28},{m:'25-10',v:8},{m:'25-11',v:46},{m:'25-12',v:18},{m:'26-01',v:20},{m:'26-02',v:20},{m:'26-04',v:57},{m:'26-05',v:20},{m:'26-06',v:13}];
      var n = d.length, w = this.rw, h = this.rh, mv = 280;
      var pl = 40, pr = 10, pt = 25, pb = 35;
      this.grid(c, w, h, pl, pt, pb, pr, mv);
      var cw = w - pl - pr, ch = h - pt - pb, bw = Math.max(3, (cw - 3 * (n + 1)) / n);
      for (var i = 0; i < n; i++) {
        var x = pl + 3 + i * (bw + 3);
        if (x + bw > w - pr) break;
        var v = d[i].v, bh = (v / mv) * ch, y = pt + ch - bh;
        c.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (bh > 1) c.fillRect(x, y, bw, bh);
        if (i % 3 === 0) {
          c.setFillStyle('#666');
          c.setFontSize(9);
          c.setTextAlign('center');
          c.fillText(d[i].m, x + bw / 2, h - 6);
        }
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  },

  dDay: function(cb) {
    try {
      var c = wx.createCanvasContext('chartDay', this);
      var d = [40,15,12,41,34,31,21,30,29,35,17,22,25,30,49,41,69,31,43,23,22,49,23,22,46,71,43,80,41,40,28];
      var n = d.length, w = this.rw, h = this.rh, mv = 90;
      var pl = 40, pr = 10, pt = 25, pb = 35;
      this.grid(c, w, h, pl, pt, pb, pr, mv);
      var cw = w - pl - pr, ch = h - pt - pb, bw = Math.max(2, (cw - 2 * 32) / 31);
      for (var i = 0; i < n; i++) {
        var x = pl + 2 + i * (bw + 2);
        if (x + bw > w - pr) break;
        var v = d[i], bh = (v / mv) * ch, y = pt + ch - bh;
        c.setFillStyle(i >= 20 ? '#C44E52' : '#4C72B0');
        if (bh > 1) c.fillRect(x, y, bw, bh);
        if (i % 3 === 0) {
          c.setFillStyle('#666');
          c.setFontSize(9);
          c.setTextAlign('center');
          c.fillText((i + 1) + '', x + bw / 2, h - 6);
        }
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  },

  dType: function(cb) {
    try {
      var c = wx.createCanvasContext('chartType', this);
      var cl = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3'];
      var d = [{t:'骗享优惠',v:595},{t:'虚开发票',v:114},{t:'网络主播',v:56},{t:'涉税中介',v:54},{t:'一般偷税',v:48},{t:'骗取出口退税',v:46},{t:'私户收款',v:38}];
      var total = 0;
      for (var i = 0; i < 7; i++) total += d[i].v;
      var w = this.rw, h = this.rh + 30;
      c.setFillStyle('#ffffff');
      c.fillRect(0, 0, w, h);
      var cx = Math.floor(w * 0.25), cy = Math.floor(h * 0.45);
      var r = Math.min(cx - 10, cy - 10, 80);
      var sa = -Math.PI / 2;
      for (var i = 0; i < 7; i++) {
        var a = (d[i].v / total) * Math.PI * 2;
        c.beginPath();
        c.moveTo(cx, cy);
        c.arc(cx, cy, r, sa, sa + a);
        c.closePath();
        c.setFillStyle(cl[i]);
        c.fill();
        sa += a;
      }
      var ir = Math.floor(r * 0.5);
      c.beginPath();
      c.arc(cx, cy, ir, 0, Math.PI * 2);
      c.setFillStyle('#ffffff');
      c.fill();
      c.setFillStyle('#1a1a2e');
      c.setFontSize(18);
      c.setTextAlign('center');
      c.fillText(total + '', cx, cy + 5);
      var lx = w * 0.52, ly = 15;
      for (var i = 0; i < 7; i++) {
        c.setFillStyle(cl[i]);
        c.fillRect(lx, ly, 16, 16);
        c.setFillStyle('#333');
        c.setFontSize(12);
        c.setTextAlign('left');
        var p = ((d[i].v / total) * 100).toFixed(1);
        c.fillText(d[i].t + '  ' + p + '%', lx + 22, ly + 13);
        ly += 28;
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  },

  dProv: function(cb) {
    try {
      var c = wx.createCanvasContext('chartProvince', this);
      var d = [{p:'广东',v:60},{p:'辽宁',v:57},{p:'浙江',v:55},{p:'福建',v:53},{p:'山东',v:40},{p:'四川',v:38},{p:'青海',v:37},{p:'贵州',v:37},{p:'重庆',v:34},{p:'安徽',v:33}];
      d.reverse();
      var cl = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3','#8C8C8C','#4C72B0','#DD8452'];
      var w = this.rw, h = this.rh + 30, n = d.length;
      var pl = 72, pr = 40, pt = 15, pb = 15;
      var cw = w - pl - pr, ch = h - pt - pb;
      var bh = Math.max(16, (ch - 5 * n) / n), gap = (ch - bh * n) / (n + 1);
      c.setFillStyle('#f8f9fa');
      c.fillRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var y = pt + gap + i * (bh + gap);
        var bw = Math.max(0, (d[i].v / 60) * cw);
        c.setFillStyle(cl[i]);
        c.fillRect(pl, y, bw, bh);
        c.setFillStyle('#333');
        c.setFontSize(13);
        c.setTextAlign('right');
        c.fillText(d[i].p, pl - 8, y + bh / 2 + 5);
        c.setFillStyle('#666');
        c.setFontSize(12);
        c.setTextAlign('left');
        c.fillText(d[i].v + '', pl + bw + 8, y + bh / 2 + 4);
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  },

  dKw: function(cb) {
    try {
      var c = wx.createCanvasContext('chartKeyword', this);
      var d = [{k:'骗取留抵退税',v:595},{k:'虚开发票',v:114},{k:'涉税中介',v:53},{k:'主播',v:45},{k:'出口退税',v:40},{k:'隐匿收入',v:34},{k:'加油站',v:32},{k:'私户收款',v:31},{k:'个税',v:28},{k:'消费税',v:20}];
      d.reverse();
      var w = this.rw, h = this.rh + 30, n = d.length;
      var pl = 135, pr = 40, pt = 15, pb = 15;
      var cw = w - pl - pr, ch = h - pt - pb;
      var bh = Math.max(16, (ch - 5 * n) / n), gap = (ch - bh * n) / (n + 1);
      c.setFillStyle('#f8f9fa');
      c.fillRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var y = pt + gap + i * (bh + gap);
        var bw = Math.max(0, (d[i].v / 595) * cw);
        c.setFillStyle(i >= n - 3 ? '#C44E52' : '#4C72B0');
        c.fillRect(pl, y, bw, bh);
        c.setFillStyle('#333');
        c.setFontSize(13);
        c.setTextAlign('right');
        c.fillText(d[i].k, pl - 8, y + bh / 2 + 5);
        c.setFillStyle('#666');
        c.setFontSize(12);
        c.setTextAlign('left');
        c.fillText(d[i].v + '', pl + bw + 8, y + bh / 2 + 4);
      }
      c.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { if (cb) setTimeout(cb, 50); }
  }
});
