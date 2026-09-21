<script setup>
import { ref } from 'vue'
import ServicesBooking from '@/components/pages/service/servicesbokingmodal.vue';
import Image from '@/assets/images/services/gugu.png';
const ImageTest = ref(`url(${Image})`);

const bancoFake = {
  servicos: [
    {
      id: 1,
      nome: 'Penteados',
      descricao: 'Penteados para eventos',
      imagem_url: Image
    },
    {
      id: 2,
      nome: 'Cortes',
      descricao: 'Cortes femininos',
      imagem_url: Image
    }
  ],

  subservicos: [
    {
      id: 1,
      id_servico: 1,
      nome: 'Penteado simples'
    },
    {
      id: 2,
      id_servico: 1,
      nome: 'Penteado casamento'
    },
    {
      id: 3,
      id_servico: 2,
      nome: 'Corte feminino'
    }
  ],

  profissionais: [
    {
      id: 1,
      nome: 'Kênia'
    },
    {
      id: 2,
      nome: 'Ana'
    }
  ],

  profissional_subservico: [
    {
      id_profissional: 1,
      id_subservico: 1,
      preco: 100,
      duracao_minutos: 60
    },
    {
      id_profissional: 1,
      id_subservico: 2,
      preco: 250,
      duracao_minutos: 120
    },
    {
      id_profissional: 2,
      id_subservico: 1,
      preco: 90,
      duracao_minutos: 60
    }
  ]
}

const services = bancoFake.servicos;

const ActiveTag = ref(null);

const SelectedService = ref(null)

function setActiveTag(tag) {
    ActiveTag.value = tag
}

function openBooking(services){
    SelectedService.value = services;
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
                <button class="-Services_Grid_Card" 
                @click="openBooking(service)"
                v-for="service in services"
                :key="service.id"
                >
                    <div class="-Services_Grid_Card_Image" :style="{'--card-image': ImageTest }">
                        <h1>{{ service.nome }}</h1>
                    </div>
                    <div class="-Services_Grid_Card_Info">
                        <div class="-Service_Grid_Card_Info_group">
                            <h2>Placeholder</h2>
                            <p>{{ service.descricao }}</p>
                        </div>
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                </button>
                <ServicesBooking 
                v-if="SelectedService"
                :servico="SelectedService"
                :banco="bancoFake"
                @close="SelectedService=null"
                />
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
    width: 1080px;
    height: auto;
    align-items: ce ;
    overflow: hidden;
}

.-Services_Grid_Card{
    display: flex;
    flex-direction: column;
    overflow: hidden;  
    width: 250px;
    aspect-ratio: 250/280;
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
    color: #000000;
    font-size: 18px;
    font-family: 'Playfair Display', serif;
    font-weight: bold;
}
.-Services_Grid_Card_Info{
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 7px;
    justify-content: space-evenly;
    font-size: 12px;

    height: fit-content;
    border-top: 1px solid #C9A66B;
}
.-Service_Grid_Card_Info_group{
    text-align: left;
    width: 80%;
    height: fit-content;

}

.-Services_Grid_Card_Info_Price{
        display: flex;
        width: 40%;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;
        color: #C9A66B;
}

</style>
