<script setup>
import { ref } from 'vue'

const ActiveTag = ref(null);
import Image from '@/assets/images/services/gugu.png';
const ImageTest = ref(`url(${Image})`);

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
            <div class="-Services_Grid_Content">
                <button class="-Services_Grid_Card">
                    <div class="-Services_Grid_Card_Image" :style="{'--card-image': ImageTest }">
                        <h1>Penteados</h1>
                    </div>
                    <div class="-Services_Grid_Card_Info">
                        <h2>
                            A partir de R$ 60
                        </h2>
                    </div>
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>

.-Services_Filter{
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    gap: 5px;
    padding: 16px;
    background-color:#FAF7F2;
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

.-Services_Grid{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width: 100%;
}

.-Services_Grid_Content{
    margin-top: 20px;
    width: 900px;
    height: auto;
}

.-Services_Grid_Card{
    display: flex;
    flex-direction: column;
    overflow: hidden;  
    width: 250px;
    aspect-ratio: 250/260;
    background:#FFFFFF;
    border: 1px solid #C9A66B;
    border-radius: 7px;
}

.-Services_Grid_Card_Image{
    position: relative;
    width: 100%;
    height:195px;
    background-image: var(--card-image);
    background-size: cover;
    background-position: center;
}

.-Services_Grid_Card_Image h1{
    position: absolute;
    bottom: 12px;
    left: 12px;
    color: #FAF7F2;
    font-size: 18px;
    font-family: 'Playfair Display', serif;
    font-weight: bold;
}
.-Services_Grid_Card_Info{
    width: 100%;
    border-top: 1px solid #C9A66B;
}

</style>
