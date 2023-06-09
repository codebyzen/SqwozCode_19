import numpy as np
import pandas as pd
import implicit
from implicit.als import AlternatingLeastSquares
import scipy.sparse as sp

from sqlalchemy import create_engine
import pymysql

import logging

from src.config import config_object

class mrg:

	logger = logging.getLogger("uvicorn.error")

	d3_mapping = {
	'3D-моделирование': 1,
	'Автомобильная школа': 2,
	'Авторская кукла. Базовый курс': 3,
	'Авторская кукла. Продвинутый курс': 4,
	'Авторские курсы/маршруты': 5,
	'Адаптивная и тонизирующая гимнастика': 6,
	'Акварельная живопись': 7,
	'Английская литература': 8,
	'Английский язык': 9,
	'Английский язык для начинающих': 10,
	'Английский язык для общения и путешествий. Базовый курс': 11,
	'Английский язык для общения и путешествий. Продвинутый курс': 12,
	'Английский язык разговорный': 13,
	'Английский язык. Базовый курс': 14,
	'Арабский язык': 15,
	'Архитектура Москвы и Подмосковья': 16,
	'Астрономия': 17,
	'Атлетическая гимнастика': 18,
	'Аэробика': 19,
	'Бадминтон': 20,
	'Бальные танцы': 21,
	'Бардовская песня': 22,
	'Баскетбол': 23,
	'Безопасность жизнедеятельности': 24,
	'Бесконфликтное поведение': 25,
	'Бильярд': 26,
	'Бисероплетение': 27,
	'Бодибалет': 28,
	'Большой теннис': 29,
	'Бояться нельзя или Смартфон для повседневной жизни': 30,
	'Валяние из шерсти': 31,
	'Взаимоотношения с детьми и внуками': 32,
	'Викторины': 33,
	'Витражное искусство': 34,
	'Волейбол': 35,
	'Волейбол (пионербол)': 36,
	'Восточные танцы': 37,
	'Все о смартфонах. Чему и как учиться? (ОС Android/IOS)': 38,
	'Вторая жизнь вещей': 39,
	'Вышивка атласными лентами': 40,
	'Вышивка бисером': 41,
	'Вышивка гладью и крестом': 42,
	'Вязание крючком': 43,
	'Вязание на спицах': 44,
	'ГТО': 45,
	'Генеалогия': 46,
	'География. Путешествия вокруг света': 47,
	'Гимнастика': 48,
	'Гимнастика мозга': 49,
	'Городки': 50,
	'Графика': 51,
	'Греческий язык': 52,
	'Дартс': 53,
	'Декупаж': 54,
	'Джиу-джицу искусство рукопашного боя': 55,
	'Дзюдо': 56,
	'Дизайн интерьера': 57,
	'Дизайн одежды': 58,
	'Дизайнер интерьера': 59,
	'Дискуссионный клуб': 60,
	'Добровольчество (волонтерство)': 61,
	'Доступный интернет': 62,
	'Дыхательная гимнастика': 63,
	'Дыхательная гимнастика по системе Стрельниковой': 64,
	'Защита от мошенников': 65,
	'Здоровая спина': 66,
	'Здорово жить': 67,
	'Здоровое похудение': 68,
	'Здоровый образ жизни (ЗОЖ)': 69,
	'Зумба': 70,
	'ИЗО': 71,
	'Изготовление аксессуаров и декоративных украшений': 72,
	'Изготовление и оформление фотоальбомов (Скрапбукинг)': 73,
	'Изготовление кукол, игрушек': 74,
	'Иное литературное творчество': 75,
	'Интернет-маркетинг': 76,
	'Информационные технологии для москвичей': 77,
	'Иные иностранные языки': 78,
	'Иные интеллектуальные игры': 79,
	'Иные настольные игры': 80,
	'Иные подвижные игры': 81,
	'Иппотерапия': 82,
	'Искусство коммуникаций': 83,
	'Испанский язык': 84,
	'Испанский язык для общения и путешествий. Базовый курс': 85,
	'Исторические танцы': 86,
	'История Москвы и России для всех поколений': 87,
	'История искусства': 88,
	'История кинематографа': 89,
	'История литературы': 90,
	'История моды и прически': 91,
	'История, культура Москвы': 92,
	'История, культура России': 93,
	'Итальянский язык': 94,
	'Итальянский язык для общения и путешествий. Базовый курс': 95,
	'Йога': 96,
	'Как остаться с внуками на ты или секреты межпоколенческой коммуникации': 97,
	'Как провести интересную экскурсию или организовать тур?': 98,
	'Калланетика': 99,
	'Канзаши (японские традиционные женские украшения из атласных лент)': 100,
	'Капоэйра— бразильское национальное боевое искусство': 101,
	'Караоке': 102,
	'Каратэ': 103,
	'Карвинг (искусство художественной резки по овощам и фруктам)': 104,
	'Керамика (глина, тестопластика)': 105,
	'Киберспорт': 106,
	'Кинолекторий': 107,
	'Китайская живопись У-Син': 108,
	'Китайский язык': 109,
	'Классические танцы': 110,
	'Клуб любителей истории': 111,
	'Клубные танцы': 112,
	'Компьютерная графика и дизайн': 113,
	'Короткий рисунок с живой натуры': 114,
	'Корригирующая гимнастика для глаз': 115,
	'Краеведение и пешие прогулки': 116,
	'Кружок правовой грамотности для людей предпенсионного возраста и пенсионеров': 117,
	'Кулинарные курсы': 118,
	'Курсы компьютерной грамотности': 119,
	'Ландшафтный дизайн': 120,
	'Латиноамериканские танцы': 121,
	'Лечебная физкультура': 122,
	'Линейные танцы': 123,
	'Литература': 124,
	'Литературная мастерская': 125,
	'Литературное творчество в современном мире. Базовый курс': 126,
	'Литературное творчество. Вводный курс': 127,
	'Лоскутное шитье': 128,
	'Лыжи': 129,
	'Макраме': 130,
	'Масляная живопись': 131,
	'Мастер-класс по уходу за кожей в зрелом возрасте': 132,
	'Ментальная арифметика': 133,
	'Мини-футбол': 134,
	'Младшая медсестра': 135,
	'Москва и москвичи': 136,
	'Москвоведение': 137,
	'Москвоведение. Я шагаю по Москве. Продвинутый курс': 138,
	'Московский театрал': 139,
	'Музыка': 140,
	'Народные танцы': 141,
	'Настольный теннис': 142,
	'Немецкий язык': 143,
	'Немецкий язык для общения и путешествий. Базовый курс': 144,
	'ОНЛАЙН Автомобильная школа': 145,
	'ОНЛАЙН Авторские курсы/маршруты': 146,
	'ОНЛАЙН Адаптивная и тонизирующая гимнастика': 147,
	'ОНЛАЙН Акварельная живопись': 148,
	'ОНЛАЙН Английская литература': 149,
	'ОНЛАЙН Английский язык': 150,
	'ОНЛАЙН Английский язык для начинающих': 151,
	'ОНЛАЙН Английский язык для общения и путешествий. Базовый курс': 152,
	'ОНЛАЙН Английский язык для общения и путешествий. Продвинутый курс': 153,
	'ОНЛАЙН Английский язык разговорный': 154,
	'ОНЛАЙН Арабский язык': 155,
	'ОНЛАЙН Архитектура Москвы и Подмосковья': 156,
	'ОНЛАЙН Астрономия': 157,
	'ОНЛАЙН Бальные танцы': 158,
	'ОНЛАЙН Бисероплетение': 159,
	'ОНЛАЙН Бояться нельзя или Смартфон для повседневной жизни': 160,
	'ОНЛАЙН Валяние из шерсти': 161,
	'ОНЛАЙН Викторины': 162,
	'ОНЛАЙН Витражное искусство': 163,
	'ОНЛАЙН Восточные танцы': 164,
	'ОНЛАЙН Все о смартфонах. Чему и как учиться? (ОС Android/IOS)': 165,
	'ОНЛАЙН Вторая жизнь вещей': 166,
	'ОНЛАЙН Вышивка атласными лентами': 167,
	'ОНЛАЙН Вышивка гладью и крестом': 168,
	'ОНЛАЙН Вязание крючком': 169,
	'ОНЛАЙН Вязание на спицах': 170,
	'ОНЛАЙН Генеалогия': 171,
	'ОНЛАЙН География. Путешествия вокруг света': 172,
	'ОНЛАЙН Гимнастика': 173,
	'ОНЛАЙН Гимнастика мозга': 174,
	'ОНЛАЙН Графика': 175,
	'ОНЛАЙН Греческий язык': 176,
	'ОНЛАЙН Декупаж': 177,
	'ОНЛАЙН Дизайн интерьера': 178,
	'ОНЛАЙН Дизайн одежды': 179,
	'ОНЛАЙН Дискуссионный клуб': 180,
	'ОНЛАЙН Доступный интернет': 181,
	'ОНЛАЙН Дыхательная гимнастика': 182,
	'ОНЛАЙН Дыхательная гимнастика по системе Стрельниковой': 183,
	'ОНЛАЙН Еда с умом и для ума': 184,
	'ОНЛАЙН Живопись с нуля (правополушарное рисование)': 185,
	'ОНЛАЙН Здоровая спина': 186,
	'ОНЛАЙН Здорово жить': 187,
	'ОНЛАЙН Здоровое похудение': 188,
	'ОНЛАЙН Здоровый образ жизни (ЗОЖ)': 189,
	'ОНЛАЙН Здоровый сон': 190,
	'ОНЛАЙН ИЗО': 191,
	'ОНЛАЙН Изготовление аксессуаров и декоративных украшений': 192,
	'ОНЛАЙН Изготовление кукол, игрушек': 193,
	'ОНЛАЙН Иное литературное творчество': 194,
	'ОНЛАЙН Информационное пространство жизни. Базовый курс': 195,
	'ОНЛАЙН Информационные технологии для москвичей': 196,
	'ОНЛАЙН Иные иностранные языки': 197,
	'ОНЛАЙН Иные интеллектуальные игры': 198,
	'ОНЛАЙН Иные настольные игры': 199,
	'ОНЛАЙН Искусство коммуникаций': 200,
	'ОНЛАЙН Испанский язык': 201,
	'ОНЛАЙН Испанский язык для общения и путешествий. Базовый курс': 202,
	'ОНЛАЙН История Москвы и России для всех поколений': 203,
	'ОНЛАЙН История зарубежного искусства': 204,
	'ОНЛАЙН История искусства': 205,
	'ОНЛАЙН История кинематографа': 206,
	'ОНЛАЙН История литературы': 207,
	'ОНЛАЙН История моды и прически': 208,
	'ОНЛАЙН История русского искусства': 209,
	'ОНЛАЙН История, культура Москвы': 210,
	'ОНЛАЙН История, культура России': 211,
	'ОНЛАЙН Итальянский язык': 212,
	'ОНЛАЙН Итальянский язык для общения и путешествий. Базовый курс': 213,
	'ОНЛАЙН Йога': 214,
	'ОНЛАЙН Как остаться с внуками на ты или секреты межпоколенческой коммуникации': 215,
	'ОНЛАЙН Как провести интересную экскурсию или организовать тур?': 216,
	'ОНЛАЙН Карвинг (искусство художественной резки по овощам и фруктам)': 217,
	'ОНЛАЙН Киберспорт': 218,
	'ОНЛАЙН Китайская живопись У-Син': 219,
	'ОНЛАЙН Китайский язык': 220,
	'ОНЛАЙН Классические танцы': 221,
	'ОНЛАЙН Клуб книголюбов': 222,
	'ОНЛАЙН Корригирующая гимнастика для глаз': 223,
	'ОНЛАЙН Краеведение и онлайн-экскурсии': 224,
	'ОНЛАЙН Краеведение и онлайн-экскурсии по Москве и России': 225,
	'ОНЛАЙН Краеведение и онлайн-экскурсии по миру': 226,
	'ОНЛАЙН Кулинарные курсы': 227,
	'ОНЛАЙН Курсы компьютерной грамотности': 228,
	'ОНЛАЙН Ландшафтный дизайн': 229,
	'ОНЛАЙН Латиноамериканские танцы': 230,
	'ОНЛАЙН Лечебная физкультура': 231,
	'ОНЛАЙН Литература': 232,
	'ОНЛАЙН Литературная мастерская': 233,
	'ОНЛАЙН Лоскутное шитье': 234,
	'ОНЛАЙН Масляная живопись': 235,
	'ОНЛАЙН Мастер-класс по уходу за кожей в зрелом возрасте': 236,
	'ОНЛАЙН Ментальная арифметика': 237,
	'ОНЛАЙН Москва и москвичи': 238,
	'ОНЛАЙН Москвоведение': 239,
	'ОНЛАЙН Московский театрал': 240,
	'ОНЛАЙН Музыка': 241,
	'ОНЛАЙН Музыкальная гостиная': 242,
	'ОНЛАЙН Наука': 243,
	'ОНЛАЙН Наше наследие: хранители истории': 244,
	'ОНЛАЙН Немецкий язык': 245,
	'ОНЛАЙН Немецкий язык для общения и путешествий. Базовый курс': 246,
	'ОНЛАЙН ОФП': 247,
	'ОНЛАЙН Обучение игре на гитаре': 248,
	'ОНЛАЙН Обучение игре на музыкальных инструментах': 249,
	'ОНЛАЙН Обучение игре на фортепьяно': 250,
	'ОНЛАЙН Огород на подоконнике': 251,
	'ОНЛАЙН Оздоровительная гимнастика': 252,
	'ОНЛАЙН Организация пространства': 253,
	'ОНЛАЙН Осваиваем мобильные устройства': 254,
	'ОНЛАЙН Основы академического рисунка и живописи': 255,
	'ОНЛАЙН Основы видеомонтажа: от идеи до результата. Базовый курс': 256,
	'ОНЛАЙН Основы духовной культуры': 257,
	'ОНЛАЙН Основы компьютерной графики: обработка фотографий в графических редакторах. Базовый курс': 258,
	'ОНЛАЙН Памятники мирового искусства. Базовый курс': 259,
	'ОНЛАЙН Памятники мирового искусства. Вводный курс': 260,
	'ОНЛАЙН Памятники отечественного искусства': 261,
	'ОНЛАЙН Педагог дополнительного образования': 262,
	'ОНЛАЙН Пение': 263,
	'ОНЛАЙН Перезагрузка (программа школы для помощи внукам)/ знай учебник лучше внука': 264,
	'ОНЛАЙН Плетение из бумаги, квиллинг, оригами': 265,
	'ОНЛАЙН Подарки своими руками': 266,
	'ОНЛАЙН Поэтический клуб': 267,
	'ОНЛАЙН Правильное питание': 268,
	'ОНЛАЙН Правовая грамотность': 269,
	'ОНЛАЙН Предпринимательская деятельность в малом и среднем бизнесе': 270,
	'ОНЛАЙН Прикладная живопись': 271,
	'ОНЛАЙН Продвинутый интернет': 272,
	'ОНЛАЙН Психологические тренинги': 273,
	'ОНЛАЙН Психологический лекторий "Всё только начинается"': 274,
	'ОНЛАЙН Психология дошкольника или как помочь внуку. Вводный курс': 275,
	'ОНЛАЙН Психология личностного роста серебряного возраста. Базовый курс': 276,
	'ОНЛАЙН Работа на компьютере и в социальных сетях': 277,
	'ОНЛАЙН Различные техники рисования': 278,
	'ОНЛАЙН Религиоведение': 279,
	'ОНЛАЙН Рисование анти-стресс': 280,
	'ОНЛАЙН Романсы': 281,
	'ОНЛАЙН Роспись по шелку (батик)': 282,
	'ОНЛАЙН Рукоделие и творчество': 283,
	'ОНЛАЙН Садоводство': 284,
	'ОНЛАЙН Свой бизнес, самозанятость': 285,
	'ОНЛАЙН Скорочтение': 286,
	'ОНЛАЙН Смартфон на каждый день (смартфон ОС IOS)': 287,
	'ОНЛАЙН Смартфоны и компьютеры - это удобно, практично': 288,
	'ОНЛАЙН Современные танцы': 289,
	'ОНЛАЙН Спортивные танцы': 290,
	'ОНЛАЙН Суставная гимнастика': 291,
	'ОНЛАЙН Тайцзи': 292,
	'ОНЛАЙН Танцевальная гимнастика': 293,
	'ОНЛАЙН Танцы для всех': 294,
	'ОНЛАЙН Текстильный дизайн, кройка и шитье': 295,
	'ОНЛАЙН Техника речи': 296,
	'ОНЛАЙН Тренинги личностного роста': 297,
	'ОНЛАЙН Турецкий язык': 298,
	'ОНЛАЙН Уход за волосами': 299,
	'ОНЛАЙН Уход и содержание домашних животных': 300,
	'ОНЛАЙН Ушу': 301,
	'ОНЛАЙН Физкультурно-оздоровительные занятия': 302,
	'ОНЛАЙН Фитодизайн': 303,
	'ОНЛАЙН Флористика': 304,
	'ОНЛАЙН Фольклор': 305,
	'ОНЛАЙН Фотостудия/видеостудия': 306,
	'ОНЛАЙН Французский язык': 307,
	'ОНЛАЙН Французский язык для общения и путешествий. Базовый курс': 308,
	'ОНЛАЙН Хореография': 309,
	'ОНЛАЙН Хоровое пение': 310,
	'ОНЛАЙН Художественное слово': 311,
	'ОНЛАЙН Церковнославянский язык': 312,
	'ОНЛАЙН Цигун': 313,
	'ОНЛАЙН Шахматы': 314,
	'ОНЛАЙН Шахматы и шашки': 315,
	'ОНЛАЙН Школа макияжа': 316,
	'ОНЛАЙН Школа моделей': 317,
	'ОНЛАЙН Школа пчеловода': 318,
	'ОНЛАЙН Экология человека. Как выжить в мегаполисе': 319,
	'ОНЛАЙН Экономическая, финансовая грамотность': 320,
	'ОНЛАЙН Экскурс в историю': 321,
	'ОНЛАЙН Электронные услуги: учимся пользоваться': 322,
	'ОНЛАЙН Эмоции, стресс и здоровье': 323,
	'ОНЛАЙН Эмоциональный интеллект': 324,
	'ОНЛАЙН Японский язык': 325,
	'ОФП': 326,
	'Обучение игре на гитаре': 327,
	'Обучение игре на музыкальных инструментах': 328,
	'Огород на подоконнике': 329,
	'Оздоровительная гимнастика': 330,
	'Оказание первой помощи': 331,
	'Организация пространства': 332,
	'Осваиваем мобильные устройства': 333,
	'Основы академического рисунка и живописи': 334,
	'Основы видеомонтажа: от идеи до результата. Базовый курс': 335,
	'Основы духовной культуры': 336,
	'Основы компьютерной графики: обработка фотографий в графических редакторах. Базовый курс': 337,
	'Основы реставрации мебели': 338,
	'Памятники культуры': 339,
	'Памятники мирового искусства. Базовый курс': 340,
	'Памятники отечественного искусства': 341,
	'Папье-маше': 342,
	'Пение': 343,
	'Перезагрузка (программа школы для помощи внукам)/ знай учебник лучше внука': 344,
	'Петанк (бочче)': 345,
	'Пилатес': 346,
	'Пилотное мастерство': 347,
	'Плетение Фриволите (кружево)': 348,
	'Плетение из бумаги, квиллинг, оригами': 349,
	'Подарки своими руками': 350,
	'Поэтические вечера': 351,
	'Правильное питание': 352,
	'Правовая грамотность': 353,
	'Предпринимательская деятельность в малом и среднем бизнесе': 354,
	'Прикладная живопись': 355,
	'Продвинутый интернет': 356,
	'Психологические проблемы общения. Базовый курс': 357,
	'Психологические тренинги': 358,
	'Психологический лекторий': 359,
	'Психологический лекторий "Всё только начинается"': 360,
	'Психология личностного роста серебряного возраста. Базовый курс': 361,
	'Психология развития': 362,
	'Работа на компьютере и в социальных сетях': 363,
	'Работа с офисными приложениями. Базовый курс': 364,
	'Различные техники рисования': 365,
	'Регби': 366,
	'Религиоведение': 367,
	'Рисование анти-стресс': 368,
	'Рисуем песком': 369,
	'Рисунок/графика': 370,
	'Ритмика и движение': 371,
	'Романсы': 372,
	'Роспись по дереву. Художественная обработка древесины': 373,
	'Роспись по шелку (батик)': 374,
	'Рукоделие и творчество': 375,
	'Русское лото': 376,
	'Садоводство': 377,
	'Самбо': 378,
	'Свободное посещение': 379,
	'Свой бизнес, самозанятость': 380,
	'Секреты добрососедства': 381,
	'Секреты немецкой грамматики. Продвинутый курс': 382,
	'Скалолазание': 383,
	'Скандинавская ходьба': 384,
	'Скорочтение': 385,
	'Смартфоны и компьютеры - это удобно, практично': 386,
	'Современная песня': 387,
	'Современные настольные игры': 388,
	'Современные средства и инструменты удаленного общения на смартфоне, планшете ОС Андроид. Продвинутый курс': 389,
	'Современные танцы': 390,
	'Современный этикет. Практический курс': 391,
	'Спортивные танцы': 392,
	'Степ-аэробика': 393,
	'Стрейчинг': 394,
	'Стрельба из лука': 395,
	'Студия семейного досуга и творчества': 396,
	'Суставная гимнастика': 397,
	'Тайцзи': 398,
	'Танцевальная гимнастика': 399,
	'Танцевальная физкультура': 400,
	'Танцевальные вечера': 401,
	'Танцы для всех': 402,
	'Творческие встречи': 403,
	'Текстильный дизайн, кройка и шитье': 404,
	'Техника речи': 405,
	'Тир. Стрельба из пневматического/лазерного оружия': 406,
	'Тренажер развития познавательных способностей': 407,
	'Тренажеры': 408,
	'Тренинги личностного роста': 409,
	'Тренировки долголетия (спецпроект по медицинской реабилитации)': 410,
	'Турецкий язык': 411,
	'Тхэквондо': 412,
	'Уход за волосами': 413,
	'Уход и содержание домашних животных': 414,
	'Ушу': 415,
	'Фигурное катание': 416,
	'Физкультурно-оздоровительные занятия': 417,
	'Фитнес': 418,
	'Фитодизайн': 419,
	'Фламенко': 420,
	'Флористика': 421,
	'Фольклор': 422,
	'Фольклорная песня': 423,
	'Фотостудия/видеостудия': 424,
	'Французский язык': 425,
	'Французский язык для общения и путешествий. Базовый курс': 426,
	'Французский язык продвинутый курс': 427,
	'Футбол': 428,
	'Хоккей/хоккей на траве/хоккей в зале': 429,
	'Хореография': 430,
	'Хоровое пение': 431,
	'Художественное слово': 432,
	'Художественные промыслы': 433,
	'Церковнославянский язык': 434,
	'Цигун': 435,
	'Шахматы': 436,
	'Шахматы и шашки': 437,
	'Шашки': 438,
	'Шейпинг': 439,
	'Школа макияжа': 440,
	'Школа маникюра': 441,
	'Школа моделей': 442,
	'Эко-практикум и эко-привычки': 443,
	'Эко-просвещение': 444,
	'Экологические программы': 445,
	'Экономическая, финансовая грамотность': 446,
	'Экскурс в историю': 447,
	'Экскурсионные программы в музеях': 448,
	'Экскурсоведение': 449,
	'Электронные услуги: учимся пользоваться': 450,
	'Эмоциональный интеллект': 451,
	'Я – москвовед. Москва златоглавая. Базовый курс': 452,
	'Японский язык': 453}

	d3_reverse_mapping = {
 1: '3D-моделирование',
 2: 'Автомобильная школа',
 3: 'Авторская кукла. Базовый курс',
 4: 'Авторская кукла. Продвинутый курс',
 5: 'Авторские курсы/маршруты',
 6: 'Адаптивная и тонизирующая гимнастика',
 7: 'Акварельная живопись',
 8: 'Английская литература',
 9: 'Английский язык',
 10: 'Английский язык для начинающих',
 11: 'Английский язык для общения и путешествий. Базовый курс',
 12: 'Английский язык для общения и путешествий. Продвинутый курс',
 13: 'Английский язык разговорный',
 14: 'Английский язык. Базовый курс',
 15: 'Арабский язык',
 16: 'Архитектура Москвы и Подмосковья',
 17: 'Астрономия',
 18: 'Атлетическая гимнастика',
 19: 'Аэробика',
 20: 'Бадминтон',
 21: 'Бальные танцы',
 22: 'Бардовская песня',
 23: 'Баскетбол',
 24: 'Безопасность жизнедеятельности',
 25: 'Бесконфликтное поведение',
 26: 'Бильярд',
 27: 'Бисероплетение',
 28: 'Бодибалет',
 29: 'Большой теннис',
 30: 'Бояться нельзя или Смартфон для повседневной жизни',
 31: 'Валяние из шерсти',
 32: 'Взаимоотношения с детьми и внуками',
 33: 'Викторины',
 34: 'Витражное искусство',
 35: 'Волейбол',
 36: 'Волейбол (пионербол)',
 37: 'Восточные танцы',
 38: 'Все о смартфонах. Чему и как учиться? (ОС Android/IOS)',
 39: 'Вторая жизнь вещей',
 40: 'Вышивка атласными лентами',
 41: 'Вышивка бисером',
 42: 'Вышивка гладью и крестом',
 43: 'Вязание крючком',
 44: 'Вязание на спицах',
 45: 'ГТО',
 46: 'Генеалогия',
 47: 'География. Путешествия вокруг света',
 48: 'Гимнастика',
 49: 'Гимнастика мозга',
 50: 'Городки',
 51: 'Графика',
 52: 'Греческий язык',
 53: 'Дартс',
 54: 'Декупаж',
 55: 'Джиу-джицу искусство рукопашного боя',
 56: 'Дзюдо',
 57: 'Дизайн интерьера',
 58: 'Дизайн одежды',
 59: 'Дизайнер интерьера',
 60: 'Дискуссионный клуб',
 61: 'Добровольчество (волонтерство)',
 62: 'Доступный интернет',
 63: 'Дыхательная гимнастика',
 64: 'Дыхательная гимнастика по системе Стрельниковой',
 65: 'Защита от мошенников',
 66: 'Здоровая спина',
 67: 'Здорово жить',
 68: 'Здоровое похудение',
 69: 'Здоровый образ жизни (ЗОЖ)',
 70: 'Зумба',
 71: 'ИЗО',
 72: 'Изготовление аксессуаров и декоративных украшений',
 73: 'Изготовление и оформление фотоальбомов (Скрапбукинг)',
 74: 'Изготовление кукол, игрушек',
 75: 'Иное литературное творчество',
 76: 'Интернет-маркетинг',
 77: 'Информационные технологии для москвичей',
 78: 'Иные иностранные языки',
 79: 'Иные интеллектуальные игры',
 80: 'Иные настольные игры',
 81: 'Иные подвижные игры',
 82: 'Иппотерапия',
 83: 'Искусство коммуникаций',
 84: 'Испанский язык',
 85: 'Испанский язык для общения и путешествий. Базовый курс',
 86: 'Исторические танцы',
 87: 'История Москвы и России для всех поколений',
 88: 'История искусства',
 89: 'История кинематографа',
 90: 'История литературы',
 91: 'История моды и прически',
 92: 'История, культура Москвы',
 93: 'История, культура России',
 94: 'Итальянский язык',
 95: 'Итальянский язык для общения и путешествий. Базовый курс',
 96: 'Йога',
 97: 'Как остаться с внуками на ты или секреты межпоколенческой коммуникации',
 98: 'Как провести интересную экскурсию или организовать тур?',
 99: 'Калланетика',
 100: 'Канзаши (японские традиционные женские украшения из атласных лент)',
 101: 'Капоэйра— бразильское национальное боевое искусство',
 102: 'Караоке',
 103: 'Каратэ',
 104: 'Карвинг (искусство художественной резки по овощам и фруктам)',
 105: 'Керамика (глина, тестопластика)',
 106: 'Киберспорт',
 107: 'Кинолекторий',
 108: 'Китайская живопись У-Син',
 109: 'Китайский язык',
 110: 'Классические танцы',
 111: 'Клуб любителей истории',
 112: 'Клубные танцы',
 113: 'Компьютерная графика и дизайн',
 114: 'Короткий рисунок с живой натуры',
 115: 'Корригирующая гимнастика для глаз',
 116: 'Краеведение и пешие прогулки',
 117: 'Кружок правовой грамотности для людей предпенсионного возраста и пенсионеров',
 118: 'Кулинарные курсы',
 119: 'Курсы компьютерной грамотности',
 120: 'Ландшафтный дизайн',
 121: 'Латиноамериканские танцы',
 122: 'Лечебная физкультура',
 123: 'Линейные танцы',
 124: 'Литература',
 125: 'Литературная мастерская',
 126: 'Литературное творчество в современном мире. Базовый курс',
 127: 'Литературное творчество. Вводный курс',
 128: 'Лоскутное шитье',
 129: 'Лыжи',
 130: 'Макраме',
 131: 'Масляная живопись',
 132: 'Мастер-класс по уходу за кожей в зрелом возрасте',
 133: 'Ментальная арифметика',
 134: 'Мини-футбол',
 135: 'Младшая медсестра',
 136: 'Москва и москвичи',
 137: 'Москвоведение',
 138: 'Москвоведение. Я шагаю по Москве. Продвинутый курс',
 139: 'Московский театрал',
 140: 'Музыка',
 141: 'Народные танцы',
 142: 'Настольный теннис',
 143: 'Немецкий язык',
 144: 'Немецкий язык для общения и путешествий. Базовый курс',
 145: 'ОНЛАЙН Автомобильная школа',
 146: 'ОНЛАЙН Авторские курсы/маршруты',
 147: 'ОНЛАЙН Адаптивная и тонизирующая гимнастика',
 148: 'ОНЛАЙН Акварельная живопись',
 149: 'ОНЛАЙН Английская литература',
 150: 'ОНЛАЙН Английский язык',
 151: 'ОНЛАЙН Английский язык для начинающих',
 152: 'ОНЛАЙН Английский язык для общения и путешествий. Базовый курс',
 153: 'ОНЛАЙН Английский язык для общения и путешествий. Продвинутый курс',
 154: 'ОНЛАЙН Английский язык разговорный',
 155: 'ОНЛАЙН Арабский язык',
 156: 'ОНЛАЙН Архитектура Москвы и Подмосковья',
 157: 'ОНЛАЙН Астрономия',
 158: 'ОНЛАЙН Бальные танцы',
 159: 'ОНЛАЙН Бисероплетение',
 160: 'ОНЛАЙН Бояться нельзя или Смартфон для повседневной жизни',
 161: 'ОНЛАЙН Валяние из шерсти',
 162: 'ОНЛАЙН Викторины',
 163: 'ОНЛАЙН Витражное искусство',
 164: 'ОНЛАЙН Восточные танцы',
 165: 'ОНЛАЙН Все о смартфонах. Чему и как учиться? (ОС Android/IOS)',
 166: 'ОНЛАЙН Вторая жизнь вещей',
 167: 'ОНЛАЙН Вышивка атласными лентами',
 168: 'ОНЛАЙН Вышивка гладью и крестом',
 169: 'ОНЛАЙН Вязание крючком',
 170: 'ОНЛАЙН Вязание на спицах',
 171: 'ОНЛАЙН Генеалогия',
 172: 'ОНЛАЙН География. Путешествия вокруг света',
 173: 'ОНЛАЙН Гимнастика',
 174: 'ОНЛАЙН Гимнастика мозга',
 175: 'ОНЛАЙН Графика',
 176: 'ОНЛАЙН Греческий язык',
 177: 'ОНЛАЙН Декупаж',
 178: 'ОНЛАЙН Дизайн интерьера',
 179: 'ОНЛАЙН Дизайн одежды',
 180: 'ОНЛАЙН Дискуссионный клуб',
 181: 'ОНЛАЙН Доступный интернет',
 182: 'ОНЛАЙН Дыхательная гимнастика',
 183: 'ОНЛАЙН Дыхательная гимнастика по системе Стрельниковой',
 184: 'ОНЛАЙН Еда с умом и для ума',
 185: 'ОНЛАЙН Живопись с нуля (правополушарное рисование)',
 186: 'ОНЛАЙН Здоровая спина',
 187: 'ОНЛАЙН Здорово жить',
 188: 'ОНЛАЙН Здоровое похудение',
 189: 'ОНЛАЙН Здоровый образ жизни (ЗОЖ)',
 190: 'ОНЛАЙН Здоровый сон',
 191: 'ОНЛАЙН ИЗО',
 192: 'ОНЛАЙН Изготовление аксессуаров и декоративных украшений',
 193: 'ОНЛАЙН Изготовление кукол, игрушек',
 194: 'ОНЛАЙН Иное литературное творчество',
 195: 'ОНЛАЙН Информационное пространство жизни. Базовый курс',
 196: 'ОНЛАЙН Информационные технологии для москвичей',
 197: 'ОНЛАЙН Иные иностранные языки',
 198: 'ОНЛАЙН Иные интеллектуальные игры',
 199: 'ОНЛАЙН Иные настольные игры',
 200: 'ОНЛАЙН Искусство коммуникаций',
 201: 'ОНЛАЙН Испанский язык',
 202: 'ОНЛАЙН Испанский язык для общения и путешествий. Базовый курс',
 203: 'ОНЛАЙН История Москвы и России для всех поколений',
 204: 'ОНЛАЙН История зарубежного искусства',
 205: 'ОНЛАЙН История искусства',
 206: 'ОНЛАЙН История кинематографа',
 207: 'ОНЛАЙН История литературы',
 208: 'ОНЛАЙН История моды и прически',
 209: 'ОНЛАЙН История русского искусства',
 210: 'ОНЛАЙН История, культура Москвы',
 211: 'ОНЛАЙН История, культура России',
 212: 'ОНЛАЙН Итальянский язык',
 213: 'ОНЛАЙН Итальянский язык для общения и путешествий. Базовый курс',
 214: 'ОНЛАЙН Йога',
 215: 'ОНЛАЙН Как остаться с внуками на ты или секреты межпоколенческой коммуникации',
 216: 'ОНЛАЙН Как провести интересную экскурсию или организовать тур?',
 217: 'ОНЛАЙН Карвинг (искусство художественной резки по овощам и фруктам)',
 218: 'ОНЛАЙН Киберспорт',
 219: 'ОНЛАЙН Китайская живопись У-Син',
 220: 'ОНЛАЙН Китайский язык',
 221: 'ОНЛАЙН Классические танцы',
 222: 'ОНЛАЙН Клуб книголюбов',
 223: 'ОНЛАЙН Корригирующая гимнастика для глаз',
 224: 'ОНЛАЙН Краеведение и онлайн-экскурсии',
 225: 'ОНЛАЙН Краеведение и онлайн-экскурсии по Москве и России',
 226: 'ОНЛАЙН Краеведение и онлайн-экскурсии по миру',
 227: 'ОНЛАЙН Кулинарные курсы',
 228: 'ОНЛАЙН Курсы компьютерной грамотности',
 229: 'ОНЛАЙН Ландшафтный дизайн',
 230: 'ОНЛАЙН Латиноамериканские танцы',
 231: 'ОНЛАЙН Лечебная физкультура',
 232: 'ОНЛАЙН Литература',
 233: 'ОНЛАЙН Литературная мастерская',
 234: 'ОНЛАЙН Лоскутное шитье',
 235: 'ОНЛАЙН Масляная живопись',
 236: 'ОНЛАЙН Мастер-класс по уходу за кожей в зрелом возрасте',
 237: 'ОНЛАЙН Ментальная арифметика',
 238: 'ОНЛАЙН Москва и москвичи',
 239: 'ОНЛАЙН Москвоведение',
 240: 'ОНЛАЙН Московский театрал',
 241: 'ОНЛАЙН Музыка',
 242: 'ОНЛАЙН Музыкальная гостиная',
 243: 'ОНЛАЙН Наука',
 244: 'ОНЛАЙН Наше наследие: хранители истории',
 245: 'ОНЛАЙН Немецкий язык',
 246: 'ОНЛАЙН Немецкий язык для общения и путешествий. Базовый курс',
 247: 'ОНЛАЙН ОФП',
 248: 'ОНЛАЙН Обучение игре на гитаре',
 249: 'ОНЛАЙН Обучение игре на музыкальных инструментах',
 250: 'ОНЛАЙН Обучение игре на фортепьяно',
 251: 'ОНЛАЙН Огород на подоконнике',
 252: 'ОНЛАЙН Оздоровительная гимнастика',
 253: 'ОНЛАЙН Организация пространства',
 254: 'ОНЛАЙН Осваиваем мобильные устройства',
 255: 'ОНЛАЙН Основы академического рисунка и живописи',
 256: 'ОНЛАЙН Основы видеомонтажа: от идеи до результата. Базовый курс',
 257: 'ОНЛАЙН Основы духовной культуры',
 258: 'ОНЛАЙН Основы компьютерной графики: обработка фотографий в графических редакторах. Базовый курс',
 259: 'ОНЛАЙН Памятники мирового искусства. Базовый курс',
 260: 'ОНЛАЙН Памятники мирового искусства. Вводный курс',
 261: 'ОНЛАЙН Памятники отечественного искусства',
 262: 'ОНЛАЙН Педагог дополнительного образования',
 263: 'ОНЛАЙН Пение',
 264: 'ОНЛАЙН Перезагрузка (программа школы для помощи внукам)/ знай учебник лучше внука',
 265: 'ОНЛАЙН Плетение из бумаги, квиллинг, оригами',
 266: 'ОНЛАЙН Подарки своими руками',
 267: 'ОНЛАЙН Поэтический клуб',
 268: 'ОНЛАЙН Правильное питание',
 269: 'ОНЛАЙН Правовая грамотность',
 270: 'ОНЛАЙН Предпринимательская деятельность в малом и среднем бизнесе',
 271: 'ОНЛАЙН Прикладная живопись',
 272: 'ОНЛАЙН Продвинутый интернет',
 273: 'ОНЛАЙН Психологические тренинги',
 274: 'ОНЛАЙН Психологический лекторий "Всё только начинается"',
 275: 'ОНЛАЙН Психология дошкольника или как помочь внуку. Вводный курс',
 276: 'ОНЛАЙН Психология личностного роста серебряного возраста. Базовый курс',
 277: 'ОНЛАЙН Работа на компьютере и в социальных сетях',
 278: 'ОНЛАЙН Различные техники рисования',
 279: 'ОНЛАЙН Религиоведение',
 280: 'ОНЛАЙН Рисование анти-стресс',
 281: 'ОНЛАЙН Романсы',
 282: 'ОНЛАЙН Роспись по шелку (батик)',
 283: 'ОНЛАЙН Рукоделие и творчество',
 284: 'ОНЛАЙН Садоводство',
 285: 'ОНЛАЙН Свой бизнес, самозанятость',
 286: 'ОНЛАЙН Скорочтение',
 287: 'ОНЛАЙН Смартфон на каждый день (смартфон ОС IOS)',
 288: 'ОНЛАЙН Смартфоны и компьютеры - это удобно, практично',
 289: 'ОНЛАЙН Современные танцы',
 290: 'ОНЛАЙН Спортивные танцы',
 291: 'ОНЛАЙН Суставная гимнастика',
 292: 'ОНЛАЙН Тайцзи',
 293: 'ОНЛАЙН Танцевальная гимнастика',
 294: 'ОНЛАЙН Танцы для всех',
 295: 'ОНЛАЙН Текстильный дизайн, кройка и шитье',
 296: 'ОНЛАЙН Техника речи',
 297: 'ОНЛАЙН Тренинги личностного роста',
 298: 'ОНЛАЙН Турецкий язык',
 299: 'ОНЛАЙН Уход за волосами',
 300: 'ОНЛАЙН Уход и содержание домашних животных',
 301: 'ОНЛАЙН Ушу',
 302: 'ОНЛАЙН Физкультурно-оздоровительные занятия',
 303: 'ОНЛАЙН Фитодизайн',
 304: 'ОНЛАЙН Флористика',
 305: 'ОНЛАЙН Фольклор',
 306: 'ОНЛАЙН Фотостудия/видеостудия',
 307: 'ОНЛАЙН Французский язык',
 308: 'ОНЛАЙН Французский язык для общения и путешествий. Базовый курс',
 309: 'ОНЛАЙН Хореография',
 310: 'ОНЛАЙН Хоровое пение',
 311: 'ОНЛАЙН Художественное слово',
 312: 'ОНЛАЙН Церковнославянский язык',
 313: 'ОНЛАЙН Цигун',
 314: 'ОНЛАЙН Шахматы',
 315: 'ОНЛАЙН Шахматы и шашки',
 316: 'ОНЛАЙН Школа макияжа',
 317: 'ОНЛАЙН Школа моделей',
 318: 'ОНЛАЙН Школа пчеловода',
 319: 'ОНЛАЙН Экология человека. Как выжить в мегаполисе',
 320: 'ОНЛАЙН Экономическая, финансовая грамотность',
 321: 'ОНЛАЙН Экскурс в историю',
 322: 'ОНЛАЙН Электронные услуги: учимся пользоваться',
 323: 'ОНЛАЙН Эмоции, стресс и здоровье',
 324: 'ОНЛАЙН Эмоциональный интеллект',
 325: 'ОНЛАЙН Японский язык',
 326: 'ОФП',
 327: 'Обучение игре на гитаре',
 328: 'Обучение игре на музыкальных инструментах',
 329: 'Огород на подоконнике',
 330: 'Оздоровительная гимнастика',
 331: 'Оказание первой помощи',
 332: 'Организация пространства',
 333: 'Осваиваем мобильные устройства',
 334: 'Основы академического рисунка и живописи',
 335: 'Основы видеомонтажа: от идеи до результата. Базовый курс',
 336: 'Основы духовной культуры',
 337: 'Основы компьютерной графики: обработка фотографий в графических редакторах. Базовый курс',
 338: 'Основы реставрации мебели',
 339: 'Памятники культуры',
 340: 'Памятники мирового искусства. Базовый курс',
 341: 'Памятники отечественного искусства',
 342: 'Папье-маше',
 343: 'Пение',
 344: 'Перезагрузка (программа школы для помощи внукам)/ знай учебник лучше внука',
 345: 'Петанк (бочче)',
 346: 'Пилатес',
 347: 'Пилотное мастерство',
 348: 'Плетение Фриволите (кружево)',
 349: 'Плетение из бумаги, квиллинг, оригами',
 350: 'Подарки своими руками',
 351: 'Поэтические вечера',
 352: 'Правильное питание',
 353: 'Правовая грамотность',
 354: 'Предпринимательская деятельность в малом и среднем бизнесе',
 355: 'Прикладная живопись',
 356: 'Продвинутый интернет',
 357: 'Психологические проблемы общения. Базовый курс',
 358: 'Психологические тренинги',
 359: 'Психологический лекторий',
 360: 'Психологический лекторий "Всё только начинается"',
 361: 'Психология личностного роста серебряного возраста. Базовый курс',
 362: 'Психология развития',
 363: 'Работа на компьютере и в социальных сетях',
 364: 'Работа с офисными приложениями. Базовый курс',
 365: 'Различные техники рисования',
 366: 'Регби',
 367: 'Религиоведение',
 368: 'Рисование анти-стресс',
 369: 'Рисуем песком',
 370: 'Рисунок/графика',
 371: 'Ритмика и движение',
 372: 'Романсы',
 373: 'Роспись по дереву. Художественная обработка древесины',
 374: 'Роспись по шелку (батик)',
 375: 'Рукоделие и творчество',
 376: 'Русское лото',
 377: 'Садоводство',
 378: 'Самбо',
 379: 'Свободное посещение',
 380: 'Свой бизнес, самозанятость',
 381: 'Секреты добрососедства',
 382: 'Секреты немецкой грамматики. Продвинутый курс',
 383: 'Скалолазание',
 384: 'Скандинавская ходьба',
 385: 'Скорочтение',
 386: 'Смартфоны и компьютеры - это удобно, практично',
 387: 'Современная песня',
 388: 'Современные настольные игры',
 389: 'Современные средства и инструменты удаленного общения на смартфоне, планшете ОС Андроид. Продвинутый курс',
 390: 'Современные танцы',
 391: 'Современный этикет. Практический курс',
 392: 'Спортивные танцы',
 393: 'Степ-аэробика',
 394: 'Стрейчинг',
 395: 'Стрельба из лука',
 396: 'Студия семейного досуга и творчества',
 397: 'Суставная гимнастика',
 398: 'Тайцзи',
 399: 'Танцевальная гимнастика',
 400: 'Танцевальная физкультура',
 401: 'Танцевальные вечера',
 402: 'Танцы для всех',
 403: 'Творческие встречи',
 404: 'Текстильный дизайн, кройка и шитье',
 405: 'Техника речи',
 406: 'Тир. Стрельба из пневматического/лазерного оружия',
 407: 'Тренажер развития познавательных способностей',
 408: 'Тренажеры',
 409: 'Тренинги личностного роста',
 410: 'Тренировки долголетия (спецпроект по медицинской реабилитации)',
 411: 'Турецкий язык',
 412: 'Тхэквондо',
 413: 'Уход за волосами',
 414: 'Уход и содержание домашних животных',
 415: 'Ушу',
 416: 'Фигурное катание',
 417: 'Физкультурно-оздоровительные занятия',
 418: 'Фитнес',
 419: 'Фитодизайн',
 420: 'Фламенко',
 421: 'Флористика',
 422: 'Фольклор',
 423: 'Фольклорная песня',
 424: 'Фотостудия/видеостудия',
 425: 'Французский язык',
 426: 'Французский язык для общения и путешествий. Базовый курс',
 427: 'Французский язык продвинутый курс',
 428: 'Футбол',
 429: 'Хоккей/хоккей на траве/хоккей в зале',
 430: 'Хореография',
 431: 'Хоровое пение',
 432: 'Художественное слово',
 433: 'Художественные промыслы',
 434: 'Церковнославянский язык',
 435: 'Цигун',
 436: 'Шахматы',
 437: 'Шахматы и шашки',
 438: 'Шашки',
 439: 'Шейпинг',
 440: 'Школа макияжа',
 441: 'Школа маникюра',
 442: 'Школа моделей',
 443: 'Эко-практикум и эко-привычки',
 444: 'Эко-просвещение',
 445: 'Экологические программы',
 446: 'Экономическая, финансовая грамотность',
 447: 'Экскурс в историю',
 448: 'Экскурсионные программы в музеях',
 449: 'Экскурсоведение',
 450: 'Электронные услуги: учимся пользоваться',
 451: 'Эмоциональный интеллект',
 452: 'Я – москвовед. Москва златоглавая. Базовый курс',
 453: 'Японский язык'}

	df_groups_april = None
	df_users = None
	df_activities = None
	deleted_recs = None
	activities_to_recommend = None

	def count_online_top10(self,recs):
		return sum([int('ОНЛАЙН' in r) for r in recs[:10]])

	def del_online_from_top10(self,recs):
		while (self.count_online_top10(recs) > 7 and len(recs) > 10):
			for k in range(9, 0, -1):
				if 'ОНЛАЙН' in recs[k]:
					self.deleted_recs.append(recs[k])
					del recs[k]
					break
		return recs



	def get_offline_groups_list(self, district, adp, gc, activity):
		# Если офлайн, то делаем выборку по району и предпочитаемому времени
		groups_list = list(self.df_groups_april[(self.df_groups_april['district'] == district) & (self.df_groups_april['day_part'] == adp) & (self.df_groups_april['dir3'] == activity)]['groupid'])
		if len(groups_list):
			return groups_list
		else:
			# Если не нашлась подходящая группа, то пробуем убрать фильтр по времени посещения
			groups_list = list(self.df_groups_april[(self.df_groups_april['district'] == district) & (self.df_groups_april['dir3'] == activity)]['groupid'])
			if len(groups_list):
				return groups_list
			else:
				# Если не нашлась подходящая группа, то расширяем район до геокластера время возвращаем на место
				groups_list = list(self.df_groups_april[(self.df_groups_april['geocluster'] == gc) & (self.df_groups_april['day_part'] == adp) & (self.df_groups_april['dir3'] == activity)]['groupid'])
				if len(groups_list):
					return groups_list
				else:
					# Если и это не помогло, то оставляем выборку только по геокластеру
					groups_list = list(self.df_groups_april[(self.df_groups_april['geocluster'] == gc) & (self.df_groups_april['dir3'] == activity)]['groupid'])
					return groups_list

	
	def init(self, arg_userid):
		uid_real = arg_userid # 101400129
		# в скрипт прилетает реальный user_id, а запросом к базе мы должны забрать ml_id из таблицы users_PROD,
		# соответствующий реальному user_id

		config = config_object()
		sqlEngine = create_engine(config.mysql_str(), pool_recycle=3600)
		dbConnection = sqlEngine.connect()
		
		self.df_users = pd.read_sql("select * from ml_users WHERE userid = "+str(arg_userid), dbConnection)
		user_id = self.df_users['ml_id'][0]
		
		# pd.set_option('display.expand_frame_repr', False)
		# print(df_users)

		# df_users = pd.read_csv('users_PROD.csv')
		# user_id = int(list(self.df_users[self.df_users['userid'] == uid_real]['ml_id'])[0])

		# Вместе с этим я забираю район пользака, предпочтительное время посещений и геокластер
		
		# df_user = self.df_users[['district', 'active_day_part', 'geocluster']]
		# df_user = self.df_users[self.df_users['userid'] == uid_real][['district', 'active_day_part', 'geocluster']]
		
		district, adp, gc = list(self.df_users['district'])[0], list(self.df_users['active_day_part'])[0], list(self.df_users['geocluster'])[0]

		# self.df_groups_april = pd.read_sql("select * from ml_groups_april", dbConnection)
		self.df_groups_april = pd.read_csv('../db/groups_april.csv')

		self.deleted_recs = []

		# self.logger.info("1")

		# Сейчас беру данные из csv, но можно доставать из базы. С другой стороны файлики маленькие, должны считаться быстро,
		# либо заведём две мелких базы под них
		# self.df_activities = pd.read_sql("select * from ml_activities", dbConnection)
		self.df_activities = pd.read_csv('../db/activities_PROD.csv')
		
		# self.df_ml = pd.read_sql("select * from ml_ratings", dbConnection)
		self.df_ml = pd.read_csv('../db/ratings_PROD.csv')
		# self.logger.info("1.0")

		# Составим разреженную матрицу рейтингов активностей, назовем ее X_ratings, для неё мне как раз нужен df_ml

		X_ratings = sp.coo_matrix((self.df_ml['lid'], (self.df_ml['user_ID'], self.df_ml['dir3_ID'])), dtype=float)
		# self.logger.info("1.0.1")
		X_ratings = X_ratings.tocsr()

		# self.logger.info("1.1")
		model = implicit.cpu.als.AlternatingLeastSquares.load("../models/sqwozcodeals142")
		# self.logger.info("2")

		recos, _ = model.recommend(user_id, X_ratings[user_id], N=30, filter_already_liked_items=True)
		textrec = [self.d3_reverse_mapping[r] for r in recos]
		if self.count_online_top10(textrec) > 7:
			textrec = self.del_online_from_top10(textrec)

		self.activities_to_recommend = textrec + self.deleted_recs

		# print(self.activities_to_recommend[:10])
		# self.logger.info("3")
		groups_array = []
		for activity in self.activities_to_recommend:
			if 'ОНЛАЙН' in activity:
				# Если онлайн-активность, то забираем список всех групп с такой активностью, подходящих по времени
				groups_list = list(self.df_groups_april[(self.df_groups_april['dir3'] == activity) & (self.df_groups_april['day_part'] == adp)]['groupid'])
				if len(groups_list) == 0:
					groups_list = list(self.df_groups_april[self.df_groups_april['dir3'] == activity]['groupid'])
			else:
				#тут вызываем функцию, которая будет лазить в базу и забирать все активности, подходящие по времени
				groups_list = self.get_offline_groups_list(district, adp, gc, activity)
			if len(groups_list):
				groups_array.append(groups_list)
			if len(groups_array) == 10:
				break

		groups_list = []
		for g in groups_array:
			groups_list.append(g[np.random.randint(len(g))])

		dbConnection.close()
		return groups_list


