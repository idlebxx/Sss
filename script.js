// تحميل البيانات
let products = JSON.parse(localStorage.getItem('products')) || [];
let prices = JSON.parse(localStorage.getItem('prices')) || {};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadPrices();
    animateStats();
    loadSettingsToPage();
    setupEventListeners();
});

// تحميل المنتجات
function loadProducts() {
    const containers = ['tools-container', 'featured-products'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            displayProducts(container, containerId === 'tools-container' ? products : products.slice(0, 3));
        }
    });
}

// عرض المنتجات
function displayProducts(container, productsToShow) {
    if (!container) return;
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-products">⚠️ لا توجد منتجات حالياً</div>';
        return;
    }
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <div class="product-price">$${product.price}</div>
                <button class="buy-btn" onclick="buyProduct('${product.name}', ${product.price})">شراء الآن</button>
            </div>
        </div>
    `).join('');
}

// تحميل الأسعار
function loadPrices() {
    const priceElements = {
        'insta-price': prices.instaBan || 50,
        'fb-price': prices.fbBan || 60,
        'tt-price': prices.ttBan || 55,
        'yt-price': prices.ytBan || 70,
        'simple-price': prices.simpleDesign || 200,
        'full-price': prices.fullDesign || 500,
        'store-price': prices.storeDesign || 800,
        'advanced-price': prices.advancedDesign || 1500
    };
    for (const [id, value] of Object.entries(priceElements)) {
        const element = document.getElementById(id);
        if (element) element.innerText = `$${value}`;
    }
}

// تحميل الإعدادات للصفحة (رقم شام كاش، الصورة)
function loadSettingsToPage() {
    const settings = JSON.parse(localStorage.getItem('botSettings')) || {};
    const shamCashSpan = document.getElementById('shamCashNumber');
    if (shamCashSpan) shamCashSpan.innerText = settings.shamCashNumber || '093 333 3333';
    const profilePic = document.getElementById('profile-pic');
    if (profilePic && settings.profileImage) profilePic.src = settings.profileImage;
}

// إحصائيات متحركة
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current);
            }
        }, 40);
    });
}

// شراء منتج
function buyProduct(name, price) {
    const whatsapp = prompt('📱 يرجى إدخال رقم واتساب للتواصل:');
    if (whatsapp) {
        const message = `مرحباً، أرغب في شراء ${name} بسعر $${price}`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
        alert('✅ تم إرسال طلبك! سيتم التواصل معك قريباً');
    }
}

// إرسال إلى تليجرام
async function sendToTelegram(data) {
    const settings = JSON.parse(localStorage.getItem('botSettings')) || {};
    const botToken = settings.botToken;
    const chatId = settings.chatId;
    
    if (!botToken || !chatId) {
        console.warn('لم يتم إعداد البوت بعد');
        return;
    }
    
    const message = formatTelegramMessage(data);
    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
        });
        
        if (data.screenshot) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, photo: data.screenshot, caption: `💰 إيصال شحن: $${data.amount}` })
            });
        }
    } catch (error) {
        console.error('خطأ في البوت:', error);
    }
}

// تنسيق رسالة التليجرام
function formatTelegramMessage(data) {
    let message = `📩 <b>طلب جديد!</b>\n\n`;
    message += `🆔 <b>نوع الطلب:</b> ${getServiceName(data.type)}\n`;
    message += `⏰ <b>الوقت:</b> ${new Date().toLocaleString('ar')}\n\n`;
    for (const [key, value] of Object.entries(data)) {
        if (value && key !== 'type' && key !== 'timestamp' && key !== 'screenshot') {
            message += `${getFieldName(key)}: <code>${value}</code>\n`;
        }
    }
    return message;
}

function getServiceName(type) {
    const names = {
        'design_request': 'طلب تصميم موقع',
        'ban_service': 'طلب فك باند',
        'recharge': 'طلب شحن رصيد'
    };
    return names[type] || type;
}

function getFieldName(key) {
    const names = {
        companyName: '🏢 اسم الشركة',
        siteName: '🌐 اسم الموقع',
        siteType: '📝 نوع الموقع',
        pagesCount: '📄 عدد الصفحات',
        whatsapp: '📞 واتساب',
        email: '📧 البريد الإلكتروني',
        requirements: '📋 المتطلبات',
        service: '🔧 الخدمة',
        accountUrl: '🔗 رابط الحساب',
        accountEmail: '📧 بريد الحساب',
        amount: '💰 المبلغ',
        transactionId: '🆔 معرف العملية',
        notes: '📝 ملاحظات',
        banReason: '⚠️ سبب الحظر'
    };
    return names[key] || key;
}

// ============== نماذج الطلبات ==============

// طلب تصميم موقع
const designForm = document.getElementById('design-request-form');
if (designForm) {
    designForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const request = {
            type: 'design_request',
            companyName: document.getElementById('company-name')?.value,
            siteName: document.getElementById('site-name')?.value,
            siteType: document.getElementById('site-type')?.value,
            pagesCount: document.getElementById('pages-count')?.value,
            colors: document.getElementById('colors')?.value,
            features: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value).join(', '),
            requirements: document.getElementById('requirements')?.value,
            whatsapp: document.getElementById('whatsapp-number')?.value,
            email: document.getElementById('email')?.value,
            timestamp: new Date().toISOString()
        };
        await sendToTelegram(request);
        alert('✅ تم إرسال طلب التصميم بنجاح! سيتم التواصل معك خلال 24 ساعة');
        designForm.reset();
    });
}

// طلب فك باند
const banForm = document.getElementById('ban-request-form');
if (banForm) {
    banForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const request = {
            type: 'ban_service',
            service: document.getElementById('service-type')?.value,
            price: document.getElementById('service-price')?.value,
            accountUrl: document.getElementById('account-url')?.value,
            accountEmail: document.getElementById('account-email')?.value,
            accountPhone: document.getElementById('account-phone')?.value,
            banReason: document.getElementById('ban-reason')?.value,
            whatsapp: document.getElementById('whatsapp-number')?.value,
            notes: document.getElementById('additional-notes')?.value,
            timestamp: new Date().toISOString()
        };
        await sendToTelegram(request);
        alert('✅ تم إرسال طلب فك الباند بنجاح! سيتم التواصل معك قريباً');
        banForm.reset();
        closeForm();
    });
}

// طلب شحن رصيد
const rechargeForm = document.getElementById('recharge-form');
if (rechargeForm) {
    rechargeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount')?.value;
        const transactionId = document.getElementById('transaction-id')?.value;
        const screenshot = document.getElementById('screenshot')?.files[0];
        const whatsapp = document.getElementById('whatsapp-number')?.value;
        if (screenshot) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const request = {
                    type: 'recharge',
                    amount: amount,
                    transactionId: transactionId,
                    screenshot: e.target.result,
                    whatsapp: whatsapp,
                    email: document.getElementById('email')?.value,
                    timestamp: new Date().toISOString()
                };
                await sendToTelegram(request);
                alert('✅ تم استلام طلب الشحن! سيتم التأكيد خلال ساعة');
                rechargeForm.reset();
            };
            reader.readAsDataURL(screenshot);
        }
    });
}

// ============== وظائف إضافية ==============
function copyNumber() {
    const number = document.querySelector('.phone-number')?.innerText;
    if (number) {
        navigator.clipboard.writeText(number);
        alert('✅ تم نسخ الرقم!');
    }
}

function selectAmount(amount) {
    const amountInput = document.getElementById('amount');
    if (amountInput) amountInput.value = amount;
}

function closeForm() {
    const form = document.getElementById('ban-form');
    if (form) form.style.display = 'none';
}

// اختيار خدمة الباند
document.querySelectorAll('.select-service').forEach(btn => {
    btn.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        const serviceNames = {
            instagram: 'فك باند انستقرام',
            facebook: 'فك باند فيسبوك',
            tiktok: 'فك باند تيك توك',
            youtube: 'رفع حظر يوتيوب'
        };
        const priceMap = {
            instagram: document.getElementById('insta-price')?.innerText || '$50',
            facebook: document.getElementById('fb-price')?.innerText || '$60',
            tiktok: document.getElementById('tt-price')?.innerText || '$55',
            youtube: document.getElementById('yt-price')?.innerText || '$70'
        };
        const serviceTypeInput = document.getElementById('service-type');
        const servicePriceInput = document.getElementById('service-price');
        if (serviceTypeInput) serviceTypeInput.value = serviceNames[service];
        if (servicePriceInput) servicePriceInput.value = priceMap[service];
        const banFormDiv = document.getElementById('ban-form');
        if (banFormDiv) {
            banFormDiv.style.display = 'block';
            banFormDiv.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// البحث والفلترة
const searchInput = document.getElementById('searchTools');
const categoryFilter = document.getElementById('categoryFilter');
if (searchInput && categoryFilter) {
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || (product.desc && product.desc.toLowerCase().includes(searchTerm));
            const matchesCategory = category === 'all' || product.category === category;
            return matchesSearch && matchesCategory;
        });
        const container = document.getElementById('tools-container');
        if (container) displayProducts(container, filtered);
    }
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

function setupEventListeners() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.glass').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
            }
