<script module lang="ts">
    import { dashboard } from '@/routes';
    import { index } from '@/routes/forms-demo';

    export const layout = {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Inertia Forms demo', href: index() },
        ],
    };
</script>

<script lang="ts">
    import { Link, router } from '@inertiajs/svelte';
    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import Eye from '@lucide/svelte/icons/eye';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Pencil from '@lucide/svelte/icons/pencil';
    import Plus from '@lucide/svelte/icons/plus';
    import Search from '@lucide/svelte/icons/search';
    import Trash2 from '@lucide/svelte/icons/trash-2';
    import AppHead from '@/components/AppHead.svelte';
    import FormsDemoDeleteDialog from '@/components/FormsDemoDeleteDialog.svelte';
    import FormsDemoPicker, {
        demoAccent,
    } from '@/components/FormsDemoPicker.svelte';
    import { Button } from '@/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { formatDate } from '@/lib/forms-demo';
    import { toUrl } from '@/lib/utils';
    import { create, edit, show } from '@/routes/forms-demo';
    import type {
        FormEntrySummary,
        FormsDemoPageProps,
        Paginated,
    } from '@/types';

    let {
        demo,
        label,
        className,
        demos,
        search,
        entries,
    }: FormsDemoPageProps & {
        search: string;
        entries: Paginated<FormEntrySummary>;
    } = $props();

    // svelte-ignore state_referenced_locally
    let query = $state(search);

    $effect(() => {
        const value = query.trim();

        if (value === search) {
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                toUrl(index(demo, { query: { search: value || undefined } })),
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    });

    const accentButton =
        'bg-(--demo-accent) text-white hover:bg-(--demo-accent)/90';
</script>

<AppHead title={`${label} entries`} />

<div
    class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
    style:--demo-accent={demoAccent.value}
>
    <FormsDemoPicker {demo} {demos} />

    <Card>
        <CardHeader
            class="flex flex-row flex-wrap items-start justify-between gap-3"
        >
            <div class="grid gap-1.5">
                <CardTitle>{label} entries</CardTitle>
                <CardDescription>
                    Saved with <code>app/Forms/{className}.php</code> and
                    <code>FormEntryService</code>.
                </CardDescription>
            </div>
            <div class="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <div class="relative flex-1 sm:w-64 sm:flex-none">
                    <Search
                        class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        bind:value={query}
                        type="search"
                        placeholder="Search entries…"
                        aria-label="Search entries"
                        class="pl-8"
                    />
                </div>
                <Button asChild class={accentButton}>
                    {#snippet children(props)}
                        <Link href={toUrl(create(demo))} class={props.class}>
                            <Plus class="size-4" />
                            New entry
                        </Link>
                    {/snippet}
                </Button>
            </div>
        </CardHeader>

        <CardContent>
            {#if entries.data.length === 0}
                <div
                    class="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-12 text-center"
                >
                    <Inbox class="size-8 text-muted-foreground" />
                    <p class="text-sm text-muted-foreground">
                        {search
                            ? `No entries match “${search}”.`
                            : 'No entries yet. Fill in the form to save the first one.'}
                    </p>
                    {#if !search}
                        <Button variant="outline" size="sm" asChild>
                            {#snippet children(props)}
                                <Link
                                    href={toUrl(create(demo))}
                                    class={props.class}
                                >
                                    <Plus class="size-4" />
                                    Create entry
                                </Link>
                            {/snippet}
                        </Button>
                    {/if}
                </div>
            {:else}
                <div class="overflow-x-auto rounded-lg border">
                    <table class="w-full text-sm">
                        <thead
                            class="bg-muted/50 text-left text-xs text-muted-foreground uppercase"
                        >
                            <tr>
                                <th class="px-4 py-2.5 font-medium">Title</th>
                                <th
                                    class="hidden px-4 py-2.5 font-medium md:table-cell"
                                >
                                    Created
                                </th>
                                <th
                                    class="hidden px-4 py-2.5 font-medium sm:table-cell"
                                >
                                    Updated
                                </th>
                                <th class="px-4 py-2.5 text-right font-medium">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            {#each entries.data as entry (entry.id)}
                                <tr class="transition hover:bg-muted/40">
                                    <td class="px-4 py-3">
                                        <Link
                                            href={toUrl(show([demo, entry.id]))}
                                            class="font-medium hover:underline"
                                        >
                                            {entry.title}
                                        </Link>
                                        <span
                                            class="ml-2 text-xs text-muted-foreground"
                                        >
                                            #{entry.id}
                                        </span>
                                    </td>
                                    <td
                                        class="hidden px-4 py-3 text-muted-foreground md:table-cell"
                                    >
                                        {formatDate(entry.createdAt)}
                                    </td>
                                    <td
                                        class="hidden px-4 py-3 text-muted-foreground sm:table-cell"
                                    >
                                        {formatDate(entry.updatedAt)}
                                    </td>
                                    <td class="px-4 py-2">
                                        <div class="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                {#snippet children(props)}
                                                    <Link
                                                        href={toUrl(
                                                            show([
                                                                demo,
                                                                entry.id,
                                                            ]),
                                                        )}
                                                        class={props.class}
                                                        aria-label={`View ${entry.title}`}
                                                    >
                                                        <Eye class="size-4" />
                                                    </Link>
                                                {/snippet}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                {#snippet children(props)}
                                                    <Link
                                                        href={toUrl(
                                                            edit([
                                                                demo,
                                                                entry.id,
                                                            ]),
                                                        )}
                                                        class={props.class}
                                                        aria-label={`Edit ${entry.title}`}
                                                    >
                                                        <Pencil
                                                            class="size-4"
                                                        />
                                                    </Link>
                                                {/snippet}
                                            </Button>
                                            <FormsDemoDeleteDialog
                                                {demo}
                                                {entry}
                                            >
                                                {#snippet trigger({ onclick })}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        class="text-destructive hover:text-destructive"
                                                        aria-label={`Delete ${entry.title}`}
                                                        {onclick}
                                                    >
                                                        <Trash2
                                                            class="size-4"
                                                        />
                                                    </Button>
                                                {/snippet}
                                            </FormsDemoDeleteDialog>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}

            {#if entries.total > 0}
                <div
                    class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"
                >
                    <p>
                        Showing {entries.from}–{entries.to} of {entries.total}
                    </p>
                    <div class="flex items-center gap-2">
                        {@render pageLink(
                            entries.prev_page_url,
                            'Previous',
                            ChevronLeft,
                        )}
                        <span>
                            Page {entries.current_page} of {entries.last_page}
                        </span>
                        {@render pageLink(
                            entries.next_page_url,
                            'Next',
                            ChevronRight,
                        )}
                    </div>
                </div>
            {/if}
        </CardContent>
    </Card>
</div>

{#snippet pageLink(
    href: string | null,
    label: string,
    Icon: typeof ChevronLeft,
)}
    {#if href}
        <Button variant="outline" size="icon" asChild>
            {#snippet children(props)}
                <Link
                    {href}
                    preserveScroll
                    preserveState
                    class={props.class}
                    aria-label={label}
                >
                    <Icon class="size-4" />
                </Link>
            {/snippet}
        </Button>
    {:else}
        <Button variant="outline" size="icon" disabled aria-label={label}>
            <Icon class="size-4" />
        </Button>
    {/if}
{/snippet}
