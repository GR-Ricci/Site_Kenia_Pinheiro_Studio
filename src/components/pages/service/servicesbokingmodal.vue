<script setup>
import { ref } from 'vue';
import Image from '@/assets/images/services/gugu.png';
const ImageTest = ref(`url(${Image})`);
</script>

<template>
    <section class="Services_booking_modal">
        <div class="-Services_booking_modal_background">
            <div class="-Services_booking_modal">
                <div class="-Services_booking_modal_image" :style="{'--card-image': ImageTest }">
                    <div class="-Services_booking_modal_image_text">
                    <p>SERVIÇO</p>
                    <h1>Penteados</h1>
                    </div>
                </div>
                <div class="-Services_booking_modal_choice_p">
                    <p>Escolha a modalidade:</p>
                </div>
                <div class="-Services_booking_modal_choice">
                    <button class="-Services_booking_modal_choice_button">
                        <img />
                        <div class="-Services_booking_modal_choice_button_info">
                        <h1>Parar casamento</h1>
                        <p>Penteados sofisticados para seu grande dia.</p>
                        </div>
                    </button>
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
      
    .-Services_booking_modal_image_text{
        position: absolute;
        bottom: 15px;
        left: 25px;
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
    }
    .-Services_booking_modal_choice_button_info{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .-Services_booking_modal_choice_button_info h1{
        font-family: 'PLayfair display', serif;
        font-size: 12px;
        font-weight: bold;
    }
</style>
