import { createInertiaApp, router } from '@inertiajs/svelte';
import AppLayout from '@/layouts/AppLayout.svelte';
import {
    initialPageProps,
    syncFormTranslations,
} from '@/lib/form-translations';
import AuthLayout from '@/layouts/AuthLayout.svelte';
import SettingsLayout from '@/layouts/settings/Layout.svelte';
import { initializeFlashToast } from '@/lib/flash-toast';
import { initializeTheme } from '@/lib/theme.svelte';

// Built-in form text in the language picked in the header (Lang Sync Inertia).
// "success" covers visits that stay on the same URL (like switching language),
// "navigate" covers the browser's back and forward buttons.
syncFormTranslations(initialPageProps());
router.on('success', (event) => syncFormTranslations(event.detail.page.props));
router.on('navigate', (event) => syncFormTranslations(event.detail.page.props));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'Welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();

// This will listen for flash toast data from the server...
initializeFlashToast();
