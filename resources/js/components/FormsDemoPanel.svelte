<script lang="ts">
    import type { LinkComponentBaseProps } from '@inertiajs/core';
    import { Link } from '@inertiajs/svelte';
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import type { Snippet } from 'svelte';
    import { Button } from '@/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '@/components/ui/card';
    import { toUrl } from '@/lib/utils';

    let {
        title,
        className,
        backHref,
        data,
        children,
    }: {
        title: string;
        className: string;
        backHref: NonNullable<LinkComponentBaseProps['href']>;
        data: Record<string, unknown> | null;
        children: Snippet;
    } = $props();
</script>

<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <Card>
        <CardHeader
            class="flex flex-row flex-wrap items-start justify-between gap-3"
        >
            <div class="grid gap-1.5">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Defined in
                    <code>app/Forms/{className}.php</code> and rendered with
                    one <code>&lt;Form&gt;</code> component. Saving validates it
                    on the server and stores it with
                    <code>FormEntryService</code>.
                </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
                {#snippet children(props)}
                    <Link href={toUrl(backHref)} class={props.class}>
                        <ArrowLeft class="size-4" />
                        Back
                    </Link>
                {/snippet}
            </Button>
        </CardHeader>
        <CardContent>
            {@render children()}
        </CardContent>
    </Card>

    <Card class="h-fit">
        <CardHeader>
            <CardTitle>Stored data</CardTitle>
            <CardDescription>
                What <code>FormEntryService</code> saved in the
                <code>form_entries</code> table. Secrets are masked.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {#if data}
                <pre
                    class="max-h-128 overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(
                        data,
                        null,
                        2,
                    )}</pre>
            {:else}
                <p
                    class="rounded-md border border-dashed p-3 text-sm text-muted-foreground"
                >
                    Nothing saved yet. Submit the form to create an entry.
                </p>
            {/if}
        </CardContent>
    </Card>
</div>
