import datetime
from typing import Dict, List, Tuple, Any
from python.common.models import BirthProfileInput, NumerologyCalculationResult

CHALDEAN_MAP: Dict[str, int] = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'C': 3, 'G': 3, 'L': 3, 'S': 3,
    'D': 4, 'M': 4, 'T': 4,
    'E': 5, 'H': 5, 'N': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
}

PYTHAGOREAN_MAP: Dict[str, int] = {
    'A': 1, 'J': 1, 'S': 1,
    'B': 2, 'K': 2, 'T': 2,
    'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4,
    'E': 5, 'N': 5, 'W': 5,
    'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7,
    'H': 8, 'Q': 8, 'Z': 8,
    'I': 9, 'R': 9
}

COMPOUND_NAMES: Dict[int, str] = {
    10: "The Wheel of Fortune",
    11: "The Spiritual Messenger (Master 11)",
    12: "The Sacrifice / Anxious Expresser",
    13: "The Phoenix / Karmic Transformation",
    14: "The Temperance / Freedom Seeker",
    15: "The Alchemist / Magnetic Charmer",
    16: "The Fallen Citadel / Karmic Awakening",
    17: "The Star of the Magi / Immortal Fame",
    18: "The Spiritual Conflict / Internal Warfare",
    19: "The Prince of Heaven / Royal Victor",
    20: "The Awakening / Karmic Turning Point",
    21: "The Crown of the Magi / Fortunate Hero",
    22: "The Master Architect (Master 22)",
    23: "The Royal Star of the Lion",
    24: "The Fortunate Nurturer",
    25: "The Discriminating Sage",
    26: "The Ruler of Material Destiny",
    27: "The Scepter of Authority",
    28: "The Delayed Sovereign (Moon-Saturn)",
    29: "The Grace Under Pressure",
    30: "The Creative Infinite",
    31: "The Solitary Strategist",
    33: "The Master Teacher (Master 33)"
}

PLANET_INFO: Dict[int, Dict[str, Any]] = {
    1: {
        "planet": "Sun (Surya)",
        "colors": ["Gold", "Orange", "Yellow", "Copper"],
        "days": ["Sunday"],
        "gemstones": ["Ruby (Manikya)", "Red Garnet", "Sunstone"],
        "friends": [1, 2, 3, 5, 9],
        "neutral": [4, 7],
        "enemies": [6, 8]
    },
    2: {
        "planet": "Moon (Chandra)",
        "colors": ["Pearl White", "Silver", "Sea Green", "Cream"],
        "days": ["Monday"],
        "gemstones": ["Pearl (Moti)", "Moonstone"],
        "friends": [1, 2, 3, 5],
        "neutral": [7, 9],
        "enemies": [4, 8, 6]
    },
    3: {
        "planet": "Jupiter (Guru)",
        "colors": ["Yellow", "Saffron", "Purple", "Gold"],
        "days": ["Thursday"],
        "gemstones": ["Yellow Sapphire (Pukhraj)", "Citrine", "Yellow Topaz"],
        "friends": [1, 2, 3, 9],
        "neutral": [5, 7],
        "enemies": [6]
    },
    4: {
        "planet": "Rahu (North Node)",
        "colors": ["Electric Blue", "Grey", "Smoky Charcoal"],
        "days": ["Saturday"],
        "gemstones": ["Hessonite Garnet (Gomed)"],
        "friends": [1, 5, 6, 7],
        "neutral": [2, 3],
        "enemies": [4, 8, 9]
    },
    5: {
        "planet": "Mercury (Budh)",
        "colors": ["Emerald Green", "Turquoise", "Pastel Shades"],
        "days": ["Wednesday"],
        "gemstones": ["Emerald (Panna)", "Peridot", "Green Tourmaline"],
        "friends": [1, 2, 3, 5, 6],
        "neutral": [7, 8],
        "enemies": [4, 9]
    },
    6: {
        "planet": "Venus (Shukra)",
        "colors": ["Royal White", "Pink", "Pastel Blue", "Silver"],
        "days": ["Friday"],
        "gemstones": ["Diamond (Heera)", "White Zircon", "Opal"],
        "friends": [1, 4, 5, 6, 7, 8],
        "neutral": [9],
        "enemies": [2, 3]
    },
    7: {
        "planet": "Ketu (South Node)",
        "colors": ["White", "Light Green", "Golden Brown", "Smoky Quartz"],
        "days": ["Tuesday", "Thursday"],
        "gemstones": ["Cat's Eye (Lehsunia)", "Chrysoberyl"],
        "friends": [1, 4, 5, 6, 7],
        "neutral": [2, 3, 8],
        "enemies": [9]
    },
    8: {
        "planet": "Saturn (Shani)",
        "colors": ["Matte Black", "Dark Navy", "Charcoal", "Deep Violet"],
        "days": ["Saturday"],
        "gemstones": ["Blue Sapphire (Neelam)", "Amethyst", "Iolite"],
        "friends": [3, 5, 6, 7],
        "neutral": [4],
        "enemies": [1, 2, 8, 9]
    },
    9: {
        "planet": "Mars (Mangal)",
        "colors": ["Crimson Red", "Coral", "Maroon", "Gold"],
        "days": ["Tuesday"],
        "gemstones": ["Red Coral (Moonga)", "Carnelian"],
        "friends": [1, 2, 3, 9],
        "neutral": [6, 7],
        "enemies": [4, 5, 8]
    }
}

def reduce_number(num: int, keep_master: bool = False) -> int:
    while num > 9:
        if keep_master and num in [11, 22, 33]:
            return num
        num = sum(int(d) for d in str(num))
    return num

def calculate_name_number(name: str, system: str = "chaldean") -> int:
    mapping = CHALDEAN_MAP if system == "chaldean" else PYTHAGOREAN_MAP
    total = sum(mapping.get(c.upper(), 0) for c in name if c.isalpha())
    return reduce_number(total) if total > 0 else 1

def calculate_soul_urge(name: str) -> int:
    vowels = set("AEIOU")
    total = sum(CHALDEAN_MAP.get(c.upper(), 0) for c in name if c.upper() in vowels)
    return reduce_number(total) if total > 0 else 1

def calculate_personality_number(name: str) -> int:
    consonants = set("BCDFGHJKLMNPQRSTVWXYZ")
    total = sum(CHALDEAN_MAP.get(c.upper(), 0) for c in name if c.upper() in consonants)
    return reduce_number(total) if total > 0 else 1

def calculate_numerology(profile: BirthProfileInput) -> NumerologyCalculationResult:
    day = profile.dob.day
    month = profile.dob.month
    year = profile.dob.year

    mulank = reduce_number(day)
    compound_number = day
    compound_name = COMPOUND_NAMES.get(compound_number, f"Vibration of {compound_number}")

    # Bhagyank (Life Path)
    dob_sum = sum(int(d) for d in f"{day:02d}{month:02d}{year}")
    bhagyank = reduce_number(dob_sum, keep_master=False)

    # Master numbers detection in raw additions
    master_numbers = []
    if dob_sum in [11, 22, 33] or day in [11, 22]:
        master_numbers.append(dob_sum if dob_sum in [11, 22, 33] else day)

    # Karmic debt numbers: 13, 14, 16, 19
    karmic_debts = []
    if day in [13, 14, 16, 19] or dob_sum in [13, 14, 16, 19]:
        karmic_debts.append(day if day in [13, 14, 16, 19] else dob_sum)

    # Names
    name_num = calculate_name_number(profile.full_name, "chaldean")
    soul_urge = calculate_soul_urge(profile.full_name)
    personality_num = calculate_personality_number(profile.full_name)

    # Loshu Grid frequencies
    all_digits = f"{day:02d}{month:02d}{year}"
    loshu_grid = {str(i): all_digits.count(str(i)) for i in range(1, 10)}
    present_numbers = [i for i in range(1, 10) if loshu_grid[str(i)] > 0]
    missing_numbers = [i for i in range(1, 10) if loshu_grid[str(i)] == 0]

    # Planes of expression
    mental_plane = loshu_grid['4'] + loshu_grid['9'] + loshu_grid['2']
    emotional_plane = loshu_grid['3'] + loshu_grid['5'] + loshu_grid['7']
    practical_plane = loshu_grid['8'] + loshu_grid['1'] + loshu_grid['6']
    thought_plane = loshu_grid['4'] + loshu_grid['3'] + loshu_grid['8']
    will_plane = loshu_grid['9'] + loshu_grid['5'] + loshu_grid['1']
    action_plane = loshu_grid['2'] + loshu_grid['7'] + loshu_grid['6']

    planes = {
        "mental": mental_plane,
        "emotional": emotional_plane,
        "practical": practical_plane,
        "thought": thought_plane,
        "will": will_plane,
        "action": action_plane
    }

    # Personal Year, Month, Day
    curr_year = profile.current_year or datetime.date.today().year
    personal_year = reduce_number(reduce_number(day) + reduce_number(month) + reduce_number(curr_year))
    curr_month = datetime.date.today().month
    curr_day = datetime.date.today().day
    personal_month = reduce_number(personal_year + curr_month)
    personal_day = reduce_number(personal_month + curr_day)

    # Pinnacles & Challenges
    r_day = reduce_number(day)
    r_month = reduce_number(month)
    r_year = reduce_number(year)

    p1 = reduce_number(r_month + r_day)
    p2 = reduce_number(r_day + r_year)
    p3 = reduce_number(p1 + p2)
    p4 = reduce_number(r_month + r_year)
    pinnacles = [p1, p2, p3, p4]

    c1 = abs(r_month - r_day)
    c2 = abs(r_day - r_year)
    c3 = abs(c1 - c2)
    c4 = abs(r_month - r_year)
    challenges = [c1, c2, c3, c4]

    p_data = PLANET_INFO.get(mulank, PLANET_INFO[1])

    return NumerologyCalculationResult(
        mulank=mulank,
        bhagyank=bhagyank,
        name_number=name_num,
        soul_urge_number=soul_urge,
        personality_number=personality_num,
        karmic_debts=karmic_debts,
        master_numbers=master_numbers,
        loshu_grid=loshu_grid,
        missing_numbers=missing_numbers,
        present_numbers=present_numbers,
        personal_year=personal_year,
        personal_month=personal_month,
        personal_day=personal_day,
        compound_number=compound_number,
        compound_name=compound_name,
        planes_of_expression=planes,
        pinnacles=pinnacles,
        challenges=challenges,
        ruling_planet=p_data["planet"],
        lucky_colors=p_data["colors"],
        lucky_days=p_data["days"],
        lucky_gemstones=p_data["gemstones"],
        neutral_numbers=p_data["neutral"],
        enemy_numbers=p_data["enemies"],
        verified=True
    )
