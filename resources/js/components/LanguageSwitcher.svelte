<script lang="ts">
    import { page, router } from '@inertiajs/svelte';
    import Check from '@lucide/svelte/icons/check';
    import Languages from '@lucide/svelte/icons/languages';
    import { Button } from '@/components/ui/button';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import { update } from '@/routes/locale';

    /**
     * Pick the app language. Laravel stores it in the session and reloads the
     * page props, so labels, form text and messages all switch together.
     */
    const locale = $derived(page.props.locale);
    const locales = $derived(page.props.locales);

    function choose(code: string): void {
        if (code === locale) {
            return;
        }

        router.post(
            update.url(),
            { locale: code },
            { preserveScroll: true, preserveState: true },
        );
    }
</script>

<DropdownMenu>
    <DropdownMenuTrigger asChild>
        {#snippet children(props)}
            <Button
                variant="ghost"
                size="sm"
                class="gap-2"
                onclick={props.onclick}
                aria-expanded={props['aria-expanded']}
                data-state={props['data-state']}
            >
                <Languages class="size-4" />
                <span>{locales[locale] ?? locale}</span>
            </Button>
        {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
        {#each Object.entries(locales) as [code, name] (code)}
            <DropdownMenuItem asChild>
                {#snippet children(props)}
                    <button
                        type="button"
                        class="{props.class} justify-between gap-4"
                        onclick={() => {
                            props.onClick?.();
                            choose(code);
                        }}
                    >
                        {name}
                        {#if code === locale}
                            <Check class="size-4" />
                        {/if}
                    </button>
                {/snippet}
            </DropdownMenuItem>
        {/each}
    </DropdownMenuContent>
</DropdownMenu>
