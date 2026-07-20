// ────────────────────────────────────────────────────────────
// DEMO DATA – realistic, unique records for the entire app
// ────────────────────────────────────────────────────────────

export const DEMO_USERS = [
  { id: 1, fullName: 'Guest',    email: 'Guest@gmail.com',         password: '123456', role: 'USER',  phone: '+91 98201 34567', active: true, joinDate: 'Jan 2024' },
  { id: 2, fullName: 'Shreyansh Jain', email: 'Shreyansh@gmail.com',     password: '123456', role: 'ADMIN', phone: '+91 99887 76655', active: true, joinDate: 'Oct 2023' },
  { id: 3, fullName: 'Riya Kapoor',    email: 'riya.kapoor@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 97324 56789', active: true, joinDate: 'Mar 2024' },
  { id: 4, fullName: 'Neha Sharma',    email: 'neha.sharma@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 88234 12345', active: true, joinDate: 'Feb 2024' },
  { id: 5, fullName: 'Kabir Verma',    email: 'kabir.verma@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 77654 87654', active: false, joinDate: 'Apr 2024' },
  { id: 6, fullName: 'Priya Singh',    email: 'priya.singh@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 90321 45678', active: true, joinDate: 'May 2024' },
  { id: 7, fullName: 'Arjun Nair',     email: 'arjun.nair@gmail.com',    password: 'demo',   role: 'USER',  phone: '+91 81234 56789', active: true, joinDate: 'Jun 2024' },
  { id: 8, fullName: 'Kavya Reddy',    email: 'kavya.reddy@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 76543 21098', active: true, joinDate: 'Dec 2023' },
  { id: 9, fullName: 'Rohan Patel',    email: 'rohan.patel@gmail.com',   password: 'demo',   role: 'SELLER',phone: '+91 98765 43210', active: true, joinDate: 'Nov 2023' },
  { id: 10, fullName: 'Ananya Iyer',   email: 'ananya.iyer@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 87654 32109', active: true, joinDate: 'Jul 2024' },
  { id: 11, fullName: 'Vivaan Chopra', email: 'vivaan.chopra@gmail.com', password: 'demo',   role: 'USER',  phone: '+91 91234 56780', active: true, joinDate: 'Aug 2024' },
  { id: 12, fullName: 'Diya Malhotra', email: 'diya.malhotra@gmail.com', password: 'demo',   role: 'USER',  phone: '+91 82345 67891', active: false, joinDate: 'Sep 2024' },
  { id: 13, fullName: 'Ishaan Gupta',  email: 'ishaan.gupta@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 93456 78902', active: true, joinDate: 'Oct 2024' },
  { id: 14, fullName: 'Saanvi Joshi',  email: 'saanvi.joshi@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 94567 89013', active: true, joinDate: 'Nov 2024' },
  { id: 15, fullName: 'Rehan Khan',    email: 'rehan.khan@gmail.com',    password: 'demo',   role: 'USER',  phone: '+91 95678 90124', active: true, joinDate: 'Dec 2024' },
  { id: 16, fullName: 'Meera Pillai',  email: 'meera.pillai@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 96789 01235', active: true, joinDate: 'Jan 2025' },
  { id: 17, fullName: 'Dev Agarwal',   email: 'dev.agarwal@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 84567 12346', active: true, joinDate: 'Feb 2025' },
  { id: 18, fullName: 'Tara Sinha',    email: 'tara.sinha@gmail.com',    password: 'demo',   role: 'USER',  phone: '+91 83456 01235', active: false, joinDate: 'Mar 2025' },
  { id: 19, fullName: 'Arnav Desai',   email: 'arnav.desai@gmail.com',   password: 'demo',   role: 'USER',  phone: '+91 92345 11235', active: true, joinDate: 'Apr 2025' },
  { id: 20, fullName: 'Zara Qureshi',  email: 'zara.qureshi@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 91111 22233', active: true, joinDate: 'May 2025' },
  { id: 21, fullName: 'Krish Bansal',  email: 'krish.bansal@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 80000 11112', active: true, joinDate: 'Jun 2025' },
  { id: 22, fullName: 'Nisha Rao',     email: 'nisha.rao@gmail.com',     password: 'demo',   role: 'USER',  phone: '+91 79999 22223', active: true, joinDate: 'Jul 2025' },
  { id: 23, fullName: 'Ayaan Bajaj',   email: 'ayaan.bajaj@gmail.com',   password: 'demo',   role: 'SELLER',phone: '+91 78888 33334', active: true, joinDate: 'Aug 2025' },
  { id: 24, fullName: 'Pari Srivastava',email:'pari.srivastava@gmail.com',password:'demo',  role: 'USER',  phone: '+91 77777 44445', active: true, joinDate: 'Sep 2025' },
  { id: 25, fullName: 'Rudra Mishra',  email: 'rudra.mishra@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 76666 55556', active: true, joinDate: 'Oct 2025' },
  { id: 26, fullName: 'Anjali Saxena', email: 'anjali.saxena@gmail.com', password: 'demo',   role: 'USER',  phone: '+91 75555 66667', active: false, joinDate: 'Nov 2025' },
  { id: 27, fullName: 'Siddharth Roy', email: 'siddharth.roy@gmail.com', password: 'demo',   role: 'USER',  phone: '+91 74444 77778', active: true, joinDate: 'Dec 2025' },
  { id: 28, fullName: 'Vanya Sharma',  email: 'vanya.sharma@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 73333 88889', active: true, joinDate: 'Jan 2026' },
  { id: 29, fullName: 'Aditya Singh',  email: 'aditya.singh@gmail.com',  password: 'demo',   role: 'USER',  phone: '+91 72222 99990', active: true, joinDate: 'Feb 2026' },
  { id: 30, fullName: 'Mia Fernandez', email: 'mia.fernandez@gmail.com', password: 'demo',   role: 'USER',  phone: '+91 71111 00001', active: true, joinDate: 'Mar 2026' },
];

export const DEMO_PRODUCTS = [
  // Electronics
  { id: 101, name: 'Sony WH-1000XM6 Wireless Headphones', category: 'Electronics', brand: 'Sony', price: 29999, originalPrice: 35000, stock: 45, rating: 4.8, reviewCount: 1240, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Industry-leading noise cancellation with 30-hour battery life' },
  { id: 102, name: 'Apple AirPods Pro (3rd Gen)', category: 'Electronics', brand: 'Apple', price: 24900, originalPrice: 26900, stock: 32, rating: 4.7, reviewCount: 3420, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', description: 'Active Noise Cancellation, Transparency mode, Spatial Audio' },
  { id: 103, name: 'Samsung Galaxy S25 Ultra', category: 'Electronics', brand: 'Samsung', price: 134999, originalPrice: 144999, stock: 18, rating: 4.9, reviewCount: 876, imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', description: '200MP camera, S Pen, Snapdragon 8 Elite' },
  { id: 104, name: 'Apple MacBook Air 15" M3', category: 'Electronics', brand: 'Apple', price: 134900, originalPrice: 144900, stock: 12, rating: 4.8, reviewCount: 645, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', description: 'M3 chip, 18-hour battery, stunning Liquid Retina display' },
  { id: 105, name: 'Dell Inspiron 16 Laptop (2025)', category: 'Electronics', brand: 'Dell', price: 67990, originalPrice: 76990, stock: 25, rating: 4.4, reviewCount: 312, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', description: 'Intel Core i7, 16GB RAM, 512GB SSD, FHD+ display' },
  { id: 106, name: 'Canon EOS R8 Mirrorless Camera', category: 'Electronics', brand: 'Canon', price: 129999, originalPrice: 149999, stock: 8, rating: 4.7, reviewCount: 198, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', description: '24.2MP Full-Frame sensor, 4K video, lightweight design' },
  { id: 107, name: 'OnePlus 13 5G Smartphone', category: 'Electronics', brand: 'OnePlus', price: 69999, originalPrice: 74999, stock: 40, rating: 4.6, reviewCount: 1567, imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', description: 'Snapdragon 8 Elite, 50MP Hasselblad camera, 100W charge' },
  { id: 108, name: 'LG OLED C4 65" Smart TV', category: 'Electronics', brand: 'LG', price: 179990, originalPrice: 219990, stock: 6, rating: 4.9, reviewCount: 432, imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4cba4?w=400', description: 'Self-lit OLED pixels, AI Picture Pro, Dolby Vision' },
  { id: 109, name: 'boAt Airdopes 441 TWS Earbuds', category: 'Electronics', brand: 'boAt', price: 1299, originalPrice: 2999, stock: 120, rating: 4.2, reviewCount: 6780, imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400', description: 'True Wireless, IPX5 rated, 6 hours playback' },
  { id: 110, name: 'Realme 12 Pro+ 5G', category: 'Electronics', brand: 'Realme', price: 27999, originalPrice: 29999, stock: 55, rating: 4.3, reviewCount: 892, imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400', description: 'Periscope telephoto camera, 6.7" AMOLED display, 67W charge' },
  { id: 111, name: 'Lenovo IdeaPad Slim 5 (2025)', category: 'Electronics', brand: 'Lenovo', price: 52999, originalPrice: 59999, stock: 30, rating: 4.5, reviewCount: 456, imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', description: 'AMD Ryzen 7, 16GB RAM, 1TB SSD, IPS display' },
  { id: 112, name: 'Xiaomi Smart TV X Pro 55"', category: 'Electronics', brand: 'Xiaomi', price: 39999, originalPrice: 49999, stock: 15, rating: 4.4, reviewCount: 1123, imageUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400', description: '4K QLED, Dolby Atmos, Google TV, 60Hz' },
  { id: 113, name: 'JBL Flip 7 Portable Speaker', category: 'Electronics', brand: 'JBL', price: 14999, originalPrice: 17999, stock: 70, rating: 4.6, reviewCount: 2345, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', description: 'IP67 waterproof, 12 hours battery, Party Boost' },
  { id: 114, name: 'Apple Watch Ultra 2', category: 'Electronics', brand: 'Apple', price: 89900, originalPrice: 99900, stock: 10, rating: 4.8, reviewCount: 321, imageUrl: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400', description: '49mm case, titanium, precision GPS, 36-hour battery' },
  { id: 115, name: 'Samsung Galaxy Tab S10 Ultra', category: 'Electronics', brand: 'Samsung', price: 119999, originalPrice: 134999, stock: 20, rating: 4.7, reviewCount: 234, imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400', description: '14.6" AMOLED, S Pen included, DeX mode' },

  // Fashion
  { id: 201, name: 'Levis 511 Slim Fit Jeans', category: 'Fashion', brand: 'Levis', price: 2999, originalPrice: 3999, stock: 80, rating: 4.5, reviewCount: 4567, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'Slim fit, mid rise, stretch denim, 5 pocket styling' },
  { id: 202, name: 'Nike Air Max 270 Sneakers', category: 'Fashion', brand: 'Nike', price: 12995, originalPrice: 14995, stock: 45, rating: 4.6, reviewCount: 3210, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'Max Air unit, breathable mesh upper, rubber outsole' },
  { id: 203, name: 'H&M Oversized Cotton Tee', category: 'Fashion', brand: 'H&M', price: 799, originalPrice: 1199, stock: 200, rating: 4.2, reviewCount: 8901, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', description: '100% organic cotton, relaxed fit, available in 8 colours' },
  { id: 204, name: 'Fossil Commuter Hybrid Watch', category: 'Fashion', brand: 'Fossil', price: 13995, originalPrice: 16995, stock: 25, rating: 4.4, reviewCount: 1234, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Hybrid smartwatch, leather strap, 2-week battery' },
  { id: 205, name: 'Woodland Waterproof Trekking Shoes', category: 'Fashion', brand: 'Woodland', price: 3999, originalPrice: 5499, stock: 60, rating: 4.3, reviewCount: 2345, imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400', description: 'Gore-Tex waterproof membrane, EVA midsole, rubber outsole' },
  { id: 206, name: 'Flying Machine Slim Chinos', category: 'Fashion', brand: 'Flying Machine', price: 1799, originalPrice: 2499, stock: 90, rating: 4.1, reviewCount: 987, imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', description: 'Stretch chino fabric, slim fit, 4-way stretch' },
  { id: 207, name: 'Fabindia Printed Kurta Set', category: 'Fashion', brand: 'Fabindia', price: 2499, originalPrice: 3499, stock: 50, rating: 4.6, reviewCount: 1567, imageUrl: 'https://images.unsplash.com/photo-1583391733956-62afe32d5b11?w=400', description: 'Hand-block printed cotton, traditional Indian design' },
  { id: 208, name: 'Ray-Ban Aviator Classic Sunglasses', category: 'Fashion', brand: 'Ray-Ban', price: 6990, originalPrice: 8990, stock: 35, rating: 4.7, reviewCount: 4321, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', description: 'G-15 lens, metal frame, UV400 protection' },

  // Books
  { id: 301, name: 'Atomic Habits by James Clear', category: 'Books', brand: 'Penguin', price: 399, originalPrice: 599, stock: 150, rating: 4.9, reviewCount: 12450, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', description: 'An easy & proven way to build good habits & break bad ones' },
  { id: 302, name: 'The Psychology of Money', category: 'Books', brand: 'Jaico', price: 329, originalPrice: 499, stock: 120, rating: 4.8, reviewCount: 9870, imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', description: 'Timeless lessons on wealth, greed, and happiness' },
  { id: 303, name: 'Rich Dad Poor Dad', category: 'Books', brand: 'Plata', price: 279, originalPrice: 399, stock: 200, rating: 4.7, reviewCount: 23450, imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', description: "What the rich teach their kids about money" },
  { id: 304, name: 'Clean Code by Robert Martin', category: 'Books', brand: 'Pearson', price: 2499, originalPrice: 3499, stock: 40, rating: 4.8, reviewCount: 3456, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', description: 'A handbook of agile software craftsmanship' },
  { id: 305, name: 'The Alchemist by Paulo Coelho', category: 'Books', brand: 'HarperCollins', price: 249, originalPrice: 399, stock: 180, rating: 4.9, reviewCount: 34560, imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', description: 'A timeless tale of following your dreams' },

  // Groceries
  { id: 401, name: 'Tata Salt Premium (2kg)', category: 'Groceries', brand: 'Tata', price: 49, originalPrice: 55, stock: 500, rating: 4.8, reviewCount: 34500, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', description: 'Iodized salt, vacuum evaporated, pure and healthy' },
  { id: 402, name: 'Aashirvaad Whole Wheat Atta (5kg)', category: 'Groceries', brand: 'Aashirvaad', price: 249, originalPrice: 285, stock: 300, rating: 4.7, reviewCount: 12300, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', description: 'Multigrain atta, rich in fibre, made from whole wheat' },
  { id: 403, name: 'Organic Fit Honey (1kg)', category: 'Groceries', brand: 'Dabur', price: 399, originalPrice: 499, stock: 150, rating: 4.6, reviewCount: 5670, imageUrl: 'https://images.unsplash.com/photo-1587049693170-4a25d23fd51c?w=400', description: '100% pure organic forest honey, no added sugar' },
  { id: 404, name: 'Harvest Gold Brown Bread (400g)', category: 'Groceries', brand: 'Harvest Gold', price: 65, originalPrice: 75, stock: 80, rating: 4.3, reviewCount: 2340, imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', description: 'Whole wheat, no preservatives, freshly baked flavour' },
  { id: 405, name: 'Fresh Almonds Premium (500g)', category: 'Groceries', brand: 'Happilo', price: 599, originalPrice: 799, stock: 90, rating: 4.7, reviewCount: 8900, imageUrl: 'https://images.unsplash.com/photo-1574806612682-9f415d9f5ea1?w=400', description: 'Premium California almonds, lightly roasted, no salt' },

  // Jewellery
  { id: 501, name: 'Tanishq Diamond Stud Earrings', category: 'Jewellery', brand: 'Tanishq', price: 24999, originalPrice: 29999, stock: 15, rating: 4.9, reviewCount: 567, imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', description: 'BIS hallmarked 14K gold, 0.15ct diamond, certified' },
  { id: 502, name: 'Malabar Gold Bangles Set', category: 'Jewellery', brand: 'Malabar Gold', price: 54999, originalPrice: 64999, stock: 8, rating: 4.8, reviewCount: 234, imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', description: '22K BIS hallmarked gold bangles, traditional design' },
  { id: 503, name: 'Silverine Oxidized Necklace', category: 'Jewellery', brand: 'Silverine', price: 1299, originalPrice: 1999, stock: 45, rating: 4.4, reviewCount: 1230, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Handcrafted oxidized silver plated necklace with pendant' },
  { id: 504, name: 'Kalyan Jewellers Kundan Ring', category: 'Jewellery', brand: 'Kalyan Jewellers', price: 8999, originalPrice: 11999, stock: 20, rating: 4.5, reviewCount: 345, imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Handset kundan stones, gold plated silver base' },

  // Medicines / Health
  { id: 601, name: 'Cipla Vitamin D3 Supplements (60 caps)', category: 'Medicines', brand: 'Cipla', price: 349, originalPrice: 450, stock: 200, rating: 4.6, reviewCount: 3456, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', description: '2000 IU per capsule, supports bone and immune health' },
  { id: 602, name: 'HealthXP Whey Protein (1kg Chocolate)', category: 'Medicines', brand: 'HealthXP', price: 1499, originalPrice: 2199, stock: 75, rating: 4.4, reviewCount: 7890, imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400', description: '24g protein per serving, informed-sport certified' },
  { id: 603, name: 'Himalaya Liv.52 DS Tablets (60 tabs)', category: 'Medicines', brand: 'Himalaya', price: 229, originalPrice: 280, stock: 300, rating: 4.7, reviewCount: 12340, imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', description: 'Liver health supplement with natural herbs' },

  // Rental
  { id: 701, name: 'Designer Bridal Lehenga Rental', category: 'Rental', brand: 'Rent It Bae', price: 4999, originalPrice: 45000, stock: 5, rating: 4.8, reviewCount: 456, imageUrl: 'https://images.unsplash.com/photo-1583391733956-62afe32d5b11?w=400', description: 'Premium Manish Malhotra inspired bridal lehenga, 3-day rental' },
  { id: 702, name: 'DSLR Camera Rental (Canon 5D Mark IV)', category: 'Rental', brand: 'Lens Rental', price: 2999, originalPrice: 180000, stock: 3, rating: 4.6, reviewCount: 234, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', description: 'Professional DSLR with 24-70mm lens, 3-day rental' },
  { id: 703, name: 'Royal Tent Setup (12x24 ft)', category: 'Rental', brand: 'Event Kings', price: 8999, originalPrice: 25000, stock: 2, rating: 4.5, reviewCount: 123, imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', description: 'Royal wedding tent with fabric draping, 1-day rental' },
];

const STATUS_LIST = ['DELIVERED', 'PROCESSING', 'SHIPPED', 'PENDING', 'CANCELLED'];
const PAYMENT_METHODS = ['Razorpay', 'Cash on Delivery', 'UPI', 'Net Banking', 'Credit Card'];

const customerNames = [
  'Aarav Mehta', 'Riya Kapoor', 'Neha Sharma', 'Kabir Verma', 'Priya Singh',
  'Arjun Nair', 'Kavya Reddy', 'Rohan Patel', 'Ananya Iyer', 'Vivaan Chopra',
  'Diya Malhotra', 'Ishaan Gupta', 'Saanvi Joshi', 'Rehan Khan', 'Meera Pillai',
  'Dev Agarwal', 'Tara Sinha', 'Arnav Desai', 'Zara Qureshi', 'Krish Bansal',
  'Nisha Rao', 'Ayaan Bajaj', 'Pari Srivastava', 'Rudra Mishra', 'Anjali Saxena',
  'Siddharth Roy', 'Vanya Sharma', 'Aditya Singh', 'Mia Fernandez', 'Laksh Verma',
  'Radha Krishnan', 'Shreya Pandey', 'Nikhil Shah', 'Pooja Tiwari', 'Suraj Kumar',
  'Mansi Aggarwal', 'Ritesh Chauhan', 'Deepika Yadav', 'Akash Bhat', 'Megha Nair',
  'Rahul Dubey', 'Sneha Bhatt', 'Kartik Saxena', 'Garima Rao', 'Vikram Tiwari',
  'Pallavi Singh', 'Mohit Jain', 'Sania Malik', 'Tarun Gupta', 'Kiran Shetty',
];

const addresses = [
  '42 Sector 15, Noida, UP 201301',
  '7/B Bandra West, Mumbai, MH 400050',
  '23 Koramangala, Bengaluru, KA 560034',
  '91 Jubilee Hills, Hyderabad, TG 500033',
  '15 Salt Lake, Kolkata, WB 700064',
  '31 Anna Nagar, Chennai, TN 600040',
  '8 Vastrapur, Ahmedabad, GJ 380015',
  '56 Civil Lines, Jaipur, RJ 302006',
  '19 Kalyani Nagar, Pune, MH 411006',
  '4 Shivajipuram, Lucknow, UP 226001',
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split('T')[0];
}

export const DEMO_ORDERS = Array.from({ length: 55 }, (_, i) => ({
  id: 100234 + i,
  orderId: `ORD-${100234 + i}`,
  customerName: customerNames[i % customerNames.length],
  customerEmail: `${customerNames[i % customerNames.length].toLowerCase().replace(' ', '.')}@gmail.com`,
  date: randomDate(180),
  amount: randNum(499, 189999),
  status: STATUS_LIST[i % STATUS_LIST.length],
  payment: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
  address: addresses[i % addresses.length],
  items: randNum(1, 5),
  product: DEMO_PRODUCTS[i % DEMO_PRODUCTS.length]?.name || 'Product',
}));

export const DEMO_VENDORS = [
  {
    id: 'v1', businessName: 'Elite Wedding Photography', ownerName: 'Rahul Sharma', service: 'Photographer',
    city: 'Mumbai', rating: 4.9, reviewCount: 312, experience: '8 years',
    price: '₹40,000 - ₹1,20,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    portfolio: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=400', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400'],
    description: 'Candid & traditional wedding photographer with 500+ weddings captured across India.',
    tags: ['Candid', 'Pre-wedding', 'Videography'],
  },
  {
    id: 'v2', businessName: 'Royal Mehendi Studio', ownerName: 'Fatima Shaikh', service: 'Mehendi Artist',
    city: 'Delhi', rating: 4.8, reviewCount: 245, experience: '10 years',
    price: '₹8,000 - ₹30,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
    portfolio: [],
    description: 'Specializing in Arabic, Rajasthani and Indo-Western bridal mehendi designs.',
    tags: ['Bridal Mehendi', 'Arabic', 'Rajasthani'],
  },
  {
    id: 'v3', businessName: 'Makeover by Anjali', ownerName: 'Anjali Verma', service: 'Makeup Artist',
    city: 'Bengaluru', rating: 4.9, reviewCount: 567, experience: '12 years',
    price: '₹15,000 - ₹60,000', availability: 'Booked',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100d293?w=400',
    portfolio: [],
    description: 'MAC & INGLOT certified MUA specializing in airbrush and HD bridal makeup.',
    tags: ['Airbrush', 'HD Makeup', 'Pre-Bridal'],
  },
  {
    id: 'v4', businessName: 'Dream Decor Events', ownerName: 'Sunita Garg', service: 'Decorator',
    city: 'Jaipur', rating: 4.7, reviewCount: 189, experience: '15 years',
    price: '₹50,000 - ₹5,00,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
    portfolio: [],
    description: 'Luxury wedding decorator crafting royal Rajasthani & floral themed weddings.',
    tags: ['Floral', 'Rajasthani Theme', 'LED Decor'],
  },
  {
    id: 'v5', businessName: 'Sharma Luxury Cabs', ownerName: 'Vikram Sharma', service: 'Cab Services',
    city: 'Hyderabad', rating: 4.5, reviewCount: 423, experience: '6 years',
    price: '₹3,000 - ₹15,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    portfolio: [],
    description: 'Fleet of decorated luxury cars including Audi, BMW & Rolls-Royce for weddings.',
    tags: ['Luxury Cars', 'Ceremonial Entry', 'Airport Transfer'],
  },
  {
    id: 'v6', businessName: 'Sweet Moments Cakery', ownerName: 'Priya Menon', service: 'Cake Designer',
    city: 'Chennai', rating: 4.8, reviewCount: 678, experience: '9 years',
    price: '₹5,000 - ₹80,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400',
    portfolio: [],
    description: 'Bespoke multi-tier wedding cakes with fondant art, flowers, and custom themes.',
    tags: ['Fondant', 'Multi-tier', 'Customized'],
  },
  {
    id: 'v7', businessName: 'Bollywood Beats DJ', ownerName: 'DJ Rohit Singh', service: 'DJ',
    city: 'Pune', rating: 4.6, reviewCount: 345, experience: '7 years',
    price: '₹20,000 - ₹80,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1571935441005-2b2e7b1e3c23?w=400',
    portfolio: [],
    description: 'Professional wedding DJ with Bollywood, International and Bhangra expertise.',
    tags: ['Bollywood', 'Sound System', 'LED Setup'],
  },
  {
    id: 'v8', businessName: 'Dawat-e-Khaas Catering', ownerName: 'Chef Naveen Kumar', service: 'Catering',
    city: 'Lucknow', rating: 4.7, reviewCount: 289, experience: '20 years',
    price: '₹800 - ₹2,500 per plate', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
    portfolio: [],
    description: 'Renowned caterer specializing in Mughlai, North Indian & live counter cuisine.',
    tags: ['Mughlai', 'Live Counter', 'Multi-cuisine'],
  },
  {
    id: 'v9', businessName: 'Candid Frames Studio', ownerName: 'Aditya Nair', service: 'Photographer',
    city: 'Kochi', rating: 4.8, reviewCount: 198, experience: '5 years',
    price: '₹30,000 - ₹90,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400',
    portfolio: [],
    description: 'Destination wedding photographer, covering Kerala & Pan-India weddings.',
    tags: ['Destination Weddings', 'Drone Shots', 'Albums'],
  },
  {
    id: 'v10', businessName: 'Bridal Bliss Salon', ownerName: 'Meghna Joshi', service: 'Makeup Artist',
    city: 'Ahmedabad', rating: 4.7, reviewCount: 432, experience: '8 years',
    price: '₹12,000 - ₹45,000', availability: 'Booked',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    portfolio: [],
    description: 'Specializing in South Asian bridal looks with traditional & contemporary styles.',
    tags: ['Bridal', 'Saree Draping', 'Hair Styling'],
  },
  {
    id: 'v11', businessName: 'Floral Fantasy Decor', ownerName: 'Smita Patil', service: 'Decorator',
    city: 'Nagpur', rating: 4.6, reviewCount: 156, experience: '11 years',
    price: '₹40,000 - ₹3,00,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    portfolio: [],
    description: 'Fresh flower specialists creating stunning arches, centrepieces & stage décor.',
    tags: ['Fresh Flowers', 'Arch Decor', 'Stage Design'],
  },
  {
    id: 'v12', businessName: 'Henna Harmony Studio', ownerName: 'Nikhat Bano', service: 'Mehendi Artist',
    city: 'Surat', rating: 4.9, reviewCount: 321, experience: '14 years',
    price: '₹6,000 - ₹25,000', availability: 'Available',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    portfolio: [],
    description: 'Expert in intricate Mughlai and modern geometric mehendi patterns.',
    tags: ['Mughlai', 'Geometric', 'Dulha Mehendi'],
  },
];

export const DEMO_STATS = {
  totalRevenue: 54_82_391,
  totalOrders: 1247,
  totalUsers: 3865,
  totalSellers: 42,
  totalVendors: 68,
  totalRailwayOrders: 389,
  totalWeddingBookings: 156,
  lowStockProducts: 7,
  pendingOrders: 183,
  deliveredOrders: 891,
  cancelledOrders: 84,
  monthlyRevenue: [
    { name: 'Jan', revenue: 2_45_000, orders: 420 },
    { name: 'Feb', revenue: 3_10_000, orders: 550 },
    { name: 'Mar', revenue: 2_90_000, orders: 490 },
    { name: 'Apr', revenue: 3_80_000, orders: 680 },
    { name: 'May', revenue: 4_20_000, orders: 740 },
    { name: 'Jun', revenue: 5_40_000, orders: 890 },
    { name: 'Jul', revenue: 4_80_000, orders: 820 },
  ],
};
