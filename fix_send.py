import sys
with open('05-SCRIPTS/Email/send_pipeline.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_save_block = False

# First pass: find the save block and remove it from the bottom
save_block = []
for line in lines:
    if line.strip() == '# SAVE PIPELINE & MASTER DB':
        in_save_block = True
    if in_save_block:
        if line.strip() == '# REPORT':
            in_save_block = False
            new_lines.append('# ==========================================\n')
            new_lines.append(line)
        else:
            save_block.append(line)
    else:
        new_lines.append(line)

# Let's write the save_state function definition right before # SEND EMAILS
final_lines = []
for line in new_lines:
    if line.strip() == '# SEND EMAILS':
        final_lines.append('# ==========================================\n')
        final_lines.append('# SAVE STATE FUNCTION\n')
        final_lines.append('# ==========================================\n\n')
        final_lines.append('def save_state():\n')
        final_lines.append('    with open(PIPELINE, "w", newline="", encoding="utf-8") as f:\n')
        final_lines.append('        writer = csv.DictWriter(f, fieldnames=rows[0].keys())\n')
        final_lines.append('        writer.writeheader()\n')
        final_lines.append('        writer.writerows(rows)\n')
        final_lines.append('    if master_db_fieldnames:\n')
        final_lines.append('        if "Notes" not in master_db_fieldnames:\n')
        final_lines.append('            master_db_fieldnames.append("Notes")\n')
        final_lines.append('        for r in master_db_rows:\n')
        final_lines.append('            if "Notes" not in r:\n')
        final_lines.append('                r["Notes"] = ""\n')
        final_lines.append('        with open(MASTER_DB_PATH, "w", newline="", encoding="utf-8") as f:\n')
        final_lines.append('            writer = csv.DictWriter(f, fieldnames=master_db_fieldnames)\n')
        final_lines.append('            writer.writeheader()\n')
        final_lines.append('            writer.writerows(master_db_rows)\n\n')
        final_lines.append('# ==========================================\n')
        final_lines.append(line)
    else:
        final_lines.append(line)

# Now inject save_state() calls inside the loop
out_lines = []
for line in final_lines:
    out_lines.append(line)
    if 'print("✓ Sent")' in line:
        out_lines.append('        save_state()\n')
    if 'print(f"Waiting {delay} seconds before next email...")' in line:
        out_lines.append('    save_state()\n') # also save on error before delay

with open('05-SCRIPTS/Email/send_pipeline.py', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

