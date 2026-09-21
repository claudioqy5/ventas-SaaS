const fs = require('fs');
const path = require('path');
const dir = 'Frontend/src/views';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

const insertLink = `
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/whatsapp-chats" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span class="sidebar-text">Chats WhatsApp</span></router-link>`;

let updatedCount = 0;

files.forEach(f => {
    let fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf8');
    
    // Check if we already inserted it
    if (content.includes('to="/whatsapp-chats"')) {
        return;
    }
    
    // Find the end of the online-orders router-link block
    // It looks like:
    // <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders"...
    //   ...
    // </router-link>
    
    const regex = /(<router-link[^>]*to="\/online-orders"[^>]*>[\s\S]*?<\/router-link>)/;
    
    if (regex.test(content)) {
        content = content.replace(regex, `$1${insertLink}`);
        fs.writeFileSync(fp, content, 'utf8');
        updatedCount++;
        console.log(`Updated sidebar in ${f}`);
    }
});

console.log(`Successfully updated ${updatedCount} files.`);
