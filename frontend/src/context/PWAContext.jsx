import { createContext, useContext, useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAContext = createContext(null);

export function PWAProvider({ children }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered:', r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    useEffect(() => {
        if (window.deferredPrompt) {
            setInstallPrompt(window.deferredPrompt);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            window.deferredPrompt = e;
        };

        const handleAppInstalled = () => {
            setInstallPrompt(null);
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    return (
        <PWAContext.Provider value={{
            installPrompt,
            installApp,
            isInstalled,
            needRefresh,
            updateServiceWorker,
            setNeedRefresh
        }}>
            {children}
        </PWAContext.Provider>
    );
}

export const usePWA = () => useContext(PWAContext);
