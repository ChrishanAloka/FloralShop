import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState({
        currencyCode: 'USD',
        currencySymbol: '$'
    });
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const { data } = await api.get('/config');
            setConfig(data);
        } catch (err) {
            console.error('Failed to fetch config:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const updateConfig = async (newConfig) => {
        try {
            const { data } = await api.put('/config', newConfig);
            setConfig({
                currencyCode: data.currencyCode,
                currencySymbol: data.currencySymbol
            });
            return { success: true };
        } catch (err) {
            console.error('Failed to update config:', err);
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '';
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: config.currencyCode || 'USD'
            }).format(price);
        } catch (e) {
            // Fallback if currency code is invalid or missing
            const symbol = config.currencySymbol || '$';
            return `${symbol}${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    return (
        <ConfigContext.Provider value={{ ...config, formatPrice, updateConfig, loading }}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);
