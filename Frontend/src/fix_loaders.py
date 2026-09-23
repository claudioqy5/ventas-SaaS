import os
import re
import io

views_dir = r'c:\Users\FAMHURP\Desktop\CFQY\VENTASSAAS\ventas-SaaS\Frontend\src\views'

files_to_fix = [
    'WhatsAppChats.vue', 'Users.vue', 'Suppliers.vue', 'StockMovements.vue',
    'SalesHistory.vue', 'Reminders.vue', 'Purchases.vue', 'Products.vue',
    'POS.vue', 'PaymentMethods.vue', 'OnlineOrders.vue', 'CreditSales.vue',
    'Clients.vue', 'Categories.vue', 'BusinessHistory.vue'
]

for filename in files_to_fix:
    filepath = os.path.join(views_dir, filename)
    if not os.path.exists(filepath):
        continue
    
    with io.open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    loader_pattern = re.compile(r'\s*(?:<!-- Loader -->\s*)?<HamsterLoader v-if="loading"[^>]*/>\s*')
    
    match = loader_pattern.search(content)
    if not match:
        continue
        
    loader_str = match.group(0).strip()
    new_content = content.replace(match.group(0), '\n')
    
    if filename == 'POS.vue':
        header_pos = re.search(r'</header>\s*<div v-if="filteredProducts\.length === 0"', new_content)
        if header_pos:
            replacement = '</header>\n\n          <div v-if="loading" style="display:flex; justify-content:center; align-items:center; flex-grow:1; min-height: 250px;">\n            ' + loader_str + '\n          </div>\n\n          <div v-else-if="filteredProducts.length === 0"'
            new_content = new_content.replace(header_pos.group(0), replacement)
    else:
        header_pattern = re.compile(r'(<header class="content-header"[^>]*>.*?</header>)', re.DOTALL)
        header_match = header_pattern.search(new_content)
        if header_match:
            replacement = header_match.group(1) + '\n\n      <div v-if="loading" style="display: flex; justify-content: center; padding: 60px;">\n        ' + loader_str + '\n      </div>\n'
            new_content = new_content.replace(header_match.group(1), replacement, 1)
            
            # Find next main div wrapper to put v-else
            next_div = re.compile(r'(<div\s+class="(?:card|table-container|stats-grid|filters-bar|search-bar)[^>]*"|<!--\s*(?:Table|Filtros).*?-->\s*<div[^>]*>)')
            next_div_match = next_div.search(new_content[header_match.end():])
            if next_div_match:
                full_div_str = next_div_match.group(1)
                if '<div ' in full_div_str and 'v-else' not in full_div_str:
                    new_div_str = full_div_str.replace('<div ', '<div v-else ')
                    new_content = new_content.replace(full_div_str, new_div_str, 1)

    with io.open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Fixed ' + filename)
