const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'Frontend', 'src', 'views');

const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.vue'));

const linkHTML = `        <div class="nav-section-title">Atención</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('libro_reclamaciones')" to="/complaints" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="sidebar-text">Reclamaciones</span>
        </router-link>

        <div class="nav-section-title" v-if="authStore.isSuperadmin || authStore.hasPermission('colaboradores')">Ajustes</div>`;

for (const file of files) {
  if (file === 'Complaints.vue' || file === 'Login.vue' || file === 'VerifyEmail.vue') continue;
  
  const filePath = path.join(viewsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already added
  if (content.includes('to="/complaints"')) {
    continue;
  }

  // Find the exact string to replace
  const searchStr = `</nav>`;
  
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, linkHTML + '\n      </nav>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find marker in ${file}`);
  }
}
console.log('Done!');
