# extract_songs.py per spec §9 - improved parsing
import pdfplumber
import json
import re
import sys
import unicodedata

def normalize_text(text: str) -> str:
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    text = re.sub(r'\s+', ' ', text.strip())
    return text

def is_chorus_title(raw_line: str) -> bool:
    return raw_line.strip().endswith('-C-')

def clean_title(raw_title: str) -> str:
    return re.sub(r'\s*-C-\s*$', '', raw_title).strip()

def extract_number(raw_line: str) -> int | None:
    match = re.match(r'^(\d+)\s*[-–]', raw_line.strip())
    return int(match.group(1)) if match else None

def parse_verses(body: str) -> list[dict]:
    verses = []
    parts = re.split(r'\n(\d+)\.\s*\n', '\n' + body)
    for i in range(1, len(parts), 2):
        verse_num = int(parts[i])
        verse_text = normalize_text(parts[i + 1] if i + 1 < len(parts) else '')
        if verse_text:
            verses.append({'number': verse_num, 'text': verse_text})
    if not verses and body.strip():
        verses.append({'number': 1, 'text': normalize_text(body)})
    return verses

def extract_inline_chorus(body: str) -> str | None:
    match = re.search(r'(Chorus|CHORUS)[:\s]*\n?([\s\S]+?)(?=\n\d+\.|$)', body, re.IGNORECASE)
    return normalize_text(match.group(2)) if match else None

def detect_language(title: str, text: str) -> str:
    combined = (title + text).lower()
    french_keywords = ['dieu', 'jésus', 'seigneur']
    zulu_keywords = ['nkosi', 'jesu', 'uthando']
    swahili_keywords = ['bwana', 'yesu', 'siku']
    lingala_keywords = ['jesu', 'baba']
    if any(k in combined for k in french_keywords) or any(c in combined for c in 'éèêô'):
        return 'french'
    if any(k in combined for k in zulu_keywords):
        return 'zulu'
    if any(k in combined for k in swahili_keywords):
        return 'swahili'
    if any(k in combined for k in lingala_keywords):
        return 'lingala'
    return 'english'

def extract_all(pdf_path: str) -> list[dict]:
    songs = []
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ''
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + '\n'

    numbered = re.finditer(r'^(\d+)\s*[-–]\s*(.+?)(?=\n)', full_text, re.MULTILINE)
    chorus_only = re.finditer(r'^(.+?-C-)\s*$', full_text, re.MULTILINE)

    entries = []
    for m in numbered:
        entries.append({'pos': m.start(), 'raw_header': m.group(0), 'number': int(m.group(1)), 'raw_title': m.group(2)})
    for m in chorus_only:
        if not any(abs(e['pos'] - m.start()) < 50 for e in entries):
            entries.append({'pos': m.start(), 'raw_header': m.group(0), 'number': None, 'raw_title': m.group(1)})

    entries.sort(key=lambda x: x['pos'])

    for i, entry in enumerate(entries):
        start = entry['pos'] + len(entry['raw_header'])
        end = entries[i+1]['pos'] if i+1 < len(entries) else len(full_text)
        body = full_text[start:end].strip()

        title = clean_title(entry['raw_title'])
        is_chorus = is_chorus_title(entry['raw_header'])
        lang = detect_language(title, body)
        num = entry['number']
        id_ = str(num).zfill(3) if num else f"c-{re.sub(r'[^a-z]', '-', title.lower())[:20]}"

        if is_chorus:
            songs.append({
                "id": id_,
                "number": num,
                "title": title,
                "type": "chorus",
                "language": lang,
                "category": "general",
                "verses": [],
                "chorusText": normalize_text(body),
                "tags": []
            })
        else:
            verses = parse_verses(body)
            chorus = extract_inline_chorus(body)
            songs.append({
                "id": id_,
                "number": num,
                "title": title,
                "type": "song",
                "language": lang,
                "category": "general",
                "verses": verses,
                "chorus": chorus,
                "tags": []
            })

    return songs

if __name__ == '__main__':
    data = extract_all(sys.argv[1])
    songs_n = sum(1 for d in data if d['type'] == 'song')
    choruses_n = sum(1 for d in data if d['type'] == 'chorus')
    with open('src/data/songs.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Done: {songs_n} songs + {choruses_n} choruses = {len(data)} total')
    print('Saved to src/data/songs.json')

