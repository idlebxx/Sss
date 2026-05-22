// التحقق من تسجيل الدخول
if (!localStorage.getItem('adminLoggedIn')) {
    const password = prompt('🔐 أدخل كلمة مرور المدير:');
    if (password === 'sham20066shamgmail.com') {
        localStorage.setItem('adminLoggedIn', 'true');
    } else {
        window.location.href = 'index.html';
    }
}

// تحميل البيانات
let products = JSON.parse(localStorage.getItem('products')) || [];
let prices = JSON.parse(localStorage.getItem('prices')) || {};
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// عرض المنتجات
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center;">⚠️ لا توجد منتجات حالياً</p>';
        return;
    }
    
    container.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p class="product-price">💰 $${product.price}</p>
                <p>📂 ${product.category}</p>
                <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                    <button onclick="editProduct(${index})" class="edit-btn" style="background:#ff1a1a; padding:0.5rem 1rem;">✏️ تعديل</button>
                    <button onclick="deleteProduct(${index})" class="delete-btn" style="background:#990000; padding:0.5rem 1rem;">🗑️ حذف</button>
                </div>
            </div>
        </div>
    `).join('');
}

// إضافة منتج
function addProduct() {
    const name = document.getElementById('product-name')?.value;
    const desc = document.getElementById('product-desc')?.value;
    const price = document.getElementById('product-price')?.value;
    const image = document.getElementById('product-image')?.value;
    const category = document.getElementById('product-category')?.value;
    
    if (!name || !desc || !price) {
        alert('⚠️ يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    const product = { name, desc, price, image, category };
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    clearProductForm();
    alert('✅ تم إضافة المنتج بنجاح');
}

// تعديل منتج
function editProduct(index) {
    const product = products[index];
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-desc').value = product.desc;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-category').value = product.category;
    deleteProduct(index);
}

// حذف منتج
function deleteProduct(index) {
    if (confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟')) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        alert('✅ تم حذف المنتج');
    }
}

// مسح نموذج المنتج
function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
}

// تحديث جميع الأسعار
function updateAllPrices() {
    prices = {
        simpleDesign: document.getElementById('simple-design-price')?.value || 200,
        fullDesign: document.getElementById('full-design-price')?.value || 500,
        storeDesign: document.getElementById('store-design-price')?.value || 800,
        advancedDesign: document.getElementById('advanced-design-price')?.value || 1500,
        instaBan: document.getElementById('insta-ban-price')?.value || 50,
        fbBan: document.getElementById('fb-ban-price')?.value || 60,
        ttBan: document.getElementById('tt-ban-price')?.value || 55,
        ytBan: document.getElementById('yt-ban-price')?.value || 70
    };
    localStorage.setItem('prices', JSON.stringify(prices));
    alert('✅ تم حفظ الأسعار بنجاح');
}

// تحميل الأسعار
function loadPrices() {
    document.getElementById('simple-design-price').value = prices.simpleDesign || 200;
    document.getElementById('full-design-price').value = prices.fullDesign || 500;
    document.getElementById('store-design-price').value = prices.storeDesign || 800;
    document.getElementById('advanced-design-price').value = prices.advancedDesign || 1500;
    document.getElementById('insta-ban-price').value = prices.instaBan || 50;
    document.getElementById('fb-ban-price').value = prices.fbBan || 60;
    document.getElementById('tt-ban-price').value = prices.ttBan || 55;
    document.getElementById('yt-ban-price').value = prices.ytBan || 70;
}

// عرض الطلبات
function displayOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;
    
    const savedOrders = JSON.parse(localStorage.getItem('telegramOrders')) || [];
    
    if (savedOrders.length === 0) {
        container.innerHTML = '<p style="text-align:center;">⚠️ لا توجد طلبات حالياً</p>';
        return;
    }
    
    container.innerHTML = savedOrders.reverse().map(order => `
        <div class="order-card" style="background:rgba(0,0,0,0.5); padding:1rem; margin:1rem 0; border-radius:12px; border-right:3px solid #ff1a1a;">
            <div class="order-header" style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <strong>📅 ${new Date(order.timestamp).toLocaleString('ar')}</strong>
                <span class="order-type" style="color:#ff1a1a;">${order.type || 'طلب'}</span>
            </div>
            <div class="order-details">
                <pre style="background:#0a0a0a; padding:0.8rem; border-radius:8px; overflow-x:auto; font-size:12px;">${JSON.stringify(order, null, 2)}</pre>
            </div>
        </div>
    `).join('');
}

// حفظ الإعدادات
function saveSettings() {
    const settings = {
        botToken: document.getElementById('bot-token')?.value,
        chatId: document.getElementById('chat-id')?.value,
        shamCashNumber: document.getElementById('sham-cash-number')?.value,
        profileImage: document.getElementById('profile-image')?.value
    };
    
    localStorage.setItem('botSettings', JSON.stringify(settings));
    alert('✅ تم حفظ الإعدادات بنجاح');
}

// تحميل الإعدادات
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('botSettings')) || {};
    document.getElementById('bot-token').value = settings.botToken || '';
    document.getElementById('chat-id').value = settings.chatId || '';
    document.getElementById('sham-cash-number').value = settings.shamCashNumber || '093 333 3333';
    document.getElementById('profile-image').value = settings.profileImage || '';
}

// نسخ احتياطي
function backupData() {
    const data = {
        products: products,
        prices: prices,
        settings: JSON.parse(localStorage.getItem('botSettings')) || {},
        orders: JSON.parse(localStorage.getItem('telegramOrders')) || []
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersec_backup_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ تم إنشاء النسخة الاحتياطية');
}

// استعادة نسخة احتياطية
function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('products', JSON.stringify(data.products));
                localStorage.setItem('prices', JSON.stringify(data.prices));
                localStorage.setItem('botSettings', JSON.stringify(data.settings));
                alert('✅ تم استعادة البيانات بنجاح، قم بتحديث الصفحة');
                window.location.reload();
            } catch (error) {
                alert('⚠️ خطأ في الملف');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// تبديل التبويبات
function showTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (tabName === 'orders') displayOrders();
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadPrices();
    loadSettings();
    displayOrders();
});
