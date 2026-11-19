<script setup></script>

<template>
  <section class="Services_banner">
    <div class="-Services_banner_Background">
      <h6>CONHEÇA</h6>
      <h1>Nossos Serviços</h1>
      <p>Selecione um profissional e clique para agendar.</p>
    </div>
  </section>
</template>

<style scoped>
.-Services_banner_Background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 185px;
  width: auto;
  background-color: #3d2010;
  color: #f5ebdd;
}
.-Services_banner_Background h6 {
  color: #c9a66b;
  font-family: 'Lato', sans-serif;
  letter-spacing: 2px;
  font-size: 12px;
}

.-Services_banner_Background h1 {
  color: #f5ebdd;
  font-family: 'Playfair Display', serif;
  font-size: 37px;
}
.-Services_banner_Background p {
  color: #f5ebdd72;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
}
</style>
