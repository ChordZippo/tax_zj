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
    ],
    ready: false
  },

  onLoad: function() {
    var that = this;
    try {
      var sys = wx.getSystemInfoSync();
      that.sysInfo = sys;
      that.chartW = Math.floor(sys.windowWidth * 0.85);
      that.chartH = Math.floor(that.chartW * 0.55);
      that.monthlyW = Math.max(sys.windowWidth, 750);
      console.log('init ok w=' + that.chartW + ' h=' + that.chartH);
    } catch(e) {
      console.log('init err: ' + e.message);
      that.chartW = 280;
      that.chartH = 160;
      that.monthlyW = 750;
    }
  },

  onReady: function() {
    var that = this;
    console.log('onReady');
    that.setData({ready: true});
    // 逐个绘制，每个间隔300ms
    setTimeout(function() { that.drawYearly(); }, 500);
    setTimeout(function() { that.drawMonthly(); }, 800);
    setTimeout(function() { that.drawType(); }, 1100);
    setTimeout(function() { that.drawProvince(); }, 1400);
    setTimeout(function() { that.drawDay(); }, 1700);
    setTimeout(function() { that.drawKeyword(); }, 2000);
  },

  drawYearly: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartYearly');
      var data = [15, 623, 102, 44, 189, 130];
      var labels = ['2021', '2022', '2023', '2024', '2025', '2026'];
      var w = that.chartW, h = that.chartH;
      var maxV = 700;

      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);

      var padL = 50, padR = 10, padT = 30, padB = 40;
      var cw = w - padL - padR;
      var ch = h - padT - padB;
      var gap = 10;
      var barW = Math.floor((cw - gap * (data.length + 1)) / data.length);

      for (var i = 0; i <= 4; i++) {
        var y = padT + ch - (ch * i / 4);
        ctx.setStrokeStyle('#eee');
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.setFillStyle('#999');
        ctx.setFontSize(11);
        ctx.setTextAlign('right');
        ctx.fillText(Math.round(maxV * i / 4) + '', padL - 6, y + 4);
      }

      for (var i = 0; i < data.length; i++) {
        var x = padL + gap + i * (barW + gap);
        var v = data[i];
        var barH = Math.max(0, (v / maxV) * ch);
        var y = padT + ch - barH;
        ctx.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(12);
        ctx.setTextAlign('center');
        ctx.fillText(v + '', x + barW / 2, y - 6);
        ctx.setFillStyle('#666');
        ctx.setFontSize(11);
        ctx.fillText(labels[i], x + barW / 2, h - 8);
      }

      ctx.draw();
      console.log('chartYearly done');
    } catch(e) {
      console.log('chartYearly err: ' + e.message);
    }
  },

  drawMonthly: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartMonthly');
      var d = [{ym:'22-05',c:162},{ym:'22-06',c:250},{ym:'22-07',c:133},{ym:'22-08',c:40},{ym:'22-09',c:9},{ym:'23-01',c:11},{ym:'23-02',c:4},{ym:'23-03',c:7},{ym:'23-04',c:13},{ym:'23-05',c:8},{ym:'23-06',c:12},{ym:'23-07',c:12},{ym:'23-08',c:4},{ym:'23-09',c:19},{ym:'23-10',c:7},{ym:'23-11',c:5},{ym:'24-01',c:7},{ym:'24-02',c:6},{ym:'24-04',c:5},{ym:'24-05',c:6},{ym:'24-10',c:6},{ym:'24-11',c:8},{ym:'24-12',c:6},{ym:'25-01',c:8},{ym:'25-02',c:8},{ym:'25-04',c:20},{ym:'25-05',c:8},{ym:'25-06',c:10},{ym:'25-07',c:20},{ym:'25-08',c:12},{ym:'25-09',c:28},{ym:'25-10',c:8},{ym:'25-11',c:46},{ym:'25-12',c:18},{ym:'26-01',c:20},{ym:'26-02',c:20},{ym:'26-04',c:57},{ym:'26-05',c:20},{ym:'26-06',c:13}];
      var w = that.monthlyW, h = that.chartH;
      var maxV = 280;

      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);

      var padL = 40, padR = 10, padT = 30, padB = 40;
      var cw = w - padL - padR;
      var ch = h - padT - padB;
      var gap = 2;
      var barW = Math.max(2, (cw - gap * (d.length + 1)) / d.length);

      for (var i = 0; i <= 4; i++) {
        var y = padT + ch - (ch * i / 4);
        ctx.setStrokeStyle('#eee');
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.setFillStyle('#999');
        ctx.setFontSize(10);
        ctx.setTextAlign('right');
        ctx.fillText(Math.round(maxV * i / 4) + '', padL - 5, y + 4);
      }

      for (var i = 0; i < d.length; i++) {
        var x = padL + gap + i * (barW + gap);
        if (x + barW > w - padR) break;
        var v = d[i].c;
        var barH = Math.max(0, (v / maxV) * ch);
        var y = padT + ch - barH;
        ctx.setFillStyle(v > 100 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        if (i % 3 === 0 || i === d.length - 1) {
          ctx.setFillStyle('#666');
          ctx.setFontSize(8);
          ctx.setTextAlign('center');
          ctx.fillText(d[i].ym, x + barW / 2, h - 8);
        }
      }

      ctx.draw();
      console.log('chartMonthly done');
    } catch(e) {
      console.log('chartMonthly err: ' + e.message);
    }
  },

  drawDay: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartDay');
      var data = [40,15,12,41,34,31,21,30,29,35,17,22,25,30,49,41,69,31,43,23,22,49,23,22,46,71,43,80,41,40,28];
      var w = that.chartW, h = that.chartH;
      var maxV = 90;

      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);

      var padL = 40, padR = 10, padT = 30, padB = 40;
      var cw = w - padL - padR;
      var ch = h - padT - padB;
      var gap = 2;
      var barW = Math.max(2, (cw - gap * (data.length + 1)) / data.length);

      for (var i = 0; i <= 4; i++) {
        var y = padT + ch - (ch * i / 4);
        ctx.setStrokeStyle('#eee');
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.setFillStyle('#999');
        ctx.setFontSize(10);
        ctx.setTextAlign('right');
        ctx.fillText(Math.round(maxV * i / 4) + '', padL - 5, y + 4);
      }

      for (var i = 0; i < data.length; i++) {
        var x = padL + gap + i * (barW + gap);
        if (x + barW > w - padR) break;
        var v = data[i];
        var barH = Math.max(0, (v / maxV) * ch);
        var y = padT + ch - barH;
        ctx.setFillStyle(i >= 20 ? '#C44E52' : '#4C72B0');
        if (barH > 1) ctx.fillRect(x, y, barW, barH);
        if (i % 2 === 0) {
          ctx.setFillStyle('#666');
          ctx.setFontSize(8);
          ctx.setTextAlign('center');
          ctx.fillText((i + 1) + '', x + barW / 2, h - 8);
        }
      }

      ctx.draw();
      console.log('chartDay done');
    } catch(e) {
      console.log('chartDay err: ' + e.message);
    }
  },

  drawType: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartType');
      var d = [{t:'骗享优惠',c:595},{t:'虚开发票',c:114},{t:'网络主播',c:56},{t:'涉税中介',c:54},{t:'一般偷税',c:48},{t:'骗取出口退税',c:46},{t:'私户收款',c:38}];
      var total = 0;
      for (var i = 0; i < d.length; i++) total += d[i].c;
      var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3'];

      var w = that.chartW, h = that.chartH + 40;
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, w, h);

      var cx = Math.floor(w * 0.28), cy = Math.floor(h * 0.5);
      var rSize = Math.min(cx - 10, cy - 10, 90);
      var innerR = Math.floor(rSize * 0.5);

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

      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();

      ctx.setFillStyle('#1a1a2e');
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText(total + '', cx, cy + 6);

      var lx = cx + rSize + 25, ly = 18;
      for (var i = 0; i < d.length; i++) {
        ctx.setFillStyle(C[i]);
        ctx.fillRect(lx, ly, 14, 14);
        ctx.setFillStyle('#333');
        ctx.setFontSize(11);
        ctx.setTextAlign('left');
        var pct = ((d[i].c / total) * 100).toFixed(1);
        ctx.fillText(d[i].t + '  ' + pct + '%', lx + 20, ly + 12);
        ly += 26;
      }

      ctx.draw();
      console.log('chartType done');
    } catch(e) {
      console.log('chartType err: ' + e.message);
    }
  },

  drawProvince: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartProvince');
      var d = [{p:'广东',c:60},{p:'辽宁',c:57},{p:'浙江',c:55},{p:'福建',c:53},{p:'山东',c:40},{p:'四川',c:38},{p:'青海',c:37},{p:'贵州',c:37},{p:'重庆',c:34},{p:'安徽',c:33}];
      d = d.reverse();

      var w = that.chartW, h = that.chartH + 40;
      var padL = 70, padR = 40, padT = 15, padB = 15;
      var cw = w - padL - padR, ch = h - padT - padB;
      var n = d.length;
      var barH = Math.max(16, Math.min(24, (ch - 4 * n) / n));
      var gap = (ch - barH * n) / (n + 1);
      var maxV = 60;
      var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3','#8C8C8C','#4C72B0','#DD8452'];

      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (d[i].c / maxV) * cw);
        ctx.setFillStyle(C[i]);
        ctx.fillRect(padL, y, bw, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(12);
        ctx.setTextAlign('right');
        ctx.fillText(d[i].p, padL - 8, y + barH / 2 + 4);
        ctx.setFillStyle('#666');
        ctx.setFontSize(12);
        ctx.setTextAlign('left');
        ctx.fillText(d[i].c + '', padL + bw + 8, y + barH / 2 + 4);
      }

      ctx.draw();
      console.log('chartProvince done');
    } catch(e) {
      console.log('chartProvince err: ' + e.message);
    }
  },

  drawKeyword: function() {
    try {
      var that = this;
      var ctx = wx.createCanvasContext('chartKeyword');
      var d = [{k:'骗取留抵退税',c:595},{k:'虚开发票',c:114},{k:'涉税中介',c:53},{k:'主播',c:45},{k:'出口退税',c:40},{k:'隐匿收入',c:34},{k:'加油站',c:32},{k:'私户收款',c:31},{k:'个税',c:28},{k:'消费税',c:20}];
      d = d.reverse();

      var w = that.chartW, h = that.chartH + 40;
      var padL = 135, padR = 40, padT = 15, padB = 15;
      var cw = w - padL - padR, ch = h - padT - padB;
      var n = d.length;
      var barH = Math.max(16, Math.min(24, (ch - 4 * n) / n));
      var gap = (ch - barH * n) / (n + 1);
      var maxV = d[d.length - 1].c;
      var C = ['#4C72B0','#DD8452','#55A868','#C44E52','#8172B3','#937860','#DA8BC3','#8C8C8C','#4C72B0','#DD8452'];

      ctx.setFillStyle('#f8f9fa');
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < n; i++) {
        var y = padT + gap + i * (barH + gap);
        var bw = Math.max(0, (d[i].c / maxV) * cw);
        ctx.setFillStyle(i >= n - 3 ? '#C44E52' : '#4C72B0');
        ctx.fillRect(padL, y, bw, barH);
        ctx.setFillStyle('#333');
        ctx.setFontSize(12);
        ctx.setTextAlign('right');
        ctx.fillText(d[i].k, padL - 8, y + barH / 2 + 4);
        ctx.setFillStyle('#666');
        ctx.setFontSize(12);
        ctx.setTextAlign('left');
        ctx.fillText(d[i].c + '', padL + bw + 8, y + barH / 2 + 4);
      }

      ctx.draw();
      console.log('chartKeyword done');
    } catch(e) {
      console.log('chartKeyword err: ' + e.message);
    }
  }
});
