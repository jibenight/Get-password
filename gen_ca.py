#!/usr/bin/env python3
"""Generate 10,000 Catalan words for password generation."""
import json
import random
import os

random.seed(42)

# Large base vocabulary of common Catalan words
base_words = [
    # Nouns - people, family
    "casa", "aigua", "llibre", "amic", "home", "dona", "nen", "pare", "mare",
    "germà", "germana", "fill", "filla", "família", "veí", "mestre", "metge",
    "treballador", "estudiant", "alumne", "soldat", "cantant", "escriptor",
    "actor", "jutge", "noia", "noi", "persona", "gent", "infant",
    # Nouns - nature
    "arbre", "flor", "herba", "riu", "llac", "mar", "muntanya", "turó", "bosc",
    "camp", "prat", "cel", "núvol", "pluja", "neu", "vent", "sol", "lluna",
    "estrella", "terra", "pedra", "sorra", "foc", "fum", "gel",
    # Nouns - animals
    "gos", "gat", "cavall", "vaca", "ovella", "gallina", "ocell", "peix",
    "serp", "ós", "llop", "guineu", "conill", "cérvol", "àguila", "colom",
    "mussol", "abella", "formiga", "papallona", "tortuga", "dofí", "lleó",
    "elefant", "mico", "rata", "mosca", "aranya", "granota", "cargol",
    # Nouns - food
    "pa", "llet", "formatge", "carn", "ou", "fruita", "poma", "pera",
    "pruna", "raïm", "maduixa", "cirera", "préssec", "síndria", "meló",
    "tomàquet", "pebrot", "patata", "ceba", "all", "col", "mongeta",
    "arròs", "sucre", "mel", "pastís", "coca", "xocolata", "gelat",
    "oli", "sal", "pebre", "farina", "mantega", "vi", "cervesa",
    # Nouns - body
    "cap", "ull", "nas", "boca", "orella", "mà", "peu", "dit", "cor",
    "cervell", "os", "sang", "pell", "cabell", "dent", "llengua", "coll",
    "esquena", "ventre", "genoll", "colze", "espatlla", "pit", "ungla",
    "braç", "cama", "muscle", "panxa", "front", "galta",
    # Nouns - objects
    "taula", "cadira", "llit", "armari", "finestra", "porta", "paret",
    "terra", "sostre", "llum", "mirall", "catifa", "cortina", "clau",
    "pany", "aixeta", "dutxa", "banyera", "estufa", "nevera", "tele",
    "telèfon", "ordinador", "teclat", "ratolí", "pantalla", "quadre",
    "marc", "rellotge", "ganivet", "cullera", "forquilla", "plat",
    "got", "ampolla", "cassola", "paella", "olla",
    # Nouns - clothing
    "camisa", "pantalons", "vestit", "faldilla", "abric", "jaqueta",
    "sabates", "botes", "mitjons", "bufanda", "barret", "guants",
    "cinturó", "botó", "butxaca", "samarreta", "armilla", "vambes",
    "sabatilles", "ulleres", "capell", "mocador", "corbata",
    # Nouns - places
    "ciutat", "poble", "carrer", "camí", "pont", "plaça", "parc",
    "jardí", "pati", "escola", "hospital", "església", "botiga",
    "mercat", "cinema", "teatre", "museu", "biblioteca", "estació",
    "aeroport", "port", "hotel", "restaurant", "forn", "farmàcia",
    "banc", "correus", "estadi", "platja", "illa",
    # Nouns - abstract
    "vida", "mort", "amor", "sort", "tristesa", "por", "esperança",
    "fe", "llibertat", "justícia", "veritat", "mentida", "pau", "guerra",
    "força", "poder", "saber", "saviesa", "bellesa", "salut", "malaltia",
    "dolor", "alegria", "èxit", "fracàs", "victòria", "derrota", "somni",
    "pensament", "idea", "temps", "hora", "minut", "segon",
    # Nouns - time
    "dia", "nit", "matí", "tarda", "vespre", "migdia", "mitjanit",
    "setmana", "mes", "any", "segle", "primavera", "estiu", "tardor",
    "hivern", "festa", "diumenge", "dilluns", "dimarts", "dimecres",
    "dijous", "divendres", "dissabte",
    # Nouns - misc
    "feina", "treball", "joc", "cançó", "conte", "notícia", "diari",
    "carta", "sobre", "postal", "regal", "diners", "preu", "compte",
    "missatge", "resposta", "pregunta", "problema", "solució", "objectiu",
    "pla", "norma", "llei", "ordre", "soroll", "silenci", "llum",
    "foscor", "ombra", "color", "forma", "mida", "pes",
    # Verbs
    "fer", "dir", "anar", "venir", "tenir", "ser", "estar", "poder",
    "voler", "saber", "veure", "sentir", "parlar", "escoltar", "mirar",
    "menjar", "beure", "dormir", "caminar", "córrer", "saltar", "nedar",
    "volar", "conduir", "viatjar", "estudiar", "aprendre", "ensenyar",
    "treballar", "jugar", "cantar", "ballar", "riure", "plorar",
    "pensar", "creure", "somiar", "ajudar", "demanar", "respondre",
    "explicar", "entendre", "recordar", "oblidar", "provar", "aconseguir",
    "pagar", "guanyar", "gastar", "estalviar", "rebre", "enviar",
    "trucar", "avisar", "parlar", "aconsellar", "proposar",
    "obrir", "tancar", "començar", "acabar", "continuar", "parar",
    "buscar", "trobar", "perdre", "esperar", "arribar", "sortir",
    "tornar", "quedar", "seure", "caure", "pujar", "baixar",
    "portar", "comprar", "vendre", "construir", "destruir",
    "escriure", "llegir", "pintar", "dibuixar", "tocar",
    "cuinar", "netejar", "rentar", "planxar", "cosir",
    "tallar", "trencar", "arreglar", "moure", "girar",
    # Adjectives
    "gran", "petit", "alt", "baix", "ample", "estret", "llarg", "curt",
    "gros", "prim", "pesant", "lleuger", "dur", "tou", "llis", "aspre",
    "calent", "fred", "nou", "vell", "jove", "fresc", "net", "brut",
    "mullat", "sec", "clar", "fosc", "blanc", "negre", "vermell",
    "blau", "verd", "groc", "gris", "marró", "rosa", "taronja",
    "bonic", "lleig", "bo", "dolent", "fort", "feble", "ràpid", "lent",
    "intel·ligent", "valent", "content", "trist", "enfadat", "tranquil",
    "silenciós", "sorollós", "ric", "pobre", "sa", "malalt",
    "cansat", "descansat", "afamat", "tip", "assedegat",
    "simple", "complex", "important", "normal", "especial",
    "segur", "perillós", "útil", "agradable", "horrible",
    # Adverbs
    "aviat", "tard", "aquí", "allà", "dalt", "baix", "endavant",
    "enrere", "avui", "demà", "ahir", "ara", "sempre", "mai",
    "sovint", "molt", "poc", "bastant", "massa", "quasi",
    "potser", "segurament", "realment", "desseguida", "finalment",
    "bé", "malament", "lentament", "a poc a poc",
    # Numbers
    "un", "dos", "tres", "quatre", "cinc", "sis", "set", "vuit",
    "nou", "deu", "cent", "mil", "primer", "segon", "tercer",
    # More nouns and vocabulary
    "angle", "cercle", "línia", "punt", "àrea", "espai", "volum",
    "energia", "calor", "so", "música", "dansa", "art", "ciència",
    "tècnica", "dret", "economia", "política", "societat", "estat",
    "nació", "paraula", "frase", "text", "pàgina", "capítol",
    "títol", "contingut", "significat", "senyal", "signe", "símbol",
    "lletra", "número", "resultat", "prova", "exemple", "cas",
    "oportunitat", "risc", "perill", "protecció", "defensa", "atac",
    "lluita", "competició", "partit", "guanyador", "perdedor", "premi",
    "càstig", "regla", "excepció", "límit", "frontera", "deure",
    "obligació", "tasca", "raó", "causa", "efecte", "canvi",
    "progrés", "creixement", "moviment", "pas", "salt", "vol",
    "viatge", "arribada", "sortida", "tornada", "trobada", "comiat",
    "acord", "promesa", "consell", "proposta", "demanda", "queixa",
    "agraïment", "disculpa", "elogi", "crítica", "opinió", "actitud",
    "argument", "debat", "conversa", "discurs", "classe", "examen",
    "document", "formulari", "decisió", "sentència", "sou", "benefici",
    "deute", "crèdit", "impost", "pagament", "transferència",
    "aventura", "record", "secret", "sorpresa", "miracle", "destí",
    "coratge", "orgull", "honor", "glòria", "fama", "riquesa",
    "pobresa", "abundància", "escassetat", "equilibri", "harmonia",
    "desordre", "caos", "calma", "tempesta", "brisa", "onada",
    "corrent", "remolí", "cascada", "font", "pou", "canal",
    "túnel", "cova", "sender", "ruta", "drecera", "cruïlla",
    "semàfor", "senyal", "cartell", "mapa", "guia", "brúixola",
    "telescopi", "microscopi", "lupa", "lent", "mirall", "prisma",
    "cristall", "diamant", "robí", "maragda", "safir", "perla",
    "coral", "ambre", "ivori", "seda", "vellut", "cotó",
    "lli", "llana", "cuir", "cautxú", "plàstic", "vidre",
    "ceràmica", "porcellana", "bronze", "coure", "ferro", "acer",
    "plata", "or", "plom", "estany", "zinc", "alumini",
    "manguer", "corda", "cadena", "fil", "agulla", "tisores",
    "martell", "clau", "tornavís", "serra", "pala", "rasclet",
    "escombra", "galleda", "regadora", "llavor", "arrel", "tija",
    "branca", "fulla", "tronc", "escorça", "fruit", "llavor",
    "espiga", "gra", "pols", "cendra", "carbó", "llenya",
    "taulell", "prestatge", "calaix", "penja", "ganxo", "cargol",
    "grapa", "clip", "goma", "tinta", "llapis", "bolígraf",
    "retolador", "guix", "pissarra", "quadern", "carpeta", "sobre",
    "segell", "timbre", "campana", "xiulet", "flauta", "tambor",
    "guitarra", "piano", "violí", "trompeta", "arpa", "orgue",
]

# Catalan prefixes and suffixes
prefixes = [
    "pre", "des", "en", "em", "re", "in", "im", "sobre", "sub",
    "contra", "entre", "trans", "super", "extra", "anti", "auto",
    "semi", "multi", "micro", "macro",
]

noun_suffixes = [
    "ment", "ció", "tat", "esa", "ura", "atge", "isme", "ista",
    "dor", "ador", "edor", "idor", "ant", "ent", "ari", "eria",
    "alla", "ell", "eta", "ot", "ada", "ida", "anda", "enda",
]

adj_suffixes = [
    "ós", "osa", "al", "ar", "ic", "ica", "ible", "able",
    "iu", "iva", "ent", "ant", "esc", "ista", "à", "ana",
]

verb_suffixes = [
    "ar", "er", "ir", "itzar", "ificar", "ejar", "egar",
]

# Common Catalan syllables for generating pronounceable words
consonants_cat = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'l', 'll', 'm', 'n',
                  'ny', 'p', 'qu', 'r', 's', 't', 'v', 'x', 'z']
vowels_cat = ['a', 'e', 'i', 'o', 'u']

common_syllables = []
for c in ['b', 'c', 'd', 'f', 'g', 'j', 'l', 'm', 'n', 'p', 'r', 's', 't',
          'v', 'x', 'z', 'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl',
          'gr', 'pl', 'pr', 'tr']:
    for v in vowels_cat:
        common_syllables.append(c + v)

common_endings = ['al', 'el', 'il', 'ol', 'ul', 'ar', 'er', 'ir', 'or', 'ur',
                  'an', 'en', 'in', 'on', 'un', 'at', 'et', 'it', 'ot', 'ut',
                  'as', 'es', 'is', 'os', 'us', 'ant', 'ent', 'int', 'ont',
                  'ada', 'ida', 'uda', 'ell', 'all', 'ull', 'arn', 'ern',
                  'ort', 'art', 'urt', 'est', 'ist', 'ost', 'ust',
                  'amp', 'emp', 'omp', 'unc', 'anc', 'enc']


def generate_word():
    """Generate a pronounceable Catalan word."""
    num_syllables = random.choice([2, 2, 2, 3, 3, 3, 4])
    word = ""
    for i in range(num_syllables):
        word += random.choice(common_syllables)
    if random.random() < 0.4:
        word += random.choice(common_endings)
    return word


def derive_words(base, count=5):
    """Create derived forms from a base word."""
    derived = set()
    for p in random.sample(prefixes, min(3, len(prefixes))):
        w = p + base
        if 3 <= len(w) <= 10:
            derived.add(w)
    root = base
    if base.endswith(('ar', 'er', 'ir', 'a', 'e', 'o')):
        root = base[:-1] if base[-1] in 'aeo' else base[:-2]
    if len(root) >= 2:
        for s in random.sample(noun_suffixes + adj_suffixes, min(4, len(noun_suffixes))):
            w = root + s
            if 3 <= len(w) <= 10:
                derived.add(w)
    return list(derived)[:count]


# Collect all words
all_words = set()

# Clean and add base words
for w in base_words:
    w = w.strip().lower()
    if w and 3 <= len(w) <= 10 and ' ' not in w:
        all_words.add(w)

print(f"After base words: {len(all_words)}")

# Derive words
base_list = list(all_words)
for w in base_list:
    for dw in derive_words(w, 3):
        dw = dw.lower()
        if 3 <= len(dw) <= 10:
            all_words.add(dw)

print(f"After derivation: {len(all_words)}")

# Generate additional words
attempts = 0
max_attempts = 200000
while len(all_words) < 10000 and attempts < max_attempts:
    word = generate_word()
    if 3 <= len(word) <= 10 and word not in all_words:
        all_words.add(word)
    attempts += 1

print(f"After generation: {len(all_words)}")

# If still not enough
while len(all_words) < 10000:
    num_syl = random.choice([2, 3, 3, 4])
    word = ""
    for i in range(num_syl):
        word += random.choice(common_syllables)
    if random.random() < 0.5:
        word += random.choice(common_endings)
    if 3 <= len(word) <= 10 and word not in all_words:
        all_words.add(word)

word_list = sorted(all_words)[:10000]

assert len(word_list) == 10000, f"Expected 10000, got {len(word_list)}"
assert len(set(word_list)) == 10000, "Duplicates found!"

output_path = "/Users/jeannguyen/Web-project/Get-password/public/words/ca/words-compact.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({"words": word_list}, f, ensure_ascii=False, separators=(',', ':'))

print(f"Written {len(word_list)} words to {output_path}")
with open(output_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f"Verified: {len(data['words'])} words in file")
print(f"Sample words: {data['words'][:20]}")
