import re

with open('index_backup.html', 'r', encoding='utf-16') as f:
    old_html = f.read()

with open('LandingPage/index.html', 'r', encoding='utf-8') as f:
    curr_html = f.read()

# 1. Extract Form CSS from current HTML
form_css_match = re.search(r'(\.plan-switch\{.*?\.form-success\.show\{display:block;\})', curr_html, re.DOTALL)
form_css = form_css_match.group(1) if form_css_match else ''

# 2. Extract Form HTML
form_html_match = re.search(r'(<form class="prospect-form".*?</form>)', curr_html, re.DOTALL)
form_html = form_html_match.group(1) if form_html_match else ''

# 3. Extract Form JS
form_js_match = re.search(r'(\(function\(\)\{\s*var planSwitch.*?\}\)\(\);)', curr_html, re.DOTALL)
form_js = form_js_match.group(1) if form_js_match else ''

# 4. Insert Form CSS into old HTML right before </style>
new_html = old_html.replace('</style>', f'\n{form_css}\n</style>')

# 5. Insert Form HTML into old HTML CTA section
old_cta_button = '<a class="btn btn-primary" href="#">Request my free video</a>'
new_html = new_html.replace(old_cta_button, form_html)

# 6. Insert Form JS into old HTML <script> block at the end
new_html = new_html.replace('</script>', f'\n  {form_js}\n</script>')

# 7. Add Altus Real Estate to logo
new_html = new_html.replace('<div class="logo">Altus<span>RealEstate</span></div>', '<div class="logo">Altus <span>Real Estate</span></div>')

with open('LandingPage/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Successfully merged form into the old responsive structure!')
