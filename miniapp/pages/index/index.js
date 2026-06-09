Page({
  data: {
    kpis: [
      {label:'总记录',value:'1,103',sub:'2021.08 — 2026.06',color:'#4C72B0'},
      {label:'月均曝光',value:'19.7',sub:'条/月',color:'#55A868'},
      {label:'覆盖省份',value:'31',sub:'全覆盖',color:'#DD8452'},
      {label:'峰值月',value:'250',sub:'2022年6月',color:'#C44E52'},
      {label:'执法通报',value:'841',sub:'占76.2%',color:'#8172B3'},
      {label:'深度揭秘',value:'115',sub:'占10.4%',color:'#937860'},
    ],
    batches: [
      {date:'2026-06-05',title:'高收入自然人个税专项',count:13},{date:'2026-05-22',title:'私户收款偷税（8起）',count:18},{date:'2026-04-29',title:'医疗美容行业（6起）',count:14},{date:'2026-04-17',title:'消费税偷逃（8起）',count:18},{date:'2026-04-09',title:'教育培训行业（4起）',count:10},{date:'2026-04-01',title:'虚开增值税发票（5起）',count:12},{date:'2026-02-27',title:'骗取出口退税（4起）',count:10},{date:'2026-02-06',title:'骗享税费优惠（4起）',count:10},{date:'2026-01-14',title:'网络主播偷税（2起）',count:6},{date:'2026-01-08',title:'涉税中介违法（6起）',count:14}
    ]
  },

  onLoad: function() {
    try {
      var sys = wx.getSystemInfoSync();
      this.chartW = Math.floor(sys.windowWidth * 0.92);
      this.chartH = Math.floor(this.chartW * 0.5);
      console.log('OK w=' + this.chartW + ' h=' + this.chartH);
    } catch(e) {
      this.chartW = 300;
      this.chartH = 160;
    }
  },

  onReady: function() {
    console.log('onReady');
    // 链式绘制：每个draw完成后触发回调再画下一个
    var that = this;
    setTimeout(function() { that.drawAll(); }, 300);
  },

  // 按顺序绘制，避免并发ctx.draw
  drawAll: function() {
    var that = this;
    // 先画年度，完成后画月度，依此类推
    that._drawYearly(function() {
      that._drawMonthly(function() {
        that._drawDay(function() {
          that._drawType(function() {
            that._drawProvince(function() {
              that._drawKeyword(function() {
                console.log('All charts done');
              });
            });
          });
        });
      });
    });
  },

  // ---- 工具：画背景和网格 ----
  _drawGrid: function(ctx, w, h, padL, padT, padB, padR, maxV) {
    ctx.setFillStyle('#f8f9fa');
    ctx.fillRect(0, 0, w, h);
    var ch = h - padT - padB;
    var rw = w - padL - padR;
    ctx.setStrokeStyle('#eee');
    ctx.setLineWidth(1);
    for (var i = 0; i <= 4; i++) {
      var y = padT + ch - (ch * i / 4);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.setFillStyle('#999');
      ctx.setFontSize(11);
      ctx.setTextAlign('right');
      ctx.fillText(Math.round(maxV * i / 4) + '', padL - 6, y + 4);
    }
    return { cw: rw, ch: ch };
  },

  // ---- 年度 ---- 
  _drawYearly: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartYearly', this);
      var data = [15, 623, 102, 44, 189, 130];
      var labels = ['2021','2022','2023','2024','2025','2026'];
      var w = this.chartW, h = this.chartH, maxV = 700;
      var padL = 50, padR = 15, padT = 30, padB = 40;
      this._drawGrid(ctx, w, h, padL, padT, padB, padR, maxV);
      var cw = w - padL - padR, ch = h - padT - padB;
      var gap = 12, barW = Math.floor((cw - gap * 7) / 6);
      for (var i = 0; i < data.length; i++) {
        var x = padL + gap + i * (barW + gap);
        var v = data[i], barH = (v / maxV) * ch, y = padT + ch - barH;
        ctx.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(13);
        ctx.setTextAlign('center');
        ctx.fillText(v + '', x + barW / 2, y - 8);
        ctx.setFillStyle('#666');
        ctx.setFontSize(12);
        ctx.fillText(labels[i], x + barW / 2, h - 8);
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 50); });
    } catch(e) { console.log('Y err ' + e.message); if (cb) setTimeout(cb, 50); }
  },

  // ---- 月度 ----
  _drawMonthly: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartMonthly', this);
      var d = [{ym:'22-05',c:162},{ym:'22-06',c:250},{ym:'22-07',c:133},{ym:'22-08',c:40},{ym:'22-09',c:9},{ym:'23-01',c:11},{ym:'23-02',c:4},{ym:'23-03',c:7},{ym:'23-04',c:13},{ym:'23-05',c:8},{ym:'23-06',c:12},{ym:'23-07',c:12},{ym:'23-08',c:4},{ym:'23-09',c:19},{ym:'23-10',c:7},{ym:'23-11',c:5},{ym:'24-01',c:7},{ym:'24-02',c:6},{ym:'24-04',c:5},{ym:'24-05',c:6},{ym:'24-10',c:6},{ym:'24-11',c:8},{ym:'24-12',c:6},{ym:'25-01',c:8},{ym:'25-02',c:8},{ym:'25-04',c:20},{ym:'25-05',c:8},{ym:'25-06',c:10},{ym:'25-07',c:20},{ym:'25-08',c:12},{ym:'25-09',c:28},{ym:'25-10',c:8},{ym:'25-11',c:46},{ym:'25-12',c:18},{ym:'26-01',c:20},{ym:'26-02',c:20},{ym:'26-04',c:57},{ym:'26-05',c:20},{ym:'26-06',c:13}];
      var w = this.chartW, h = this.chartH, maxV = 280;
      var padL = 40, padR = 10, padT = 25, padB = 35;
      this._drawGrid(ctx, w, h, padL, padT, padB, padR, maxV);
      var cw = w - padL - padR, ch = h - padT - padB;
      var barW = Math.max(3, (cw - 3 * (d.length + 1)) / d.length);
      for (var i = 0; i < d.length; i++) {
        var x = padL + 3 + i * (barW + 3);
        if (x + barW > w - padR) break;
        var v = d[i].c, barH = (v / maxV) * ch, y = padT + ch - barH;
        ctx.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        if (i % 3 === 0) {
          ctx.setFillStyle('#666');
          ctx.setFontSize(9);
          ctx.setTextAlign('center');
          ctx.fillText(d[i].ym, x + barW / 2, h - 6);
        }
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 100); });
    } catch(e) { console.log('M err ' + e.message); if (cb) setTimeout(cb, 100); }
  },

  // ---- 每日 ----
  _drawDay: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartDay', this);
      var data = [40,15,12,41,34,31,21,30,29,35,17,22,25,30,49,41,69,31,43,23,22,49,23,22,46,71,43,80,41,40,28];
      var w = this.chartW, h = this.chartH, maxV = 90;
      var padL = 40, padR = 10, padT = 25, padB = 35;
      this._drawGrid(ctx, w, h, padL, padT, padB, padR, maxV);
      var cw = w - padL - padR, ch = h - padT - padB;
      var barW = Math.max(2, (cw - 2 * 32) / 31);
      for (var i = 0; i < data.length; i++) {
        var x = padL + 2 + i * (barW + 2);
        if (x + barW > w - padR) break;
        var v = data[i], barH = (v / maxV) * ch, y = padT + ch - barH;
        ctx.setFillStyle(i >= 20 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        if (i % 3 === 0) {
          ctx.setFillStyle('#666');
          ctx.setFontSize(9);
          ctx.setTextAlign('center');
          ctx.fillText((i + 1) + '', x + barW / 2, h - 6);
        }
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 100); });
    } catch(e) { console.log('D err ' + e.message); if (cb) setTimeout(cb, 100); }
  },

  // ---- 环形图 ----
  _drawType: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartType', this);
      var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3'];
      var d = [{t:'骗享优惠',c:595},{t:'虚开发票',c:114},{t:'网络主播',c:56},{t:'涉税中介',c:54},{t:'一般偷税',c:48},{t:'骗取出口退税',c:46},{t:'私户收款',c:38}];
      var total = 0;
      for (var i = 0; i < d.length; i++) total += d[i].c;
      var w = this.chartW, h = this.chartH + 30;
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, w, h);
      var cx = Math.floor(w * 0.25), cy = Math.floor(h * 0.45);
      var rSize = Math.min(cx - 10, cy - 10, 80);
      var startAngle = -Math.PI / 2;
      for (var i = 0; i < d.length; i++) {
        var angle = (d[i].c / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, rSize, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.setFillStyle(C[i]);
        ctx.fill();
        startAngle += angle;
      }
      var innerR = Math.floor(rSize * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.setFillStyle('#1a1a2e');
      ctx.setFontSize(18);
      ctx.setTextAlign('center');
      ctx.fillText(total + '', cx, cy + 5);
      // 图例
      var lx = w * 0.52, ly = 15;
      for (var i = 0; i < d.length; i++) {
        ctx.setFillStyle(C[i]);
        ctx.fillRect(lx, ly, 16, 16);
        ctx.setFillStyle('#333');
        ctx.setFontSize(12);
        ctx.setTextAlign('left');
        var pct = ((d[i].c / total) * 100).toFixed(1);
        ctx.fillText(d[i].t + '  ' + pct + '%', lx + 22, ly + 13);
        ly += 28;
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 100); });
    } catch(e) { console.log('T err ' + e.message); if (cb) setTimeout(cb, 100); }
  },

  // ---- 省份 ----
  _drawProvince: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartProvince', this);
      var d = [{p:'广东',c:60},{p:'辽宁',c:57},{p:'浙江',c:55},{p:'福建',c:53},{p:'山东',c:40},{p:'四川',c:38},{p:'青海',c:37},{p:'贵州',c:37},{p:'重庆',c:34},{p:'安徽',c:33}];
      d.reverse();
      var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3','#8C8C8C','#4C72B0','#DD8452'];
      var w = this.chartW, h = this.chartH + 30;
      var padL = 72, padR = 40, padT = 15, padB = 15;
      var cw = w - padL - padR, ch = h - padT - padB;
      var n = d.length;
      var barH = Math.max(16, (ch - 5 * n) / n);
      var gap = (ch - barH * n) / (n + 1);
      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (d[i].c / 60) * cw);
        ctx.setFillStyle(C[i]);
        ctx.fillRect(padL, y, bw, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(13);
        ctx.setTextAlign('right');
        ctx.fillText(d[i].p, padL - 8, y + barH / 2 + 5);
        ctx.setFillStyle('#666');
        ctx.setFontSize(12);
        ctx.setTextAlign('left');
        ctx.fillText(d[i].c + '', padL + bw + 8, y + barH / 2 + 4);
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 100); });
    } catch(e) { console.log('P err ' + e.message); if (cb) setTimeout(cb, 100); }
  },

  // ---- 关键词 ----
  _drawKeyword: function(cb) {
    try {
      var ctx = wx.createCanvasContext('chartKeyword', this);
      var d = [{k:'骗取留抵退税',c:595},{k:'虚开发票',c:114},{k:'涉税中介',c:53},{k:'主播',c:45},{k:'出口退税',c:40},{k:'隐匿收入',c:34},{k:'加油站',c:32},{k:'私户收款',c:31},{k:'个税',c:28},{k:'消费税',c:20}];
      d.reverse();
      var w = this.chartW, h = this.chartH + 30;
      var padL = 135, padR = 40, padT = 15, padB = 15;
      var cw = w - padL - padR, ch = h - padT - padB;
      var n = d.length;
      var barH = Math.max(16, (ch - 5 * n) / n);
      var gap = (ch - barH * n) / (n + 1);
      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (d[i].c / 595) * cw);
        ctx.setFillStyle(i >= n - 3 ? '#C44E52' : '#4C72B0');
        ctx.fillRect(padL, y, bw, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(13);
        ctx.setTextAlign('right');
        ctx.fillText(d[i].k, padL - 8, y + barH / 2 + 5);
        ctx.setFillStyle('#666');
        ctx.setFontSize(12);
        ctx.setTextAlign('left');
        ctx.fillText(d[i].c + '', padL + bw + 8, y + barH / 2 + 4);
      }
      ctx.draw(false, function() { if (cb) setTimeout(cb, 100); });
    } catch(e) { console.log('K err ' + e.message); if (cb) setTimeout(cb, 100); }
  }
});
