import { DataTypes, Model, Optional } from "sequelize"
import { sequelize } from "../db"

interface IUserAttributes {
    id: string
    email: string
    phoneNumber: string
    roles: string[]
    password: string
    name: string
    resetToken: string
    resetTokenExp: string
    activationToken: string
    isActivated: boolean
    latestPasswordChangeDate: Date
}

type TUserCreationAttributes = Optional<
    IUserAttributes, 'roles' | 'activationToken' | 'resetTokenExp'
    | 'resetToken' | 'phoneNumber' | "id" | "isActivated" | "latestPasswordChangeDate"
>

const User = sequelize.define<Model<IUserAttributes, TUserCreationAttributes>>('user', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: ['USER']
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latestPasswordChangeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    activationToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
})
const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    }
})
const CartDevice = sequelize.define('cart_device', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        
    }
})
const Television = sequelize.define('television', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    diagonal: {
        type: DataTypes.DECIMAL, // вручную приписывать "
    },
    hdResolution: {
        type: DataTypes.ENUM,
        values: ['4K UltraHD', '8K UltraHD', '720p HD', '1080i HD', 'Full HD'],
        allowNull: false,
    },
    resolution: {
        type: DataTypes.ENUM,
        values: [`1280x720`, `1366x768`, `1920x1080`, `2560x1080`, `3840x2160`, `7680x4320`],
        allowNull: false,
    },
    tvFormat: {
        type: DataTypes.ENUM,
        values: ['4:3', `16:9`, '16:10', '21:9'],
        allowNull: false
    },
    matrix: {
        type: DataTypes.ENUM,
        values: ['IPS', 'OLED', 'VA', 'WVA', 'HVA', 'micro-LED', 'MVA', 'S-MVA', 'S-PVA','PLS', 'PVA', 'SVA',
            'MSA/SVA', 'TV', 'ADS', 'AMVA3', 'A-MVA', 'ASV', 'DLED', 'FSA', 'TFT', 'TFT LED', 'U2VA', 'TN', 
            'QLED', 'LED'],
        allowNull: true
    },
    screenRefreshRate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hdmiPorts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // defaultValue: 1
    },
    supportSmartTv: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        // defaultValue: false
    },
    hdrFormat: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM('HDR10', 'HDR10+', 'Dolby Vision', 'HLG', 'HDR 10 PRO', 'Active HDR')
        ),
        allowNull: false,
        // defaultValue: DataTypes.ARRAY,
    },
    illuminationType: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM('Direct LED', 'Dual LED', 'Edge LED', 'Mini-LED', 'RGB LED')
        ),
        allowNull: false,
        // defaultValue: ['mini-LED']
        // defaultValue: DataTypes.ARRAY,
    },
    screenTechnology: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM('HDR', 'LED', 'NanoCell', 'Neo QLED', 'OLED', 'QLED', 'QNED', 'Quantum Dot', 
                'ULED', 'Triluminos')
        ),
        allowNull: false,
        // defaultValue: DataTypes.STRING
    },
    wirelessConnection: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM('Airplay', "Bluetooth", 'Chromecast', 'Miracast', 'Wi-Fi', 'WiDi')
        ),
        allowNull: false,
        // defaultValue: DataTypes.ARRAY,
    },
    screenType: {
        type: DataTypes.ENUM,
        values: ['LED', 'OLED', 'ЖК', 'Лазерный', 'Плазменная панель', "Смарт-монитор", "ЭЛТ плоский"],
        allowNull: true
    },
    tvTuner: {
        type: DataTypes.ARRAY(
            DataTypes.ENUM("DVB-S2", 'DVB-S', 'DBV-C2', 'DVB-C', 'DVB-T2', 'DVB-T', 'ATV', 'без ТВ-тюнера')),
        allowNull: false
    },
    brightness: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    contrast: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    dynamicContrast: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    viewAngle: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    pixelResponseTime: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    dynamicSceneIdx: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalSoundPower: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    dynamicsCount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    vesaFixingStandard: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hdmiVersion: {
        type: DataTypes.ENUM,
        values: ['HDMI 1.3', 'HDMI 1.4', 'HDMI 2.0', 'HDMI 2.1'],
        allowNull: true
    },
    usbAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    wifiStandard: {
        type: DataTypes.ENUM,
        values: ['802.11b (Wi-Fi 1)', '802.11a (Wi-Fi 2)', '802.11g (Wi-Fi 3)',
            '802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)'],
        allowNull: true
    },
    power: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    width: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    height: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    depth: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    creationYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hasBlackoutTechnology: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        // defaultValue: false
    },
    blackoutZonesAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(5000),
        allowNull: true,

    }
})

const Brand = sequelize.define('brand', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    logoImg: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})
// const Type = sequelize.define('type', {
//     id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         primaryKey: true,
//         unique: true,
//         defaultValue: DataTypes.UUIDV4
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true 
//     }
// })
// const BrandType = sequelize.define('brand_type', {
//     id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         primaryKey: true,
//         unique: true,
//         defaultValue: DataTypes.UUIDV4
//     }
// })
const Rating = sequelize.define('rating', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

const UntrackedPhones = sequelize.define("untracked_phones", {
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const ContactRequests = sequelize.define("contact_us_requests", {
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Anonymous",
    },
    message: {
        type: DataTypes.STRING(1023),
        allowNull: false
    }
})

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    orderPlacementSum: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
})
const OrderDevice = sequelize.define('order_device', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        
    }
})
Order.hasMany(OrderDevice)
// Order.belongsTo(Cart)
OrderDevice.belongsTo(Order)

// const CartTelevisions = sequelize.define('User_Profile', {}, { timestamps: false });

User.hasOne(Cart, {
    foreignKey: {
        allowNull: false,
        name: 'userId',
    }
})
User.hasMany(Rating)
User.hasMany(Order)
Order.belongsTo(User)

Cart.hasMany(CartDevice)
Cart.belongsTo(User)

// Brand.belongsToMany(Type, {
// through: BrandType
// })
Brand.hasMany(Television, {
    foreignKey: 'manufacturer'
})


Television.belongsTo(Brand, {
    foreignKey: 'manufacturer'
})
Television.hasMany(CartDevice)
Television.hasMany(OrderDevice)
Television.hasMany(Rating)

CartDevice.belongsTo(Cart)
CartDevice.belongsTo(Television)

OrderDevice.belongsTo(Television)

Rating.belongsTo(User)
Rating.belongsTo(Television)

export { 
    User, Cart, CartDevice, Television, Brand, Rating, UntrackedPhones, ContactRequests, Order, OrderDevice 
}