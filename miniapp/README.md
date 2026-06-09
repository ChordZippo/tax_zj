# 税案通报大数据分析 - 微信小程序

## 📱 项目说明

基于国家税务总局"税案通报"栏目公开数据的微信小程序版数据分析仪表盘。
包含 6 张数据图表、KPI 指标卡和 2026 年曝光批次列表。

## 🛠 使用步骤

### 1. 准备工作
- 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号（如已有请跳过）：https://mp.weixin.qq.com/
- 获取小程序 AppID

### 2. 导入项目

```bash
git clone https://github.com/ChordZippo/tax_zj.git
cd tax_zj/miniapp
```

或直接用微信开发者工具打开 `miniapp` 文件夹。

### 3. 配置 AppID

编辑 `project.config.json`，将 `appid` 替换为你的小程序 AppID：

```json
"appid": "wx你的AppID"
```

### 4. 预览与调试

在微信开发者工具中：
- 点击"预览"生成二维码，用手机微信扫码即可真机预览
- 点击"编译"可在模拟器中查看效果

### 5. 发布（可选）

- 开发者工具 → 上传
- 登录微信公众平台 → 版本管理 → 提交审核
- 审核通过后发布

## 📋 项目结构

```
miniapp/
├── app.js              # 应用入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置（需填appid）
├── sitemap.json        # 搜索规则
└── pages/
    └── index/
        ├── index.js    # 页面逻辑（数据+图表绘制）
        ├── index.wxml  # 页面模板
        ├── index.wxss  # 页面样式
        └── index.json  # 页面配置
```

## 📊 功能清单

| 功能 | 说明 |
|------|------|
| KPI 指标卡 | 6 个核心指标（总记录、月均、省份等） |
| 年度趋势柱状图 | 2021-2026 年发稿量变化 |
| 月度节奏柱状图 | 56 个月的实际发稿节奏 |
| 类型分布环形图 | 案件类型占比 |
| 省份排名条形图 | Top 10 省份曝光量 |
| 每日潮汐柱状图 | 每月 31 天的分布规律 |
| 关键词频率条形图 | Top 10 高频关键词 |
| 2026年曝光批次 | 10 批专项曝光详情 |

## ⚠️ 注意事项

- 所有数据已嵌入前端，无需服务器后端
- 图表使用 WeChat Canvas 2D API 绘制，兼容 iOS 和 Android
- 模拟器数据可能与真机略有差异，以真机预览为准

## 🔗 相关链接

- 在线网页版：https://chordzippo.github.io/tax_zj/
- 数据来源：https://www.chinatax.gov.cn/chinatax/n810219/c102025/common_listwyc.html
