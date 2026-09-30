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
    import { Link } from '@inertiajs/svelte';
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import Paperclip from '@lucide/svelte/icons/paperclip';
    import Pencil from '@lucide/svelte/icons/pencil';
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
    import { formatDate, formatFileSize } from '@/lib/forms-demo';
    import { toUrl } from '@/lib/utils';
    import { edit } from '@/routes/forms-demo';
    import type {
        FormEntrySection,
        FormEntrySummary,
        FormsDemoPageProps,
    } from '@/types';

    let {
        demo,
        label,
        demos,
        entry,
        sections,
    }: FormsDemoPageProps & {
        entry: FormEntrySummary;
        sections: FormEntrySection[];
    } = $props();
</script>

<AppHead title={entry.title} />

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
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription>
                    {label} entry #{entry.id} · created {formatDate(
                        entry.createdAt,
                    )} · updated {formatDate(entry.updatedAt)}
                </CardDescription>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                    {#snippet children(props)}
                        <Link href={toUrl(index(demo))} class={props.class}>
                            <ArrowLeft class="size-4" />
                            All entries
                        </Link>
                    {/snippet}
                </Button>
                <Button
                    size="sm"
                    asChild
                    class="bg-(--demo-accent) text-white hover:bg-(--demo-accent)/90"
                >
                    {#snippet children(props)}
                        <Link
                            href={toUrl(edit([demo, entry.id]))}
                            class={props.class}
                        >
                            <Pencil class="size-4" />
                            Edit
                        </Link>
                    {/snippet}
                </Button>
                <FormsDemoDeleteDialog {demo} {entry}>
                    {#snippet trigger({ onclick })}
                        <Button variant="destructive" size="sm" {onclick}>
                            <Trash2 class="size-4" />
                            Delete
                        </Button>
                    {/snippet}
                </FormsDemoDeleteDialog>
            </div>
        </CardHeader>

        <CardContent class="grid gap-6">
            {#each sections as section, sectionIndex (sectionIndex)}
                <section class="grid gap-3">
                    {#if section.title}
                        <h3
                            class="border-b pb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
                        >
                            {section.title}
                        </h3>
                    {/if}
                    <dl
                        class="grid gap-x-6 gap-y-3 sm:grid-cols-[12rem_minmax(0,1fr)]"
                    >
                        {#each section.rows as row, rowIndex (rowIndex)}
                            <dt class="text-sm text-muted-foreground">
                                {row.label}
                            </dt>
                            <dd class="text-sm">
                                {#if row.type === 'empty'}
                                    <span class="text-muted-foreground">—</span>
                                {:else if row.type === 'json'}
                                    <pre
                                        class="max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">{row.value}</pre>
                                {:else if row.type === 'files'}
                                    <ul class="grid gap-1.5">
                                        {#each row.files as file (file.url)}
                                            <li>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    class="inline-flex items-center gap-1.5 hover:underline"
                                                >
                                                    <Paperclip
                                                        class="size-3.5 text-muted-foreground"
                                                    />
                                                    {file.name}
                                                    <span
                                                        class="text-xs text-muted-foreground"
                                                    >
                                                        {formatFileSize(
                                                            file.size,
                                                        )}
                                                    </span>
                                                </a>
                                            </li>
                                        {/each}
                                    </ul>
                                {:else}
                                    <span
                                        class="break-words whitespace-pre-wrap"
                                        >{row.value}</span
                                    >
                                {/if}
                            </dd>
                        {/each}
                    </dl>
                </section>
            {/each}
        </CardContent>
    </Card>
</div>
