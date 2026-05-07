/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    // Скидка, преобразованная из процентов в десятичное число
    const decimalDiscount = discount / 100;
    // Полная стоимость
    const totalFullPrice = sale_price * quantity;
    // Итоговая стоимость (без скидки)
    const revenue = totalFullPrice * (1 - decimalDiscount);

   return revenue;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller;

    // 15% бонус (первое место по прибыли)
    if (index === 0) {
        return profit * 0.15;
    }

    // 10% бонус (второе и третье места по прибыли)
    if (index === 1 || index === 2) {
        return profit * 0.1;
    }

    // 0% бонус (последнее место по прибыли)
    if (index === total - 1) {
        return 0;
    }

    // 5% бонус (оставшиеся места по прибыли)
    return profit * 0.05;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
     if (!data ||
        !Array.isArray(data.sellers) || data.sellers.length === 0 ||
        !Array.isArray(data.products) || data.products.length === 0 ||
        !Array.isArray(data.purchase_records) || data.purchase_records.length === 0) {
        throw new Error("Ошибка: отсутствуют данные");
    }

    // @TODO: Проверка наличия опций
    if (!options ||
        typeof options.calculateRevenue !== 'function' ||
        typeof options.calculateBonus !== 'function') {
        throw new Error("Ошибка: отсутствуют функции для расчетов");
    }
    const { calculateRevenue, calculateBonus } = options;

    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        profit: 0,
        revenue: 0,
        sales_count: 0,
        products_sold: {},
    }));

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(item => [item.id, item]));
    const productIndex = Object.fromEntries(data.products.map(item => [item.sku, item]));

    // @TODO: Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];

        if (seller) {
            seller.sales_count += 1;
            seller.revenue += record.total_amount;

            record.items.forEach(item => {
                const product = productIndex[item.sku];

                if (product) {
                    const cost = product.purchase_price * item.quantity;
                    const itemRevenue = calculateRevenue(item, product);
                    const profit = itemRevenue - cost;

                    seller.profit += profit;

                    if (!seller.products_sold[item.sku]) {
                        seller.products_sold[item.sku] = 0;
                    }
                    seller.products_sold[item.sku] += item.quantity;
                }
            });
        }
    });

    // @TODO: Сортировка продавцов по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);

    // @TODO: Назначение премий на основе ранжирования
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller);

        seller.top_products = Object.entries(seller.products_sold)
            .map(([sku, quantity]) => ({ sku, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    });

    // @TODO: Подготовка итоговой коллекции с нужными полями
    return sellerStats.map(seller => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }));
}