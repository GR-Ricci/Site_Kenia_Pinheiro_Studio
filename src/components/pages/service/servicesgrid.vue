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
                    <button @click="setActiveTag(null)" :class="{ active: ActiveTag === null}"><span>Todos</span></button>
                    <button @click="setActiveTag('cortes')" :class="{ active: ActiveTag === 'cortes'}"><span>Cabelos</span></button>
                    <button @click="setActiveTag('manicure')" :class="{ active: ActiveTag === 'manicure'}"><span>Unhas</span></button>
                    <button @click="setActiveTag('estetica')" :class="{ active: ActiveTag === 'estetica'}"><span>Estética</span></button>
                    <button @click="setActiveTag('eventos')" :class="{ active: ActiveTag === 'eventos'}"><span>Eventos</span></button>
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

.-Services_Filter span{
    position: relative;
    z-index: 1;

}

.-Services_Filter button{
    position: relative;
    overflow: hidden;
    background-color: #FFFFFF;
    border: 1px solid #1C100910;
    transition: 
        background-color 0.3s ease,
        border-color 0.3s ease;
        transition: transform 0.3s ease-out;
    font-size: 12px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 50px;
}

.-Services_Filter button:hover{
    transition: transform 0.3s ease-in;
    transform: translateY(-2px) ;
    filter:brightness(0.9)
}

.-Services_Filter button:after{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;

    width: 10px;
    height: 10px;
    background: #651F2A;
    border-radius: 50%;
     border-color: #651F2A;

    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.3s ease-in-out;
}

.-Services_Filter button.active{
    color: #FFFFFF;
}

.-Services_Filter button.active::after{
    transform: translate(-50%, -50%) scale(30);
    transition: transform 0.3s ease-in-out;
}


</style>
