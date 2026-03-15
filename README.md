## Installation

1. Download the ZIP
2. Extract the folder
3. Open `chrome://extensions`
4. Enable **Developer Mode**
5. Click **Load Unpacked**

---

### Extension Preview

Once the extension is loaded, the control panel should appear in the **top-left corner** of the page.

<p align="center">
  <img src="1.png" width="420">
  <img src="2.png" width="420">
</p>

---

## ⚠️ Limitations

**Maximum Supported Entries: 100**

This extension can rig the wheel only when the total number of entries is **100 or fewer**.
If the wheel contains **more than 100 entries**, the rigging logic will not activate and the spin will behave normally.

This limitation exists due to the way the extension calculates offsets and patterns for determining the final wheel position. Keeping the entry count at **100 or below** ensures accurate and consistent results.

**Recommendation:**
For best performance and reliability, keep the wheel entry count within the supported range.
