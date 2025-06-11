import re

# Read the file
with open('virgo.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all quoted numbers with unquoted numbers in stars sections
patterns = [
    (r'"hustle": "([0-9.]+)"', r'"hustle": \1'),
    (r'"sex": "([0-9.]+)"', r'"sex": \1'),
    (r'"success": "([0-9.]+)"', r'"success": \1'),
    (r'"vibe": "([0-9.]+)"', r'"vibe": \1')
]

for pattern, replacement in patterns:
    content = re.sub(pattern, replacement, content)

# Write back to file
with open('virgo.json', 'w', encoding='utf-8') as f:
    f.write(content)

print('All stars values converted to numbers successfully!') 