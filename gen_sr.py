#!/usr/bin/env python3
"""Generate 10,000 Serbian (Latin script) words for password generation."""
import json
import random
import os

random.seed(42)

# Large base vocabulary of common Serbian words in Latin script
base_words = [
    # Nouns - people, family
    "kuća", "voda", "knjiga", "prijatelj", "čovek", "žena", "dete", "otac", "majka",
    "brat", "sestra", "sin", "ćerka", "porodica", "komšija", "učitelj", "lekar",
    "radnik", "Student", "đak", "vojnik", "pevač", "pisac", "glumac", "sudija",
    # Nouns - nature
    "drvo", "cvet", "trava", "reka", "jezero", "more", "planina", "brdo", "šuma",
    "polje", "livada", "nebo", "oblak", "kiša", "sneg", "vetar", "sunce", "mesec",
    "zvezda", "zemlja", "kamen", "pesak", "vatra", "dim", "led",
    # Nouns - animals
    "pas", "mačka", "konj", "krava", "ovca", "kokoška", "ptica", "riba", "zmija",
    "medved", "vuk", "lisica", "zec", "jelen", "orao", "golub", "sova", "pčela",
    "mrav", "leptir", "kornjača", "delfin", "lav", "slon", "majmun",
    # Nouns - food
    "hleb", "mleko", "sir", "meso", "jaje", "voće", "jabuka", "kruška", "šljiva",
    "grožđe", "jagoda", "trešnja", "višnja", "breskva", "lubenica", "dinja",
    "paradajz", "paprika", "krompir", "luk", "beli", "kupus", "pasulj", "pirinač",
    "šećer", "med", "torta", "kolač", "čokolada", "sladoled",
    # Nouns - body
    "glava", "oko", "nos", "usta", "uho", "ruka", "noga", "prst", "srce",
    "mozak", "kost", "krv", "koža", "kosa", "zub", "jezik", "vrat", "leđa",
    "stomak", "koleno", "lakat", "rame", "grudi", "stopalo", "nokat",
    # Nouns - objects
    "sto", "stolica", "krevet", "ormar", "prozor", "vrata", "zid", "pod",
    "plafon", "lampa", "ogledalo", "tepih", "zavesa", "ključ", "brava",
    "česma", "tuš", "kada", "peć", "frižider", "televizor", "telefon",
    "računar", "tastatura", "miš", "ekran", "slika", "ram", "sat", "budilnik",
    # Nouns - clothing
    "košulja", "pantalone", "haljina", "suknja", "kaput", "jakna", "cipele",
    "čizme", "čarape", "šal", "kapa", "rukavice", "kaiš", "dugme", "džep",
    "majica", "prsluk", "patike", "papuče", "naočare", "šešir", "marama",
    # Nouns - places
    "grad", "selo", "ulica", "put", "most", "trg", "park", "bašta", "dvorište",
    "škola", "bolnica", "crkva", "prodavnica", "tržnica", "pijaca", "bioskop",
    "pozorište", "muzej", "biblioteka", "stanica", "aerodrom", "luka", "hotel",
    "restoran", "kafana", "pekara", "apoteka", "banka", "pošta", "stadion",
    # Nouns - abstract
    "život", "smrt", "ljubav", "sreća", "tuga", "strah", "nada", "vera",
    "sloboda", "pravda", "istina", "laž", "mir", "rat", "snaga", "moć",
    "znanje", "mudrost", "lepota", "zdravlje", "bolest", "bol", "radost",
    "uspeh", "neuspeh", "pobeda", "poraz", "san", "misao", "ideja",
    # Nouns - time
    "dan", "noć", "jutro", "veče", "podne", "ponoć", "sat", "minut",
    "sekund", "nedelja", "mesec", "godina", "vek", "proleće", "leto",
    "jesen", "zima", "praznik", "rođendan", "godišnjica",
    # Nouns - misc
    "posao", "rad", "igra", "pesma", "priča", "vest", "novine", "pismo",
    "koverta", "razglednica", "poklon", "novac", "cena", "račun", "poruka",
    "odgovor", "pitanje", "problem", "rešenje", "cilj", "plan", "pravilo",
    "zakon", "red", "mir", "buka", "tišina", "svetlost", "tama", "senka",
    # Verbs (infinitive forms and common conjugations)
    "raditi", "pisati", "čitati", "govoriti", "slušati", "gledati", "videti",
    "čuti", "jesti", "piti", "spavati", "hodati", "trčati", "skakati",
    "plivati", "leteti", "voziti", "putovati", "učiti", "znati", "moći",
    "hteti", "voleti", "mrzeti", "dati", "uzeti", "staviti", "nositi",
    "kupiti", "prodati", "praviti", "graditi", "rušiti", "otvoriti", "zatvoriti",
    "početi", "završiti", "nastaviti", "prestati", "tražiti", "naći",
    "izgubiti", "čekati", "stići", "krenuti", "doći", "otići", "vratiti",
    "ostati", "sedeti", "stajati", "ležati", "padati", "dizati", "baciti",
    "uhvatiti", "držati", "pustiti", "pevati", "igrati", "smejati", "plakati",
    "misliti", "verovati", "sanjati", "pomoći", "pitati", "odgovoriti",
    "objasniti", "razumeti", "pamtiti", "zaboraviti", "probati", "uspeti",
    "platiti", "zaraditi", "potrošiti", "uštedetli", "dobiti", "poslati",
    "primiti", "zvati", "javiti", "pričati", "savetovati", "predložiti",
    # Adjectives
    "veliki", "mali", "visok", "nizak", "širok", "uzak", "dugačak", "kratak",
    "debeo", "tanak", "težak", "lak", "tvrd", "mekan", "gladak", "grub",
    "topao", "hladan", "vreo", "leden", "nov", "star", "mlad", "svež",
    "čist", "prljav", "mokar", "suv", "svetao", "taman", "beo", "crn",
    "crven", "plav", "zelen", "žut", "siv", "braon", "narandžast", "ljubičast",
    "lep", "ružan", "dobar", "loš", "jak", "slab", "brz", "spor",
    "pametan", "glup", "hrabar", "plašljiv", "veseo", "tužan", "ljut",
    "miran", "tih", "glasan", "bogat", "siromašan", "zdrav", "bolestan",
    "umoran", "odmoran", "gladan", "sit", "žedan", "pijan", "trezan",
    "prost", "složen", "važan", "običan", "poseban", "redak", "čest",
    "siguran", "opasan", "koristan", "štetan", "prijatan", "grozan",
    # Adverbs
    "brzo", "polako", "tiho", "glasno", "dobro", "loše", "lepo", "ružno",
    "ovde", "tamo", "gore", "dole", "napred", "nazad", "levo", "desno",
    "danas", "sutra", "juče", "sada", "uvek", "nikad", "često", "retko",
    "mnogo", "malo", "dovoljno", "previše", "skoro", "jedva", "možda",
    "sigurno", "zaista", "stvarno", "odmah", "polako", "konačno",
    # Numbers/Misc
    "jedan", "dva", "tri", "četiri", "pet", "šest", "sedam", "osam",
    "devet", "deset", "sto", "hiljada", "milion", "prvi", "drugi", "treći",
    # More nouns
    "ptica", "cveće", "šuma", "oblak", "magla", "rosa", "slana", "grad",
    "grom", "munja", "potok", "izvor", "vodapad", "dolina", "klisura",
    "pećina", "ostrvo", "obala", "plaža", "talas", "struja", "energija",
    "toplota", "zvuk", "boja", "oblik", "veličina", "težina", "brzina",
    "udaljenost", "pravac", "strana", "centar", "ivica", "ugao", "krug",
    "linija", "tačka", "crta", "površina", "prostor", "vreme", "doba",
    "trenutak", "period", "epoha", "istorija", "budućnost", "prošlost",
    "sadašnjost", "sećanje", "iskustvo", "navika", "običaj", "tradicija",
    "kultura", "umetnost", "nauka", "tehnika", "medicina", "pravo",
    "ekonomija", "politika", "društvo", "država", "narod", "jezik",
    "reč", "rečenica", "tekst", "strana", "poglavlje", "naslov",
    "sadržaj", "značenje", "smisao", "poruka", "signal", "znak",
    "simbol", "slovo", "broj", "formula", "jednačina", "rezultat",
    "dokaz", "primer", "slučaj", "prilika", "šansa", "rizik",
    "opasnost", "zaštita", "sigurnost", "odbrana", "napad", "borba",
    "takmičenje", "utakmica", "pobednik", "gubitnik", "nagrada", "kazna",
    "pravilo", "izuzetak", "granica", "sloboda", "pravo", "dužnost",
    "obaveza", "odgovornost", "zadatak", "cilj", "namena", "svrha",
    "razlog", "uzrok", "posledica", "efekat", "uticaj", "promena",
    "razvoj", "napredak", "pad", "rast", "kretanje", "pokret",
    "korak", "skok", "let", "vožnja", "putovanje", "dolazak",
    "odlazak", "povratak", "susret", "rastanak", "poziv", "pozivnica",
    "dogovor", "sporazum", "ugovor", "obećanje", "pretnja", "upozorenje",
    "savet", "predlog", "zahtev", "molba", "žalba", "prigovor",
    "zahvalnost", "izvinjenje", "pohvala", "kritika", "ocena", "sud",
    "mišljenje", "stav", "teza", "argument", "rasprava", "razgovor",
    "diskusija", "debata", "govor", "predavanje", "lekcija", "čas",
    "ispit", "test", "zadatak", "domaći", "seminarski", "diplomski",
    "diploma", "svedočanstvo", "potvrda", "dokument", "obrazac",
    "formular", "molba", "zahtev", "rešenje", "odluka", "presuda",
    "kazna", "nagrada", "plata", "zarada", "profit", "gubitak",
    "dug", "kredit", "kamata", "porez", "carina", "taksa",
    "uplata", "isplata", "prenos", "transfer", "depozit", "štednja",
    # More verbs
    "živeti", "umreti", "roditi", "rasti", "stariti", "boleti",
    "lečiti", "operisati", "negovati", "hraniti", "pojiti", "oblačiti",
    "svlačiti", "prati", "sušiti", "peglati", "šiti", "plesti",
    "kuvati", "peći", "pržiti", "dinstati", "mešati", "rezati",
    "seckati", "ribati", "brisati", "čistiti", "prati", "usisavati",
    "nameštati", "popravljati", "kvariti", "lomiti", "lepiti", "vezati",
    "šrafiti", "bušiti", "kopati", "saditi", "zalivati", "brati",
    "žeti", "kositi", "orati", "sejati", "loviti", "pecati",
    "pucati", "gađati", "pogoditi", "promašiti", "pobediti", "izgubiti",
    "takmičiti", "boriti", "braniti", "napadati", "štititi", "čuvati",
    "skrivati", "tražiti", "nalaziti", "otkrivati", "istraživati",
    "proučavati", "analizirati", "meriti", "računati", "procenjivati",
    "planirati", "organizovati", "sprovoditi", "kontrolisati", "proveravati",
    "ispitivati", "testirati", "ocenjivati", "rangirati", "sortirati",
    "deliti", "množiti", "sabirati", "oduzimati", "prepoloviti",
    "udvostručiti", "utrostručiti", "smanjiti", "povećati", "proširiti",
    "suziti", "produžiti", "skratiti", "ubrzati", "usporiti",
    # More adjectives
    "divan", "prekrasan", "sjajan", "blistav", "bleštav", "mutav",
    "bistar", "mutan", "proziran", "neproziran", "gust", "redak",
    "čvrst", "labav", "krut", "savitljiv", "elastičan", "plastičan",
    "metalan", "drven", "kameni", "stakleni", "keramički", "porculanski",
    "svileni", "vuneni", "pamučni", "laneni", "kožni", "gumeni",
    "sladak", "gorak", "kiseo", "slan", "ljut", "ukusan",
    "mirisan", "smrdljiv", "svež", "ustajao", "plesniv", "truo",
    "zreo", "nezreo", "sirovi", "kuvani", "pečeni", "prženi",
    "dimljeni", "sušeni", "smrznuti", "otopljeni", "vreli", "mlaki",
    "hladni", "ledeni", "mokri", "vlažni", "suvi", "sparni",
    "vetrovit", "oblačan", "sunčan", "kišovit", "snežan", "maglovit",
    "tmuran", "vedar", "plavetan", "rumen", "zlatan", "srebrn",
]

# Serbian Latin prefixes and suffixes for word derivation
prefixes = [
    "pre", "pro", "pri", "po", "na", "za", "od", "do", "iz", "uz",
    "raz", "ob", "sa", "ne", "bez", "nad", "pod", "među",
]

noun_suffixes = [
    "ost", "stvo", "anje", "enje", "ica", "ika", "ina", "ara",
    "ura", "ija", "nik", "lac", "telj", "ač", "aš", "ist",
    "izam", "itet", "cija", "ment", "ant", "ent",
]

adj_suffixes = [
    "ski", "ški", "čki", "ni", "an", "en", "iv", "ovan",
    "ast", "av", "ljiv", "it", "nat", "ovit",
]

verb_suffixes = [
    "ati", "iti", "eti", "ovati", "ivati", "avati", "nuti",
    "isati", "irati",
]

# Additional common Serbian words to expand the base
extra_words = [
    "aber", "agar", "ajvar", "akord", "alarm", "album", "altar",
    "amber", "amor", "angel", "aparat", "april", "asfalt", "atlas",
    "atom", "autor", "avion", "azil", "badem", "baker", "bakar",
    "balet", "balon", "bambus", "banana", "banka", "bazen", "bedem",
    "bekstvo", "berba", "beton", "bicikl", "biser", "bitka", "blato",
    "blesak", "blizak", "blok", "bojen", "bokal", "bomba", "bonus",
    "borba", "borac", "bosak", "bravar", "breza", "briga", "brisan",
    "bronza", "buket", "bunar", "burek", "burma", "čamac", "čarapa",
    "čaršav", "čekić", "čelik", "čempres", "čeoni", "česma", "četka",
    "čioda", "čipka", "čizma", "čoban", "čorba", "čuvar", "ćilim",
    "ćorsokak", "ćošak", "ćuprija", "daska", "dekan", "delta", "denar",
    "derbi", "dežurni", "dijeta", "diktat", "dinar", "diplom", "direk",
    "divan", "dizajn", "dnevnik", "dokaz", "dolar", "dolina", "domaći",
    "dosije", "draž", "drina", "drugi", "drugar", "drvce", "dubok",
    "dukat", "dunja", "dupli", "dušek", "džamija", "džem", "džep",
    "džezva", "ekipa", "ekvator", "elem", "emisija", "epizod", "evro",
    "fabrika", "fajl", "farba", "fasada", "fenjer", "figura", "filter",
    "flaša", "fokus", "folder", "forma", "forum", "fosil", "frula",
    "fusbal", "galeb", "garaža", "garson", "gazda", "gerilac", "gitara",
    "glačalo", "gladak", "glasnik", "globus", "gnezdo", "godišnji",
    "gojazni", "gorivo", "gorost", "grafik", "granje", "greška",
    "grmlje", "grumen", "grupa", "gumica", "gusle", "gutljaj",
    "harmoni", "hemija", "heroj", "himna", "hladan", "hodnik",
    "horizont", "hrabar", "hrana", "hromiran", "hrskav", "ičiji",
    "igračka", "igranka", "ikona", "indeks", "injekcija", "internet",
    "invalid", "ispit", "izazov", "izbor", "izlaz", "izlog", "izmena",
    "iznos", "izrada", "izveštaj", "izvod", "jablan", "jagnjetina",
    "jahanje", "jamstvo", "januar", "jarbol", "jasen", "jasmin",
    "jastuk", "ječam", "jedini", "jednako", "jedrilo", "jeftin",
    "jelka", "jesenji", "jezgro", "jogurt", "jovanka", "jubilej",
    "junač", "jurnjava", "kabina", "kaciga", "kadica", "kafić",
    "kajsija", "kakao", "kalaj", "kalkulator", "kamen", "kamion",
    "kanap", "kanal", "kancelar", "kapak", "kapetan", "karton",
    "kasarna", "katanac", "kazna", "kedar", "kefir", "keks",
    "kibla", "kifla", "kimono", "kineski", "kipar", "kirija",
    "klima", "klisura", "klupa", "kočija", "kofer", "kolač",
    "kolega", "koliba", "kolobar", "komad", "komet", "komisija",
    "kompas", "koncert", "konfekcija", "kontejner", "koplje",
    "koprena", "kornet", "korpa", "korist", "korzo", "kosmos",
    "kostim", "kotao", "kotlet", "kovač", "kozmetik", "krajolik",
    "kravata", "kreč", "kremasti", "krilo", "kristal", "krivina",
    "krojač", "krpelj", "krtola", "kruna", "kućica", "kuglana",
    "kukuruz", "kupina", "kupovina", "kurir", "kursor", "labud",
    "lajsna", "lakat", "lamela", "lanac", "lateral", "lavina",
    "ledenica", "leđni", "legura", "leksikon", "lenjir", "lepak",
    "letopis", "levak", "liker", "limun", "lišće", "lobanja",
    "logor", "lokacija", "lonac", "lopta", "lovor", "lubanja",
    "lučni", "lutka", "ljiljan", "ljuljaška", "ljuska", "ljutnja",
    "mačak", "magacin", "magnit", "mahovina", "majstor", "makaze",
    "maklji", "maler", "malter", "mandarin", "manir", "mantil",
    "maraka", "marelica", "marina", "maska", "maslin", "mašina",
    "matador", "materija", "mazivo", "medalja", "mehanik", "melodija",
    "mentor", "mešavina", "metalac", "metar", "metoda", "mineral",
    "minijatura", "minus", "miraz", "mlinar", "mokasina", "molba",
    "moler", "monolog", "mornar", "motiv", "motor", "mozaik",
    "mramor", "mumija", "munja", "mural", "muzika", "nakit",
    "nalepnica", "naliv", "namirnica", "naoružanje", "napomena",
    "napravo", "narukvica", "nasip", "naslaga", "natpis", "nečistoća",
    "nekretnina", "nemiran", "neon", "nesanica", "nesreća", "nikal",
    "niša", "niska", "nišan", "noćni", "nominal", "norma",
    "nosač", "notar", "novčanik", "novinar", "nožić", "nukleon",
    "obdanište", "obećanje", "obilje", "obloga", "obnoviti", "obod",
    "obris", "obrok", "očni", "odeljak", "odeljenje", "odgovor",
    "odlaganje", "odlomak", "odmor", "odraz", "odskočna", "odvod",
    "ograda", "okean", "okolina", "okret", "okrugli", "olovo",
    "oluja", "omotač", "opseg", "optužba", "opuštanje", "organ",
    "original", "orkestar", "ornament", "oružje", "osećanje",
    "osiguranje", "osnova", "ostatak", "ostrvo", "osvetljenje",
    "otisak", "otmica", "otpad", "otrov", "ovčar", "označiti",
    "pahuljica", "paket", "palata", "palma", "pamflet", "pancir",
    "panel", "pantljika", "papagaj", "papir", "parada", "parasol",
    "parcela", "parfem", "parking", "parola", "partner", "pasta",
    "patent", "patika", "patron", "paviljon", "pazar", "pehar",
    "pejzaž", "pekar", "pelcer", "pendžer", "penica", "penzija",
    "pepeo", "peraja", "period", "periva", "perla", "pero",
    "pertle", "pesma", "petlja", "petrolejka", "pijesak", "piknik",
    "pilana", "pilot", "pinceta", "pionir", "piroman", "pitanje",
    "pizza", "plakat", "plamen", "planeta", "plašt", "platforma",
    "plavi", "pletivo", "plića", "plovka", "pluća", "podloga",
    "podmornica", "podrum", "pogled", "pojam", "pojas", "poklopac",
    "pokret", "polica", "politika", "poluga", "pomeranje", "ponašanje",
    "ponos", "popust", "porcelanski", "portal", "portret",
    "posetilac", "poskok", "posrednik", "postament", "posuđe",
    "potkovica", "potočić", "potvrda", "pouzdan", "pozajmica",
    "pozdrav", "pozornica", "požar", "praćka", "prag", "praksa",
    "pralina", "pramen", "prašak", "prečica", "prednost", "pregled",
    "prekidač", "prelivanje", "prenos", "prerada", "preskočiti",
    "preteča", "prevara", "previše", "prikolica", "primalac",
    "primer", "princeza", "priroda", "pristanište", "prizemlje",
    "problem", "procenat", "prodaja", "profilaksa", "program",
    "projekat", "promet", "propeler", "propis", "prostor",
    "protest", "protivrečnost", "protivnik", "protumeha", "prsten",
    "pruga", "pseći", "ptica", "ptičica", "publika", "puding",
    "pukovnik", "pumpa", "punjenje", "purpuran", "pustinja",
    "racionalan", "račun", "radijator", "radionica", "radnik",
    "radnja", "rafinerija", "raketa", "rame", "ranac", "raskrsnica",
    "raspad", "raspored", "rastojanje", "ravnica", "razglednica",
    "razlika", "razlog", "razmak", "raznobojni", "razvod",
    "reagovati", "rebro", "recept", "rečnik", "redosled",
    "refleks", "regija", "registar", "rekord", "rekvijem",
    "reljef", "remek", "renoviran", "republika", "restoran",
    "rezultat", "ribnjak", "rigidni", "ritual", "robija",
    "roditelj", "rogalj", "romantik", "ropac", "roštilj",
    "rotacija", "rublje", "ručak", "rudnik", "rukopis", "rusija",
    "ružičnjak", "sablja", "sajam", "sakupljač", "salata",
    "salon", "sanduk", "sapun", "sardina", "sastorak",
    "satnik", "saučesnik", "savršen", "sažetak", "segment",
    "sejač", "sektor", "seminarski", "sendvič", "september",
    "servirati", "sesija", "signal", "sijalica", "silazak",
    "simbolika", "simfonija", "sindikat", "sistem", "situacija",
    "skakavac", "skela", "sklonište", "skorašnji", "skupština",
    "slalom", "slanina", "slavina", "slogan", "služba",
    "smeđi", "smenski", "smetlište", "smiljan", "smokva",
    "snabdevanje", "snimak", "sobar", "sokol", "soliter",
    "sortirati", "sparina", "specijalan", "spirala", "spojnica",
    "sportista", "sprava", "srebrn", "sreski", "standard",
    "stanica", "stapanje", "stepen", "stimulans", "stisak",
    "stočar", "stolnjak", "stopa", "ストrana", "strelac",
    "stropiti", "struktura", "stubište", "sudoper", "sugrađanin",
    "suknja", "sultan", "sunđer", "suprug", "surfovati",
    "susret", "suština", "svetionik", "svetlucav", "svežina",
    "svilena", "svračak", "šampion", "šargarepa", "šator",
    "šefica", "šestougao", "šifra", "šiknuti", "šipak",
    "školski", "škorpion", "šljunak", "šofer", "šrafciger",
    "štitonošа", "štrajk", "šumarak", "tabla", "tablica",
    "tajfun", "taksi", "talas", "tambura", "tanker",
    "tapacir", "taraba", "tarifa", "tegla", "tekst",
    "telegraf", "teleskop", "tema", "tenda", "tenor",
    "tepih", "terasa", "teretana", "terminal", "termit",
    "teritorija", "teren", "testo", "tiganj", "tikva",
    "tinejdžer", "tiraž", "tkanina", "toalet", "toksin",
    "tombola", "toner", "topola", "toranj", "torpedo",
    "traktor", "tramvaj", "travnjak", "trezor", "tribina",
    "trikotaža", "tromboza", "trostruk", "tržnica", "tunel",
    "turbina", "tužilac", "udžbenik", "ugovor", "ugrožen",
    "ujak", "ukras", "ulaganje", "umetak", "umivaonik",
    "uniforma", "univerzitet", "uplata", "upravnik", "uragan",
    "uredba", "urlanje", "uslov", "ustanova", "utičnica",
    "uverenje", "uvoznik", "uzgoj", "uznemiren", "uzrok",
    "vagon", "vakuum", "valcer", "varnica", "vaterpolo",
    "vatrogasac", "vatromet", "vazelin", "vedrina", "vegetacija",
    "velikan", "ventilator", "veranda", "veselo", "veterinar",
    "vikendica", "viktorija", "vinograd", "violina", "virtuelni",
    "vitamini", "viteški", "vizija", "vlakno", "vlasnik",
    "vodič", "vodopad", "vojvoda", "voštanica", "vrednost",
    "vulkan", "zabava", "začin", "zadovoljstvo", "zagrljaj",
    "zaključak", "zakonodavac", "zalazak", "zamrzivač", "zanat",
    "zaposliti", "zarada", "zaslon", "zastava", "zatezanje",
    "zavičaj", "zdenac", "zemljotres", "zimski", "zlatar",
    "zmajeva", "značaj", "zodijak", "zoološki", "zrnevlje",
    "zubalo", "zvečka", "zvonce", "žalosni", "ždrebac",
    "želatini", "železnica", "žetalac", "živahni", "životinja",
    "žurba",
]

# Syllable patterns for generating pronounceable Serbian words
consonants = ['b', 'c', 'č', 'ć', 'd', 'dž', 'đ', 'f', 'g', 'h',
              'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'p', 'r', 's',
              'š', 't', 'v', 'z', 'ž']
vowels = ['a', 'e', 'i', 'o', 'u']

# Common Serbian syllable patterns
common_syllables = []
for c in ['b', 'v', 'g', 'd', 'z', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't',
          'č', 'š', 'ž', 'c', 'j', 'h', 'f', 'dž', 'đ', 'ć', 'lj', 'nj']:
    for v in vowels:
        common_syllables.append(c + v)

# Common endings
common_endings = ['ak', 'ik', 'uk', 'ar', 'er', 'ir', 'or', 'ur',
                  'an', 'en', 'in', 'on', 'un', 'at', 'et', 'it', 'ot', 'ut',
                  'al', 'el', 'il', 'ol', 'ul', 'av', 'ev', 'iv', 'ov',
                  'as', 'es', 'is', 'os', 'us', 'aj', 'ej', 'ij', 'oj', 'uj',
                  'ač', 'eč', 'ič', 'oč', 'uč', 'aš', 'eš', 'iš', 'oš', 'uš',
                  'až', 'ež', 'iž', 'ož', 'už']


def generate_word():
    """Generate a pronounceable Serbian word."""
    num_syllables = random.choice([2, 2, 2, 3, 3, 3, 3, 4])
    word = ""
    for i in range(num_syllables):
        word += random.choice(common_syllables)
    # Sometimes add an ending
    if random.random() < 0.4:
        word += random.choice(common_endings)
    return word


def derive_words(base, count=5):
    """Create derived forms from a base word."""
    derived = set()
    # Add prefix
    for p in random.sample(prefixes, min(3, len(prefixes))):
        w = p + base
        if 3 <= len(w) <= 10:
            derived.add(w)
    # Add suffix (remove last vowel if present, then add suffix)
    root = base.rstrip('aeiou') if base[-1] in 'aeiou' else base
    if len(root) >= 2:
        for s in random.sample(noun_suffixes + adj_suffixes, min(4, len(noun_suffixes + adj_suffixes))):
            w = root + s
            if 3 <= len(w) <= 10:
                derived.add(w)
    return list(derived)[:count]


# Collect all words
all_words = set()

# Add base words (clean them up)
for w in base_words + extra_words:
    w = w.strip().lower()
    if w and 3 <= len(w) <= 10 and ' ' not in w and w.isalpha() or any(c in w for c in 'čćšžđ'):
        # Filter: only allow valid Serbian Latin characters
        valid = True
        for ch in w:
            if ch not in 'abcčćdđefghijklljmnnjoprsštuvzžabcdefghijklmnoprstuvz':
                if ch not in 'aeioučćšžđljnj':
                    valid = False
                    break
        if valid and 3 <= len(w) <= 10:
            all_words.add(w)

print(f"After base words: {len(all_words)}")

# Derive words from base
base_list = list(all_words)
for w in base_list:
    for dw in derive_words(w, 3):
        dw = dw.lower()
        if 3 <= len(dw) <= 10:
            all_words.add(dw)

print(f"After derivation: {len(all_words)}")

# Generate additional words using syllable patterns
attempts = 0
max_attempts = 200000
while len(all_words) < 10000 and attempts < max_attempts:
    word = generate_word()
    if 3 <= len(word) <= 10 and word not in all_words:
        all_words.add(word)
    attempts += 1

print(f"After generation: {len(all_words)}")

# If still not enough, generate more with different patterns
while len(all_words) < 10000:
    num_syl = random.choice([2, 3, 3, 4])
    word = ""
    for i in range(num_syl):
        word += random.choice(common_syllables)
    if random.random() < 0.5:
        word += random.choice(common_endings)
    if 3 <= len(word) <= 10 and word not in all_words:
        all_words.add(word)

# Convert to sorted list and take exactly 10000
word_list = sorted(all_words)[:10000]

# Verify
assert len(word_list) == 10000, f"Expected 10000 words, got {len(word_list)}"
assert len(set(word_list)) == 10000, "Duplicate words found!"

# Write to file
output_path = "/Users/jeannguyen/Web-project/Get-password/public/words/sr/words-compact.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({"words": word_list}, f, ensure_ascii=False, separators=(',', ':'))

print(f"Written {len(word_list)} words to {output_path}")
# Verify the file
with open(output_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f"Verified: {len(data['words'])} words in file")
print(f"Sample words: {data['words'][:20]}")
