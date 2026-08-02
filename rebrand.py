#!/usr/bin/env python3
import os, re

ROOT = "."
EXTS = (".jsx", ".js", ".ts", ".jsonc", ".html")
SKIP_DIRS = {"node_modules", "dist", ".git", ".base44"}

RULES = [
    (r"https://nurturink-for-real-estate-mortgage\.base44\.app", "https://writebecause.com"),
    (r"https://nurturink\.com/realestate", "https://writebecause.com"),
    (r"https://nurturink\.com", "https://writebecause.com"),
    (r"nurturink\.com/realestate", "writebecause.com"),
    (r"NurturInk\.com", "WriteBecause.com"),
    (r"Powered by NurturInk", "Powered by Write Because"),
    (r"NURTURINK", "WRITE BECAUSE"),
    (r"NurturInk", "Write Because"),
    (r"Nurturink", "Write Because"),
    (r"nurturInk", "Write Because"),
]

IDENT_RULES = [
    (r"\bNurturinkCTA\b", "WriteBecauseCTA"),
    (r"\bNurturInkCTA\b", "WriteBecauseCTA"),
    (r"\bRunnerNurturInkCTA\b", "RunnerWriteBecauseCTA"),
    (r"\bnurturink_theme\b", "writebecause_theme"),
    (r"\bNURTURINK_RE_URL\b", "WRITE_BECAUSE_URL"),
]

def walk():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(EXTS):
                yield os.path.join(dirpath, fn)

changed = []
for path in walk():
    try:
        original = open(path, "r", encoding="utf-8").read()
    except Exception:
        continue
    text = original
    for pat, rep in IDENT_RULES:
        text = re.sub(pat, rep, text)
    for pat, rep in RULES:
        text = re.sub(pat, rep, text)
    if text != original:
        open(path, "w", encoding="utf-8").write(text)
        n = sum(1 for a, b in zip(original.split("\n"), text.split("\n")) if a != b)
        changed.append((path, n))

for path, n in sorted(changed):
    print(f"{n:4d}  {path}")
print(f"\n{len(changed)} files changed")

leftovers = []
for path in walk():
    try:
        t = open(path, "r", encoding="utf-8").read()
    except Exception:
        continue
    for i, line in enumerate(t.split("\n"), 1):
        if re.search(r"nurturink", line, re.I) and "pipeline.nurturink.com" not in line:
            leftovers.append(f"{path}:{i}: {line.strip()[:110]}")
if leftovers:
    print("\nREMAINING:")
    for l in leftovers:
        print("  " + l)
else:
    print("\nNo remaining brand refs outside pipeline.nurturink.com")
