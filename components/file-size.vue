<template>
    <span v-if="!value">—</span>

    <span v-else>
        {{ size.toLocaleString('ru', { maximumFractionDigits: maximumFractionDigits || 0 }) }} {{ label }}
    </span>
</template>

<script setup lang="ts">
    const props = defineProps({
        value: {
            type: Number,
            required: true
        },
        maximumFractionDigits: {
            type: Number,
        },
    });

    const SIZE_B = 1;
    const SIZE_KB = SIZE_B * 1024;
    const SIZE_MB = SIZE_KB * 1024;
    const SIZE_GB = SIZE_MB * 1024;
    const SIZE_TB = SIZE_GB * 1024;
    const SIZE_PB = SIZE_TB * 1024;

    const getSizeParts = (size: number): [number, string] => {
        if (size > SIZE_PB) return [size / SIZE_PB, 'Пб'];
        if (size > SIZE_TB) return [size / SIZE_TB, 'Тб'];
        if (size > SIZE_GB) return [size / SIZE_GB, 'Гб'];
        if (size > SIZE_MB) return [size / SIZE_MB, 'Мб'];
        if (size > SIZE_KB) return [size / SIZE_KB, 'Кб'];

        return [size, 'Б'];
    };

    const [size, label] = getSizeParts(props.value);
</script>

<style lang="scss" scoped>
</style>
