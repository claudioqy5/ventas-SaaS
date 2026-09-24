const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Frontend', 'src', 'views', 'Users.vue');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = "'colaboradores': 'Colaboradores'";
if (content.includes(targetStr)) {
  content = content.replace(targetStr, "'colaboradores': 'Colaboradores',\n    'libro_reclamaciones': 'Libro Reclamaciones'");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated formatPermissionName!');
} else {
  console.log('Could not find target string in Users.vue');
}
