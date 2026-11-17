/**
 * Install plugin.
 */

import formatDate from './date';
import formatNumber from './number';
import formatCurrency from './currency';
import relativeDate from './relative';
import defaultLocale from '../dist/locales/en.json';

function plugin(app) {

    if (app && app.version && app.version.split('.')[0] < 3) {

        if (!app.prototype.$locale) {
            app.prototype.$locale = defaultLocale;
        }

        app.prototype.$date = formatDate;
        app.prototype.$number = formatNumber;
        app.prototype.$currency = formatCurrency;
        app.prototype.$relativeDate = relativeDate;

        app.filter('date', (date, format, timezone) => app.prototype.$date(date, format, timezone));
        app.filter('number', (number, fractionSize) => app.prototype.$number(number, fractionSize));
        app.filter('currency', (amount, currencySymbol, fractionSize) => app.prototype.$currency(amount, currencySymbol, fractionSize));
        app.filter('relativeDate', (date, options) => app.prototype.$relativeDate(date, options));

    } else {

        if (!app.config.globalProperties.$locale) {
            app.config.globalProperties.$locale = defaultLocale;
        }

        const filters = {
            date: formatDate.bind(app.config.globalProperties),
            number: formatNumber.bind(app.config.globalProperties),
            currency: formatCurrency.bind(app.config.globalProperties),
            relativeDate: relativeDate.bind(app.config.globalProperties)
        }

        if (app.config.globalProperties.$filters && Object.keys(app.config.globalProperties.$filters).length) {
            Object.assign(app.config.globalProperties.$filters, filters);
        } else {
            app.config.globalProperties.$filters = filters;
        }
    }
}

if (typeof exports === 'object') {
    module.exports = plugin;
} else if (typeof define === 'function' && define.amd) {
    define([], function () { return plugin; });
} else if (typeof window !== 'undefined' && window.Vue && window.Vue.use) {
    Vue.use(plugin);
}

export default plugin;
