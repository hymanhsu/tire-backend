-- initialize data of tire 
-- tire=> \i D:/workspace/tire-backend/src/scripts/init_data.sql


-- roles
INSERT INTO u_roles (id, session_ttl) VALUES('ROOT', 1);
INSERT INTO u_roles (id, session_ttl) VALUES('ADMN', 8);
INSERT INTO u_roles (id, session_ttl) VALUES('MERT', 8);
INSERT INTO u_roles (id, session_ttl) VALUES('MANR', 8);
INSERT INTO u_roles (id, session_ttl) VALUES('STAF', 8);
INSERT INTO u_roles (id, session_ttl) VALUES('CUST', 24);

-- users
INSERT INTO u_users (id, user_name, role_id, phone_number, email) VALUES('AWPo68O4So3oederv9jiJ', 'root', 'ROOT', '6661236789', 'root666@gmail.com');
INSERT INTO u_users (id, user_name, role_id) VALUES('odTKh0e9eCCSAt63J5rec', 'admin01', 'ADMN');
INSERT INTO u_users (id, user_name, role_id) VALUES('joZb8dPA9YmgQBBy7rNfH', 'manager01', 'MANR');
INSERT INTO u_users (id, user_name, role_id) VALUES('kRglaJo7vCIM6ALrHm8Jf', 'staff01', 'STAF');
INSERT INTO u_users (id, user_name, role_id) VALUES('EuoPIozzbRNQGsdoFUtxM', 'customer01', 'CUST');

-- auths
INSERT INTO u_auths (id, user_id, login_name, auth_pass, session_ttl) VALUES('vZQf6t4wct14PZYZbLfNH', 'AWPo68O4So3oederv9jiJ', 'root', 'fc5e038d38a57032085441e7fe7010b0', 1);

-- Categories of products
---------------------------------------------------
INSERT INTO categories (id, title) VALUES('101', 'Tire');
INSERT INTO categories (id, title) VALUES('102', 'Wheel');
INSERT INTO categories (id, title) VALUES('201', 'Auto Detailing');
INSERT INTO categories (id, title) VALUES('202', 'Electronics');
INSERT INTO categories (id, title) VALUES('203', 'Towing');
INSERT INTO categories (id, title) VALUES('204', 'Bumper');
INSERT INTO categories (id, title) VALUES('205', 'Body Protection');
INSERT INTO categories (id, title) VALUES('206', 'Suspension');
INSERT INTO categories (id, title) VALUES('207', 'TPMS');
INSERT INTO categories (id, title) VALUES('208', 'Floor Mats and Liners');
INSERT INTO categories (id, title) VALUES('209', 'Tire Accessories');
INSERT INTO categories (id, title) VALUES('210', 'Wheel Accessories');
INSERT INTO categories (id, title) VALUES('211', 'Winter Accessories');
INSERT INTO categories (id, title) VALUES('212', 'Automotive Lighting and Lighting Accessories');
INSERT INTO categories (id, title) VALUES('213', 'Exhaust');


-- Premium brands of tyres
---------------------------------------------------
INSERT INTO brands (id, brand, grade) VALUES ('1001', 'Michelin', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1002', 'Bridgestone', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1003', 'Pirelli', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1004', 'Continental', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1005', 'Goodyear', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1006', 'Dunlop', '1');
INSERT INTO brands (id, brand, grade) VALUES ('1007', 'Hankook', '1');

-- Mid-range brands of tyres
---------------------------------------------------
INSERT INTO brands (id, brand, grade) VALUES('2001', 'Avon', '2');
INSERT INTO brands (id, brand, grade) VALUES('2002', 'Barum', '2');
INSERT INTO brands (id, brand, grade) VALUES('2003', 'BFGoodrich', '2');
INSERT INTO brands (id, brand, grade) VALUES('2004', 'Cooper', '2');
INSERT INTO brands (id, brand, grade) VALUES('2005', 'Falken', '2');
INSERT INTO brands (id, brand, grade) VALUES('2006', 'Firestone', '2');
INSERT INTO brands (id, brand, grade) VALUES('2007', 'Fulda', '2');
INSERT INTO brands (id, brand, grade) VALUES('2008', 'General', '2');
INSERT INTO brands (id, brand, grade) VALUES('2009', 'Giti', '2');
INSERT INTO brands (id, brand, grade) VALUES('2010', 'GT Radial', '2');
INSERT INTO brands (id, brand, grade) VALUES('2011', 'Kleber', '2');
INSERT INTO brands (id, brand, grade) VALUES('2012', 'Kumho', '2');
INSERT INTO brands (id, brand, grade) VALUES('2013', 'Marangoni', '2');
INSERT INTO brands (id, brand, grade) VALUES('2014', 'Maxxis', '2');
INSERT INTO brands (id, brand, grade) VALUES('2015', 'Metzeler', '2');
INSERT INTO brands (id, brand, grade) VALUES('2016', 'Nankang', '2');
INSERT INTO brands (id, brand, grade) VALUES('2017', 'Nexen', '2');
INSERT INTO brands (id, brand, grade) VALUES('2018', 'Nitto', '2');
INSERT INTO brands (id, brand, grade) VALUES('2019', 'Nokian', '2');
INSERT INTO brands (id, brand, grade) VALUES('2020', 'Semperit', '2');
INSERT INTO brands (id, brand, grade) VALUES('2021', 'Toyo', '2');
INSERT INTO brands (id, brand, grade) VALUES('2022', 'Uniroyal', '2');
INSERT INTO brands (id, brand, grade) VALUES('2023', 'Vredestein', '2');
INSERT INTO brands (id, brand, grade) VALUES('2024', 'Yokohama', '2');

-- Economy brands of tyres
---------------------------------------------------
INSERT INTO brands (id, brand, grade) VALUES('3001', 'Achilles', '3');
INSERT INTO brands (id, brand, grade) VALUES('3002', 'Aeolus', '3');
INSERT INTO brands (id, brand, grade) VALUES('3003', 'Altenzo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3004', 'Apollo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3005', 'Atlas', '3');
INSERT INTO brands (id, brand, grade) VALUES('3006', 'Atturo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3007', 'Ceat', '3');
INSERT INTO brands (id, brand, grade) VALUES('3008', 'Cordiant', '3');
INSERT INTO brands (id, brand, grade) VALUES('3009', 'Cosmo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3010', 'Davanti', '3');
INSERT INTO brands (id, brand, grade) VALUES('3011', 'Dayton', '3');
INSERT INTO brands (id, brand, grade) VALUES('3012', 'Debica', '3');
INSERT INTO brands (id, brand, grade) VALUES('3013', 'Dmack', '3');
INSERT INTO brands (id, brand, grade) VALUES('3014', 'Dynamo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3015', 'ESA Tecar', '3');
INSERT INTO brands (id, brand, grade) VALUES('3016', 'Evergreen', '3');
INSERT INTO brands (id, brand, grade) VALUES('3017', 'Federal', '3');
INSERT INTO brands (id, brand, grade) VALUES('3018', 'Firenza', '3');
INSERT INTO brands (id, brand, grade) VALUES('3019', 'Formula', '3');
INSERT INTO brands (id, brand, grade) VALUES('3020', 'Fuzion', '3');
INSERT INTO brands (id, brand, grade) VALUES('3021', 'Gripmax', '3');
INSERT INTO brands (id, brand, grade) VALUES('3022', 'Hercules', '3');
INSERT INTO brands (id, brand, grade) VALUES('3023', 'High Performer', '3');
INSERT INTO brands (id, brand, grade) VALUES('3024', 'Infinity', '3');
INSERT INTO brands (id, brand, grade) VALUES('3025', 'Interstate', '3');
INSERT INTO brands (id, brand, grade) VALUES('3026', 'Ironman', '3');
INSERT INTO brands (id, brand, grade) VALUES('3027', 'Kelly', '3');
INSERT INTO brands (id, brand, grade) VALUES('3028', 'Kenda', '3');
INSERT INTO brands (id, brand, grade) VALUES('3029', 'Kormoran', '3');
INSERT INTO brands (id, brand, grade) VALUES('3030', 'Landsail', '3');
INSERT INTO brands (id, brand, grade) VALUES('3031', 'Lassa', '3');
INSERT INTO brands (id, brand, grade) VALUES('3032', 'Laufenn', '3');
INSERT INTO brands (id, brand, grade) VALUES('3033', 'Leao', '3');
INSERT INTO brands (id, brand, grade) VALUES('3034', 'Lexani', '3');
INSERT INTO brands (id, brand, grade) VALUES('3035', 'Linglong', '3');
INSERT INTO brands (id, brand, grade) VALUES('3036', 'Mabor', '3');
INSERT INTO brands (id, brand, grade) VALUES('3037', 'Marshal', '3');
INSERT INTO brands (id, brand, grade) VALUES('3038', 'Matador', '3');
INSERT INTO brands (id, brand, grade) VALUES('3039', 'Maxtrek', '3');
INSERT INTO brands (id, brand, grade) VALUES('3040', 'Mazzini', '3');
INSERT INTO brands (id, brand, grade) VALUES('3041', 'Mentor', '3');
INSERT INTO brands (id, brand, grade) VALUES('3042', 'Meteor', '3');
INSERT INTO brands (id, brand, grade) VALUES('3043', 'Millennium', '3');
INSERT INTO brands (id, brand, grade) VALUES('3044', 'Momo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3045', 'MRF', '3');
INSERT INTO brands (id, brand, grade) VALUES('3046', 'Nereus', '3');
INSERT INTO brands (id, brand, grade) VALUES('3047', 'Neuton', '3');
INSERT INTO brands (id, brand, grade) VALUES('3048', 'Nordman', '3');
INSERT INTO brands (id, brand, grade) VALUES('3049', 'Novex', '3');
INSERT INTO brands (id, brand, grade) VALUES('3050', 'Ohtsu', '3');
INSERT INTO brands (id, brand, grade) VALUES('3051', 'Petlas', '3');
INSERT INTO brands (id, brand, grade) VALUES('3052', 'Pneumant', '3');
INSERT INTO brands (id, brand, grade) VALUES('3053', 'Point S', '3');
INSERT INTO brands (id, brand, grade) VALUES('3054', 'Prestivo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3055', 'Radar', '3');
INSERT INTO brands (id, brand, grade) VALUES('3056', 'Riken', '3');
INSERT INTO brands (id, brand, grade) VALUES('3057', 'Roadhog', '3');
INSERT INTO brands (id, brand, grade) VALUES('3058', 'Roadstone', '3');
INSERT INTO brands (id, brand, grade) VALUES('3059', 'RoadX', '3');
INSERT INTO brands (id, brand, grade) VALUES('3060', 'Sailun', '3');
INSERT INTO brands (id, brand, grade) VALUES('3061', 'Sava', '3');
INSERT INTO brands (id, brand, grade) VALUES('3062', 'Seiberling', '3');
INSERT INTO brands (id, brand, grade) VALUES('3063', 'Sentury', '3');
INSERT INTO brands (id, brand, grade) VALUES('3064', 'Silverstone', '3');
INSERT INTO brands (id, brand, grade) VALUES('3065', 'Sonar', '3');
INSERT INTO brands (id, brand, grade) VALUES('3066', 'Starmaxx', '3');
INSERT INTO brands (id, brand, grade) VALUES('3067', 'Sumitomo', '3');
INSERT INTO brands (id, brand, grade) VALUES('3068', 'Sunny', '3');
INSERT INTO brands (id, brand, grade) VALUES('3069', 'Syron', '3');
INSERT INTO brands (id, brand, grade) VALUES('3070', 'Tigar', '3');
INSERT INTO brands (id, brand, grade) VALUES('3071', 'Tomket', '3');
INSERT INTO brands (id, brand, grade) VALUES('3072', 'Torque', '3');
INSERT INTO brands (id, brand, grade) VALUES('3073', 'Travelstar', '3');
INSERT INTO brands (id, brand, grade) VALUES('3074', 'Triangle', '3');
INSERT INTO brands (id, brand, grade) VALUES('3075', 'Viatti', '3');
INSERT INTO brands (id, brand, grade) VALUES('3076', 'Viking', '3');
INSERT INTO brands (id, brand, grade) VALUES('3077', 'Zeetex', '3');
INSERT INTO brands (id, brand, grade) VALUES('3078', 'Zenises', '3');
INSERT INTO brands (id, brand, grade) VALUES('3079', 'Zeta', '3');

-- Budget brands of tyres
---------------------------------------------------
INSERT INTO brands (id, brand, grade) VALUES('6001', 'Accelera', '4');
INSERT INTO brands (id, brand, grade) VALUES('6002', 'Admiral', '4');
INSERT INTO brands (id, brand, grade) VALUES('6003', 'Alliance', '4');
INSERT INTO brands (id, brand, grade) VALUES('6004', 'Antares', '4');
INSERT INTO brands (id, brand, grade) VALUES('6005', 'Aoteli', '4');
INSERT INTO brands (id, brand, grade) VALUES('6006', 'Aplus', '4');
INSERT INTO brands (id, brand, grade) VALUES('6007', 'Aptany', '4');
INSERT INTO brands (id, brand, grade) VALUES('6008', 'Austone', '4');
INSERT INTO brands (id, brand, grade) VALUES('6009', 'Autogrip', '4');
INSERT INTO brands (id, brand, grade) VALUES('6010', 'BCT', '4');
INSERT INTO brands (id, brand, grade) VALUES('6011', 'Belshina', '4');
INSERT INTO brands (id, brand, grade) VALUES('6012', 'Berlin Tires', '4');
INSERT INTO brands (id, brand, grade) VALUES('6013', 'Black Arrow', '4');
INSERT INTO brands (id, brand, grade) VALUES('6014', 'Blacklion', '4');
INSERT INTO brands (id, brand, grade) VALUES('6015', 'Capitol', '4');
INSERT INTO brands (id, brand, grade) VALUES('6016', 'Chengshan', '4');
INSERT INTO brands (id, brand, grade) VALUES('6017', 'Compasal', '4');
INSERT INTO brands (id, brand, grade) VALUES('6018', 'Constancy', '4');
INSERT INTO brands (id, brand, grade) VALUES('6019', 'CST', '4');
INSERT INTO brands (id, brand, grade) VALUES('6020', 'Deestone', '4');
INSERT INTO brands (id, brand, grade) VALUES('6021', 'Delinte', '4');
INSERT INTO brands (id, brand, grade) VALUES('6022', 'Dextero', '4');
INSERT INTO brands (id, brand, grade) VALUES('6023', 'Double Coin', '4');
INSERT INTO brands (id, brand, grade) VALUES('6024', 'Doublestar', '4');
INSERT INTO brands (id, brand, grade) VALUES('6025', 'Duraturn', '4');
INSERT INTO brands (id, brand, grade) VALUES('6026', 'Durun', '4');
INSERT INTO brands (id, brand, grade) VALUES('6027', 'Event', '4');
INSERT INTO brands (id, brand, grade) VALUES('6028', 'Extreme Performance', '4');
INSERT INTO brands (id, brand, grade) VALUES('6029', 'Firemax', '4');
INSERT INTO brands (id, brand, grade) VALUES('6030', 'Forceum', '4');
INSERT INTO brands (id, brand, grade) VALUES('6031', 'Fortuna', '4');
INSERT INTO brands (id, brand, grade) VALUES('6032', 'Fullrun', '4');
INSERT INTO brands (id, brand, grade) VALUES('6033', 'Fullway', '4');
INSERT INTO brands (id, brand, grade) VALUES('6034', 'Gislaved', '4');
INSERT INTO brands (id, brand, grade) VALUES('6035', 'Goform', '4');
INSERT INTO brands (id, brand, grade) VALUES('6036', 'Goodride', '4');
INSERT INTO brands (id, brand, grade) VALUES('6037', 'Goodtrip', '4');
INSERT INTO brands (id, brand, grade) VALUES('6038', 'Habilead', '4');
INSERT INTO brands (id, brand, grade) VALUES('6039', 'Haida', '4');
INSERT INTO brands (id, brand, grade) VALUES('6040', 'Headway', '4');
INSERT INTO brands (id, brand, grade) VALUES('6041', 'Hero', '4');
INSERT INTO brands (id, brand, grade) VALUES('6042', 'Herse', '4');
INSERT INTO brands (id, brand, grade) VALUES('6043', 'Hifly', '4');
INSERT INTO brands (id, brand, grade) VALUES('6044', 'Horizon', '4');
INSERT INTO brands (id, brand, grade) VALUES('6045', 'Imperial', '4');
INSERT INTO brands (id, brand, grade) VALUES('6046', 'Insa Turbo', '4');
INSERT INTO brands (id, brand, grade) VALUES('6047', 'Intertrac', '4');
INSERT INTO brands (id, brand, grade) VALUES('6048', 'Jinyu', '4');
INSERT INTO brands (id, brand, grade) VALUES('6049', 'Joyroad', '4');
INSERT INTO brands (id, brand, grade) VALUES('6050', 'Kama', '4');
INSERT INTO brands (id, brand, grade) VALUES('6051', 'Kinforest', '4');
INSERT INTO brands (id, brand, grade) VALUES('6052', 'King Meiler', '4');
INSERT INTO brands (id, brand, grade) VALUES('6053', 'Kingpin', '4');
INSERT INTO brands (id, brand, grade) VALUES('6054', 'Lanvigator', '4');
INSERT INTO brands (id, brand, grade) VALUES('6055', 'Maloya', '4');
INSERT INTO brands (id, brand, grade) VALUES('6056', 'Mastercraft', '4');
INSERT INTO brands (id, brand, grade) VALUES('6057', 'Mastersteel', '4');
INSERT INTO brands (id, brand, grade) VALUES('6058', 'Mayrun', '4');
INSERT INTO brands (id, brand, grade) VALUES('6059', 'Membat', '4');
INSERT INTO brands (id, brand, grade) VALUES('6060', 'Milestone', '4');
INSERT INTO brands (id, brand, grade) VALUES('6061', 'Minerva', '4');
INSERT INTO brands (id, brand, grade) VALUES('6062', 'Mohawk', '4');
INSERT INTO brands (id, brand, grade) VALUES('6063', 'Multirac', '4');
INSERT INTO brands (id, brand, grade) VALUES('6064', 'Norauto', '4');
INSERT INTO brands (id, brand, grade) VALUES('6065', 'Nordexx', '4');
INSERT INTO brands (id, brand, grade) VALUES('6066', 'Ovation', '4');
INSERT INTO brands (id, brand, grade) VALUES('6067', 'Pace', '4');
INSERT INTO brands (id, brand, grade) VALUES('6068', 'Paxaro', '4');
INSERT INTO brands (id, brand, grade) VALUES('6069', 'Platin', '4');
INSERT INTO brands (id, brand, grade) VALUES('6070', 'Powertrac', '4');
INSERT INTO brands (id, brand, grade) VALUES('6071', 'Premiorri', '4');
INSERT INTO brands (id, brand, grade) VALUES('6072', 'Primewell', '4');
INSERT INTO brands (id, brand, grade) VALUES('6073', 'Rapid', '4');
INSERT INTO brands (id, brand, grade) VALUES('6074', 'Reference', '4');
INSERT INTO brands (id, brand, grade) VALUES('6075', 'Rockstone', '4');
INSERT INTO brands (id, brand, grade) VALUES('6076', 'Rotalla', '4');
INSERT INTO brands (id, brand, grade) VALUES('6077', 'Rovelo', '4');
INSERT INTO brands (id, brand, grade) VALUES('6078', 'Runway', '4');
INSERT INTO brands (id, brand, grade) VALUES('6079', 'Sportiva', '4');
INSERT INTO brands (id, brand, grade) VALUES('6080', 'Star Performer', '4');
INSERT INTO brands (id, brand, grade) VALUES('6081', 'Starfire', '4');
INSERT INTO brands (id, brand, grade) VALUES('6082', 'Sunew', '4');
INSERT INTO brands (id, brand, grade) VALUES('6083', 'Sunfull', '4');
INSERT INTO brands (id, brand, grade) VALUES('6084', 'Sunitrac', '4');
INSERT INTO brands (id, brand, grade) VALUES('6085', 'Superia', '4');
INSERT INTO brands (id, brand, grade) VALUES('6086', 'Taurus', '4');
INSERT INTO brands (id, brand, grade) VALUES('6087', 'Three A', '4');
INSERT INTO brands (id, brand, grade) VALUES('6088', 'Tourador', '4');
INSERT INTO brands (id, brand, grade) VALUES('6089', 'Tracmax', '4');
INSERT INTO brands (id, brand, grade) VALUES('6090', 'Trazano', '4');
INSERT INTO brands (id, brand, grade) VALUES('6091', 'Tristar', '4');
INSERT INTO brands (id, brand, grade) VALUES('6092', 'Tyfoon', '4');
INSERT INTO brands (id, brand, grade) VALUES('6093', 'Unigrip', '4');
INSERT INTO brands (id, brand, grade) VALUES('6094', 'Wanli', '4');
INSERT INTO brands (id, brand, grade) VALUES('6095', 'Westlake', '4');
INSERT INTO brands (id, brand, grade) VALUES('6096', 'Winda', '4');
INSERT INTO brands (id, brand, grade) VALUES('6097', 'Winrun', '4');









