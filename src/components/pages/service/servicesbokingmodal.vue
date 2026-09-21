<script setup>
import { ref, computed } from 'vue';
import Image from '@/assets/images/services/gugu.png';

const ImageTest = ref(`url(${Image})`);

const props = defineProps({
    servico: Object,
    banco: Object
});

const emit = defineEmits(['close']);

const CurrentStep = ref('professional');
const SelectedProfessional = ref(null);
const SelectedSubservice = ref(null);


const AvailableProfessionals = computed(() => {

    const idsSubservice = props.banco.subservicos
        .filter(sub => sub.id_servico === props.servico.id)
        .map(sub => sub.id);

    const idsProfessionals = props.banco.profissional_subservico
        .filter(relation =>
            idsSubservice.includes(relation.id_subservico)
        )
        .map(relation => relation.id_profissional);

    return props.banco.profissionais
        .filter(prof =>
            idsProfessionals.includes(prof.id)
        );
});

function SelectProfessional(professional) {
    SelectedProfessional.value = professional;
    CurrentStep.value = 'subservice';
}

const AvailableSubservices = computed(() => {

    if (!SelectedProfessional.value) return [];

    const idsSubservice = props.banco.profissional_subservico
        .filter(relation =>
            relation.id_profissional === SelectedProfessional.value.id
        )
        .map(relation => relation.id_subservico);

    return props.banco.subservicos
        .filter(sub =>
            sub.id_servico === props.servico.id &&
            idsSubservice.includes(sub.id)
        );
});


function SelectSubservice(subservice) {
    SelectedSubservice.value = subservice;
    CurrentStep.value = 'booking';
}

</script>

<template>
    <section class="Services_booking_modal">
        <div class="-Services_booking_modal_background" @click.self="emit('close')">
            <div class="-Services_booking_modal">
                <div class="-Services_booking_modal_image" :style="{'--card-image': ImageTest }">
                    <div class="-Services_booking_modal_image_text">
                    <p>SERVIÇO</p>
                    <h1>{{ servico.nome }}</h1>
                    </div>
                    <div class="-Services_booking_modal_close" >
                    <i class="fa-solid fa-x" @click.self="emit('close')"></i>
                    </div>
                </div>  
                <div class="-Services_booking_modal_choice_p">
                    <p v-if="CurrentStep == 'professional'">
                        Escolha o profissional ideal para você.
                    </p>
                    <p v-else>
                        Confira as modalidades disponiveis.
                    </p>                    
                </div>
                <div class="-Services_booking_modal_choice">
                    <template v-if="CurrentStep == 'professional'">
                        <button class="-Services_booking_modal_choice_button"
                            v-for="professional in AvailableProfessionals"
                            :key="professional.id"
                            @click="-SelectProfessional(professional)"
                        >
                            <img :src="Image"/>
                            <div class="-Services_booking_modal_choice_button_info">
                                <h1>{{ professional.nome }}</h1>
                            </div>
                            <div class="-Services_booking_modal_choice_button_price">
                                <h1>
                                </h1>
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </button>
                    </template>
                    <template v-if="CurrentStep == 'subservice'">
                        <button class="-Services_booking_modal_choice_button"
                            v-for="subservice in AvailableSubservices"
                            :key="subservice.id"
                            @click="-SelectSubservice(subservice)"
                        >
                            <img :src="Image"/>
                            <div class="-Services_booking_modal_choice_button_info">
                                <h1>{{ subservice.nome }}</h1>
                            </div>
                            <div class="-Services_booking_modal_choice_button_price">
                                <h1>
                                </h1>
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </button>
                    </template>
                </div>
            </div>
       </div>
    </section>
</template>

<style scoped>
    .-Services_booking_modal_background{
        position: fixed;
        inset: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        background: #00000080;
    }

    .-Services_booking_modal{
        width: 80dvh;
        height: 88vh;

        display: flex;
        flex-direction: column;

        background: #FAF7F2;
        border: 1px solid #C9A66B;
        border-radius: 2.5%;
        overflow: hidden;
    }

    .-Services_booking_modal_image{
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: end;
        padding-right: 15px;
        padding-left: 15px;
        padding-bottom: 15px;

        width: 100%;
        height: 20%;
        flex-shrink: 0;

        background-image: var(--card-image);
        background-size: cover;
        background-position: center -250PX          ;
        background-size: 400%;
        background-color: black;

        border-bottom: 1px solid #C9A66B;
    }
      
    .-Services_booking_modal_image_text {
        color: rgba(30,18,10,0.65);
    }
    .-Services_booking_modal_image h1{
        color: #651F2A;
        font-family: 'Playfair Display', serif;
        font-size: 20px;
        font-weight: bold;
        -webkit-text-stroke: 0.2px #C9A66B;
    }
    .-Services_booking_modal_image p{ 
        left: 25px;
        bottom: 26px;
        color: #C9A66B;
        font-family: 'Lato', sans-serif;
        font-weight: 100;
        font-size: 13px;
    }
    .-Services_booking_modal_choice{
        display: flex;
        flex-direction: column;
        align-items: center;
        
        width: 100%;
       
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        gap: 12px;

        margin-bottom: 20px;
    }
    .-Services_booking_modal_choice_p{
        flex-shrink: 0;
        position: relative;
        margin: 20px;
        font-family: 'Lato', sans-serif;
        color: #3D201090;
    }
    .-Services_booking_modal_choice_button{
        width: 92%;
        height: 90px;
        flex-shrink: 0;

        display: flex;
        gap: 16px;
        padding: 10px;

        background-color: #FFFFFF;
        border: 1px solid #C9A66B;
        border-radius: 10px;
    }
    .-Services_booking_modal_choice_button img{
        width: 70px;
        height: 70px;
        background-color: #651F2A;
        object-fit: cover;
    }
    .-Services_booking_modal_choice_button_info{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .-Services_booking_modal_choice_button_info h1{
        font-family: 'PLayfair display', serif;
        font-size: 15px;
        font-weight: bold;
    }
    .-Services_booking_modal_choice_button_info h1{
        font-family: 'PLayfair display', serif;
        font-size: 15px;
        font-weight: bold;
    }
    .-Services_booking_modal_choice_button_info p{
        color: #1E120A;
        font-size: 15px;
        text-align: left;
    }
    .-Services_booking_modal_choice_button_price {
        display: flex;
        width: 25%;
        flex-direction: column;
        justify-content: space-between;
        text-align: right;
        color: #C9A66B;
    }
    .-Services_booking_modal_close {
    color: #1E120A65;
    font-size: 15px;
    cursor: pointer;
    
    }

  
</style>
