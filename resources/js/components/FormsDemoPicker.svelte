<script module lang="ts">
    /**
     * Accent colors offered by the demo picker.
     */
    export const accents = [
        { name: 'Indigo', value: '#4f46e5' },
        { name: 'Sky', value: '#0284c7' },
        { name: 'Emerald', value: '#059669' },
        { name: 'Amber', value: '#d97706' },
        { name: 'Rose', value: '#e11d48' },
        { name: 'Violet', value: '#7c3aed' },
    ];

    /**
     * The accent picked in the demo, kept while moving between the demo pages.
     */
    export const demoAccent = $state({ value: accents[0].value });
</script>

<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import LayoutList from '@lucide/svelte/icons/layout-list';
    import Puzzle from '@lucide/svelte/icons/puzzle';
    import Rocket from '@lucide/svelte/icons/rocket';
    import LayoutTemplate from '@lucide/svelte/icons/layout-template';
    import MessagesSquare from '@lucide/svelte/icons/messages-square';
    import Megaphone from '@lucide/svelte/icons/megaphone';
    import Briefcase from '@lucide/svelte/icons/briefcase';
    import LifeBuoy from '@lucide/svelte/icons/life-buoy';
    import CalendarDays from '@lucide/svelte/icons/calendar-days';
    import Target from '@lucide/svelte/icons/target';
    import Users from '@lucide/svelte/icons/users';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import Stethoscope from '@lucide/svelte/icons/stethoscope';
    import House from '@lucide/svelte/icons/house';
    import Newspaper from '@lucide/svelte/icons/newspaper';
    import Palette from '@lucide/svelte/icons/palette';
    import Shapes from '@lucide/svelte/icons/shapes';
    import { cn, toUrl } from '@/lib/utils';
    import { index } from '@/routes/forms-demo';

    /**
     * Icon shown next to each demo in the picker.
     */
    const demoIcons: Record<string, typeof Shapes> = {
        'all-fields': LayoutList,
        'custom-fields': Puzzle,
        'onboarding-wizard': Rocket,
        'landing-page': LayoutTemplate,
        'support-chat': MessagesSquare,
        'product-launch': Megaphone,
        'project-kickoff': Briefcase,
        'support-triage': LifeBuoy,
        'event-session': CalendarDays,
        'campaign-plan': Target,
        'hiring-pipeline': Users,
        'subscription-billing': CreditCard,
        'clinic-intake': Stethoscope,
        'property-booking': House,
        'editorial-calendar': Newspaper,
    };

    let {
        demo,
        demos,
    }: {
        demo: string;
        demos: Record<string, string>;
    } = $props();
</script>

<section
    class="flex flex-col gap-4 rounded-xl border bg-card p-4"
    style:--demo-accent={demoAccent.value}
>
    <div class="flex flex-col gap-3">
        <h2
            id="form-class-heading"
            class="flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
        >
            <Shapes class="size-3.5" />
            Form class
        </h2>
        <nav
            class="flex flex-wrap gap-2"
            aria-labelledby="form-class-heading"
        >
            {#each Object.entries(demos) as [slug, label] (slug)}
                <Link
                    href={toUrl(index(slug))}
                    preserveScroll
                    aria-current={slug === demo ? 'page' : undefined}
                    class={cn(
                        'inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-xs transition hover:border-foreground/20 hover:text-foreground',
                        slug === demo &&
                            'border-[color-mix(in_oklab,var(--demo-accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--demo-accent)_8%,transparent)] text-[var(--demo-accent)] hover:border-[color-mix(in_oklab,var(--demo-accent)_45%,transparent)] hover:text-[var(--demo-accent)]',
                    )}
                >
                    {@const Icon = demoIcons[slug] ?? Shapes}
                    <Icon class="size-4" />
                    {label}
                </Link>
            {/each}
        </nav>
    </div>
    <div
        class="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Accent color"
    >
        <span
            class="flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
        >
            <Palette class="size-3.5" />
            Accent
        </span>
        {#each accents as color (color.value)}
            <button
                type="button"
                aria-label={color.name}
                aria-pressed={demoAccent.value === color.value}
                class="size-6 rounded-full ring-offset-2 ring-offset-background transition hover:scale-110 aria-pressed:ring-2"
                style:background-color={color.value}
                style:--tw-ring-color={color.value}
                onclick={() => (demoAccent.value = color.value)}
            ></button>
        {/each}
        <label
            class="relative size-6 cursor-pointer overflow-hidden rounded-full border border-dashed border-muted-foreground"
            title="Custom color"
        >
            <span class="sr-only">Custom accent color</span>
            <input
                type="color"
                bind:value={demoAccent.value}
                class="absolute inset-0 size-full cursor-pointer opacity-0"
            />
        </label>
    </div>
</section>
