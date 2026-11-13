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
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';
    import { svelteLang } from '@erag/lang-sync-inertia/svelte';
    import AppHead from '@/components/AppHead.svelte';
    import CodeInput from '@/components/form-fields/CodeInput.svelte';
    import QuantityStepper from '@/components/form-fields/QuantityStepper.svelte';
    import Rating from '@/components/form-fields/Rating.svelte';
    import FormsDemoPanel from '@/components/FormsDemoPanel.svelte';
    import FormsDemoPicker, {
        demoAccent,
    } from '@/components/FormsDemoPicker.svelte';
    import { show } from '@/routes/forms-demo';
    import type { FormEntrySummary, FormsDemoPageProps } from '@/types';

    let {
        demo,
        label,
        className,
        demos,
        form,
        entry,
    }: FormsDemoPageProps & {
        form: FormSchema;
        entry: (FormEntrySummary & { data: Record<string, unknown> }) | null;
    } = $props();

    /**
     * Components for the custom fields in app/Forms/Fields, keyed by `component()`.
     */
    const customFields = { Rating, CodeInput, QuantityStepper };

    const { trans } = svelteLang();

    const title = $derived(
        trans(entry ? 'demo.page.edit_entry' : 'demo.page.new_entry', {
            name: label.toLowerCase(),
        }),
    );
</script>

<AppHead {title} />

<div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
    <FormsDemoPicker {demo} {demos} />

    <FormsDemoPanel
        {title}
        {className}
        backHref={entry ? show([demo, entry.id]) : index(demo)}
        data={entry?.data ?? null}
    >
        {#key `${demo}-${entry?.id ?? 'new'}`}
            <Form
                {form}
                accent={demoAccent.value}
                components={customFields}
            />
        {/key}
    </FormsDemoPanel>
</div>
