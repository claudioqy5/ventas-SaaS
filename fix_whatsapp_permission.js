const fs = require('fs');
const path = require('path');
const dir = 'Frontend/src/views';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));
let count = 0;
files.forEach(f => {
    let fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf8');
    let regex = /<router-link v-if="!authStore\.isSuperadmin && authStore\.hasPermission\('pedidos_web'\)" to="\/whatsapp-chats"/g;
    if (regex.test(content)) {
        content = content.replace(regex, `<router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('chats_bot')" to="/whatsapp-chats"`);
        fs.writeFileSync(fp, content, 'utf8');
        count++;
    }
});
console.log(`Fixed ${count} files.`);
