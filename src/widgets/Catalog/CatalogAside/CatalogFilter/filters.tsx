import { IFilterItemProps } from "./FilterItem/FilterItem";


export const filters: IFilterItemProps[] = [
    {
        type: 'number-range',
        name: 'price',
        title: 'Цена'
    },
    {
        type: 'number-range',
        title: 'Диагональ',
        name: 'diagonal'
    },
    {
        type: 'options',
        title: 'Разрешение HD',
        name: 'hdResolution',
        options: [
            {
                name: '4K UltraHD',
                value: '4K UltraHD'
            },
            {
                name: '8K UltraHD',
                value: '8K UltraHD'
            },
            {
                name: 'Full HD',
                value: 'Full HD'
            },
            {
                name: '1080i HD',
                value: '1080i HD'
            },
            {
                name: '720p HD',
                value: '720p HD'
            },
        ],
        visibleCount: 3
    },
    {
        name: 'brand',
        title: 'Производитель'
    },
    {
        type: 'options',
        title: 'Разрешение',
        name: 'resolution',
        options: [
            {
                name: '7680x4320',
                value: '7680x4320'
            }, {
                name: '3840x2160',
                value: '3840x2160'
            }, {
                name: '2560x1080',
                value: '2560x1080'
            }, {
                name: '1920x1080',
                value: '1920x1080'
            }, {
                name: '1280x720',
                value: '1280x720'
            }, {
                name: '1366x768',
                value: '1366x768'
            },
        ],
        visibleCount: 4
    },
    {
        type: 'options',
        title: 'Технология экрана',
        name: 'screenTechnology',
        options: [
            {
                name: 'HDR',
                value: 'HDR'
            },
            {
                name: 'LED',
                value: 'LED'
            },
            {
                name: 'QLED',
                value: 'QLED'
            },
            {
                name: 'OLED',
                value: 'OLED'
            },
            {
                name: 'Neo QLED',
                value: 'Neo QLED'
            },
            {
                name: 'NanoCell',
                value: 'NanoCell'
            },
            {
                name: 'QNED',
                value: 'QNED'
            },
            {
                name: 'Quantum Dot',
                value: 'Quantum Dot'
            },
            {
                name: 'Triluminos',
                value: 'Triluminos'
            },
            {
                name: 'ULED',
                value: 'ULED'
            },
        ]
    },
    {
        type: 'options',
        title: 'Частота обновления экрана',
        name: 'screenRefreshRate',
        options: [
            {
                name: '144 Гц',
                value: '144'
            },
            {
                name: '120 Гц',
                value: '120'
            },
            {
                name: '60 Гц',
                value: '60'
            },
            {
                name: '400 Гц',
                value: '400'
            },
            {
                name: '200 Гц',
                value: '200'
            },
            {
                name: '100 Гц',
                value: '100'
            },
            {
                name: '50 Гц',
                value: '50'
            },
        ],
        visibleCount: 3
    },
    {
        type: 'options',
        title: 'Тип экрана',
        name: 'screenType',
        options: [
            {
                name: 'LED',
                value: 'LED'
            }, {
                name: 'OLED',
                value: 'OLED'
            }, {
                name: 'Жидкий Кристал',
                value: 'ЖК'
            }, {
                name: 'Лазерный',
                value: 'Лазерный'
            }, {
                name: 'Плазменная панель',
                value: 'Плазменная панель'
            }, {
                name: 'Смарт-монитор',
                value: 'Смарт-монитор'
            }, {
                name: 'ЭЛТ плоский',
                value: 'ЭЛТ плоский'
            },
        ],
        visibleCount: 4
    },
    {
        name: "illuminationType",
        type: "options",
        title: "Тип подсветки",
        options: [
            {
                value: "Direct LED",
                name: "Direct LED"
            }, {
                value: "Dual LED",
                name: "Dual LED"
            }, {
                value: "Edge LED",
                name: "Edge LED"
            }, {
                value: "Mini-LED",
                name: "Mini-LED"
            }, {
                value: "RGB LED",
                name: "RGB LED"
            },
        ]
    },
    {
        type: 'options',
        title: 'Количество входов HDMI',
        name: 'hdmiPorts',
        options: [
            {
                name: '1',
                value: '1'
            }, {
                name: '2',
                value: '2'
            }, {
                name: '3',
                value: '3'
            }, {
                name: '4',
                value: '4'
            }, {
                name: '5',
                value: '5'
            }, {
                name: '6',
                value: '6'
            }
        ],
        visibleCount: 4
    }
]