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

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
