/* eslint-disable sonarjs/no-duplicate-string */
import { Matrix } from '@/shared/types/Matrix';
import { TVFeatureType } from './types';

// const numValidate = (value: any) => {
//     // Если числа нет просто скип
//     if (value === null || value === undefined || value === '') return true
//     // Если что-то да есть, то пусть парсфлоат вернёт какое-нибудь число
//     if (Number.isNaN(parseFloat(value))) return 'Данное поле - число'
// }
const intValidate = (num: any) => {
    // Если числа нет просто скип
    if (num === null || num === undefined || num === '') return true
    // Если что-то да есть, то пусть парсфлоат вернёт какое-нибудь число
    if (Number.isNaN(parseFloat(num))) return 'Данное поле - число'
    if (!Number.isInteger(parseFloat(num))) return 'Данное поле - целое число'
}
const setNumber = (value: any) => {
    if (!value && value !== 0) return null
    return Number.isNaN(+value) ? null : +value
}

// type = one-option, many-options, true/false,input 
export const TVFeatures: TVFeatureType[] = [
    {
        type: 'input',
        name: 'name',
        options: {
            required: {
                value: true,
                message: 'Ну введи название телевизора'
            },
            minLength: {
                value: 10,
                message: 'Ну как будто слишком короткое название, накинь ещё'
            },
            maxLength: {
                value: 500,
                message: 'Ну слишком длинное название, реально'
            }
        },
        title: 'Название телевизора',
        placeholder: 'Введи название телевизора'
    },
    {
        type: 'input',
        name: 'price',
        title: 'Цена',
        placeholder: 'Введи цену в рублях',
        options: {
            setValueAs: setNumber,
            required: {
                value: true,
                message: "Цену обязательно надо установить"
            },
            min: {
                value: 0,
                message: 'Цена должна быть больше 0'
            },
            // validate: numValidate
        },
        inputType: 'number'
    },
    {
        type: "input",
        name: 'img',
        title: "Ссылка на изображение телевизора",
        inputType: "url",
        placeholder: "Ну вставляй получается",
        options: {
            required: {
                value: true,
                message: 'Ссылка на изображение телевизора обязательно должна быть'
            },

        }
    },
    {
        type: 'input',
        inputType: 'number',
        title: "Диагональ",
        name: "diagonal",
        placeholder: "Диагональ телевизора, в дюймах",
        options: {
            required: {
                value: true,
                message: "Данное поле обязательно для заполнения"
            },
            setValueAs: setNumber,
            min: {
                value: 10,
                message: "Ну минимум 10 дюйм диагональ у телевизора"
            },
            max: {
                value: 10000,
                message: "Ну слишком больная диагональ"
            },
        }
    },
    {
        type: 'manufacturer',
        name: 'manufacturer',
        title: 'Производитель',
    },
    {
        type: 'one-of-many',
        name: "hdResolution",
        title: "Разрешение HD",
        validationOptions: {
            required: {
                value: true,
                message: "Разрешение обязательно должно быть указано"
            }
        },
        options: [
            {
                title: "8K UltraHD",
                value: "8K UltraHD"
            },
            {
                title: "4K UltraHD",
                value: "4K UltraHD"
            },
            {
                title: "Full HD",
                value: "Full HD"
            },
            {
                title: "1080i HD",
                value: "1080i HD"
            },
            {
                title: "720p HD",
                value: "720p HD"
            },
        ]
    },
    {
        type: 'one-of-many',
        name: 'resolution',
        title: "Разрешение",
        validationOptions: {
            required: {
                value: true,
                message: "Разрешение обязательно должно быть указано"
            },
        },
        options: [
            {
                title: '7680x4320',
                value: '7680x4320'
            }, {
                title: '3840x2160',
                value: '3840x2160'
            }, {
                title: '2560x1080',
                value: '2560x1080'
            }, {
                title: '1920x1080',
                value: '1920x1080'
            }, {
                title: '1280x720',
                value: '1280x720'
            }, {
                title: '1366x768',
                value: '1366x768'
            },
        ],
        visibleCount: 4 //4
    },
    {
        type: 'one-of-many',
        name: 'tvFormat',
        title: "Соотношение сторон",
        validationOptions: {
            required: {
                value: true,
                message: "Соотношение сторон обязательно должно быть указано"
            }
        },
        options: [
            {
                title: '21:9',
                value: '21:9'
            }, {
                title: '16:9',
                value: '16:9'
            }, {
                title: '16:10',
                value: '16:10'
            }, {
                title: '4:3',
                value: '4:3'
            },
        ],
    },
    {
        type: "one-of-many",
        name: "screenRefreshRate",
        title: "Частота обновления экрана, Гц",
        options: [
            {
                title: '144',
                value: '144'
            }, {
                title: '120',
                value: '120'
            },
            {
                title: '400',
                value: '400'
            },
            {
                title: '200',
                value: '200'
            }, {
                title: '100',
                value: '100'
            }, {
                title: '60',
                value: '60'
            }, {
                title: '50',
                value: '50'
            }, 
        ],
        validationOptions: {
            required: {
                value: true,
                message: "Частота обновления экрана обязательно должна быть указана"
            },
        },
        visibleCount: 7
    },
    {
        type: 'one-of-many',
        name: 'matrix',
        title: 'Матрица телевизора',
        // validationOptions: {
        //     required: {
        //         value: true,
        //         message: "Матрица обязательно должна быть указана"
        //     }
        // },
        options: [
            {
                value: 'IPS' as Matrix,
                title: 'IPS',
            },
            {
                value: 'OLED' as Matrix,
                title: 'OLED',
            }, {
                value: 'micro-LED' as Matrix,
                title: 'micro-LED',
            }, {
                value: 'VA' as Matrix,
                title: 'VA',
            }, {
                value: 'WVA' as Matrix,
                title: 'WVA',
            }, 
            {
                value: 'QLED' as Matrix,
                title: 'QLED',
            },
            {
                value: 'LED' as Matrix,
                title: 'LED',
            },{
                value: 'A-MVA' as Matrix,
                title: 'A-MVA',
            }, {
                value: 'ADS' as Matrix,
                title: 'ADS',
            }, {
                value: 'AMVA3' as Matrix,
                title: 'AMVA3',
            }, {
                value: 'ASV' as Matrix,
                title: 'ASV',
            }, {
                value: 'DLED' as Matrix,
                title: 'DLED',
            }, {
                value: 'FSA' as Matrix,
                title: 'FSA',
            }, {
                value: 'HVA' as Matrix,
                title: 'HVA',
            }, {
                value: 'MSA/SVA' as Matrix,
                title: 'MSA/SVA',
            }, {
                value: 'MVA' as Matrix,
                title: 'MVA',
            }, {
                value: 'PLS' as Matrix,
                title: 'PLS',
            }, {
                value: 'PVA' as Matrix,
                title: 'PVA',
            }, {
                value: 'S-MVA' as Matrix,
                title: 'SUPER-MVA',
            }, {
                value: 'S-PVA' as Matrix,
                title: 'SUPER-PVA',
            }, 
            {
                value: 'TN' as Matrix,
                title: 'TN',
            }, {
                value: 'SVA' as Matrix,
                title: 'SVA',
            }, {
                value: 'TFT' as Matrix,
                title: 'TFT',
            }, {
                value: 'TFT LED' as Matrix,
                title: 'TFT LED'
            }, {
                value: 'TV' as Matrix,
                title: 'TV',
            }, {
                value: 'U2VA' as Matrix,
                title: 'U2VA',
            },
        ]
    },
    {
        type: 'input',
        name: 'description',
        title: 'Описание',
        placeholder: 'Описание телевизора',
        options: {
            maxLength: {
                value: 5000,
                message: "Ну слишком длинное описание телевизора"
            },
        },
        inputType: "textarea"
    },
    {
        type: 'true/false',
        name: 'supportSmartTv',
        title: "Поддерживает Smart Tv?",
        trueValue: {
            title: 'Поддерживает'
        },
        falseValue: {
            title: "Не поддерживает"
        },
        options:{}
    },
    {
        type: "input",
        name: "hdmiPorts",
        title: "Количество входов HDMI",
        placeholder: "Введи количество портов",
        inputType: "number",
        options: {
            min: {
                value: 1,
                message: "Ну хотя бы один HDMI вход есть"
            },
            max: {
                value: 6,
                message: "Если больше 6, поставь 6 пока"
            },
            setValueAs: setNumber,
            validate: intValidate
        }
    },
    {
        name: "hdmiVersion",
        type: "one-of-many",
        title: "Версия HDMI",
        options: [
            {
                title: "HDMI 2.1",
                value: "HDMI 2.1",
            }, {
                title: "HDMI 2.0",
                value: "HDMI 2.0",
            }, {
                title: "HDMI 1.4",
                value: "HDMI 1.4",
            }, {
                title: "HDMI 1.3",
                value: "HDMI 1.3",
            }
        ],
    }, 
    {
        name: "hdrFormat",
        type: 'many-options',
        title: 'Форматы HDR',
        options: [
            {
                value: 'Active HDR',
                title: 'Active HDR'
            },
            {
                value: 'Dolby Vision',
                title: 'Dolby Vision'
            },
            {
                value: 'HDR 10 PRO',
                title: 'HDR 10 PRO'
            },
            {
                value: 'HDR10',
                title: 'HDR10'
            },
            {
                value: 'HDR10+',
                title: 'HDR10+'
            },
            {
                value: 'HLG',
                title: 'HLG'
            },
        ],
        visibleCount: 4
    },
    {
        name: "illuminationType",
        type: "many-options",
        title: "Тип подсветки",
        options: [
            {
                value: "Direct LED",
                title: "Direct LED"
            }, {
                value: "Dual LED",
                title: "Dual LED"
            }, {
                value: "Edge LED",
                title: "Edge LED"
            }, {
                value: "Mini-LED",
                title: "Mini-LED"
            }, {
                value: "RGB LED",
                title: "RGB LED"
            },
        ]
    },
    {
        title: "Технология экрана",
        name: "screenTechnology",
        type: "many-options",
        options: [
            {
                value: "HDR",
                title: "HDR"
            }, {
                value: "LED",
                title: "LED"
            }, {
                value: "NanoCell",
                title: "NanoCell"
            }, {
                value: "Neo QLED",
                title: "Neo QLED"
            }, {
                value: "OLED",
                title: "OLED"
            }, {
                value: "QLED",
                title: "QLED"
            }, {
                value: "QNED",
                title: "QNED"
            }, {
                value: "Quantum Dot",
                title: "Quantum Dot"
            }, {
                value: "Triluminos",
                title: "Triluminos"
            }, {
                value: "ULED",
                title: "ULED"
            },
        ]
    },
    {
        name: "wirelessConnection",
        type: "many-options",
        title: "Беспроводная связь",
        options: [
            {
                title: "Airplay",
                value: "Airplay"
            }, {
                title: "Bluetooth",
                value: "Bluetooth"
            }, {
                title: "Chromecast",
                value: "Chromecast"
            }, {
                title: "Miracast",
                value: "Miracast"
            }, {
                title: "Wi-Fi",
                value: "Wi-Fi"
            }, {
                title: "WiDi",
                value: "WiDi"
            },
        ],
        visibleCount: 6
    },
    {
        name: "screenType",
        type: "one-of-many",
        title: "Тип",
        options: [
            {
                title: 'LED',
                value: 'LED'
            }, {
                title: 'OLED',
                value: 'OLED'
            }, {
                title: 'Жидкий Кристал',
                value: 'ЖК'
            }, {
                title: 'Лазерный',
                value: 'Лазерный'
            }, {
                title: 'Плазменная панель',
                value: 'Плазменная панель'
            }, {
                title: 'Смарт-монитор',
                value: 'Смарт-монитор'
            }, {
                title: 'ЭЛТ плоский',
                value: 'ЭЛТ плоский'
            },
        ]
    },
    {
        name: "tvTuner",
        type: 'many-options',
        title: "ТВ Тюнер",
        options: [
            {
                title: "без ТВ-тюнера",
                value: "без ТВ-тюнера"
            }, {
                title: "DVB-S2",
                value: "DVB-S2"
            }, {
                title: "DVB-S",
                value: "DVB-S"
            }, {
                title: "DBV-C2",
                value: "DBV-C2"
            }, {
                title: "DVB-C",
                value: "DVB-C"
            }, {
                title: "DVB-T2",
                value: "DVB-T2"
            }, {
                title: "DVB-T",
                value: "DVB-T"
            }, {
                title: "ATV",
                value: "ATV"
            }
        ]
    },
    {
        name: "brightness",
        title: "Яркость кд/м2",
        type: "input",
        inputType: "number",
        placeholder: "Яркость телевизора кд/м2",
        options: {
            min: {
                value: 20,
                message: "Слишком маленькая яркость"
            },
            max: {
                value: 3000,
                message: "Слишком большая яркость"
            },
            setValueAs: setNumber
        }
    },
    {
        name: "contrast",
        title: "Контрастность",
        type: "input",
        inputType: "text",
        placeholder: "Контрастность телевизора",
        // options: {
        //     min: {
        //         value: 1.0001,
        //         message: "Слишком маленькая контрастность"
        //     },
        //     max: {
        //         value: 40001,
        //         message: "Слишком большая контрастность"
        //     },
        //     setValueAs: setNumber
        // }
        options: {
            maxLength: {
                value: 15,
                message: 'Слишком длинная контрастность'
            }
        }
    }, {
        name: "dynamicContrast",
        title: "Динамическая контрастность",
        type: "input",
        placeholder: "Динамическая контрастность телевизора",
        // options: {
        //     min: {
        //         value: 1,
        //         message: "Слишком маленькая динамическая контрастность"
        //     },
        //     max: {
        //         value: 1070000000,
        //         message: "Слишком большая динамическая контрастность"
        //     },
        //     setValueAs: setNumber
        // }
        options: {
            maxLength: {
                value: 15,
                message: 'Слишком длинная динамическая контрастность'
            }
        }
    }, {
        name: "viewAngle",
        title: "Угол обзора",
        type: "input",
        inputType: "number",
        placeholder: "Угол обзора, в градусах",
        options: {
            min: {
                value: 88,
                message: "Слишком маленький угол обзора"
            },
            max: {
                value: 180,
                message: "Слишком большой угол обзора"
            },
            setValueAs: setNumber
        }
    }, {
        name: "pixelResponseTime",
        title: "Время отклика",
        type: "input",
        inputType: "number",
        placeholder: "Время отклика в мс",
        options: {
            min: {
                value: 0.1,
                message: "Слишком маленькое время отклика"
            },
            max: {
                value: 605,
                message: "Слишком большое время отклика"
            },
            setValueAs: setNumber
        }
    }, {
        name: "dynamicSceneIdx",
        title: "Индекс динамических сцен",
        type: "input",
        inputType: "number",
        placeholder: "Индекс динамических сцен (кратен 100 наверное)",
        options: {
            setValueAs: setNumber
        }
    }, {
        name: "totalSoundPower",
        title: "Суммарная мощность звука",
        type: "input",
        inputType: "number",
        placeholder: "Суммарная мощность звука, Вт",
        options: {
            min: {
                value: 0,
                message: "Слишком маленькая мощность звука"
            },
            max: {
                value: 120,
                message: "Слишком большая мощность звука"
            },
            setValueAs: setNumber
        }
    }, {
        name: "dynamicsCount",
        title: "Количество динамиков",
        type: "input",
        inputType: "number",
        placeholder: "Количество динамиков, Шт",
        options: {
            min: {
                value: 1,
                message: "Слишком маленькое количество динамиков"
            },
            max: {
                value: 16,
                message: "Слишком большое количество динамиков"
            },
            setValueAs: setNumber,
            validate: intValidate
        }
    }, {
        name: "vesaFixingStandard",
        type: 'input',
        title: "Стандарт крепления VESA",
        placeholder: "--x-- (мм)",
        options: {
            // Не работает эта регулярка. Работает только на ЧислоxЧисло мм
            // pattern: new RegExp("^\\d+x\\d+(,\\d+)? мм$")
        },
    },
    {
        name: 'usbAmount',
        type: 'input',
        title: "Количество USB интерфейсов",
        inputType: 'number',
        placeholder: "Количество USB интерфейсов, штук",
        options: {
            setValueAs: setNumber,
            min: {
                value: 0,
                message: "Количество USB интерфейсов больше 0"
            },
            max: {
                value: 5,
                message: "Количество USB интерфейсов меньше 5"
            },
            validate: intValidate
        }
    },
    {
        name: "wifiStandard",
        type: 'one-of-many',
        title: "Стандарт Wi-Fi",
        options: [
            {
                value: '802.11b (Wi-Fi 1)',
                title: '802.11b (Wi-Fi 1)'
            }, {
                value: '802.11a (Wi-Fi 2)',
                title: '802.11a (Wi-Fi 2)'
            }, {
                value: '802.11g (Wi-Fi 3)',
                title: '802.11g (Wi-Fi 3)'
            }, {
                value: '802.11n (Wi-Fi 4)',
                title: '802.11n (Wi-Fi 4)'
            }, {
                value: '802.11ac (Wi-Fi 5)',
                title: '802.11ac (Wi-Fi 5)'
            }, {
                value: '802.11ax (Wi-Fi 6)',
                title: '802.11ax (Wi-Fi 6)'
            },
        ],
        visibleCount: 6
    }, {
        name: "power",
        title: "Потребляемая мощность",
        type: "input",
        inputType: "number",
        placeholder: "Потребляемая мощность, Вт",
        options: {
            min: {
                value: 0,
                message: "Слишком маленькая мощность"
            },
            max: {
                value: 1125,
                message: "Слишком большая мощность"
            },
            setValueAs: setNumber
        }
    }, {
        name: "width",
        title: "Ширина телевизора",
        type: "input",
        inputType: "number",
        placeholder: "Ширина телевизора, мм",
        options: {
            min: {
                value: 150,
                message: "Слишком маленькая ширина"
            },
            max: {
                value: 3000,
                message: "Слишком большая ширина"
            },
            setValueAs: setNumber
        }
    }, {
        name: "height",
        title: "Высота телевизора",
        type: "input",
        inputType: "number",
        placeholder: "Высота телевизора, мм",
        options: {
            min: {
                value: 150,
                message: "Слишком маленькая высота"
            },
            max: {
                value: 3000,
                message: "Слишком большая высота"
            },
            setValueAs: setNumber
        }
    }, {
        name: "depth",
        title: "Глубина телевизора",
        type: "input",
        inputType: "number",
        placeholder: "Глубина телевизора, мм",
        options: {
            min: {
                value: 20,
                message: "Слишком маленькая глубина"
            },
            max: {
                value: 1300,
                message: "Слишком большая глубина"
            },
            setValueAs: setNumber
        }
    }, {
        name: "weight",
        title: "Вес телевизора",
        type: "input",
        inputType: "number",
        placeholder: "Масса, кг",
        options: {
            min: {
                value: 1,
                message: "Слишком маленький вес"
            },
            max: {
                value: 230,
                message: "Слишком большой вес"
            },
            setValueAs: setNumber
        }
    }, {
        name: "creationYear",
        title: "Год создания модели",
        type: "input",
        inputType: "number",
        placeholder: "Год создания модели",
        options: {
            min: {
                value: 2007,
                message: "Слишком старый телевизор"
            },
            max: {
                value: (new Date()).getFullYear(),
                message: "Телевизор ещё не вышел"
            },
            setValueAs: setNumber,
            validate: intValidate
        }
    }, {
        name: "hasBlackoutTechnology",
        type: 'true/false',
        falseValue: {
            title: "нет"
        },
        trueValue: {
            title: "есть"
        },
        title: 'Технология затемнения',
        options:{}
    }, {
        name: "blackoutZonesAmount",
        title: "Количество зон затемнения",
        type: "input",
        inputType: "number",
        placeholder: "Количество зон затемнения",
        options: {
            min: {
                value: 30,
                message: "Слишком мало зон затемнения"
            },
            max: {
                value: 6000,
                message: "Слишком много зон затемнения"
            },
            setValueAs: setNumber, 
            // Number.isNaN(+value) ? null : +value,
            validate: intValidate
        }
    },
]

// export interface ITelevision {
//     // остальное в details: {}
//     power: number //Потребляемая мощность [0, 1123]
//     width: number // мм [150, 2697]
//     height: number // мм [150, 3000]
//     depth: number // мм [26.9, 1299.5]
//     weight: number // кг [1.1, 226]
//     creation_year: number // [2014, ...]
//     blackout_zone: boolean
//     blackout_zones_amount: number // [30, 5184]
//     description: string // ебашь чё хошь
// }