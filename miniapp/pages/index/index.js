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
    {t:'一般偷税',c:48},{t:'骗取出口退税',c:46},{t:'私户收款',c:38},{t:'个税违法',c:31},
    {t:'加油站',c:28},{t:'消费税',c:22}
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

// ======== 颜色 ========
const C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3','#8C8C8C'];

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

  onReady() {
    this.drawYearlyChart();
    this.drawMonthlyChart();
    this.drawTypeChart();
    this.drawProvinceChart();
    this.drawDayChart();
    this.drawKeywordChart();
  },

  // ====== 柱状图工具函数 ======
  drawBars(ctx, data, labels, opts) {
    const { w, h, maxV } = opts;
    const pad = { t: 40, b: 40, l: 50, r: 20 };
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;
    const gap = 6;
    const barW = (cw - gap * (data.length + 1)) / data.length;

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    if (opts.title) ctx.fillText(opts.title, 12, 22);

    // Y-axis grid lines
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + ch - (ch * i / 4);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxV * i / 4).toString(), pad.l - 5, y + 4);
    }

    // Bars
    data.forEach((v, i) => {
      const x = pad.l + gap + i * (barW + gap);
      const barH = (v / maxV) * ch;
      const y = pad.t + ch - barH;
      const color = opts.colors ? opts.colors[i] : '#4C72B0';
      ctx.fillStyle = color;
      ctx.beginPath();
      const r = 3;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.arcTo(x + barW, y, x + barW, y + r, r);
      ctx.lineTo(x + barW, pad.t + ch);
      ctx.lineTo(x, pad.t + ch);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.fill();

      // Value label
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(v.toString(), x + barW / 2, y - 6);

      // X label
      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, h - 8);
    });

    ctx.draw();
  },

  // ====== 年度趋势 ======
  drawYearlyChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartYearly').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = DATA.years.map(d => d.c);
      const labels = DATA.years.map(d => d.y.toString());
      this.drawBars(ctx, data, labels, {
        w, h, maxV: 700,
        colors: data.map(v => v > 100 ? '#C44E52' : '#4C72B0'),
        title: ''
      });
    });
  },

  // ====== 月度节奏 ======
  drawMonthlyChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartMonthly').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = DATA.months.map(d => d.c);
      const labels = DATA.months.map(d => d.ym);
      this.drawBars(ctx, data, labels, {
        w, h, maxV: 280,
        colors: data.map(v => v > 100 ? '#C44E52' : '#4C72B0'),
        title: ''
      });
    });
  },

  // ====== 类型分布（环形图） ======
  drawTypeChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartType').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = DATA.types;
      const total = data.reduce((a, d) => a + d.c, 0);
      const cx = w * 0.35, cy = h / 2, r = Math.min(cx - 10, cy - 20);
      const innerR = r * 0.55;

      ctx.clearRect(0, 0, w, h);

      let startAngle = -Math.PI / 2;
      data.forEach((d, i) => {
        const angle = (d.c / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.fillStyle = C[i % C.length];
        ctx.fill();
        startAngle += angle;
      });

      // Inner white circle
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Center text
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(total.toString(), cx, cy - 4);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#999';
      ctx.fillText('条', cx, cy + 12);

      // Legend on the right
      let ly = 20;
      data.forEach((d, i) => {
        ctx.fillStyle = C[i % C.length];
        ctx.fillRect(w * 0.6, ly, 12, 12);
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        const pct = ((d.c / total) * 100).toFixed(1);
        ctx.fillText(d.t + ' ' + pct + '%', w * 0.6 + 18, ly + 10);
        ly += 26;
      });

      ctx.draw();
    });
  },

  // ====== 省份排名 ======
  drawProvinceChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartProvince').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = [...DATA.provinces].reverse();
      const maxV = Math.max(...data.map(d => d.c));
      const pad = { t: 12, b: 12, l: 70, r: 40 };
      const cw = w - pad.l - pad.r;
      const ch = h - pad.t - pad.b;
      const barH = Math.min(20, (ch - 8 * data.length) / data.length);
      const gap = (ch - barH * data.length) / (data.length + 1);

      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, w, h);

      data.forEach((d, i) => {
        const y = pad.t + gap + i * (barH + gap);
        const bw = (d.c / maxV) * cw;

        ctx.fillStyle = C[i % C.length];
        ctx.beginPath();
        const r = 3;
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + bw - r, y);
        ctx.arcTo(pad.l + bw, y, pad.l + bw, y + r, r);
        ctx.lineTo(pad.l + bw, y + barH - r);
        ctx.arcTo(pad.l + bw, y + barH, pad.l + bw - r, y + barH, r);
        ctx.lineTo(pad.l, y + barH);
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(d.p, pad.l - 6, y + barH / 2 + 4);

        // Value
        ctx.fillStyle = '#666';
        ctx.textAlign = 'left';
        ctx.fillText(d.c.toString(), pad.l + bw + 6, y + barH / 2 + 4);
      });

      ctx.draw();
    });
  },

  // ====== 每日分布 ======
  drawDayChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartDay').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = DATA.days;
      const labels = data.map((_, i) => (i + 1) + '日');
      this.drawBars(ctx, data, labels, {
        w, h, maxV: 90,
        colors: data.map((v, i) => i >= 20 ? '#C44E52' : '#4C72B0'),
        title: ''
      });
    });
  },

  // ====== 关键词频率 ======
  drawKeywordChart() {
    const query = wx.createSelectorQuery();
    query.select('#chartKeyword').fields({ node: true, size: true }).exec(res => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      const w = res[0].width, h = res[0].height;

      const data = [...DATA.keywords].reverse();
      const maxV = Math.max(...data.map(d => d.c));
      const pad = { t: 12, b: 12, l: 130, r: 40 };
      const cw = w - pad.l - pad.r;
      const ch = h - pad.t - pad.b;
      const barH = Math.min(20, (ch - 6 * data.length) / data.length);
      const gap = (ch - barH * data.length) / (data.length + 1);

      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, w, h);

      data.forEach((d, i) => {
        const y = pad.t + gap + i * (barH + gap);
        const bw = (d.c / maxV) * cw;

        ctx.fillStyle = i >= data.length - 3 ? '#C44E52' : '#4C72B0';
        ctx.beginPath();
        const r = 3;
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + bw - r, y);
        ctx.arcTo(pad.l + bw, y, pad.l + bw, y + r, r);
        ctx.lineTo(pad.l + bw, y + barH - r);
        ctx.arcTo(pad.l + bw, y + barH, pad.l + bw - r, y + barH, r);
        ctx.lineTo(pad.l, y + barH);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(d.k, pad.l - 6, y + barH / 2 + 4);

        ctx.fillStyle = '#666';
        ctx.textAlign = 'left';
        ctx.fillText(d.c.toString(), pad.l + bw + 6, y + barH / 2 + 4);
      });

      ctx.draw();
    });
  }
});
