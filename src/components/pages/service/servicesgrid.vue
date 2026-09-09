<script setup>
import { ref } from 'vue'

const ActiveTag = ref(null)

function setActiveTag(tag) {
    ActiveTag.value = tag
}
</script>

<template>
    <section class="Services_Grid">
        <div class="-Services_Grid">
            <div class="-Services_Filter">
                    <button @click="setActiveTag(null)" :class="{ active: ActiveTag === null}">Todos</button>
                    <button @click="setActiveTag('cortes')" :class="{ active: ActiveTag === 'cortes'}">Cabelos</button>
                    <button @click="setActiveTag('manicure')" :class="{ active: ActiveTag === 'manicure'}">Unhas</button>
                    <button @click="setActiveTag('estetica')" :class="{ active: ActiveTag === 'estetica'}">Estética</button>
                    <button @click="setActiveTag('eventos')" :class="{ active: ActiveTag === 'eventos'}">Eventos</button>
            </div>
        </div>
    </section>
</template>

<style scoped>

.-Services_Filter{
    display:flex;
    flex-direction:row;
    justify-content:center;
    gap: 5px;
    padding: 16px;
    background-color:#FAF7F2;
    width: auto;
    border-bottom: 1px solid #1C100910;
}

.-Services_Filter button{
    background-color: #FFFFFF;
    font-size: 12px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    border: 1px solid #1C100910;
    border-radius: 50px;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
}

.-Services_Filter button::after{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;

    width: 0;
    height: 0;
    background-color: #651F2A;
    border-radius: 50%;

    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
}

.-Services_Filter button.active{
    background-color: #651F2A;
    border-color: #651F2A;
    color: #FFFFFF;
}


</style>
