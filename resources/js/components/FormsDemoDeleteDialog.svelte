<script lang="ts">
    import { Form } from '@inertiajs/svelte';
    import type { Snippet } from 'svelte';
    import { Button } from '@/components/ui/button';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogTitle,
        DialogTrigger,
    } from '@/components/ui/dialog';
    import { destroy } from '@/routes/forms-demo';
    import type { FormEntrySummary } from '@/types';

    let {
        demo,
        entry,
        trigger,
    }: {
        demo: string;
        entry: FormEntrySummary;
        trigger: Snippet<[{ onclick: () => void }]>;
    } = $props();
</script>

<Dialog>
    <DialogTrigger asChild>
        {#snippet children(props)}
            {@render trigger({ onclick: props.onClick as () => void })}
        {/snippet}
    </DialogTrigger>
    <DialogContent>
        <div class="space-y-3">
            <DialogTitle>Delete this entry?</DialogTitle>
            <DialogDescription>
                “{entry.title}” and its uploaded files will be deleted. This
                cannot be undone.
            </DialogDescription>
        </div>

        <Form {...destroy.form([demo, entry.id])} class="mt-6">
            {#snippet children({ processing })}
                <DialogFooter class="gap-2">
                    <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={processing}
                    >
                        Delete entry
                    </Button>
                </DialogFooter>
            {/snippet}
        </Form>
    </DialogContent>
</Dialog>
