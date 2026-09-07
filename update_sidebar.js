const fs = require('fs');
const path = require('path');
const dir = 'Frontend/src/views';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));
files.forEach(f => {
  let fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  const searchStr = `<router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> <span class="sidebar-text">Categorías</span></router-link>`;
  const replaceStr = searchStr + `\n        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/marcas" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01"/></svg> <span class="sidebar-text">Marcas</span></router-link>`;
  if (content.includes(searchStr) && !content.includes('to="/marcas"')) {
    fs.writeFileSync(fp, content.replace(searchStr, replaceStr));
    console.log('Updated ' + f);
  }
});
