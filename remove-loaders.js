const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'Dashboard.vue',
  'OnlineOrders.vue',
  'CreditSales.vue',
  'Categories.vue',
  'Suppliers.vue',
  'Clients.vue',
  'Reminders.vue'
];

const basePath = path.join(__dirname, 'Frontend', 'src', 'views');

for (const file of filesToProcess) {
    const fullPath = path.join(basePath, file);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove the HamsterLoader import
    content = content.replace(/import\s+HamsterLoader\s+from\s+['"].*?HamsterLoader\.vue['"];?\n?/, '');
    
    // Remove the v-if="loading" div that wraps the HamsterLoader
    const blockRegex = /<div\s+v-if="loading"[^>]*>[\s\S]*?<HamsterLoader[^>]*\/>[\s\S]*?<\/div>\s*/;
    content = content.replace(blockRegex, '');
    
    // Sometimes the loader is not in a wrapper, just remove it standalone if any remains
    content = content.replace(/<HamsterLoader[^>]*\/>\s*/g, '');
    
    // For Dashboard.vue, we must also remove the v-else from the next div
    if (file === 'Dashboard.vue') {
        content = content.replace(/<div\s+v-else\s+(style="display: grid;)/, '<div $1');
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Removed loader from', file);
}
