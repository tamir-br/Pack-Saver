# 🛍️ Pack Saver - Smart Bulk Price Calculator

<div align="center">

![Pack Saver Logo](icon128.png)

**Find the best deals on bulk purchases instantly**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](manifest.json)

[Install Extension](#installation) • [Features](#features) • [Screenshots](#screenshots) • [Support](#support)

</div>

---

## 🎯 What is Pack Saver?

Pack Saver is a **free Chrome extension** that automatically calculates the **price per item** for every product on major shopping sites, helping you find the true best deals when buying in bulk.

Stop doing mental math and let Pack Saver instantly show you which multipack offers the best value!

### 🤔 The Problem

When shopping online, it's hard to compare:
- "$6.99 for a 24-pack" vs "$9.99 for a 48-pack"
- Is the larger pack actually cheaper per item?
- Which deal saves you the most money?

### ✨ The Solution

Pack Saver automatically:
- ✅ Calculates price per item for ALL products
- ✅ Highlights the best deals in gold
- ✅ Shows you the top 3 offers at a glance
- ✅ Lets you jump directly to the cheapest option

---

## 🚀 Features

### 💰 Automatic Price Analysis
- Instantly calculates cost per item for every product
- Works with all pack sizes (2-pack to 500-pack+)
- Handles complex pricing patterns

### 🎯 Best Deal Detection
- Golden "BEST VALUE" badges on the cheapest options
- Purple badges show price/item for all products
- Top 3 deals list in elegant overlay

### 🖱️ Interactive Interface
- Draggable floating button
- Draggable overlay dashboard
- One-click jump to best deals
- Single-click to toggle, double-click to disable

### 🌐 Multi-Platform Support
Works seamlessly on:
- 🔸 Amazon (all regions)
- 🔸 Walmart & Walmart Canada
- 🔸 AliExpress
- 🔸 Temu
- 🔸 eBay

### 🔒 Privacy First
- ❌ Zero data collection
- ❌ No tracking or analytics
- ❌ No user accounts
- ✅ 100% local processing
- ✅ Open source code

---

## 📸 Screenshots

### Main Dashboard
![Dashboard](screenshots/dashboard.png)
*Elegant overlay shows analyzed products and top deals*

### Best Value Detection
![Best Value](screenshots/best-value.png)
*Golden badges automatically highlight the cheapest per-item prices*

### Amazon Integration
![Amazon](screenshots/amazon.png)
*Seamless integration with Amazon product listings*

### Walmart Integration
![Walmart](screenshots/walmart.png)
*Works perfectly on Walmart's search results*

---

## 📥 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](#) (link coming soon)
2. Click "Add to Chrome"
3. Start shopping and save money!

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/pack-saver.git
   ```
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `pack-saver` folder
6. The extension is now active!

---

## 🎮 How to Use

### Automatic Mode
1. Visit any supported shopping site (Amazon, Walmart, etc.)
2. Pack Saver automatically activates and analyzes products
3. Purple badges appear showing price per item
4. Golden "BEST VALUE" badges highlight top deals
5. Click the floating button to see the dashboard

### Dashboard Features
- **Top 3 Deals:** See the best offers ranked
- **Jump to Best Deal:** One-click navigation
- **Refresh:** Re-analyze current page
- **Drag:** Move the overlay anywhere you want

### Controls
- **Single Click** floating button: Toggle dashboard
- **Double Click** floating button: Disable on this site
- **Drag** header or button: Reposition elements

---

## 🛠️ Technical Details

### Architecture
- **Content Script:** Analyzes product listings and injects UI elements
- **Background Service Worker:** Manages extension state
- **Popup:** Simple re-enable interface
- **No External Dependencies:** Pure vanilla JavaScript

### Supported Features
- ✅ Lazy-load detection for infinite scroll sites
- ✅ Mutation observer for dynamic content
- ✅ Accurate quantity extraction (handles "24-pack", "100 count", etc.)
- ✅ Price-per-unit detection on Walmart
- ✅ Multi-region currency support

### Browser Compatibility
- Chrome 88+
- Chromium-based browsers (Edge, Brave, Opera)
- Manifest V3 compliant

---

## 📊 Supported Sites & Examples

| Site | Example Product | Pack Saver Features |
|------|----------------|-------------------|
| **Amazon** | Dishwasher pods | ✅ Price/item, Best deal highlight, Jump navigation |
| **Walmart** | Wooden pencils | ✅ Detects "c/ea" pricing, Multipack analysis |
| **AliExpress** | Balloon packs | ✅ Lazy-load support, Large pack detection |
| **Temu** | Craft supplies | ✅ Auto-scroll loading, Dynamic content |
| **eBay** | Bulk items | ✅ Standard price analysis |

---

## 🔧 Development

### Project Structure
```
pack-saver/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── styles.css            # Extension styling
├── background.js         # Service worker
├── popup.html            # Extension popup
├── popup.js              # Popup logic
├── icon16.png            # 16x16 icon
├── icon48.png            # 48x48 icon
├── icon128.png           # 128x128 icon
└── README.md             # This file
```

### Key Files

**content.js** - The heart of Pack Saver
- Product detection and analysis
- Price calculation algorithms
- UI injection and management
- Lazy-load and mutation detection

**styles.css** - Beautiful, minimal design
- Gradient badges
- Draggable components
- Smooth animations
- Responsive layout

### Running Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/pack-saver.git
cd pack-saver

# Load in Chrome (see Installation section above)
# No build process needed - pure vanilla JS!
```

---

## 🐛 Troubleshooting

### Extension not working?
1. Check that you're on a supported site
2. Refresh the page
3. Make sure the extension is enabled
4. Try disabling and re-enabling

### Prices seem wrong?
- Pack Saver calculates based on displayed prices
- Sale prices and special offers are included
- Shipping costs are not included in calculations

### Can't see the button?
- The button is draggable - it might be off-screen
- Try disabling and re-enabling the extension
- Check if you double-clicked it (which disables on the site)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Report Bugs
Found a bug? [Open an issue](https://github.com/yourusername/pack-saver/issues) with:
- Description of the problem
- Steps to reproduce
- Browser version
- Screenshots (if applicable)

### Suggest Features
Have an idea? [Open an issue](https://github.com/yourusername/pack-saver/issues) with:
- Feature description
- Use case / why it's useful
- Mockups (optional)

### Submit Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use vanilla JavaScript (no frameworks)
- Comment complex logic
- Follow existing code style
- Test on all supported sites

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this code freely, even commercially. Just include the original license.

---

## 🙏 Acknowledgments

- Inspired by the frustration of comparing bulk prices
- Built for the budget-conscious shopping community
- Thanks to all users who provide feedback and suggestions

---

## 📞 Support

### Get Help
- 📧 Email: support@packsaver.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pack-saver/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/pack-saver/discussions)

### Stay Updated
- ⭐ Star this repository to follow development
- 👀 Watch for new releases
- 🐦 Follow us on Twitter: [@PackSaverApp](#)

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Amazon support
- ✅ Walmart support
- ✅ AliExpress support
- ✅ Temu support
- ✅ eBay support
- ✅ Draggable UI
- ✅ Best deal detection

### Version 1.1 (Planned)
- ⏳ Target support
- ⏳ More Amazon regions
- ⏳ User settings panel
- ⏳ Customizable badge colors

### Version 1.2 (Future)
- ⏳ Historical price tracking
- ⏳ Deal alerts
- ⏳ Price drop notifications
- ⏳ Multi-language support

### Version 2.0 (Vision)
- ⏳ Cross-site price comparison
- ⏳ Browser sync for preferences
- ⏳ Firefox and Safari versions

---

## 📊 Stats

- **Lines of Code:** ~800
- **File Size:** ~50KB
- **RAM Usage:** <5MB
- **Supported Sites:** 5+
- **Supported Regions:** 20+

---

## ❤️ Made with Love

Pack Saver was created to make online shopping easier and more transparent. If it helps you save money, consider:
- ⭐ Starring this repository
- 📢 Sharing with friends
- 💬 Leaving a review on Chrome Web Store
- ☕ Buying us a coffee (coming soon)

---

<div align="center">

**Happy Shopping! 🛍️**

*Save money effortlessly with Pack Saver*

[Install Now](#installation) • [Report Issue](https://github.com/yourusername/pack-saver/issues) • [View Changelog](CHANGELOG.md)

</div>
