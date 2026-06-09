var DATA = {
  years: [{y:2021,c:15},{y:2022,c:623},{y:2023,c:102},{y:2024,c:44},{y:2025,c:189},{y:2026,c:130}],
  months: [
    {ym:'22-05',c:162},{ym:'22-06',c:250},{ym:'22-07',c:133},{ym:'22-08',c:40},{ym:'22-09',c:9},
    {ym:'23-01',c:11},{ym:'23-02',c:4},{ym:'23-03',c:7},{ym:'23-04',c:13},{ym:'23-05',c:8},{ym:'23-06',c:12},{ym:'23-07',c:12},{ym:'23-08',c:4},{ym:'23-09',c:19},{ym:'23-10',c:7},{ym:'23-11',c:5},
    {ym:'24-01',c:7},{ym:'24-02',c:6},{ym:'24-04',c:5},{ym:'24-05',c:6},{ym:'24-10',c:6},{ym:'24-11',c:8},{ym:'24-12',c:6},
    {ym:'25-01',c:8},{ym:'25-02',c:8},{ym:'25-04',c:20},{ym:'25-05',c:8},{ym:'25-06',c:10},{ym:'25-07',c:20},{ym:'25-08',c:12},{ym:'25-09',c:28},{ym:'25-10',c:8},{ym:'25-11',c:46},{ym:'25-12',c:18},
    {ym:'26-01',c:20},{ym:'26-02',c:20},{ym:'26-04',c:57},{ym:'26-05',c:20},{ym:'26-06',c:13}
  ],
  days: [40,15,12,41,34,31,21,30,29,35,17,22,25,30,49,41,69,31,43,23,22,49,23,22,46,71,43,80,41,40,28],
  types: [
    {t:'骗享优惠',c:595},{t:'虚开发票',c:114},{t:'网络主播',c:56},{t:'涉税中介',c:54},
    {t:'一般偷税',c:48},{t:'骗取出口退税',c:46},{t:'私户收款',c:38}
  ],
  provinces: [
    {p:'广东',c:60},{p:'辽宁',c:57},{p:'浙江',c:55},{p:'福建',c:53},{p:'山东',c:40},
    {p:'四川',c:38},{p:'青海',c:37},{p:'贵州',c:37},{p:'重庆',c:34},{p:'安徽',c:33}
  ],
  keywords: [
    {k:'骗取留抵退税',c:595},{k:'虚开',c:114},{k:'涉税中介',c:53},{k:'主播',c:45},
    {k:'出口退税',c:40},{k:'隐匿收入',c:34},{k:'加油站',c:32},{k:'私户收款',c:31},
    {k:'个税',c:28},{k:'消费税',c:20}
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
};

var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3'];

Page({
  data: {
    kpis: [
      {label:'总记录',value:'1,103',sub:'2021.08—2026.06',color:'#4C72B0'},
      {label:'月均',value:'19.7',sub:'条/月',color:'#55A868'},
      {label:'省份',value:'31',sub:'全覆盖',color:'#DD8452'},
      {label:'峰值月',value:'250',sub:'2022年6月',color:'#C44E52'},
      {label:'执法通报',value:'841',sub:'占76.2%',color:'#8172B3'},
      {label:'揭秘稿',value:'115',sub:'占10.4%',color:'#937860'},
    ],
    batches: DATA.batches
  },

  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.drawYearly();
      that.drawMonthly();
      that.drawType();
      that.drawProvince();
      that.drawDay();
      that.drawKeyword();
    }, 800);
  },

  // ====== 竖向柱状图 ======
  drawVBar: function(id, data, labels, maxV) {
    var ctx = wx.createCanvasContext(id, this);
    var n = data.length;
    var w = 320, h = 290;
    if (id === 'chartMonthly') { w = 800; }

    var padL = 45, padR = 15, padT = 35, padB = 45;
    var cw = w - padL - padR;
    var ch = h - padT - padB;
    var gap = n > 25 ? 2 : n > 10 ? 4 : 6;
    var barW = Math.max(1, (cw - gap * (n + 1)) / n);

    // 底色
    ctx.setFillStyle('#f8f9fa');
    ctx.fillRect(0, 0, w, h);

    // 网格线
    for (var i = 0; i <= 4; i++) {
      var y = padT + ch - (ch * i / 4);
      ctx.setStrokeStyle('#eee');
      ctx.setLineWidth(1);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.setFillStyle('#999');
      ctx.setFontSize(10);
      ctx.setTextAlign('right');
      ctx.fillText(Math.round(maxV * i / 4).toString(), padL - 5, y + 4);
    }

    // 柱子
    for (var i = 0; i < n; i++) {
      var x = padL + gap + i * (barW + gap);
      if (x + barW > w - padR) break;
      var v = data[i];
      var barH = Math.max(0, (v / maxV) * ch);
      var y = padT + ch - barH;
      ctx.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
      if (barH > 2) {
        var r = 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.arcTo(x + barW, y, x + barW, y + r, r);
        ctx.lineTo(x + barW, padT + ch);
        ctx.lineTo(x, padT + ch);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.fill();
      }
      if (n <= 15) {
        ctx.setFillStyle('#333');
        ctx.setFontSize(10);
        ctx.setTextAlign('center');
        ctx.fillText(v.toString(), x + barW / 2, y - 5);
      }
      if (n > 31) {
        if (i % 3 !== 0 && i !== n - 1) continue;
      }
      ctx.setFillStyle('#666');
      ctx.setFontSize(n > 20 ? 8 : 10);
      ctx.setTextAlign('center');
      ctx.fillText(labels[i], x + barW / 2, h - 8);
    }

    ctx.draw();
  },

  // ====== 年度 ======
  drawYearly: function() {
    this.drawVBar('chartYearly',
      DATA.years.map(function(d){return d.c}),
      DATA.years.map(function(d){return d.y+'年'}),
      700);
  },

  // ====== 月度 ======
  drawMonthly: function() {
    this.drawVBar('chartMonthly',
      DATA.months.map(function(d){return d.c}),
      DATA.months.map(function(d){return d.ym}),
      280);
  },

  // ====== 每日 ======
  drawDay: function() {
    var labels = [];
    for (var i = 1; i <= 31; i++) labels.push(i + '日');
    this.drawVBar('chartDay', DATA.days, labels, 90);
  },

  // ====== 环形图 ======
  drawType: function() {
    var ctx = wx.createCanvasContext('chartType', this);
    var data = DATA.types;
    var total = 0;
    for (var i = 0; i < data.length; i++) total += data[i].c;

    var w = 320, h = 310;
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, w, h);

    var cx = 80, cy = 140, rSize = 70, innerR = 35;

    var startAngle = -Math.PI / 2;
    for (var i = 0; i < data.length; i++) {
      var angle = (data[i].c / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rSize, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.setFillStyle(C[i % C.length]);
      ctx.fill();
      startAngle += angle;
    }

    // 中心圆
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.setFillStyle('#ffffff');
    ctx.fill();

    ctx.setFillStyle('#1a1a2e');
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.fillText(total.toString(), cx, cy - 2);
    ctx.setFontSize(12);
    ctx.setFillStyle('#999');
    ctx.fillText('条', cx, cy + 16);

    // 图例
    var ly = 15;
    var lx = 175;
    for (var i = 0; i < data.length; i++) {
      ctx.setFillStyle(C[i % C.length]);
      ctx.fillRect(lx, ly, 14, 14);
      ctx.setFillStyle('#333');
      ctx.setFontSize(11);
      ctx.setTextAlign('left');
      var pct = ((data[i].c / total) * 100).toFixed(1);
      ctx.fillText(data[i].t + ' ' + pct + '%', lx + 20, ly + 12);
      ly += 26;
    }

    ctx.draw();
  },

  // ====== 横向条形图 ======
  drawHBar: function(id, data, labelKey, valKey, padL, maxV) {
    var ctx = wx.createCanvasContext(id, this);
    var n = data.length;
    var w = 320, h = 310;
    var padR = 40, padT = 15, padB = 15;
    var cw = w - padL - padR;
    var ch = h - padT - padB;
    var barH = Math.max(14, Math.min(24, (ch - 4 * n) / n));
    var gap = (ch - barH * n) / (n + 1);

    ctx.setFillStyle('#f8f9fa');
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < n; i++) {
      var y = padT + gap + i * (barH + gap);
      var bw = Math.max(0, (data[i][valKey] / maxV) * cw);

      ctx.setFillStyle(C[i % C.length]);
      var r = 3;
      ctx.beginPath();
      ctx.moveTo(padL + r, y);
      ctx.lineTo(padL + bw - r, y);
      ctx.arcTo(padL + bw, y, padL + bw, y + r, r);
      ctx.lineTo(padL + bw, y + barH - r);
      ctx.arcTo(padL + bw, y + barH, padL + bw - r, y + barH, r);
      ctx.lineTo(padL + r, y + barH);
      ctx.arcTo(padL, y + barH, padL, y + barH - r, r);
      ctx.lineTo(padL, y + r);
      ctx.arcTo(padL, y, padL + r, y, r);
      ctx.closePath();
      ctx.fill();

      ctx.setFillStyle('#333');
      ctx.setFontSize(11);
      ctx.setTextAlign('right');
      ctx.fillText(data[i][labelKey], padL - 6, y + barH / 2 + 4);

      ctx.setFillStyle('#666');
      ctx.setFontSize(10);
      ctx.setTextAlign('left');
      ctx.fillText(data[i][valKey].toString(), padL + bw + 6, y + barH / 2 + 4);
    }
    ctx.draw();
  },

  // ====== 省份 ======
  drawProvince: function() {
    var d = DATA.provinces.slice().reverse();
    var maxV = 0;
    for (var i = 0; i < d.length; i++) { if (d[i].c > maxV) maxV = d[i].c; }
    this.drawHBar('chartProvince', d, 'p', 'c', 70, maxV);
  },

  // ====== 关键词 ======
  drawKeyword: function() {
    var d = DATA.keywords.slice().reverse();
    var maxV = 0;
    for (var i = 0; i < d.length; i++) { if (d[i].c > maxV) maxV = d[i].c; }
    this.drawHBar('chartKeyword', d, 'k', 'c', 130, maxV);
  }
});
