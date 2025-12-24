-- Инициализация базы данных Peaksel с демо-данными
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица брендов
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    rating DECIMAL(3,2) DEFAULT 0,
    "logoImg" VARCHAR(500),
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    "phoneNumber" VARCHAR(50) UNIQUE,
    roles TEXT[] DEFAULT ARRAY['USER'],
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    "resetToken" VARCHAR(255),
    "resetTokenExp" TIMESTAMP,
    "activationToken" VARCHAR(255),
    "isActivated" BOOLEAN DEFAULT false,
    "latestPasswordChangeDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица телевизоров
CREATE TABLE IF NOT EXISTS televisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    img VARCHAR(500) NOT NULL,
    name VARCHAR(500) NOT NULL,
    diagonal DECIMAL(4,1),
    "hdResolution" VARCHAR(50),
    resolution VARCHAR(50),
    "tvFormat" VARCHAR(20),
    matrix VARCHAR(50),
    "screenRefreshRate" INTEGER,
    "hdmiPorts" INTEGER,
    "supportSmartTv" BOOLEAN,
    "hdrFormat" VARCHAR(50)[],
    "illuminationType" VARCHAR(50)[],
    "screenTechnology" VARCHAR(50)[],
    "wirelessConnection" VARCHAR(50)[],
    "screenType" VARCHAR(50),
    "tvTuner" VARCHAR(50)[],
    brightness DECIMAL(6,2),
    contrast VARCHAR(15),
    "dynamicContrast" VARCHAR(15),
    "viewAngle" DECIMAL(5,2),
    "pixelResponseTime" DECIMAL(4,2),
    "dynamicSceneIdx" INTEGER,
    "totalSoundPower" DECIMAL(5,2),
    "dynamicsCount" INTEGER,
    "vesaFixingStandard" VARCHAR(100),
    "hdmiVersion" VARCHAR(20),
    "usbAmount" INTEGER,
    "wifiStandard" VARCHAR(50),
    power DECIMAL(5,2),
    width DECIMAL(6,2),
    height DECIMAL(6,2),
    depth DECIMAL(6,2),
    weight DECIMAL(6,2),
    "creationYear" INTEGER,
    "hasBlackoutTechnology" BOOLEAN,
    "blackoutZonesAmount" INTEGER,
    description TEXT,
    manufacturer UUID REFERENCES brands(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем бренды
INSERT INTO brands (id, name, rating, "logoImg", description) VALUES 
    ('f8f4272e-4792-4d46-815f-0e2f5adc971d', 'Xiaomi', 0, 'https://tehnik-ise.ru/upload/iblock/5fb/5fb7ec9465ba71a766a89b33e8275a6a.png ', 'Китайский технологический гигант, предлагающий умные телевизоры с передовыми функциями по доступным ценам. Известен интеграцией с экосистемой умного дома.'),
    ('42be28bb-6228-4af1-9539-f9dcd5e0e35c', 'Haier', 0, 'https://avatars.mds.yandex.net/get-mpic/1600461/img_id7234172528066309035.png/orig', 'Международный производитель бытовой техники, предлагающий качественные телевизоры с акцентом на надежность и энергоэффективность. Широкий модельный ряд для любого бюджета.'),
    ('461d6273-0b62-46af-a20c-5bf180d5bbbd', 'LG', 0, 'https://banner2.cleanpng.com/20180928/osp/kisspng-lg-electronics-brand-trademark-product-design-sams-sadko-5bae6f97664924.866499291538158487419.jpg', 'Южнокорейский бренд-пионер в технологии OLED. Известен революционными разработками в области дисплеев, передовым дизайном и интеллектуальными функциями Smart TV.'),
    ('a8a283b4-9eb2-40f9-adb1-2e5ae6d9d1a3', 'Philips', 0, 'https://www.clipartmax.com/png/middle/35-357293_46cd8d-philips-shield-philips-logo-new-philips-logo-png.png', 'Нидерландский бренд с богатой историей, известный технологией Ambilight для иммерсивного просмотра. Сочетает европейское качество сборки с инновационными функциями.'),
    ('d1fb88be-67e5-4b99-b12f-4e8355b0fa41', 'Samsung', 0, 'https://warrenenskat.com/wp-content/uploads/2019/01/Logo-Samsung.png', 'Мировой лидер в производстве телевизоров, пионер QLED-технологий. Предлагает инновационные решения, премиальный дизайн и полную интеграцию с экосистемой умного дома.'),
    ('e482fd3e-6a50-4e21-a8b9-35dfa6ae4372', 'Hisense', 0, 'https://workclimat.ru/wa-data/public/shop/categories/150/150.jpg', 'Китайская государственная компания, производитель телевизоров, крупной бытовой техники и потребительской электроники.')
ON CONFLICT (id) DO NOTHING;

-- Вставляем телевизоры
INSERT INTO televisions (
    id, name, price, rating, img, diagonal, "hdResolution", resolution, 
    "tvFormat", matrix, "screenRefreshRate", "hdmiPorts", "supportSmartTv", 
    "hdrFormat", "illuminationType", "screenTechnology", "wirelessConnection",
    "screenType", "tvTuner", description, manufacturer
) VALUES 
    (
        'f40cd30d-a04f-4640-bf61-8c9e9341ba6d',
        '55" Телевизор Xiaomi MI TV A2 55 LED, black',
        41270,
        0,
        'https://avatars.mds.yandex.net/get-mpic/1724439/img_id1065185854647876405.jpeg/300x400',
        55,
        '4K UltraHD',
        '3840x2160',
        '16:9',
        'VA',
        60,
        3,
        true,
        ARRAY['Dolby Vision', 'HDR10', 'HLG'],
        ARRAY['Direct LED', 'Edge LED'],
        ARRAY['HDR', 'LED'],
        ARRAY['Bluetooth', 'Chromecast', 'Miracast', 'Wi-Fi'],
        'ЖК',
        ARRAY['DVB-S2', 'DVB-C', 'DVB-T2', 'DVB-T'],
        $$Этот телевизор может похвастаться также и достаточно высокими техническими характеристиками. Формат матрицы 16:9 и при этом она поддерживает разрешение 3840x2160. На изображении такого характера без проблем можно рассмотреть даже самые мельчайшие детали. Высокая частота обновления экрана, реализованная в Xiaomi Mi TV A2 и составляющая 60 Гц также способствует улучшению качества изображения.
        Стоит отметить великолепную цветопередачу телевизора, благодаря чему изображение на экране выглядит максимально приближенным к реальности. 

        Для воспроизведения звука в конструкции Xiaomi Mi TV A2 представлены качественные колонки. Наличие в конструкции устройства AV/Ethernet (RJ-45)/HDMI/mini-Джек/USB входов даёт возможность подключать к телевизору широкий спектр электронных приборов и дополнительных аксессуаров.  
        Купить телевизор можно в дом, офис, заведение и т.д. Для удобства пользователя предусмотрена возможность крепления модели на стену.
        Корпус телевизора Xiaomi Mi TV A2 окрашен в черный цвет. Благодаря лаконичному дизайну представленная модель найдёт своё место в интерьере любого помещения и будет радовать вас своими широкими функциональными возможностями. 
        $$,
        'f8f4272e-4792-4d46-815f-0e2f5adc971d'
    )
ON CONFLICT (id) DO NOTHING;

-- Вставляем владельца приложения (OWNER)
INSERT INTO users (
    id, email, roles, password, name, 
    "activationToken", "isActivated", "latestPasswordChangeDate"
) VALUES 
    (
        '8c44661d-c64c-4555-a59c-b802e7e23d0a',
        'lordminigames@gmail.com',
        ARRAY['USER', 'ADMIN', 'OWNER'],
        '$2b$12$MNqHmk174Zm4Qs0..9EES.MgWNIjTU49bn4vZndCw/Q.cxDToyBbK',
        'prankerborislavchik',
        'qH-BrIKvtNelaiwy3jhWKSD8',
        true,
        '2024-01-25 17:01:57.118+00'
    ),
    (
        'd310aabc-68e6-48af-83e5-b9221ae4771f',
        'vupsen.rano@mail.ru', 
        ARRAY['USER', 'ADMIN'],
        '$2b$12$bXWCHwpljstsj8plRVlfiOir2ZRD1OxfpGHlRqJ4r7VgUDZIINacS',
        'Zakhar admin',
        'M80pthLlbBb8Fd2EfZBHtALw',
        true,
        '2024-01-31 19:26:35.853+00'
    )
ON CONFLICT (id) DO NOTHING;

-- Создаем корзины для пользователей
INSERT INTO carts (id, "userId") VALUES 
    ('9122ebb0-e967-4498-be63-907f6f1bdc45', '8c44661d-c64c-4555-a59c-b802e7e23d0a'),
    ('1c286aa4-9f52-4455-9a89-6de4a2870115', 'd310aabc-68e6-48af-83e5-b9221ae4771f')
ON CONFLICT (id) DO NOTHING;

-- Добавляем товары в корзину тестового пользователя
INSERT INTO cart_devices (id, "cartId", "televisionId", quantity) VALUES 
    ('a86f3815-1ada-4816-b13f-82ab201a3a89', '1c286aa4-9f52-4455-9a89-6de4a2870115', 'f40cd30d-a04f-4640-bf61-8c9e9341ba6d', 1),
    ('cd2e1c01-a2b3-4c4d-5e6f-1a2b3c4d5e6f', '9122ebb0-e967-4498-be63-907f6f1bdc45', 'f40cd30d-a04f-4640-bf61-8c9e9341ba6d', 98)
ON CONFLICT (id) DO NOTHING;

-- Создаем заказ
INSERT INTO orders (id, "orderPlacementSum", "userId") VALUES 
    ('a3324e59-336b-40b3-8e41-12970539a5b2', 123810, 'd310aabc-68e6-48af-83e5-b9221ae4771f'),
    ('d9ca35fe-4609-426a-ad60-368840ee8c27', 41270, 'd310aabc-68e6-48af-83e5-b9221ae4771f')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_devices (id, "orderId", "televisionId", quantity) VALUES 
    ('627af271-0809-4900-805a-27c34591f3be', 'a3324e59-336b-40b3-8e41-12970539a5b2', 'f40cd30d-a04f-4640-bf61-8c9e9341ba6d', 3),
    ('9cd66575-f7ce-40dc-8897-d2806be0b274', 'd9ca35fe-4609-426a-ad60-368840ee8c27', 'f40cd30d-a04f-4640-bf61-8c9e9341ba6d', 1)
ON CONFLICT (id) DO NOTHING;