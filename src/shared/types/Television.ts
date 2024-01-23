import { Matrix } from "./Matrix"

export interface ITelevision {
    id: string
    name: string
    price: number // v rublyah
    img: string
    diagonal: number // 98"
    hdResolution: '4K UltraHD' | '8K UltraHD' | '720p HD' | '1080i HD' | 'Full HD'
    manufacturer: string
    resolution: `1280x720` | `1366x768` | `1920x1080` | `2560x1080` | `3840x2160` | `7680x4320`  // 1920x1080 ...
    tvFormat: '4:3' | `16:9` | '16:10' | '21:9' // 16:9 ...
    screenRefreshRate: 50 | 60 | 100 | 120 | 144 | 200 | '50' | '60' | '100' | '120' | '144' | '200' // 60 Гц
    matrix: Matrix
    hdmiPorts: number // do 6
    supportSmartTv: boolean
    hdrFormat: ('HDR10' | 'HDR10+' | 'Dolby Vision' | 'HLG' | 'HDR 10 PRO' | 'Active HDR')[]
    illuminationType: ('Direct LED' | 'Dual LED' | 'Edge LED' | 'mini-LED' | 'RGB LED')[]
    screenTechnology: ('HDR' | 'LED' | 'NanoCell' | 'Neo QLED' | 'OLED' | 'QLED' | 'QNED' | 'Quantum Dot'
    | 'ULED' | 'Triluminos')[]
    //
    wirelessConnection: ('Airplay' | "Bluetooth" | 'Chromecast' | 'Miracast' | 'Wi-Fi' | 'WiDi')[]
    screenType: 'LED' | 'OLED' | 'ЖК' | 'Лазерный' | 'Плазменная панель' | "Смарт-монитор"
    | "ЭЛТ плоский"
    tvTuner: ("DVB-S2" | 'DVB-S' | 'DBV-C2' | 'DVB-C' | 'DVB-T2' | 'DVB-T' | 'ATV' | 'без ТВ-тюнера')[]
    brightness: string// [20, 3000] 150 Кд/м**2
    contrast: string // [1.0001, 40001]
    dynamicContrast: string // [1, 1070000000]
    viewAngle: number // [88, 180]
    pixelResponseTime: number // Время отклика в мс [0.1, 605]
    dynamicSceneIdx: number // кратен 100 наверное
    totalSoundPower: number // Вт, [0, 120]
    dynamicsCount: number // [2, 16]
    vesaFixingStandard: `${number}x${number}${' мм' | ''}`
    hdmiVersion: 'нет' | 'HDMI 1.3' | 'HDMI 1.4' | 'HDMI 2.0' | 'HDMI 2.1'
    usbAmount: number // [0, 3]
    // eslint-disable-next-line max-len
    wifiStandard: '802.11b (Wi-Fi 1)' | '802.11a (Wi-Fi 2)' | '802.11g (Wi-Fi 3)' | '802.11n (Wi-Fi 4)' | '802.11ac (Wi-Fi 5)' | '802.11ax (Wi-Fi 6)'
    power: number //Потребляемая мощность [0, 1123]   
    width: number // мм [150, 2697]
    height: number // мм [150, 3000]
    depth: number // мм [26.9, 1299.5]
    weight: number // кг [1.1, 226]
    creationYear: number // [2014, ...]
    hasBlackoutTechnology: boolean
    blackoutZonesAmount: number // [30, 5184]
    description: string // ебашь чё хошь

}

