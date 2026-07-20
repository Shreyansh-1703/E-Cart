export const POPULAR_TRAINS = [
  { 
    number: '22436', 
    name: 'Vande Bharat Express', 
    route: 'New Delhi — Varanasi', 
    days: 'Tue, Wed, Fri, Sat, Sun',
    departure: '06:00',
    arrival: '14:00',
    stations: [
      { name: 'New Delhi', code: 'NDLS', arrival: '--:--', departure: '06:00', halt: 0 },
      { name: 'Aligarh Jn', code: 'ALG', arrival: '07:48', departure: '07:53', halt: 5 },
      { name: 'Tundla Jn', code: 'TDL', arrival: '08:20', departure: '08:25', halt: 5 },
      { name: 'Kanpur Central', code: 'CNB', arrival: '10:08', departure: '10:15', halt: 7 },
      { name: 'Prayagraj Jn', code: 'PRYJ', arrival: '12:08', departure: '12:13', halt: 5 },
      { name: 'Mirzapur', code: 'MZP', arrival: '13:10', departure: '13:15', halt: 5 },
      { name: 'Varanasi Jn', code: 'BSB', arrival: '14:00', departure: '--:--', halt: 0 }
    ],
    reliability: '98%'
  },
  { 
    number: '12951', 
    name: 'Mumbai Rajdhani', 
    route: 'Mumbai Central — New Delhi', 
    days: 'Daily',
    departure: '17:00',
    arrival: '08:32',
    stations: [
      { name: 'Mumbai Central', code: 'MMCT', arrival: '--:--', departure: '17:00', halt: 0 },
      { name: 'Borivali', code: 'BVI', arrival: '17:24', departure: '17:29', halt: 5 },
      { name: 'Surat', code: 'ST', arrival: '19:43', departure: '19:48', halt: 5 },
      { name: 'Vadodara Jn', code: 'BRC', arrival: '21:06', departure: '21:16', halt: 10 },
      { name: 'Ratlam Jn', code: 'RTM', arrival: '00:25', departure: '00:30', halt: 5 },
      { name: 'Kota Jn', code: 'KOTA', arrival: '03:15', departure: '03:20', halt: 5 },
      { name: 'Mathura Jn', code: 'MTJ', arrival: '06:10', departure: '06:15', halt: 5 },
      { name: 'New Delhi', code: 'NDLS', arrival: '08:32', departure: '--:--', halt: 0 }
    ],
    reliability: '96%'
  },
  {
    number: '12002',
    name: 'Shatabdi Express',
    route: 'New Delhi — Rani Kamalapati',
    days: 'Daily',
    departure: '06:00',
    arrival: '14:40',
    stations: [
      { name: 'New Delhi', code: 'NDLS', arrival: '--:--', departure: '06:00', halt: 0 },
      { name: 'Mathura Jn', code: 'MTJ', arrival: '07:19', departure: '07:24', halt: 5 },
      { name: 'Agra Cantt', code: 'AGC', arrival: '07:50', departure: '07:55', halt: 5 },
      { name: 'Morena', code: 'MRA', arrival: '08:39', departure: '08:44', halt: 5 },
      { name: 'Gwalior', code: 'GWL', arrival: '09:23', departure: '09:28', halt: 5 },
      { name: 'Jhansi Jn', code: 'VGLB', arrival: '10:45', departure: '10:53', halt: 8 },
      { name: 'Lalitpur Jn', code: 'LAR', arrival: '11:42', departure: '11:47', halt: 5 },
      { name: 'Bina Jn', code: 'BINA', arrival: '12:40', departure: '12:45', halt: 5 },
      { name: 'Bhopal Jn', code: 'BPL', arrival: '14:12', departure: '14:17', halt: 5 },
      { name: 'Rani Kamalapati', code: 'RKMP', arrival: '14:40', departure: '--:--', halt: 0 }
    ],
    reliability: '94%'
  },
  {
    number: '12301',
    name: 'Kolkata Rajdhani',
    route: 'New Delhi — Howrah',
    days: 'Daily',
    departure: '16:55',
    arrival: '10:00',
    stations: [
      { name: 'New Delhi', code: 'NDLS', arrival: '--:--', departure: '16:55', halt: 0 },
      { name: 'Kanpur Central', code: 'CNB', arrival: '21:40', departure: '21:45', halt: 5 },
      { name: 'Prayagraj Jn', code: 'PRYJ', arrival: '23:50', departure: '23:55', halt: 5 },
      { name: 'Pt DD Upadhyaya Jn', code: 'DDU', arrival: '02:00', departure: '02:10', halt: 10 },
      { name: 'Gaya Jn', code: 'GAYA', arrival: '04:35', departure: '04:40', halt: 5 },
      { name: 'Dhanbad Jn', code: 'DHN', arrival: '07:15', departure: '07:20', halt: 5 },
      { name: 'Asansol Jn', code: 'ASN', arrival: '08:25', departure: '08:30', halt: 5 },
      { name: 'Howrah Jn', code: 'HWH', arrival: '10:00', departure: '--:--', halt: 0 }
    ],
    reliability: '97%'
  },
  {
    number: '12627',
    name: 'Karnataka Express',
    route: 'New Delhi — Bengaluru',
    days: 'Daily',
    departure: '21:30',
    arrival: '06:55',
    stations: [
      { name: 'New Delhi', code: 'NDLS', arrival: '--:--', departure: '21:30', halt: 0 },
      { name: 'Agra Cantt', code: 'AGC', arrival: '00:10', departure: '00:15', halt: 5 },
      { name: 'Gwalior', code: 'GWL', arrival: '01:42', departure: '01:47', halt: 5 },
      { name: 'Jhansi Jn', code: 'VGLB', arrival: '03:05', departure: '03:15', halt: 10 },
      { name: 'Bhopal Jn', code: 'BPL', arrival: '06:25', departure: '06:35', halt: 10 },
      { name: 'Itarsi Jn', code: 'ET', arrival: '07:45', departure: '07:50', halt: 5 },
      { name: 'Nagpur', code: 'NGP', arrival: '11:30', departure: '11:40', halt: 10 },
      { name: 'Secunderabad Jn', code: 'SC', arrival: '18:00', departure: '18:15', halt: 15 },
      { name: 'Bengaluru City Jn', code: 'SBC', arrival: '06:55', departure: '--:--', halt: 0 }
    ],
    reliability: '93%'
  },
  {
    number: '11301',
    name: 'Udyan Express',
    route: 'Mumbai CST — Bengaluru',
    days: 'Daily',
    departure: '08:05',
    arrival: '06:30',
    stations: [
      { name: 'Mumbai CST', code: 'CSTM', arrival: '--:--', departure: '08:05', halt: 0 },
      { name: 'Pune Jn', code: 'PUNE', arrival: '11:05', departure: '11:15', halt: 10 },
      { name: 'Solapur', code: 'SUR', arrival: '15:20', departure: '15:30', halt: 10 },
      { name: 'Wadi', code: 'WADI', arrival: '17:25', departure: '17:30', halt: 5 },
      { name: 'Gulbarga', code: 'GR', arrival: '18:45', departure: '18:50', halt: 5 },
      { name: 'Yadgir', code: 'YG', arrival: '19:28', departure: '19:33', halt: 5 },
      { name: 'Dharmavaram Jn', code: 'DMM', arrival: '21:50', departure: '21:55', halt: 5 },
      { name: 'Bengaluru City Jn', code: 'SBC', arrival: '06:30', departure: '--:--', halt: 0 }
    ],
    reliability: '90%'
  }
];

export const RAILWAY_PRODUCTS = [
  {
    id: 'f1',
    category: 'Food & Beverages',
    items: [
      { id: 'fb1',  name: 'Bisleri Mineral Water 1L',         price: 20,  rating: 4.9, img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
      { id: 'fb2',  name: 'Ginger Masala Chai',                price: 15,  rating: 4.7, img: 'https://images.unsplash.com/photo-1556742400-b5b7c512f022?w=400' },
      { id: 'fb3',  name: 'Coca-Cola 500ml',                   price: 40,  rating: 4.8, img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
      { id: 'fb4',  name: 'Pepsi 500ml Chilled',               price: 40,  rating: 4.7, img: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
      { id: 'fb5',  name: 'Sprite Lemon Fizz 500ml',           price: 40,  rating: 4.6, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400' },
      { id: 'fb6',  name: 'Pringles Original 110g',            price: 120, rating: 4.9, img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
      { id: 'fb7',  name: 'Pringles Sour Cream & Onion 110g',  price: 120, rating: 4.8, img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
      { id: 'fb8',  name: 'Lays Classic Salted 73g',           price: 30,  rating: 4.7, img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400' },
      { id: 'fb9',  name: 'Mixed Fruit Juice Tetra 250ml',     price: 60,  rating: 4.5, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400' },
      { id: 'fb10', name: 'Tropicana Orange 200ml',             price: 45,  rating: 4.6, img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
      { id: 'fb11', name: 'Kwality Walls Cornetto Choco',       price: 55,  rating: 4.9, img: 'https://images.unsplash.com/photo-1633933358116-a27b902fad35?w=400' },
      { id: 'fb12', name: 'Amul Vanilla Ice Cream Bar',         price: 30,  rating: 4.8, img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400' },
      { id: 'fb13', name: 'Chocolate Fudge Ice Cream Cup',      price: 65,  rating: 4.7, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
      { id: 'fb14', name: 'Nestlé NAN Baby Milk Powder 400g',  price: 680, rating: 4.9, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
      { id: 'fb15', name: 'Similac Stage 1 Powder 200g',        price: 450, rating: 4.8, img: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400' },
      { id: 'fb16', name: 'Baby Milk Liquid 180ml Tetra',       price: 85,  rating: 4.7, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
      { id: 'fb17', name: 'Enfamil Infant Formula Liquid',      price: 95,  rating: 4.8, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
      { id: 'fb18', name: 'Veg Club Sandwich',                  price: 85,  rating: 4.5, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
      { id: 'fb19', name: 'Mini Thali Express',                 price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
      { id: 'fb20', name: 'Masala Butter Milk 200ml',           price: 25,  rating: 4.9, img: 'https://images.unsplash.com/photo-1571805341302-2c19624b927d?w=400' }
    ]
  },
  {
    id: 'e1',
    category: 'Electronics',
    items: [
      { id: 'el1',  name: 'Fast Charging Power Bank 10000mAh', price: 1299, rating: 4.8, img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' },
      { id: 'el2',  name: 'USB-C Braided Cable 1.5m',          price: 299,  rating: 4.5, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'el3',  name: 'Wired Earphones with Mic',           price: 499,  rating: 4.4, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
      { id: 'el4',  name: 'GaN Wall Adapter 20W',               price: 699,  rating: 4.6, img: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400' },
      { id: 'el5',  name: 'Bluetooth Neckband Earphones',       price: 999,  rating: 4.7, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
      { id: 'el6',  name: 'Digital LED Travel Alarm Clock',     price: 350,  rating: 4.2, img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400' },
      { id: 'el7',  name: 'MicroSD Card 64GB Class 10',         price: 549,  rating: 4.5, img: 'https://images.unsplash.com/photo-1531492829786-34f1a4cf4848?w=400' },
      { id: 'el8',  name: 'Portable Mini Bluetooth Speaker',    price: 899,  rating: 4.3, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
      { id: 'el9',  name: 'Universal Travel Power Adapter',     price: 450,  rating: 4.4, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
      { id: 'el10', name: 'Flexible Phone Stand Tripod',        price: 249,  rating: 4.4, img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' }
    ]
  },
  {
    id: 't1',
    category: 'Travel Essentials',
    items: [
      { id: 'tr1',  name: 'Memory Foam Neck Pillow',            price: 499,  rating: 4.8, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
      { id: 'tr2',  name: 'Soft Cotton Travel Blanket',         price: 850,  rating: 4.7, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
      { id: 'tr3',  name: '3D Contoured Sleep Eye Mask',        price: 150,  rating: 4.5, img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400' },
      { id: 'tr4',  name: 'Compact Toothbrush Travel Kit',      price: 99,   rating: 4.4, img: 'https://images.unsplash.com/photo-1559591937-abc1e3b33fd0?w=400' },
      { id: 'tr5',  name: 'Hand Sanitizer Gel 100ml',           price: 50,   rating: 4.9, img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400' },
      { id: 'tr6',  name: 'Lemon Fresh Wet Wipes 15pc',         price: 35,   rating: 4.6, img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400' },
      { id: 'tr7',  name: 'Disposable N95 Face Masks 5pc',      price: 100,  rating: 4.7, img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400' },
      { id: 'tr8',  name: 'Compact Foldable Hair Brush',        price: 120,  rating: 4.3, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400' },
      { id: 'tr9',  name: 'TSA Approved Padlock 3-Digit',       price: 180,  rating: 4.5, img: 'https://images.unsplash.com/photo-1558618047-f4e90a83e4b7?w=400' },
      { id: 'tr10', name: 'Noise Cancelling Foam Earplugs',     price: 80,   rating: 4.8, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400' }
    ]
  },
  {
    id: 'm1',
    category: 'Medicines',
    items: [
      { id: 'md1',  name: 'Paracetamol 500mg Strip x10',        price: 30,  rating: 4.9, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
      { id: 'md2',  name: 'Digene Antacid Gel 15ml',            price: 45,  rating: 4.8, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400' },
      { id: 'md3',  name: 'Band-Aid Flexible Classic 10pk',     price: 40,  rating: 4.9, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400' },
      { id: 'md4',  name: 'Vicks VapoRub 25g',                  price: 65,  rating: 4.7, img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400' },
      { id: 'md5',  name: 'Moov Fast Relief Spray 35g',         price: 155, rating: 4.8, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
      { id: 'md6',  name: 'ORS Electrolyte Drink Orange',       price: 20,  rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' },
      { id: 'md7',  name: 'Aspirin 75mg Tablets 10ct',          price: 35,  rating: 4.5, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400' },
      { id: 'md8',  name: 'Strepsils Honey Lemon 8pc',          price: 60,  rating: 4.9, img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400' },
      { id: 'md9',  name: 'Betadine Antiseptic 30ml',           price: 75,  rating: 4.6, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
      { id: 'md10', name: 'Pudin Hara Liquid 10ml',             price: 25,  rating: 4.8, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400' }
    ]
  },
  {
    id: 'b1',
    category: 'Books & Magazines',
    items: [
      { id: 'bk1',  name: 'The Silent Patient',                 price: 349, rating: 4.8, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { id: 'bk2',  name: 'Ikigai: Japanese Secret to Life',   price: 299, rating: 4.9, img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400' },
      { id: 'bk3',  name: 'The Alchemist',                      price: 199, rating: 4.9, img: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400' },
      { id: 'bk4',  name: 'Crossword Puzzle Book',              price: 149, rating: 4.5, img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400' },
      { id: 'bk5',  name: 'Sudoku Extreme 500 Puzzles',         price: 120, rating: 4.7, img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400' },
      { id: 'bk6',  name: 'Atomic Habits — James Clear',        price: 380, rating: 4.9, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
      { id: 'bk7',  name: 'The Psychology of Money',            price: 280, rating: 4.8, img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
      { id: 'bk8',  name: 'Lonely Planet India 2024',           price: 599, rating: 4.6, img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400' },
      { id: 'bk9',  name: 'Chacha Chaudhary Comic Pack',        price: 50,  rating: 4.9, img: 'https://images.unsplash.com/photo-1533327325824-76851d7547d0?w=400' },
      { id: 'bk10', name: 'Economic Times Morning Edition',     price: 10,  rating: 4.3, img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400' }
    ]
  }
];
