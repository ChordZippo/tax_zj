// ======== 数据 ========
const DATA = {
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

const C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3'];

// ====== 安全获取Canvas ======
function initCanvas(canvasId) {
  return new Promise(function(resolve, reject) {
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec(function(res) {
        if (!res || !res[0] || !res[0].node) {
          console.warn('Canvas not found:', canvasId);
          reject(new Error('no canvas'));
          return;
        }
        var canvas = res[0].node;
        var ctx = canvas.getContext('2d');
        var dpr = wx.getWindowInfo().pixelRatio;
        var w = res[0].width;
        var h = res[0].height;
        if (w === 0 || h === 0) {
          w = 300; h = 200; // fallback
        }
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        resolve({ ctx: ctx, w: w, h: h, canvas: canvas, dpr: dpr });
      });
  });
}

// ====== 圆角矩形 (不用roundRect，兼容所有版本) ======
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

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
    // 延迟确保canvas已渲染
    setTimeout(function() {
      that.drawAll();
    }, 500);
  },

  drawAll: function() {
    this.drawYearly();
    this.drawMonthly();
    this.drawType();
    this.drawProvince();
    this.drawDay();
    this.drawKeyword();
  },

  // ====== 年度柱状图 ======
  drawYearly: function() {
    var that = this;
    initCanvas('chartYearly').then(function(r) {
      that.drawVBar(r.ctx, r.w, r.h, DATA.years.map(function(d){return d.c}), DATA.years.map(function(d){return d.y+'年'}), 700);
    }).catch(function(){});
  },

  // ====== 月度柱状图 ======
  drawMonthly: function() {
    var that = this;
    initCanvas('chartMonthly').then(function(r) {
      var w2 = Math.max(r.w, 800);
      r.canvas.width = w2 * r.dpr;
      r.ctx.scale(r.dpr, r.dpr);
      that.drawVBar(r.ctx, w2, r.h, DATA.months.map(function(d){return d.c}), DATA.months.map(function(d){return d.ym}), 280);
    }).catch(function(){});
  },

  // ====== 竖向柱状图 ======
  drawVBar: function(ctx, w, h, data, labels, maxV) {
    var n = data.length;
    var padL = 45, padR = 15, padT = 30, padB = 40;
    var cw = w - padL - padR;
    var ch = h - padT - padB;
    var gap = n > 25 ? 2 : n > 10 ? 4 : 6;
    var barW = Math.max(1, (cw - gap * (n + 1)) / n);

    ctx.clearRect(0, 0, w, h);

    // 网格线
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padT + ch - (ch * i / 4);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxV * i / 4).toString(), padL - 5, y + 4);
    }

    // 柱子
    for (var i = 0; i < n; i++) {
      var x = padL + gap + i * (barW + gap);
      if (x + barW > w - padR) break;
      var v = data[i];
      var barH = Math.max(0, (v / maxV) * ch);
      var y = padT + ch - barH;
      ctx.fillStyle = data[i] > 100 ? '#C44E52' : '#4C72B0';
      if (barH > 2) {
        roundRect(ctx, x, y, barW, barH, 2);
        ctx.fill();
      }
      // 顶部数值 (限制显示数量)
      if (n <= 15) {
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(v.toString(), x + barW / 2, y - 5);
      }
      // X轴标签
      if (n > 31 && i % 3 !== 0 && i !== n - 1) continue;
      ctx.fillStyle = '#666';
      ctx.font = n > 20 ? '8px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, h - 8);
    }
  },

  // ====== 环形图 ======
  drawType: function() {
    var that = this;
    initCanvas('chartType').then(function(r) {
      var ctx = r.ctx, w = r.w, h = r.h;
      var data = DATA.types;
      var total = 0;
      for (var i = 0; i < data.length; i++) total += data[i].c;

      ctx.clearRect(0, 0, w, h);

      var cx = w * 0.35, cy = h / 2;
      var rSize = Math.max(40, Math.min(cx - 15, cy - 20));
      var innerR = rSize * 0.5;

      var startAngle = -Math.PI / 2;
      for (var i = 0; i < data.length; i++) {
        var angle = (data[i].c / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, rSize, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.fillStyle = C[i % C.length];
        ctx.fill();
        startAngle += angle;
      }

      // 中心白圆
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(total.toString(), cx, cy - 4);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#999';
      ctx.fillText('条', cx, cy + 12);

      // 图例
      var ly = 20;
      var lx = w * 0.6;
      for (var i = 0; i < data.length; i++) {
        ctx.fillStyle = C[i % C.length];
        ctx.fillRect(lx, ly, 12, 12);
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        var pct = ((data[i].c / total) * 100).toFixed(1);
        ctx.fillText(data[i].t + ' ' + pct + '%', lx + 18, ly + 10);
        ly += 24;
      }
    }).catch(function(){});
  },

  // ====== 横向条形图（省份） ======
  drawProvince: function() {
    var that = this;
    initCanvas('chartProvince').then(function(r) {
      var ctx = r.ctx, w = r.w, h = r.h;
      var data = DATA.provinces.slice().reverse();
      var maxV = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].c > maxV) maxV = data[i].c;
      }
      var padL = 70, padR = 35, padT = 15, padB = 15;
      var cw = w - padL - padR;
      var ch = h - padT - padB;
      var n = data.length;
      var barH = Math.max(14, Math.min(22, (ch - 4 * n) / n));
      var gap = (ch - barH * n) / (n + 1);

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (data[i].c / maxV) * cw);

        ctx.fillStyle = C[i % C.length];
        roundRect(ctx, padL, y, bw, barH, 3);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(data[i].p, padL - 6, y + barH / 2 + 4);

        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data[i].c.toString(), padL + bw + 6, y + barH / 2 + 4);
      }
    }).catch(function(){});
  },

  // ====== 每日柱状图 ======
  drawDay: function() {
    var that = this;
    initCanvas('chartDay').then(function(r) {
      that.drawVBar(r.ctx, r.w, r.h, DATA.days, DATA.days.map(function(_,i){return (i+1)+'日'}), 90);
    }).catch(function(){});
  },

  // ====== 关键词横向条形图 ======
  drawKeyword: function() {
    var that = this;
    initCanvas('chartKeyword').then(function(r) {
      var ctx = r.ctx, w = r.w, h = r.h;
      var data = DATA.keywords.slice().reverse();
      var maxV = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].c > maxV) maxV = data[i].c;
      }
      var padL = 130, padR = 35, padT = 15, padB = 15;
      var cw = w - padL - padR;
      var ch = h - padT - padB;
      var n = data.length;
      var barH = Math.max(14, Math.min(24, (ch - 4 * n) / n));
      var gap = (ch - barH * n) / (n + 1);

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (data[i].c / maxV) * cw);

        ctx.fillStyle = i >= n - 3 ? '#C44E52' : '#4C72B0';
        roundRect(ctx, padL, y, bw, barH, 3);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(data[i].k, padL - 6, y + barH / 2 + 4);

        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data[i].c.toString(), padL + bw + 6, y + barH / 2 + 4);
      }
    }).catch(function(){});
  }
});
