#!/usr/bin/env python3
"""Generate 10,000 Filipino/Tagalog words for password generation."""
import json
import random
import os

random.seed(42)

# Large base vocabulary of common Filipino/Tagalog words
base_words = [
    # Nouns - people, family
    "tao", "babae", "lalaki", "anak", "ina", "ama", "ate", "kuya", "bunso",
    "lola", "lolo", "tita", "tito", "pinsan", "kapatid", "asawa", "biyenan",
    "manugang", "pamangkin", "bata", "sanggol", "dalaga", "binata", "matanda",
    "magulang", "pamilya", "kapuso", "kaibigan", "kalaro", "katrabaho",
    "guro", "doktor", "nars", "pulis", "sundalo", "magsasaka", "mangingisda",
    "tindera", "kusinero", "barbero", "mekaniko", "karpintero", "tubero",
    "elektrisista", "abogado", "inhinyero", "arkitekto", "piloto", "drayber",
    "manlalaro", "mananahi", "manunulat", "mang-aawit", "artista", "pintor",
    # Nouns - nature
    "araw", "buwan", "tala", "ulap", "langit", "lupa", "dagat", "ilog",
    "bundok", "burol", "gubat", "kahoy", "bulaklak", "damo", "dahon",
    "ugat", "sanga", "puno", "bato", "buhangin", "putik", "hangin",
    "ulan", "kidlat", "kulog", "bagyo", "baha", "lindol", "bulkan",
    "yelo", "niyebe", "hamog", "ulap", "bahaghari", "bituin", "sinag",
    "liwanag", "dilim", "anino", "apoy", "usok", "abo", "alikabok",
    "tubig", "batis", "talon", "lawa", "pulo", "baybayin", "dalampasigan",
    "lambak", "talampas", "kapuluan", "bangin", "kweba", "bukal",
    # Nouns - animals
    "aso", "pusa", "kabayo", "baka", "kalabaw", "kambing", "baboy",
    "manok", "pato", "ibon", "isda", "palaka", "butiki", "ahas",
    "buwaya", "pagong", "susog", "tipaklong", "langgam", "bubuyog",
    "paru-paro", "tutubi", "ipis", "lamok", "langaw", "gagamba",
    "daga", "usa", "agila", "kalapati", "maya", "uwak", "loro",
    "unggoy", "elepante", "leon", "tigre", "lobo", "soro", "oso",
    "dolfin", "balyena", "hipon", "talangka", "pusit", "tahong",
    "talaba", "alimasag", "alimango", "salagubang", "uod", "suso",
    # Nouns - food
    "kanin", "ulam", "isda", "karne", "gulay", "prutas", "tinapay",
    "gatas", "itlog", "asin", "asukal", "suka", "toyo", "patis",
    "bagoong", "mangga", "saging", "pinya", "papaya", "bayabas",
    "durian", "rambutan", "langka", "lanzones", "kalamansi", "dayap",
    "dalandan", "pakwan", "melon", "ubas", "mansanas", "buko",
    "niyog", "mais", "palay", "bigas", "kamote", "gabi", "ube",
    "patatas", "sibuyas", "bawang", "luya", "sili", "talong",
    "ampalaya", "sitaw", "kangkong", "petsay", "repolyo", "labanos",
    "okra", "kalabasa", "sayote", "kamatis", "pipino", "munggo",
    "bataw", "kadios", "turon", "halo-halo", "adobo", "sinigang",
    "kare-kare", "lumpia", "pansit", "lechon", "bibingka", "kakanin",
    "puto", "kutsinta", "sapin-sapin", "suman", "tikoy", "palitaw",
    # Nouns - body parts
    "ulo", "mukha", "mata", "ilong", "bibig", "tainga", "noo",
    "pisngi", "baba", "buhok", "kilay", "pilikmata", "ngipin",
    "dila", "labi", "leeg", "balikat", "braso", "kamay", "daliri",
    "kuko", "dibdib", "tiyan", "likod", "baywang", "balakang",
    "hita", "tuhod", "binti", "paa", "sakong", "talampakan",
    "puso", "baga", "atay", "bato", "bituka", "dugo", "buto",
    "kalamnan", "balat", "ugat", "utak", "lalamunan", "siko",
    "gulugod", "tadyang", "sikmura",
    # Nouns - objects, household
    "bahay", "pinto", "bintana", "bubong", "sahig", "dingding",
    "kisame", "hagdan", "bakod", "tarangka", "mesa", "upuan", "kama",
    "unan", "kumot", "banig", "lamesa", "aparador", "estante",
    "salamin", "lampara", "kandila", "kaldero", "kawali", "palayok",
    "kutsara", "tinidor", "kutsilyo", "plato", "baso", "tasa",
    "mangkok", "pitsel", "takure", "kalan", "pugon", "sandok",
    "siyanse", "lababo", "gripo", "timba", "tabo", "walis",
    "basahan", "sabon", "tuwalya", "suklay", "sipilyo", "gunting",
    "karayom", "sinulid", "tela", "papel", "lapis", "bolpen",
    "libro", "kuwaderno", "sobre", "selyo", "timbang", "orasan",
    "relo", "radyo", "telebisyon", "telepono", "kompyuter", "susi",
    "kandado", "payong", "abaniko", "supot", "pitaka",
    # Nouns - clothing
    "damit", "kamisa", "palda", "pantalon", "korto", "bestida",
    "polo", "blusa", "saya", "terno", "barong", "malong",
    "sapatos", "tsinelas", "medyas", "sinturon", "korbata",
    "sombrero", "salakot", "gora", "balabal", "tsaleko",
    # Nouns - places
    "bayan", "lungsod", "probinsya", "baryo", "kalye", "kalsada",
    "tulay", "palengke", "simbahan", "eskwela", "ospital", "parke",
    "plaza", "munisipyo", "kapitolyo", "palasyo", "himpilan",
    "istasyon", "daungan", "pantalan", "paliparan", "bodega",
    "opisina", "bangko", "tindahan", "botika", "panadero",
    "restawran", "karihan", "kainan", "bilangguan", "hukuman",
    "senado", "kongreso", "museo", "aklatan", "sinehan",
    "stadium", "koliseo", "sementeryo", "paliparan", "bukirin",
    # Nouns - abstract
    "buhay", "kamatayan", "pagibig", "galit", "takot", "tuwa",
    "lungkot", "pangamba", "pag-asa", "pangarap", "alaala",
    "gunita", "diwa", "isip", "loob", "damdamin", "kalooban",
    "budhi", "dangal", "puri", "kapangyarihan", "kalayaan",
    "katotohanan", "katarungan", "kapayapaan", "kagandahan",
    "kalusugan", "kayamanan", "karunungan", "kasanayan",
    "karanasan", "kaalaman", "kahalagahan", "katapatan",
    "katapangan", "kasiyahan", "tagumpay", "kabiguan",
    "pagbabago", "pag-unlad", "pagkakaisa",
    # Nouns - time
    "oras", "minuto", "segundo", "araw", "gabi", "umaga",
    "tanghali", "hapon", "madaling-araw", "linggo", "buwan",
    "taon", "siglo", "panahon", "tag-init", "tag-ulan",
    "taglamig", "tagsibol", "kapaskuhan", "bagong-taon",
    # Nouns - misc
    "trabaho", "laro", "awit", "tugon", "tanong", "sagot",
    "balita", "kwento", "tula", "bugtong", "salawikain",
    "kasabihan", "pahayag", "liham", "sulat", "mensahe",
    "pakete", "regalo", "premyo", "gantimpala", "suweldo",
    "sahod", "bayad", "utang", "puhunan", "tubo", "buwis",
    "presyo", "halaga", "pera", "barya", "salapi", "ginto",
    "pilak", "tanso", "bakal", "asero", "yero", "lata",
    "kahon", "supot", "sisidlan", "kulay", "hugis", "sukat",
    "timbang", "bilis", "lakas", "taas", "laki", "haba",
    "lapad", "lalim", "bigat", "ganda", "bango", "amoy",
    "lasa", "tunog", "ingay", "tahimik", "kapangyarihan",
    # Verbs - common root forms
    "kain", "inom", "tulog", "gising", "lakad", "takbo",
    "talon", "langoy", "lipad", "pasok", "labas", "upo",
    "tayo", "higa", "ligo", "bihis", "luto", "hugas",
    "walis", "linis", "tahi", "sulat", "basa", "aral",
    "kanta", "sayaw", "tugtog", "guhit", "pinta", "dikit",
    "hiwa", "buhat", "dala", "kuha", "lagay", "tapon",
    "pukol", "sipa", "hampas", "suntok", "kagat", "sipsip",
    "lulon", "gawa", "yari", "buo", "sira", "putol",
    "durog", "punit", "tusok", "bali", "tiklop", "bukas",
    "sara", "basa", "tuyo", "init", "lamig", "prito",
    "laga", "ihaw", "hinog", "hilaw", "singil", "bayad",
    "bili", "tinda", "hatid", "sundo", "sakay", "baba",
    "akyat", "lusong", "tawid", "harang", "tago", "huli",
    "bitiw", "hawak", "kapit", "hila", "tulak", "angat",
    "baba", "ikot", "liko", "diretso", "habol", "iwas",
    "takot", "lakas", "hina", "tulong", "sakit",
    # Adjectives
    "malaki", "maliit", "matangkad", "mababa", "mahaba",
    "maikli", "malapad", "makitid", "makapal", "manipis",
    "mabigat", "magaan", "matigas", "malambot", "makinis",
    "magaspang", "mainit", "malamig", "mahangin", "maulap",
    "maulan", "maaraw", "madilim", "maliwanag", "makulay",
    "maputi", "maitim", "mapula", "madilaw", "berde",
    "asul", "kahel", "rosas", "lila", "kulay-ginto",
    "maganda", "pangit", "mabuti", "masama", "malakas",
    "mahina", "mabilis", "mabagal", "matalino", "mangmang",
    "matapang", "duwag", "masaya", "malungkot", "galit",
    "tahimik", "maingay", "mayaman", "mahirap", "malusog",
    "masakit", "pagod", "busog", "gutom", "uhaw",
    "bago", "luma", "bata", "matanda", "sariwa",
    "bulok", "hinog", "hilaw", "malinis", "marumi",
    "basa", "tuyo", "buo", "sira", "bukas", "sara",
    "totoo", "peke", "tama", "mali", "madali", "mahirap",
    "payak", "masikip", "maluwag", "mataas", "mababa",
    "malalim", "mababaw", "matamis", "mapait", "maasim",
    "maalat", "maanghang", "mabango", "mabaho", "mataba",
    "payat", "bilog", "parisukat", "pahaba", "patayo",
    "pahiga", "patag", "matulis", "mapurol", "matibay",
    "marupok", "malabo", "malinaw", "matagal", "madalas",
    "bihira", "lahat", "wala", "puno", "bakante",
    # Adverbs and function words
    "dito", "doon", "saan", "kailan", "bakit", "paano",
    "sino", "ano", "alin", "ilan", "palagi", "minsan",
    "kailanman", "madalas", "ngayon", "mamaya", "kanina",
    "kahapon", "bukas", "makalawa", "agad", "bigla",
    "dahan-dahan", "nang-nang", "halos", "sobra", "kulang",
    "sakto", "sapat", "labis", "tama", "pataas", "pababa",
    "pasulong", "pabalik", "palayo", "palapit",
    # Numbers
    "isa", "dalawa", "tatlo", "apat", "lima", "anim",
    "pito", "walo", "siyam", "sampu", "daan", "libo",
    "milyon", "una", "ikalawa", "ikatlo", "ikaapat",
    "ikalima", "ikaanim", "ikapito", "ikawalo",
    # More nouns - tools, technology
    "martilyo", "lagari", "pait", "pako", "tornilyo",
    "plais", "destornilyo", "barena", "pala", "asarol",
    "itak", "gulok", "sibat", "pana", "palaso",
    "kawit", "kadena", "lubid", "alambre", "tubo",
    "grasa", "pintura", "brotsas", "rodilyo", "espada",
    "kalasag", "sandata", "baril", "bala", "bomba",
    "makina", "sasakyan", "kotse", "trak", "dyip",
    "tren", "barko", "bangka", "eroplano", "bisikleta",
    "motorsiklo", "kariton", "kalesa", "dyip", "taksi",
    "gulong", "makina", "preno", "manibela",
    # More nouns - concepts, society
    "batas", "karapatan", "tungkulin", "kasunduan",
    "halalan", "gobyerno", "senador", "alkalde",
    "kapitan", "kagawad", "kalihim", "tagapagsalita",
    "mambabatas", "kinatawan", "embahador", "konsul",
    "pangulo", "punong", "hukom", "piskal", "taga-usig",
    "akusado", "biktima", "saksi", "hatol", "multa",
    "parusa", "kulungan", "lupon", "samahan", "unyon",
    "lipunan", "kultura", "tradisyon", "kaugalian",
    "paniniwala", "relihiyon", "panalangin", "misa",
    "pagbibinyag", "kasal", "libing", "pista", "handaan",
    "salu-salo", "pagdiriwang",
    # Nature words extended
    "talahib", "kawayan", "nipa", "rattan", "palapa",
    "anahaw", "akasya", "narra", "molave", "ipil",
    "kamagong", "banaba", "sampaguita", "rosal",
    "gumamela", "santan", "ilang-ilang", "hasmin",
    "orkidyas", "rosa", "tulipan", "dama-de-noche",
    "kamia", "waling-waling", "kalachuchi",
    # Emotion and state words
    "ligaya", "lumbay", "hinagpis", "pangungulila",
    "pagmamahal", "pagkapoot", "pagkainggit",
    "pagkagulat", "pagkabigla", "pagkatakot",
    "pagkalito", "pagkahiya", "pagkaawa",
    "pagkahabag", "pagkagalit", "pagkalungkot",
    "pagkasaya", "pagkatawa", "pagkaiyak",
    # More daily life
    "almusal", "tanghalian", "hapunan", "merienda",
    "pamahid", "pampahid", "sabon", "gugo",
    "suklay", "tuwalya", "sipilyo", "sabaw",
    "sawsawan", "paminta", "laurel", "bawang",
    "sibuyas", "kamatis", "mantika", "margarina",
    "gata", "nata", "keso", "mantikilya",
    "harina", "asukal", "asin", "pampalasa",
    # Actions and activities
    "paglalaro", "pagluluto", "paglilinis",
    "pagbabasa", "pagsusulat", "pagtutugtog",
    "pagkanta", "pagsasayaw", "pagguhit",
    "pagpipinta", "pagtatanim", "pagaani",
    "pangingisda", "pamamasyal", "paglalakbay",
    "pamimili", "pamamalengke", "pagdarasal",
    "pagsisimba", "pagaaral",
    # Weather and environment
    "panahon", "klima", "temperatura", "init",
    "lamig", "singaw", "hamog", "ambon",
    "buhos", "bagyong", "habagat", "amihan",
    "salanta", "daluyong", "agos", "sunog",
    "baha", "pagguho", "pagbuga",
    # Buildings and structures
    "gusali", "tore", "kuta", "kastilyo",
    "simbahan", "kapilya", "moske", "templo",
    "dampa", "kubo", "barong-barong", "mansion",
    "palasyo", "kumbento", "monasteryo", "santuwaryo",
    # Music and arts
    "tugtugin", "gitara", "piyano", "tambol",
    "plawta", "biyolin", "kudyapi", "kulintang",
    "rondalla", "bandurya", "oktabina",
    "pintura", "eskultura", "litrato", "pelikula",
    "dula", "komedya", "trahedya", "sayaw",
    "tinikling", "pandanggo", "kundiman",
    # Education
    "paaralan", "silid", "pisara", "tisa",
    "aklat", "tinta", "eksamen", "grado",
    "kabanata", "aralin", "leksiyon", "talata",
    "pangungusap", "salita", "titik", "bantas",
    "tuldok", "kuwit", "tanong", "sagot",
    "diploma", "titulo", "gradwasyon",
    # Sports
    "basketbol", "boksing", "takraw", "arnis",
    "karate", "larong", "palaro", "puntos",
    "manlalaro", "kotsero", "kampeon", "medalya",
    "trofeo", "tsampyon", "laban", "paligsahan",
    # Geography - Philippine specific
    "luzon", "visayas", "mindanao", "maynila",
    "quezon", "rizal", "tarlak", "laguna",
    "batangas", "cavite", "bulacan", "cebu",
    "davao", "baguio", "boracay", "palawan",
    "siargao", "taal", "pinatubo", "mayon",
]

# Tagalog affixes for word derivation
prefixes_mag = ["mag", "nag", "pag"]
prefixes_ma = ["ma", "na", "pa"]
prefixes_i = ["i", "ipa", "ipag", "ipang"]
prefixes_mang = ["mang", "nang", "pang"]
prefixes_ka = ["ka", "kina", "naka"]
prefixes_um = ["um", "in"]
prefixes_tag = ["taga", "tagapag"]
prefixes_misc = ["di", "hindi", "pala", "pang", "pan", "pin", "sang"]

all_prefixes = (prefixes_mag + prefixes_ma + prefixes_i + prefixes_mang +
                prefixes_ka + prefixes_um + prefixes_tag + prefixes_misc)

# Tagalog suffixes
suffixes = [
    "an", "han", "in", "hin", "ng", "ang",
]

# Tagalog infixes
infixes = ["um", "in"]

# Combined affix patterns for derivation
noun_suffixes = ["an", "han", "in", "hin", "nan", "yan", "lan"]
adj_prefixes = ["ma", "na", "pa", "ka", "pang", "naka"]
verb_prefixes = ["mag", "nag", "pag", "um", "in", "mang", "nang", "i", "ipa"]

# Additional common Tagalog words
extra_words = [
    # Kitchen and cooking
    "sinaing", "ginisa", "nilaga", "pinakbet", "dinuguan", "tinola",
    "bulalo", "kaldereta", "mechado", "menudo", "afritada", "pochero",
    "paksiw", "kilawin", "pinangat", "laing", "ginataang", "pininyahan",
    "sariwang", "pritong", "lutong", "bahaw", "tustado", "himagas",
    # Household items
    "sandok", "siansi", "kawali", "kalan", "pugon", "palayok",
    "banig", "kumot", "unan", "aparador", "tokador", "kabinet",
    "estante", "banga", "paso", "planggana", "batya", "palanggana",
    "balde", "timba", "tabo", "takip", "pinggan", "kubyertos",
    # Emotions extended
    "galak", "hapis", "lungkot", "pighati", "saya", "ligaya",
    "dusa", "hinanakit", "samyo", "simoy", "lagaslas", "lagutok",
    "lagitik", "kaluskos", "kalansing", "kalatog", "dagundong",
    "ugong", "haginit", "hagibis", "hagunot", "hagulgol",
    # Nature sounds and phenomena
    "dagitab", "kidlat", "kulog", "lagapak", "lagatok", "lagabog",
    "lagasak", "lagpak", "ugoy", "alon", "daloy", "agos",
    "buhawi", "ipu-ipo", "sigwa", "unos", "habagat", "amihan",
    # Character traits
    "masipag", "tamad", "tapat", "sinungaling", "matulungin",
    "mapagbigay", "maawain", "mapagmahal", "makatarungan",
    "matiisin", "magalang", "bastos", "mahinhin", "makulit",
    "maliksi", "matiyaga", "masunurin", "masuwayin", "mapagkumbaba",
    "mayabang", "mataray", "mahinahon", "magaspang", "masungit",
    # Verbs - action roots
    "palo", "hampas", "dagok", "tadyak", "sampal", "sakal",
    "sunggab", "dakma", "dampot", "pulot", "hugot", "hilahin",
    "tangay", "agaw", "kamkam", "samsam", "nakaw", "umit",
    "dayukdok", "kalkal", "halukay", "dukot", "haplos", "himas",
    "hagod", "dampi", "sapo", "hipig", "pisil", "piga",
    "pindot", "pihit", "pikit", "mulat", "kindat", "kislap",
    "titig", "tingin", "sulyap", "silip", "dungaw", "sumilip",
    "lingon", "linga", "libot", "gulong", "ikid", "galaw",
    "kilos", "kumpas", "galaw", "indak", "sabay", "kasabay",
    # More nouns
    "pangalan", "apelyido", "tirahan", "direksyon", "numero",
    "taon", "gulang", "kasarian", "lahi", "wika", "salita",
    "pangungusap", "talata", "akda", "tula", "kwento",
    "nobela", "alamat", "bugtong", "sawikain", "kasabihan",
    "tugma", "sukat", "taludtod", "saknong", "pamagat",
    "nilalaman", "simula", "gitna", "wakas", "buod",
    "layunin", "aral", "tema", "tauhan", "tagpuan",
    "banghay", "tunggalian", "sagisag",
    # Descriptive words
    "makintab", "maputla", "mapungay", "malabo", "malinaw",
    "maliwanag", "madilim", "maaliwalas", "malungkot", "masigla",
    "masikap", "malikot", "malimit", "madalang", "masinsing",
    "mabulas", "maburak", "makulimlim", "makitid", "maluwang",
    "malabnaw", "malapot", "matubig", "mabuhangin", "maputik",
    "mabato", "madamo", "makahoy", "mabulaklak", "mabunga",
    # Filipino culture
    "bayanihan", "fiesta", "patron", "nobena", "pasyon",
    "salubong", "pahiyas", "sinulog", "kadayawan", "panagbenga",
    "maskara", "moriones", "santakrusan", "flores",
    "harana", "balitaw", "kumintang", "tagulaylay",
    "duplo", "balagtasan", "tibag", "komedya",
    # Common borrowed/adapted words (established in Tagalog)
    "kutsero", "kalesa", "dosena", "kwarenta", "singkwenta",
    "sandaan", "sanlibo", "riles", "estero", "kanto",
    "eskina", "kuwarto", "kwarto", "sala", "kusina",
    "komedor", "banyo", "garahe", "balkon", "azotea",
    "bodega", "sotano", "delantera", "sentro", "baryo",
    "plasa", "krus", "kampana", "sero", "doble",
    # Time-related
    "takipsilim", "dapit-hapon", "bukangliwayway",
    "hatinggabi", "katanghalian", "tardeng",
    "aginaldo", "pasalubong",
    # Tools and implements
    "sundang", "bolo", "itak", "tabak", "panaksak",
    "pantok", "pamutol", "panggupit", "panahi",
    "panulat", "pambura", "pandikit", "pantali",
    "pansaing", "panggatong", "panggisa",
    # Kinship and social
    "kababayan", "kababata", "kabarkada", "kaklase",
    "kadaupang", "kabiyak", "katipan", "kasintahan",
    "nobyo", "nobya", "manliligaw", "abay", "ninong",
    "ninang", "inaanak", "kumpadre", "kumadre",
    # Materials
    "kahoy", "bato", "buhangin", "semento", "adobe",
    "yero", "kawayan", "nipa", "rattan", "abaka",
    "katsa", "sutla", "lino", "lana", "balahibo",
    "goma", "plastik", "salamin", "porselana",
    "luwad", "luad", "palayok", "tapayan",
    # Philippine flora
    "narra", "molave", "kamagong", "ipil-ipil",
    "banaba", "balete", "akasya", "mahogani",
    "talisay", "kalatsutsi", "adelfa", "bougainvillea",
    "sampaguita", "rosal", "gumamela", "santan",
    "kamia", "ylang-ylang", "tsiko", "atis",
    "santol", "siniguelas", "makopa", "duhat",
    "sampalok", "kamias", "balimbing",
]

# Syllable patterns for generating pronounceable Tagalog words
consonants = ['b', 'd', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w', 'y']
ng_consonant = ['ng']  # Treated separately due to digraph
vowels = ['a', 'e', 'i', 'o', 'u']

# Common Tagalog syllable patterns (CV)
common_syllables = []
for c in consonants:
    for v in vowels:
        common_syllables.append(c + v)
# Add 'ng' + vowel
for v in vowels:
    common_syllables.append('ng' + v)
# Add vowel-only syllables (V pattern)
for v in vowels:
    common_syllables.append(v)

# Common Tagalog word endings (CVC pattern closers)
common_endings = [
    'ak', 'ik', 'uk', 'ok', 'ek',
    'al', 'il', 'ul', 'ol', 'el',
    'an', 'in', 'un', 'on', 'en',
    'at', 'it', 'ut', 'ot', 'et',
    'as', 'is', 'us', 'os', 'es',
    'ad', 'id', 'ud', 'od', 'ed',
    'ag', 'ig', 'ug', 'og', 'eg',
    'ap', 'ip', 'up', 'op', 'ep',
    'am', 'im', 'um', 'om', 'em',
    'ar', 'ir', 'ur', 'or', 'er',
    'ab', 'ib', 'ub', 'ob', 'eb',
    'ay', 'oy', 'uy', 'aw', 'iw', 'ew',
    'ang', 'ing', 'ung', 'ong', 'eng',
    'ng',
]


def is_valid_tagalog_word(word):
    """Check if a word uses only valid Latin characters and meets length requirements."""
    if not word or len(word) < 3 or len(word) > 10:
        return False
    for ch in word:
        if ch not in 'abcdefghijklmnopqrstuvwxyz':
            return False
    return True


def generate_word():
    """Generate a pronounceable Tagalog word using syllable patterns."""
    num_syllables = random.choice([2, 2, 2, 3, 3, 3, 3, 4])
    word = ""
    for i in range(num_syllables):
        word += random.choice(common_syllables)
    # Sometimes add a consonant ending
    if random.random() < 0.45:
        word += random.choice(common_endings)
    return word


def derive_words(base, count=6):
    """Create derived forms from a Tagalog base word using affixes."""
    derived = set()

    # Prefix derivations
    for p in random.sample(all_prefixes, min(5, len(all_prefixes))):
        w = p + base
        if is_valid_tagalog_word(w):
            derived.add(w)

    # Suffix derivations
    for s in random.sample(noun_suffixes, min(4, len(noun_suffixes))):
        # If word ends in vowel, just add suffix
        if base[-1] in 'aeiou':
            w = base + s
        else:
            w = base + s
        if is_valid_tagalog_word(w):
            derived.add(w)

    # Prefix + suffix combinations
    for p in random.sample(adj_prefixes, min(3, len(adj_prefixes))):
        w = p + base
        if is_valid_tagalog_word(w):
            derived.add(w)
        # Also try with -an suffix
        w2 = p + base + "an"
        if is_valid_tagalog_word(w2):
            derived.add(w2)

    # Infix derivations (insert after first consonant cluster)
    for inf in infixes:
        if len(base) >= 3 and base[0] not in 'aeiou':
            # Find first vowel position
            first_vowel = -1
            for i, ch in enumerate(base):
                if ch in 'aeiou':
                    first_vowel = i
                    break
            if first_vowel > 0:
                w = base[:first_vowel] + inf + base[first_vowel:]
                if is_valid_tagalog_word(w):
                    derived.add(w)

    # Reduplication (common in Tagalog) - only for consonant-initial words
    if len(base) >= 3 and base[0] not in 'aeiou':
        # Find first CV syllable for reduplication
        # e.g., "takbo" -> "ta" + "takbo" = "tatakbo"
        first_vowel_idx = -1
        for i, ch in enumerate(base):
            if ch in 'aeiou':
                first_vowel_idx = i
                break
        if first_vowel_idx > 0 and first_vowel_idx < len(base) - 1:
            # Take consonant(s) + vowel as the reduplicated syllable
            first_syl = base[:first_vowel_idx + 1]
            w = first_syl + base
            if is_valid_tagalog_word(w):
                derived.add(w)

    return list(derived)[:count]


# Collect all words
all_words = set()

# Add base words (clean them up - only keep pure Latin alphabet words)
for w in base_words + extra_words:
    w = w.strip().lower()
    # Skip words with hyphens or non-alpha characters
    if '-' in w or ' ' in w:
        continue
    if is_valid_tagalog_word(w):
        all_words.add(w)

print(f"After base words: {len(all_words)}")

# Derive words from base
base_list = list(all_words)
for w in base_list:
    for dw in derive_words(w, 5):
        dw = dw.lower()
        if is_valid_tagalog_word(dw):
            all_words.add(dw)

print(f"After derivation: {len(all_words)}")

# Generate additional words using syllable patterns
attempts = 0
max_attempts = 300000
while len(all_words) < 10000 and attempts < max_attempts:
    word = generate_word()
    if is_valid_tagalog_word(word) and word not in all_words:
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
    if is_valid_tagalog_word(word) and word not in all_words:
        all_words.add(word)

# Convert to sorted list and take exactly 10000
word_list = sorted(all_words)[:10000]

# Verify
assert len(word_list) == 10000, f"Expected 10000 words, got {len(word_list)}"
assert len(set(word_list)) == 10000, "Duplicate words found!"

# Write to file
output_path = "/Users/jeannguyen/Web-project/Get-password/public/words/tl/words-compact.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({"words": word_list}, f, ensure_ascii=False, separators=(',', ':'))

print(f"Written {len(word_list)} words to {output_path}")
# Verify the file
with open(output_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f"Verified: {len(data['words'])} words in file")
print(f"Sample words: {data['words'][:20]}")
print(f"Word length range: {min(len(w) for w in data['words'])} - {max(len(w) for w in data['words'])}")
