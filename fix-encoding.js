const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.vue') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            let newContent = content
                .replace(/Ã¡/g, 'á')
                .replace(/Ã©/g, 'é')
                .replace(/\xc3\xad/g, 'í') // Ã­
                .replace(/Ã³/g, 'ó')
                .replace(/Ãº/g, 'ú')
                .replace(/Ã±/g, 'ñ')
                .replace(/Ã‘/g, 'Ñ')
                .replace(/Ã“/g, 'Ó')
                .replace(/\xc3\x81/g, 'Á') // Ã 
                .replace(/Ã‰/g, 'É')
                .replace(/\xc3\x8d/g, 'Í') // Ã 
                .replace(/Ãš/g, 'Ú')
                .replace(/Â¿/g, '¿')
                .replace(/Â¡/g, '¡')
                .replace(/Âº/g, 'º')
                .replace(/Ã¼/g, 'ü')
                .replace(/Ã¢/g, 'â')
                .replace(/â€“/g, '–')
                .replace(/â€”/g, '—')
                .replace(/â€œ/g, '“')
                .replace(/â€/g, '”')
                .replace(/Ã/g, 'í'); // Any leftover Ã alone might be a typo for í in some corrupted contexts, but wait, Ã is \xc3. Let's not replace standalone Ã broadly unless needed.
                
            // Let's remove the raw `Ã` replacement at the end to avoid over-matching.
            newContent = content
                .replace(/Ã¡/g, 'á')
                .replace(/Ã©/g, 'é')
                .replace(/\xc3\xad/g, 'í') // Ã­
                .replace(/Ã³/g, 'ó')
                .replace(/Ãº/g, 'ú')
                .replace(/Ã±/g, 'ñ')
                .replace(/Ã‘/g, 'Ñ')
                .replace(/Ã“/g, 'Ó')
                .replace(/\xc3\x81/g, 'Á') // Ã 
                .replace(/Ã‰/g, 'É')
                .replace(/\xc3\x8d/g, 'Í') // Ã 
                .replace(/Ãš/g, 'Ú')
                .replace(/Â¿/g, '¿')
                .replace(/Â¡/g, '¡')
                .replace(/Âº/g, 'º')
                .replace(/Ã¼/g, 'ü');
                
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Fixed: ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'Frontend', 'src'));
console.log('Done.');
