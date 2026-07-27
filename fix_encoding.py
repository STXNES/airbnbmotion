path = 'LandingPage/index.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('ÔÇö', '—')
c = c.replace('ÔåÆ', '→')
c = c.replace('Ôåô', '↓')
c = c.replace('ÔëÑ', '≥')
c = c.replace('┬À', '·')
c = c.replace('┬®', '©')
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
