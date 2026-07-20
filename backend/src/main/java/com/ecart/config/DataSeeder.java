package com.ecart.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ecart.entity.Category;
import com.ecart.entity.Product;
import com.ecart.entity.User;
import com.ecart.entity.Review;
import com.ecart.repository.CategoryRepository;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.UserRepository;
import com.ecart.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        seedUsers();
        if (productRepository.count() == 0) {
            seedProductsFromApis();
        } else {
            log.info("Products already seeded ({} found), skipping API fetch.", productRepository.count());
        }
        // Always top-up categories to ensure each has 20+ products
        seedAdditionalProducts();
        // Seed reviews for products if none exist
        seedReviews();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@ecart.com")) {
            User admin = new User();
            admin.setFirstName("Arjun");
            admin.setLastName("Kapoor");
            admin.setEmail("admin@ecart.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setPhone("1234567890");
            userRepository.save(admin);
            log.info("Admin user seeded.");
        }

        if (!userRepository.existsByEmail("priya.sharma@ecart.com")) {
            User customer = new User();
            customer.setFirstName("Priya");
            customer.setLastName("Sharma");
            customer.setEmail("priya.sharma@ecart.com");
            customer.setPassword(passwordEncoder.encode("Priya@2024"));
            customer.setRole(User.Role.CUSTOMER);
            customer.setPhone("9876543210");
            userRepository.save(customer);
            log.info("Demo customer Priya Sharma seeded.");
        }

        if (!userRepository.existsByEmail("rahul.verma@ecart.com")) {
            User customer2 = new User();
            customer2.setFirstName("Rahul");
            customer2.setLastName("Verma");
            customer2.setEmail("rahul.verma@ecart.com");
            customer2.setPassword(passwordEncoder.encode("Rahul@2024"));
            customer2.setRole(User.Role.CUSTOMER);
            customer2.setPhone("9876501234");
            userRepository.save(customer2);
            log.info("Demo customer Rahul Verma seeded.");
        }

        if (!userRepository.existsByEmail("customer@ecart.com")) {
            User legacy = new User();
            legacy.setFirstName("John");
            legacy.setLastName("Doe");
            legacy.setEmail("customer@ecart.com");
            legacy.setPassword(passwordEncoder.encode("customer123"));
            legacy.setRole(User.Role.CUSTOMER);
            legacy.setPhone("0987654321");
            userRepository.save(legacy);
            log.info("Legacy customer seeded.");
        }
    }


    private void seedProductsFromApis() {
        log.info("Fetching products from multiple APIs...");
        try {
            HttpClient client = HttpClient.newHttpClient();
                
                HttpRequest dummyReq = HttpRequest.newBuilder()
                        .uri(URI.create("https://dummyjson.com/products?limit=100"))
                        .GET().build();
                HttpResponse<String> dummyResp = client.send(dummyReq, HttpResponse.BodyHandlers.ofString());
                JsonNode dummyRoot = objectMapper.readTree(dummyResp.body());
                JsonNode dummyProducts = dummyRoot.get("products");

                Map<String, Category> categoryMap = new HashMap<>();

                if (dummyProducts != null) {
                    for (JsonNode node : dummyProducts) {
                        String catName = node.get("category").asText();
                        catName = catName.substring(0, 1).toUpperCase() + catName.substring(1).replace("-", " ");

                        Category category = categoryMap.computeIfAbsent(catName, k -> {
                            Category c = new Category(null, k, k + " products", "📦", true);
                            return categoryRepository.save(c);
                        });

                        Product p = new Product();
                        p.setName(node.get("title").asText());
                        p.setDescription(node.get("description").asText());

                        double priceUsd = node.get("price").asDouble();
                        p.setPrice(BigDecimal.valueOf(priceUsd * 83.5).setScale(2, java.math.RoundingMode.HALF_UP));
                        
                        double discountPct = node.has("discountPercentage") ? node.get("discountPercentage").asDouble() : 10.0;
                        double originalUsd = priceUsd / (1 - discountPct / 100);
                        p.setOriginalPrice(BigDecimal.valueOf(originalUsd * 83.5).setScale(2, java.math.RoundingMode.HALF_UP));

                        p.setCategory(category);
                        
                        if (node.has("thumbnail")) {
                            p.setImageUrl(node.get("thumbnail").asText());
                        }
                        if (node.has("images") && node.get("images").size() > 0) {
                            p.setImageUrl(node.get("images").get(0).asText());
                        }
                        
                        p.setBrand(node.has("brand") ? node.get("brand").asText() : "Generic");
                        p.setStock(node.has("stock") ? node.get("stock").asInt() : (int)(Math.random() * 100) + 10);
                        p.setBadge(discountPct > 15 ? "SALE" : "NEW");
                        p.setStatus(Product.ProductStatus.ACTIVE);

                        if (node.has("rating")) {
                            p.setRating(BigDecimal.valueOf(node.get("rating").asDouble()));
                        }
                        if (node.has("reviews")) {
                            p.setReviewCount(node.get("reviews").size());
                        }

                        p.applyFeatureFlags(); 
                        productRepository.save(p);
                    }
                }

                HttpRequest fakeReq = HttpRequest.newBuilder()
                        .uri(URI.create("https://fakestoreapi.com/products"))
                        .GET().build();
                HttpResponse<String> fakeResp = client.send(fakeReq, HttpResponse.BodyHandlers.ofString());
                JsonNode fakeProducts = objectMapper.readTree(fakeResp.body());

                for (JsonNode node : fakeProducts) {
                    String catName = node.get("category").asText();
                    catName = catName.substring(0, 1).toUpperCase() + catName.substring(1);

                    Category category = categoryMap.computeIfAbsent(catName, k -> {
                        Category c = new Category(null, k, k + " products", "📦", true);
                        return categoryRepository.save(c);
                    });

                    Product p = new Product();
                    p.setName(node.get("title").asText());
                    p.setDescription(node.get("description").asText());
                    double priceUsd = node.get("price").asDouble();
                    p.setPrice(BigDecimal.valueOf(priceUsd * 83.5).setScale(2, java.math.RoundingMode.HALF_UP));
                    p.setOriginalPrice(p.getPrice().multiply(BigDecimal.valueOf(1.2)).setScale(2, java.math.RoundingMode.HALF_UP));
                    p.setCategory(category);
                    p.setImageUrl(node.get("image").asText());
                    p.setBrand("Generic");
                    p.setStock((int)(Math.random() * 100) + 10);
                    p.setBadge(Math.random() > 0.5 ? "SALE" : "NEW");
                    p.setStatus(Product.ProductStatus.ACTIVE);
                    JsonNode ratingNode = node.get("rating");
                    if (ratingNode != null) {
                        p.setRating(BigDecimal.valueOf(ratingNode.get("rate").asDouble()));
                        p.setReviewCount(ratingNode.get("count").asInt());
                    }
                    p.applyFeatureFlags(); 
                    productRepository.save(p);
                }

            } catch (Exception e) {
                log.error("Failed to fetch products from APIs, falling back to manual seed", e);
                seedFallback();
            }
    }

    private void seedFallback() {
        log.info("Seeding fallback products with hardcoded data...");

        Category electronics  = getOrCreate("Electronics",  "Gadgets and Devices",       "📱");
        Category fashion      = getOrCreate("Fashion",      "Clothing and Accessories",  "👗");
        Category home         = getOrCreate("Home",         "Home and Kitchen",          "🏠");
        Category beauty       = getOrCreate("Beauty",       "Skincare and Cosmetics",    "💄");
        Category sports       = getOrCreate("Sports",       "Sports and Fitness",        "🏋\uFE0F");
        Category books        = getOrCreate("Books",        "Books and Stationery",      "📚");
        Category jewelry      = getOrCreate("Jewellery",    "Jewellery and Accessories", "💍");
        Category toys         = getOrCreate("Toys",         "Toys and Games",            "🧸");

        seed("iPhone 15 Pro Max", "Apple's flagship with titanium design, A17 Pro chip.", 124900, 134900, electronics, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", "Apple", 45, 4.8, 2840, "SALE");
        seed("Samsung Galaxy S24 Ultra", "200MP camera, S Pen, Snapdragon 8 Gen 3.", 134999, 149999, electronics, "https://images.unsplash.com/photo-1706016851617-7f5e5e5e5e5e?w=400", "Samsung", 60, 4.7, 1920, "NEW");
        
        Category clothing = getOrCreate("Clothing", "Clothing and Apparel", "👕");
        seed("Premium Cotton Kurta Set", "Elegant cotton kurta with matching pyjama.", 1299, 1799, clothing, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400", "FabIndia", 80, 4.6, 3200, "SALE");
        
        Category medicine = getOrCreate("Medicine", "Medicines and Healthcare", "💊");
        seed("Paracetamol 500mg", "Fast-acting paracetamol tablets for fever.", 25, 35, medicine, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", "Cipla", 500, 4.8, 12000, "NEW");
        
        Category grocery = getOrCreate("Grocery", "Grocery and Daily Essentials", "🛒");
        seed("Organic Basmati Rice 5kg", "Premium aged basmati rice.", 599, 749, grocery, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", "India Gate", 200, 4.7, 15000, "SALE");
        
        Category wedding = getOrCreate("LastMinuteWedding", "Last Minute Wedding Essentials", "💍");
        seed("Bridal Lehenga — Red & Gold", "Stunning bridal lehenga with heavy embroidery.", 24999, 39999, wedding, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", "Manyavar", 10, 4.9, 1200, "SALE");
    }

    private void seedAdditionalProducts() {
        log.info("Starting enrichment seeding...");
        
        Category electronics = getOrCreate("Electronics", "Gadgets and Devices", "📱");
        Category fashion = getOrCreate("Fashion", "Clothing and Accessories", "👗");
        Category home = getOrCreate("Home", "Home and Kitchen", "🏠");
        Category beauty = getOrCreate("Beauty", "Skincare and Cosmetics", "💄");
        Category sports = getOrCreate("Sports", "Sports and Fitness", "🏋\uFE0F");
        Category books = getOrCreate("Books", "Books and Stationery", "📚");
        Category grocery = getOrCreate("Grocery", "Grocery and Daily Essentials", "🛒");
        Category toys = getOrCreate("Toys", "Toys and Games", "🧸");
        Category petSupplies = getOrCreate("Pet Supplies", "Supplies for your furry friends", "🐾");
        Category jewellery = getOrCreate("Jewellery", "Jewellery and Accessories", "💍");
        Category wedding = getOrCreate("LastMinuteWedding", "Last Minute Wedding Essentials", "💍");

        // ── Electronics ─────────────────────────────────────────────────────
        seed("Apple iPhone 15", "The latest iPhone with A16 Bionic chip.", 79900, 89900, electronics, "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400", "Apple", 50, 4.8, 1200, "NEW");
        seed("Samsung Galaxy S24", "Galaxy AI is here. Epic camera.", 74999, 82999, electronics, "https://images.unsplash.com/photo-1707234637375-9e6b4e5ae5b1?w=400", "Samsung", 45, 4.7, 850, "SALE");
        seed("OnePlus 12", "Smooth Beyond Belief. Snapdragon 8 Gen 3.", 64999, 69999, electronics, "https://images.unsplash.com/photo-1711200000000-000000000000?w=400", "OnePlus", 30, 4.6, 600, "NEW");
        seed("Google Pixel 8 Pro", "The most advanced Pixel yet.", 106990, 115990, electronics, "https://images.unsplash.com/photo-1697223533230-00fe85d7f7de?w=400", "Google", 25, 4.7, 450, "SALE");
        seed("MacBook Pro M3", "Pro to the Max. 14-inch display.", 169900, 184900, electronics, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", "Apple", 15, 4.9, 2100, "NEW");
        seed("Sony Bravia 4K LED TV", "Stunning 4K clarity with vibrant colors.", 54900, 64900, electronics, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", "Sony", 12, 4.6, 980, "NEW");
        seed("Bose QuietComfort Headphones", "World-class noise cancelling.", 25900, 32900, electronics, "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", "Bose", 40, 4.8, 1500, "SALE");
        seed("Kindle Paperwhite", "Now with a 6.8\" display.", 14999, 16999, electronics, "https://images.unsplash.com/photo-1594980596271-e33bc87e35cc?w=400", "Amazon", 60, 4.7, 2400, "NEW");
        seed("Garmin Venu 3", "Know the real you with advanced health.", 44990, 49990, electronics, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", "Garmin", 18, 4.6, 150, "NEW");
        seed("Marshall Emberton II", "Rich, clear and loud.", 14999, 17999, electronics, "https://images.unsplash.com/photo-1545454675-3531bdf9915e?w=400", "Marshall", 35, 4.7, 890, "NEW");
        seed("Sennheiser Momentum 4", "The choice for a new generation.", 34990, 39990, electronics, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "Sennheiser", 20, 4.8, 450, "NEW");
        seed("Logitech MX Master 3S", "Advanced wireless mouse.", 9995, 11995, electronics, "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", "Logitech", 90, 4.8, 3400, "NEW");
        seed("Dell XPS 13", "The most portable 13-inch laptop.", 124990, 139990, electronics, "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", "Dell", 15, 4.7, 120, "SALE");
        seed("Apple AirPods Pro", "Magic like you've never heard.", 24900, 26900, electronics, "https://images.unsplash.com/photo-1588423770186-80f3ef9adfa2?w=400", "Apple", 80, 4.8, 5600, "NEW");
        seed("Razer DeathAdder V3", "For the pro, by the pro.", 6999, 8999, electronics, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400", "Razer", 50, 4.7, 890, "SALE");
        seed("WD Black 1TB SSD", "Next-gen PCIe Gen4 technology.", 8999, 10999, electronics, "https://images.unsplash.com/photo-1597872200382-0bf5fd3f9794?w=400", "Western Digital", 120, 4.8, 2100, "NEW");
        seed("TP-Link WiFi 6 Router", "Ultrafast AX3000 WiFi Speed.", 5999, 7999, electronics, "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400", "TP-Link", 45, 4.5, 450, "SALE");
        seed("Samsung Galaxy Tab S9", "The new standard of premium tablets.", 72999, 82999, electronics, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", "Samsung", 25, 4.7, 320, "NEW");
        seed("JBL Flip 6", "Bold sound for every adventure.", 9999, 12999, electronics, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", "JBL", 150, 4.6, 6700, "SALE");
        seed("Corsair Vengeance 32GB RAM", "Push the limits of performance.", 12999, 15999, electronics, "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400", "Corsair", 60, 4.9, 1200, "NEW");

        // ── Fashion ─────────────────────────────────────────────────────────
        seed("Nike Zoom Fly 5", "Durable design for training and racing.", 14995, 16995, fashion, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", "Nike", 40, 4.6, 560, "NEW");
        seed("Adidas Stan Smith", "Enduring style and quality.", 8999, 10999, fashion, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400", "Adidas", 60, 4.5, 1200, "SALE");
        seed("Puma Suede Classic", "The PUMA Suede is the original.", 6999, 7999, fashion, "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400", "Puma", 80, 4.4, 2100, "NEW");
        seed("Levi's Sherpa Jacket", "The original jean jacket since 1967.", 6999, 8999, fashion, "https://images.unsplash.com/photo-1576871333019-220ef346ddbb?w=400", "Levi's", 25, 4.7, 890, "SALE");
        seed("Ralph Lauren Polo", "An American style standard since 1972.", 9900, 11900, fashion, "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400", "Ralph Lauren", 100, 4.6, 4500, "NEW");
        seed("Zara Breasted Coat", "Long coat with a lapel collar.", 11990, 14990, fashion, "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", "Zara", 12, 4.5, 120, "NEW");
        seed("Ray-Ban Wayfarer", "Historical history of sunglasses.", 10990, 12990, fashion, "https://images.unsplash.com/photo-1511499767390-91f99f73948c?w=400", "Ray-Ban", 40, 4.8, 6700, "NEW");
        seed("Casio G-Shock", "Carbon Core Guard thin case.", 9995, 11995, fashion, "https://images.unsplash.com/photo-1522312346375-d1ad505d682b?w=400", "Casio", 75, 4.7, 4300, "SALE");
        seed("Vans Old Skool", "The first iconic side stripe.", 5499, 6499, fashion, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400", "Vans", 120, 4.6, 8900, "NEW");
        seed("Crocs Classic Clog", "Iconic comfort revolution.", 3495, 3995, fashion, "https://images.unsplash.com/photo-1620794341491-7fb52f2f846f?w=400", "Crocs", 200, 4.7, 15000, "NEW");
        seed("Fossil Neutra", "Chronograph brown leather watch.", 12495, 14995, fashion, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", "Fossil", 35, 4.6, 1200, "SALE");
        seed("Uniqlo Linen Shirt", "Breathable linen for summer comfort.", 2490, 2990, fashion, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", "Uniqlo", 100, 4.4, 2100, "NEW");
        seed("Lacoste Hoodie", "Premium fleece for cool weather.", 8900, 10900, fashion, "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400", "Lacoste", 20, 4.5, 450, "SALE");
        seed("Tommy Hilfiger Wallet", "Genuine leather slim wallet.", 2999, 3999, fashion, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", "Tommy Hilfiger", 150, 4.6, 5600, "NEW");
        seed("Allen Solly Blazer", "Slim fit formal blazer.", 5999, 7999, fashion, "https://images.unsplash.com/photo-1594932224010-70f0322ba53a?w=400", "Allen Solly", 15, 4.4, 320, "SALE");
        seed("Peter England Shirt", "Classic white formal shirt.", 1499, 1999, fashion, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", "Peter England", 200, 4.3, 8900, "NEW");
        seed("Bata Leather Shoes", "Durable formal leather shoes.", 2499, 3499, fashion, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", "Bata", 80, 4.2, 4300, "SALE");
        seed("Titan Neo", "Sophisticated analog watch for men.", 5995, 6995, fashion, "https://images.unsplash.com/photo-1522312346375-d1ad505d682b?w=400", "Titan", 50, 4.7, 3100, "NEW");
        seed("FabIndia Silk Kurta", "Luxurious silk for special occasions.", 4999, 6999, fashion, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400", "FabIndia", 25, 4.8, 1200, "SALE");
        seed("W for Woman Kurti", "Trendy ethnic wear for women.", 1999, 2999, fashion, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", "W", 120, 4.5, 5600, "NEW");

        // ── Home ─────────────────────────────────────────────────────────────
        seed("Samsung Washer", "12kg capacity AI technology.", 44990, 52990, home, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", "Samsung", 15, 4.7, 450, "SALE");
        seed("LG Refrigerator", "655L with Door-in-Door.", 92990, 105000, home, "https://images.unsplash.com/photo-1571175432230-0167f9e299c1?w=400", "LG", 10, 4.8, 320, "NEW");
        seed("Air Fryer", "Digital healthy oil-free cooking.", 8999, 12999, home, "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400", "Morphy", 40, 4.6, 1200, "SALE");
        seed("Mixer Grinder", "750W motor with 4 jars.", 4500, 5999, home, "https://images.unsplash.com/photo-1585615822317-73d28348352c?w=400", "Prestige", 60, 4.5, 3400, "NEW");
        seed("Water Purifier", "RO + UV TDS Control.", 16500, 19500, home, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", "Kent", 25, 4.7, 5600, "SALE");
        seed("Ortho Mattress", "Memory foam back support.", 24999, 32999, home, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", "Sleepwell", 20, 4.8, 890, "NEW");
        seed("Steam Iron", "2400W steam for easy crease.", 3499, 4499, home, "https://images.unsplash.com/photo-1510007809012-6e27303f290d?w=400", "Philips", 100, 4.4, 2100, "SALE");
        seed("Cello Dinner Set", "36-piece opalware dinner set.", 3999, 5499, home, "https://images.unsplash.com/photo-1590732159930-985223c6f17e?w=400", "Cello", 50, 4.6, 1200, "NEW");
        seed("Voltas Split AC", "1.5 Ton 5 Star Inverter Split AC.", 42990, 56990, home, "https://images.unsplash.com/photo-1591147139225-856bb0a7735c?w=400", "Voltas", 10, 4.5, 340, "SALE");
        seed("Solimo Comforter", "Soft reversible microfibre comforter.", 1499, 2499, home, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", "Solimo", 100, 4.4, 2100, "NEW");
        seed("Milton Water Bottle", "Insulated stainless steel 24-hour hot/cold.", 999, 1299, home, "https://images.unsplash.com/photo-1602143399827-bd9396fbc3a7?w=400", "Milton", 200, 4.6, 5600, "SALE");
        seed("Pigeon Induction Cooktop", "7 segments LED display for temperature.", 2499, 3999, home, "https://images.unsplash.com/photo-1584990344468-5a111a62d816?w=400", "Pigeon", 80, 4.3, 1200, "NEW");
        seed("Havel's Geyser", "25L vertical storage water heater.", 8999, 11999, home, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", "Havells", 20, 4.7, 560, "SALE");
        seed("Crompton Iron", "Lightweight dry iron with non-stick coating.", 899, 1199, home, "https://images.unsplash.com/photo-1510007809012-6e27303f290d?w=400", "Crompton", 120, 4.2, 890, "NEW");
        seed("SleepyCat Pillow", "Memory foam pillow for neck support.", 1999, 2999, home, "https://images.unsplash.com/photo-1616627686502-38612ecebf51?w=400", "SleepyCat", 150, 4.8, 3100, "SALE");
        seed("Blue Star Air Purifier", "Hepa filter with carbon filter protection.", 7999, 10999, home, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", "Blue Star", 30, 4.6, 210, "NEW");
        seed("Wonderchef Nutri-Blend", "Powerful nutrient extractor mixer.", 4999, 6499, home, "https://images.unsplash.com/photo-1585615822317-73d28348352c?w=400", "Wonderchef", 60, 4.7, 1500, "SALE");

        // ── Beauty ───────────────────────────────────────────────────────────
        seed("Hydro Boost", "Water gel moisturizer.", 1249, 1499, beauty, "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", "Neutrogena", 300, 4.7, 8500, "SALE");
        seed("Snail Mucin", "Repairing facial essence.", 1450, 1950, beauty, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", "COSRX", 150, 4.8, 12000, "NEW");
        seed("SPF 50 Sunscreen", "Broad spectrum protection.", 2200, 2600, beauty, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", "La Roche", 200, 4.9, 15000, "SALE");
        seed("MAC Powder", "Foundation and powder.", 3200, 3600, beauty, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", "MAC", 100, 4.8, 25000, "NEW");
        seed("Night Repair", "Multi-Recovery Complex.", 8900, 9900, beauty, "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", "Estee Lauder", 50, 4.9, 8900, "SALE");
        seed("Moisture Surge", "100H auto-replenishing.", 3400, 3800, beauty, "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", "Clinique", 80, 4.7, 5600, "NEW");
        seed("BHA Exfoliant", "Exfoliant for skin texture.", 2900, 3400, beauty, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", "Paula's Choice", 120, 4.8, 18000, "SALE");
        seed("Sauvage Parfum", "Iconic men's fragrance.", 11500, 13000, beauty, "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400", "Dior", 40, 4.9, 32000, "NEW");
        seed("Chanel No. 5", "Timeless floral fragrance.", 14500, 16000, beauty, "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", "Chanel", 25, 4.8, 15000, "SALE");
        seed("Seed Serum", "Hydrating serum green tea.", 2100, 2400, beauty, "https://images.unsplash.com/photo-1570172619674-c6c8008e103c?w=400", "Innisfree", 180, 4.6, 9200, "NEW");
        seed("Loreal Revitalift", "Pure hyaluronic acid serum.", 999, 1299, beauty, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", "Loreal", 200, 4.7, 12000, "SALE");
        seed("Dove Beauty Bar", "Gently cleanses and moisturizes.", 249, 299, beauty, "https://images.unsplash.com/photo-1600857062241-99e5da7f5a9e?w=400", "Dove", 500, 4.5, 45000, "NEW");
        seed("Biotique Fruit Brightening", "Natural skin whitening lip balm.", 149, 199, beauty, "https://images.unsplash.com/photo-1591130219388-ae3d1c17431b?w=400", "Biotique", 400, 4.4, 18000, "SALE");
        seed("Tresemme Keratin Smooth", "Lower sulfate shampoo for smooth hair.", 749, 899, beauty, "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400", "Tresemme", 300, 4.6, 21000, "NEW");
        seed("Lakme Liquid Liner", "Intense black liquid eyeliner.", 399, 499, beauty, "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400", "Lakme", 350, 4.4, 32000, "SALE");
        seed("Cetaphil Face Wash", "Daily facial cleanser for sensitive skin.", 599, 749, beauty, "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", "Cetaphil", 450, 4.8, 15000, "NEW");
        seed("Maybelline Colossal", "Volumizing mascara for big lashes.", 799, 999, beauty, "https://images.unsplash.com/photo-1591360236631-482403fd174a?w=400", "Maybelline", 200, 4.5, 9800, "SALE");
        seed("Sugar Matte Lipstick", "Bold matte finish lipstick.", 899, 1099, beauty, "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=400", "Sugar", 180, 4.6, 5600, "NEW");
        seed("Mamaearth Face Serum", "Vitamin C and turmeric radiance.", 649, 799, beauty, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", "Mamaearth", 220, 4.7, 3100, "SALE");
        seed("Forest Essentials Deo", "Natural deodorant with floral notes.", 1200, 1500, beauty, "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", "Forest Essentials", 100, 4.8, 1200, "NEW");

        // ── Sports ───────────────────────────────────────────────────────────
        seed("Boxing Gloves", "Synthetic leather durability.", 2999, 3999, sports, "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400", "Everlast", 50, 4.6, 980, "SALE");
        seed("Basketball", "The #1 indoor game.", 3499, 4499, sports, "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400", "Wilson", 60, 4.9, 3400, "NEW");
        seed("Yonex Racket", "Offensive-oriented racket.", 18900, 22000, sports, "https://images.unsplash.com/photo-1626225967041-964dc268a4bc?w=400", "Yonex", 15, 4.8, 560, "SALE");
        seed("Official Ball", "Leather indoor basketball.", 9999, 12000, sports, "https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=400", "Spalding", 20, 4.8, 890, "NEW");
        seed("Golf Balls", "Most played ball.", 4999, 5999, sports, "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400", "Titleist", 100, 4.9, 12000, "SALE");
        seed("Baseball Glove", "Premium leather glove.", 24900, 28000, sports, "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", "Rawlings", 10, 4.7, 340, "NEW");
        seed("Pure Drive", "Power and the spin.", 16500, 19500, sports, "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?w=400", "Babolat", 25, 4.8, 1200, "SALE");
        seed("Swimming Goggles", "Best-selling goggles.", 1999, 2499, sports, "https://images.unsplash.com/photo-1552674605-db6f4ad91811?w=400", "Speedo", 120, 4.7, 5600, "NEW");
        seed("SelectTech Dumbbells", "Turn dial resistance.", 35900, 42000, sports, "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400", "Bowflex", 12, 4.8, 980, "SALE");
        seed("Suspension Trainer", "All-in-one fitness solution.", 14500, 17500, sports, "https://images.unsplash.com/photo-1594737626072-883753f0296d?w=400", "TRX", 30, 4.7, 1500, "NEW");
        seed("Nivia Football", "Machine stitched for durability.", 1299, 1599, sports, "https://images.unsplash.com/photo-1552667466-07fdd0a4489c?w=400", "Nivia", 100, 4.5, 3400, "SALE");
        seed("Cricket Bat", "English willow grade A bat.", 15500, 18900, sports, "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", "SS", 12, 4.8, 1200, "NEW");
        seed("Yoga Mat", "6mm extra thick TPE mat.", 1499, 1999, sports, "https://images.unsplash.com/photo-1592432676556-311790da22ec?w=400", "Boldfit", 150, 4.7, 8500, "SALE");
        seed("Treadmill", "2.5HP power folding treadmill.", 39999, 45000, sports, "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400", "Lifelong", 5, 4.6, 430, "NEW");
        seed("Skipping Rope", "Fast speed cable jumping rope.", 499, 699, sports, "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=400", "Vector X", 200, 4.4, 12000, "SALE");
        seed("Adjustable Hand Grip", "Strengthen your grip and forearms.", 299, 399, sports, "https://images.unsplash.com/photo-1591940742863-7096d7ad515b?w=400", "Strauss", 100, 4.3, 5600, "NEW");
        seed("Tennis Ball (Pack of 3)", "Premium felt for high bounce.", 449, 549, sports, "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400", "Wilson", 300, 4.5, 3100, "SALE");
        seed("Pull Up Bar", "Avenue doorway gym bar.", 1999, 2499, sports, "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400", "Skyline", 40, 4.6, 1500, "NEW");
        seed("Fitness Tracker", "Smart watch with SpO2 and heart rate.", 2999, 3999, sports, "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400", "Boat", 120, 4.5, 9200, "SALE");
        seed("Knee Support", "Elasticated compression knee sleeve.", 599, 799, sports, "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400", "Flamingo", 80, 4.4, 2100, "NEW");

        // ── Books ────────────────────────────────────────────────────────────
        seed("The Alchemist", "A fable about following your dream.", 299, 399, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Harper", 300, 4.8, 15000, "SALE");
        seed("Atomic Habits", "Transform your life with tiny changes.", 399, 499, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Penguin", 500, 4.9, 85000, "NEW");
        seed("Psychology of Money", "Timeless lessons on wealth and greed.", 349, 449, books, "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", "Jaico", 400, 4.8, 62000, "SALE");
        seed("Rich Dad Poor Dad", "What the rich teach their kids.", 299, 349, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Warner", 600, 4.7, 95000, "NEW");
        seed("Think and Grow Rich", "The original success classic.", 199, 249, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Ballantine", 350, 4.6, 12000, "SALE");
        seed("Sapiens", "A brief history of humankind.", 449, 599, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Vintage", 200, 4.8, 56000, "NEW");
        seed("The Intelligent Investor", "The definitive book on value investing.", 549, 699, books, "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", "Harper", 150, 4.7, 34000, "SALE");
        seed("Deep Work", "Rules for focused success in a distracted world.", 399, 499, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Piatkus", 250, 4.7, 18000, "NEW");
        seed("Ego is the Enemy", "Control your ego to reach your potential.", 349, 449, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Portfolio", 180, 4.6, 9200, "SALE");
        seed("Ikigai", "The Japanese secret to a long and happy life.", 399, 499, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Cornerstone", 300, 4.7, 24000, "NEW");
        seed("Man's Search for Meaning", "Viktor Frankl's classic on resilience.", 249, 349, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Beacon", 400, 4.9, 120000, "SALE");
        seed("Power of Your Subconscious", "Unlock the secrets of your mind.", 149, 199, books, "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", "Simon", 500, 4.6, 45000, "NEW");
        seed("Start with Why", "How great leaders inspire everyone to take action.", 399, 499, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Portfolio", 150, 4.7, 15000, "SALE");
        seed("Zero to One", "Notes on startups, or how to build the future.", 449, 549, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Crown", 200, 4.7, 21000, "NEW");
        seed("Grit", "The power of passion and perseverance.", 399, 499, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Scribner", 120, 4.7, 8900, "SALE");
        seed("Influence", "The psychology of persuasion.", 499, 649, books, "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", "Harper", 80, 4.8, 5600, "NEW");
        seed("Thinking, Fast and Slow", "Explore how our minds work.", 549, 699, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Farrar", 100, 4.9, 31000, "SALE");
        seed("The 4-Hour Workweek", "Escape 9-5 and live anywhere.", 499, 599, books, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", "Harmony", 200, 4.5, 15000, "NEW");
        seed("Mindset", "The new psychology of success.", 399, 499, books, "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", "Ballantine", 300, 4.7, 24000, "SALE");
        seed("The 5 AM Club", "Own your morning, elevate your life.", 349, 449, books, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", "Harper", 400, 4.6, 9200, "NEW");

        // ── Grocery ──────────────────────────────────────────────────────────
        seed("Basmati Rice 5kg", "Long grain aromatic basmati rice.", 599, 749, grocery, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", "India Gate", 200, 4.7, 15000, "SALE");
        seed("Aashirvaad Atta 10kg", "Whole wheat flour for healthy roti.", 449, 549, grocery, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", "Aashirvaad", 300, 4.6, 25000, "NEW");
        seed("Fortune Sunflower Oil 5L", "Pure sunflower oil for cooking.", 799, 999, grocery, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", "Fortune", 150, 4.4, 12000, "SALE");
        seed("Amul Butter 500g", "Pure pasteurised table butter.", 275, 299, grocery, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", "Amul", 500, 4.8, 56000, "NEW");
        seed("Tata Salt 1kg", "Vacuum evaporated iodised salt.", 25, 28, grocery, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400", "Tata", 1000, 4.9, 120000, "SALE");
        seed("Maggi Noodles (Pack of 12)", "2-minute instant masala noodles.", 168, 180, grocery, "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400", "Nestle", 800, 4.7, 85000, "NEW");
        seed("Dabur Honey 500g", "Pure natural honey with no added sugar.", 199, 249, grocery, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", "Dabur", 400, 4.5, 34000, "SALE");
        seed("Nescafe Classic 200g", "Instant coffee powder pure and rich.", 549, 649, grocery, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", "Nescafe", 300, 4.8, 45000, "NEW");
        seed("Kellogg's Corn Flakes", "Crispy original corn flakes breakfast.", 349, 399, grocery, "https://images.unsplash.com/photo-1580191947416-62d35a55e71d?w=400", "Kelloggs", 250, 4.4, 18000, "SALE");
        seed("Surf Excel Matic 2kg", "Front load washing machine powder.", 499, 599, grocery, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400", "Surf Excel", 350, 4.6, 31000, "NEW");
        seed("Cadbury Silk (Pack of 3)", "Rich and smooth dairy milk chocolate.", 299, 349, grocery, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", "Cadbury", 150, 4.8, 56000, "SALE");
        seed("Organic Tattva Moong Dal", "Unpolished and chemical free moong dal.", 149, 199, grocery, "https://images.unsplash.com/photo-1585914924626-45adac9e6bd6?w=400", "Organic Tattva", 200, 4.5, 12000, "NEW");
        seed("Himalaya Turmeric 100g", "Pure turmeric powder for immunity.", 49, 69, grocery, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400", "Himalaya", 600, 4.7, 8900, "SALE");
        seed("Horlicks 1kg", "Health drink for children's growth.", 450, 550, grocery, "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400", "Horlicks", 180, 4.6, 21000, "NEW");
        seed("Tropicana Orange 1L", "100% pure orange juice with no pulp.", 119, 149, grocery, "https://images.unsplash.com/photo-1600266177646-1f63bbd4b2d5?w=400", "Tropicana", 400, 4.3, 15000, "SALE");
        seed("Lipton Green Tea 100 Bags", "Refreshing energy with pure green tea.", 399, 499, grocery, "https://images.unsplash.com/photo-1544787210-2211d44b565a?w=400", "Lipton", 250, 4.7, 32000, "NEW");
        seed("Hand Sanitizer 500ml", "Alcohol based germ protection liquid.", 199, 249, grocery, "https://images.unsplash.com/photo-1584622723133-7833a87530b8?w=400", "Dettol", 1000, 4.8, 85000, "SALE");
        seed("Paper Boat Anar 1L", "Traditional pomegranate juice drink.", 125, 150, grocery, "https://images.unsplash.com/photo-1600266177646-1f63bbd4b2d5?w=400", "Paper Boat", 300, 4.5, 9200, "NEW");
        seed("Ambi Pur Air Freshener", "Lavender bouquet room spray.", 299, 399, grocery, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400", "Ambi Pur", 150, 4.4, 5600, "SALE");
        seed("Oreo Biscuits (Box of 12)", "Chocolate sandwich cookies with cream.", 360, 420, grocery, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", "Oreo", 200, 4.6, 31000, "NEW");

        // ── Toys ─────────────────────────────────────────────────────────────
        seed("LEGO Police Station", "Modular city collection for kids.", 8999, 10999, toys, "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400", "LEGO", 30, 4.9, 2100, "SALE");
        seed("Barbie Dream House", "Large mansion with interactive rooms.", 15500, 18900, toys, "https://images.unsplash.com/photo-1558017487-06bf9f8071c9?w=400", "Mattel", 15, 4.8, 890, "NEW");
        seed("Hot Wheels Mega Track", "Crazy loop track for racing cars.", 2499, 3499, toys, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400", "Hot Wheels", 80, 4.7, 5600, "SALE");
        seed("Uno Card Game", "Classic family card game for everyone.", 199, 299, toys, "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400", "Mattel", 500, 4.9, 120000, "NEW");
        seed("Monopoly Deluxe Edition", "Family board game with metal tokens.", 1499, 1999, toys, "https://images.unsplash.com/photo-1610819013583-29b817326488?w=400", "Hasbro", 200, 4.8, 45000, "SALE");
        seed("Remote Control Car", "High speed rechargeable drifting car.", 1299, 1799, toys, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400", "ToyZon", 150, 4.5, 3400, "NEW");
        seed("Stuffed Teddy Bear", "Large fluffy bear for cuddling.", 899, 1299, toys, "https://images.unsplash.com/photo-1559414231-9c8577bc9732?w=400", "Softies", 120, 4.6, 9200, "SALE");
        seed("Rubik's Cube 3x3", "Classic brain teaser puzzle cube.", 499, 699, toys, "https://images.unsplash.com/photo-1591994844446-6084a7e17441?w=400", "Rubiks", 400, 4.7, 18000, "NEW");
        seed("Electronic Keyboard", "Learning piano for children with mic.", 2999, 3999, toys, "https://images.unsplash.com/photo-1598501170363-079cf483d47c?w=400", "Casio", 40, 4.6, 2100, "SALE");
        seed("Kitchen Set Playset", "Miniature kitchen with lights and sound.", 1499, 2499, toys, "https://images.unsplash.com/photo-1558017487-06bf9f8071c9?w=400", "FunSkool", 100, 4.4, 5600, "NEW");
        seed("Baby Rattles Set", "6-piece developmental rattles for infants.", 599, 899, toys, "https://images.unsplash.com/photo-1559414231-9c8577bc9732?w=400", "FisherPrice", 300, 4.7, 12000, "SALE");
        seed("Superhero Action Figure", "Posable hero figure with LED chest.", 799, 1199, toys, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400", "Marvel", 200, 4.5, 8900, "NEW");
        seed("Walking Robot Toy", "Interactive robot with lights and music.", 1999, 2999, toys, "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400", "Robotix", 80, 4.6, 3100, "SALE");
        seed("Crayola Art Case", "140 count art supplies set.", 2499, 3499, toys, "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", "Crayola", 150, 4.8, 15000, "NEW");
        seed("Wooden Building Blocks", "Natural wood blocks for construction.", 1299, 1999, toys, "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400", "Melissa", 100, 4.7, 5600, "SALE");
        seed("Chess Set Tournament", "Large folding wooden board with pieces.", 999, 1499, toys, "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400", "Sagar", 200, 4.8, 12000, "NEW");
        seed("Squishmallow Plush", "Ultra soft marshmallow-like plush toy.", 1499, 1999, toys, "https://images.unsplash.com/photo-1559414231-9c8577bc9732?w=400", "KellyToys", 300, 4.9, 25000, "SALE");
        seed("Nerf Elite Blaster", "Precision blasting with 6-dart rotation.", 1299, 1799, toys, "https://images.unsplash.com/photo-1623932230836-e78996b86650?w=400", "Nerf", 180, 4.7, 18000, "NEW");
        seed("Scrabble Original", "The classic letter game for wordsmiths.", 1199, 1599, toys, "https://images.unsplash.com/photo-1591994844446-6084a7e17441?w=400", "Mattel", 150, 4.8, 9200, "SALE");
        seed("Play-Doh Multi Pack", "12 cans of non-toxic modeling compound.", 999, 1299, toys, "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", "Hasbro", 400, 4.6, 31000, "NEW");

        // ── Pet Supplies ─────────────────────────────────────────────────────
        seed("Pedigree Dog Food 10kg", "Complete nutrition for adult dogs.", 1850, 2200, petSupplies, "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400", "Pedigree", 100, 4.7, 15000, "SALE");
        seed("Whiskas Cat Food 1.1kg", "Ocean fish flavored dry food for cats.", 399, 499, petSupplies, "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400", "Whiskas", 200, 4.6, 9200, "NEW");
        seed("Dog Leash & Collar Set", "Reflective nylon set for night safety.", 499, 799, petSupplies, "https://images.unsplash.com/photo-1591768310344-150bc227c8be?w=400", "FurBlast", 150, 4.5, 3400, "SALE");
        seed("Cat Litter 10kg", "Bentonite clumping litter lavender scent.", 699, 899, petSupplies, "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", "TidyCats", 300, 4.7, 12000, "NEW");
        seed("Pet Bed Large", "Orthopedic foam bed for joint comfort.", 2499, 3499, petSupplies, "https://images.unsplash.com/photo-1541599540903-21b8f0477033?w=400", "Bolster", 80, 4.8, 2100, "SALE");
        seed("Aquarium Filter", "Internal power filter for clean water.", 799, 1199, petSupplies, "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400", "RS Electrical", 120, 4.4, 5600, "NEW");
        seed("Bird Seed Mix 2kg", "Premium seeds for parrots and parakeets.", 349, 449, petSupplies, "https://images.unsplash.com/photo-1550853024-fae8cd4be477?w=400", "ZuPreem", 250, 4.6, 3100, "SALE");
        seed("Hamster Wheel", "Silent spinner exercise wheel.", 599, 799, petSupplies, "https://images.unsplash.com/photo-1548546738-8542ad0f28b0?w=400", "Kaytee", 100, 4.5, 1200, "NEW");
        seed("Flea and Tick Drops", "Monthly treatment for large dogs.", 899, 1299, petSupplies, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", "Frontline", 400, 4.8, 18000, "SALE");
        seed("Fish Food Flakes 50g", "Nutritious flakes for tropical fish.", 149, 199, petSupplies, "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400", "Tetra", 600, 4.7, 24000, "NEW");
        seed("Pet Carrier", "Breathable mesh bag for small animals.", 1299, 1799, petSupplies, "https://images.unsplash.com/photo-1541599540903-21b8f0477033?w=400", "Sherpa", 150, 4.6, 5600, "SALE");
        seed("Cat Scratching Post", "Natural sisal rope post with ball.", 999, 1499, petSupplies, "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400", "GoPetClub", 200, 4.7, 8900, "NEW");
        seed("Rabbit Hutch", "Two-story wooden outdoor house.", 6999, 8999, petSupplies, "https://images.unsplash.com/photo-1548546738-8542ad0f28b0?w=400", "PawHut", 20, 4.5, 300, "SALE");
        seed("Pet Shampoo 500ml", "Hypoallergenic aloe vera formula.", 499, 699, petSupplies, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", "Wahl", 350, 4.6, 9200, "NEW");
        seed("Interactive Dog Toy", "Treat dispensing puzzle ball.", 799, 1199, petSupplies, "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400", "Kong", 400, 4.9, 35000, "SALE");
        seed("Pet Nail Clipper", "Professional grooming tool for dogs.", 349, 499, petSupplies, "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400", "Safari", 500, 4.4, 15000, "NEW");
        seed("Turtle Tank Kit", "20-gallon complete aquarium habitat.", 4999, 6499, petSupplies, "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400", "Tetra", 40, 4.8, 1200, "SALE");
        seed("Chew Sticks for Dogs", "Calcium enriched dental treats.", 249, 349, petSupplies, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", "Drools", 800, 4.5, 22000, "NEW");
        seed("Automatic Pet Feeder", "Programmable portion control dispenser.", 5499, 6999, petSupplies, "https://images.unsplash.com/photo-1541599540903-21b8f0477033?w=400", "PetSafe", 50, 4.7, 1500, "SALE");
        seed("Bird Cage Medium", "Large wire cage with perches and cups.", 2999, 3999, petSupplies, "https://images.unsplash.com/photo-1550853024-fae8cd4be477?w=400", "Yaheetech", 60, 4.6, 980, "NEW");

        // ── Jewellery ────────────────────────────────────────────────────────
        seed("Gold Coin 1g", "24KT 999.9 purity gold coin.", 7500, 8000, jewellery, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "Tanishq", 50, 4.9, 120000, "SALE");
        seed("Silver Bracelet", "925 sterling silver curb chain.", 2499, 3499, jewellery, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400", "Giva", 200, 4.8, 15000, "NEW");
        seed("Diamond Ring 0.5ct", "IGI certified diamond in 18KT gold.", 45000, 52000, jewellery, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", "CaratLane", 25, 4.9, 890, "SALE");
        seed("Pearl Necklace Set", "Freshwater pearls with silver clasp.", 5999, 7999, jewellery, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Pearls", 150, 4.7, 5600, "NEW");
        seed("Rose Gold Watch", "Stylish mesh band for women.", 3999, 4999, jewellery, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", "DanielWellington", 120, 4.6, 9200, "SALE");
        seed("Platinum Band men", "950 platinum classic men's band.", 32000, 36000, jewellery, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", "Malabar", 30, 4.8, 560, "NEW");
        seed("Hoop Earrings Silver", "Medium size lightweight silver hoops.", 999, 1499, jewellery, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400", "Giva", 300, 4.5, 18000, "SALE");
        seed("Temple Jewellery Set", "Traditional south indian antique set.", 12500, 15500, jewellery, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Kalyan", 40, 4.8, 1200, "NEW");
        seed("Leather Wrap Bracelet", "Handmade leather with silver accents.", 1499, 1999, jewellery, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400", "Fossil", 250, 4.4, 5600, "SALE");
        seed("Charm Bracelet Kit", "Customizable bracelet with 5 charms.", 2999, 3999, jewellery, "https://images.unsplash.com/photo-1511591437281-460bfbe1220a?w=400", "Pandora", 100, 4.7, 3100, "NEW");
        seed("Solitaire Earrings", "1ct total weight diamond studs.", 85000, 95000, jewellery, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", "Tanishq", 10, 4.9, 120, "SALE");
        seed("Meenakari Bangle Set", "Colorful hand-painted traditional bangles.", 4999, 6499, jewellery, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Voylla", 180, 4.6, 9200, "NEW");
        seed("Pendant with Chain", "Minimalist heart design in rose gold.", 3499, 4499, jewellery, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "Bluestone", 220, 4.7, 3100, "SALE");
        seed("Cufflinks Silver", "Sleek engraved sterling silver links.", 2499, 3499, jewellery, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400", "ParkAvenue", 150, 4.6, 1200, "NEW");
        seed("Anklet with Bells", "Sterling silver traditional ghungroo anklet.", 1999, 2999, jewellery, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Tanishq", 200, 4.5, 15000, "SALE");
        seed("Nose Pin Diamond", "0.05ct single diamond in 18KT gold.", 7999, 9999, jewellery, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "Malabar", 100, 4.7, 5600, "NEW");
        seed("Statement Necklace", "Bold chunky geometric design.", 1499, 1999, jewellery, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Zara", 300, 4.4, 8900, "SALE");
        seed("Mangalsutra with Diamond", "Modern daily wear gold mangalsutra.", 35000, 42000, jewellery, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "CaratLane", 45, 4.8, 1500, "NEW");
        seed("Enamel Ring", "Vintage style colorful enamel ring.", 4999, 6999, jewellery, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", "Mia", 120, 4.6, 3100, "SALE");
        seed("Gold Chain 10g", "22KT BIS hallmarked machine chain.", 62000, 68000, jewellery, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "Kalyan", 15, 4.9, 15000, "NEW");

        // ── Last Minute Wedding 🎉 ───────────────────────────────────────────
        seed("Bridal Lehenga — Red & Gold", "Stunning bridal lehenga with heavy embroidery.", 24999, 39999, wedding, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", "Manyavar", 10, 4.9, 1200, "SALE");
        seed("Wedding Cake — 3 Tier", "Custom 3-tier fondant cake in 4 hours.", 8999, 12999, wedding, "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400", "BakeHouse", 5, 4.8, 890, "NEW");
        seed("Floral Decoration Package", "Complete mandap decoration within 6 hours.", 14999, 22999, wedding, "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", "Bloom", 8, 4.7, 560, "SALE");
        seed("Groom's Sherwani — Ivory", "Premium ivory sherwani ready to ship.", 12999, 18999, wedding, "https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=400", "Manyavar", 15, 4.8, 780, "NEW");
        seed("Bridal Jewellery Set", "Gold-plated complete bridal set.", 6999, 9999, wedding, "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", "Tanishq", 20, 4.9, 1450, "SALE");
        seed("Invitation Cards 50pcs", "Premium laser-cut cards in 1 hour.", 1999, 2999, wedding, "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400", "PrintKart", 50, 4.6, 3200, "NEW");
        seed("Mehndi Artist Booking", "Professional artist for same day.", 3999, 5999, wedding, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400", "MehndiPro", 3, 4.9, 2100, "SALE");
        seed("Photographer 1 Day", "Full-day wedding DSLR coverage.", 19999, 29999, wedding, "https://images.unsplash.com/photo-1519741497674-611481863552?w=400", "SnapStudio", 2, 4.9, 980, "NEW");
        seed("Wedding Turbans 10pcs", "Ready-to-wear turbans for guests.", 4999, 6999, wedding, "https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=400", "Manyavar", 10, 4.5, 340, "SALE");
        seed("Silk Saree for Moms", "Elegant Banarasi silk for family.", 7999, 10999, wedding, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", "Nalli", 30, 4.8, 1200, "NEW");
        seed("Makeup Kit Bridal", "Professional grade makeup box essentials.", 5499, 7499, wedding, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", "Sugar", 40, 4.7, 5600, "SALE");
        seed("Gift Box Hampers 10pcs", "Assorted sweets and nuts gift sets.", 8500, 10500, wedding, "https://images.unsplash.com/photo-1549465220-1d8c9ded3d51?w=400", "Haldirams", 25, 4.6, 9200, "NEW");
        seed("Wedding Clutches", "Gold embroidered party hand bags.", 1299, 1999, wedding, "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", "Lavie", 100, 4.4, 3100, "SALE");
        seed("Decorative Garlands", "Artificial jasmine and flower strings.", 999, 1499, wedding, "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", "DecoArt", 200, 4.5, 1500, "NEW");
        seed("Dhol/Band Booking", "Traditional band for marriage procession.", 12500, 15000, wedding, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400", "PunjabBand", 2, 4.9, 320, "SALE");
        seed("Wedding Favor Bags 100pcs", "Small gold drawstring pouches.", 1499, 2499, wedding, "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400", "BagIt", 50, 4.3, 8900, "NEW");
        seed("Disposable Dinnerware 500pcs", "Eco-friendly premium wooden sets.", 4999, 6499, wedding, "https://images.unsplash.com/photo-1590732159930-985223c6f17e?w=400", "Cello", 15, 4.6, 1200, "SALE");
        seed("Custom Cake Topper", "Acrylic names topper made in 2 hours.", 499, 799, wedding, "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400", "CakePro", 100, 4.8, 3400, "NEW");
        seed("Wedding Car Decor", "Complete car decoration with ribbons.", 2499, 3499, wedding, "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", "Florist", 10, 4.5, 150, "SALE");
        seed("Bridal Hair Accessories", "Pins and clips with stones and pearls.", 299, 449, wedding, "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400", "YouBella", 300, 4.6, 5600, "NEW");
    }

    private Category getOrCreate(String name, String desc, String icon) {
        return categoryRepository.findByName(name).orElseGet(() -> {
            Category c = new Category(null, name, desc, icon, true);
            return categoryRepository.save(c);
        });
    }

    private void seed(String name, String desc, double price, double origPrice,
                      Category cat, String imageUrl, String brand,
                      int stock, double rating, int reviewCount, String badge) {
        if (productRepository.existsByName(name)) return;
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(BigDecimal.valueOf(price).setScale(2, java.math.RoundingMode.HALF_UP));
        p.setOriginalPrice(BigDecimal.valueOf(origPrice).setScale(2, java.math.RoundingMode.HALF_UP));
        p.setCategory(cat);
        p.setImageUrl(imageUrl);
        p.setBrand(brand);
        p.setStock(stock);
        p.setRating(BigDecimal.valueOf(rating));
        p.setReviewCount(reviewCount);
        p.setBadge(badge);
        p.setStatus(Product.ProductStatus.ACTIVE);
        p.applyFeatureFlags(); 
        productRepository.save(p);
    }

    private void seedReviews() {
        if (reviewRepository.count() > 0) {
            log.info("Reviews already seeded, skipping.");
            return;
        }
        log.info("Seeding product reviews...");
        String[] names = {
            "Aarav Mehta", "Priya Sharma", "Rohan Kapoor", "Sneha Nair", "Ananya Gupta",
            "Kabir Singh", "Arjun Verma", "Neha Joshi", "Ethan Carter", "Olivia Brooks",
            "Liam Parker", "Sophia Adams", "Ishaan Patel", "Divya Reddy", "Vikram Nair",
            "Meera Iyer", "Aditya Kumar", "Riya Desai", "Samuel Thomas", "Natasha Roy"
        };
        String[][] reviewData = {
            {"5", "Absolutely love it!", "The packaging was excellent and delivery was faster than expected. Would definitely buy again.", "true"},
            {"5", "Worth every rupee", "Battery backup easily lasts a full day. Looks premium and performs really well.", "true"},
            {"4", "Great product, minor issues", "Quality is excellent overall. Setup was easy and it works as described. Minor packaging damage but product intact.", "true"},
            {"5", "Exceeded expectations", "I was skeptical initially but this exceeded all my expectations. Highly recommend to anyone.", "false"},
            {"4", "Good value for money", "Worth the price during the sale. Build quality is solid and feels premium in hand.", "true"},
            {"3", "Decent but not perfect", "Quality could be slightly better at this price point. However, the basic functionality works fine.", "false"},
            {"5", "Excellent!", "I've been using it for two months and have no complaints. Performs consistently well.", "true"},
            {"4", "Happy with purchase", "Fast delivery and great quality. Exactly as shown in the pictures.", "true"},
            {"5", "Best in class", "Outstanding quality. You can feel the premium build the moment you open the box.", "false"},
            {"2", "Mixed feelings", "Had higher expectations. Works okay but the finish could be better. Customer support was responsive though.", "false"},
            {"5", "Highly recommended", "Perfect for daily use. The design is elegant and the performance is top-notch.", "true"},
            {"4", "Solid choice", "I researched a lot before buying this. No regrets — it delivers exactly what is promised.", "true"}
        };

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.util.List<com.ecart.entity.Product> products = productRepository.findAll();
        java.util.Random rng = new java.util.Random(42);

        int seeded = 0;
        for (com.ecart.entity.Product product : products) {
            if (seeded >= 60) break; // seed reviews for first 60 products
            int reviewCount = 3 + rng.nextInt(6); // 3-8 reviews per product
            for (int i = 0; i < reviewCount; i++) {
                Review r = new Review();
                String[] rd = reviewData[rng.nextInt(reviewData.length)];
                r.setRating(Integer.parseInt(rd[0]));
                r.setTitle(rd[1]);
                r.setDescription(rd[2]);
                r.setVerifiedPurchase(Boolean.parseBoolean(rd[3]));
                r.setReviewerName(names[rng.nextInt(names.length)]);
                r.setProduct(product);
                // Spread review dates over last 12 months
                r.setReviewDate(now.minusDays(rng.nextInt(365)));
                reviewRepository.save(r);
            }
            seeded++;
        }
        log.info("Seeded reviews for {} products.", seeded);
    }
}

