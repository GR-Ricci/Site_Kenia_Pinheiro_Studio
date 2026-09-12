<script setup></script>

<template>
  <footer class="footer">
    <div class="footer--container--content">
      <div class="footer--informative">
        <div class="card--logo">
          <img src="@/assets/images/logo/logo.svg" alt="logo" />
          <div class="card--logo__text">Studio</div>
        </div>
        <div class="card--adress">Sertãozinho, SP</div>
        <div class="card--description">Atendimento com Hora Marcada</div>
      </div>

      <div class="footer--navbar">
        <div class="card--title">Navegação</div>

        <RouterLink to="/" class="card card--home" active-class="card--active">Início</RouterLink>

        <RouterLink to="/services" class="card card--service" active-class="card--active">Serviços</RouterLink>

        <RouterLink to="/about" class="card card--about" active-class="card--active">Sobre Nós</RouterLink>

        <RouterLink to="/contact" class="card card--contact" active-class="card--active">Contato</RouterLink>

        <RouterLink to="/gallery" class="card card--gallery" active-class="card--active">Galeria</RouterLink>
      </div>

      <div class="footer--social">
        <div class="card--social">
          <div class="card--social__text">Nos Siga</div>

          <a href="https://www.instagram.com/keniapinheirostudio/" target="_blank" rel="noopener" class="card--social__link">
            <i class="fab fa-instagram"></i>
            <span class="card--social__link__describe">@keniapinheirostudio</span>
          </a>

          <a href="https://wa.me/5516992568812?text=Ol%C3%A1%2C%20Gostaria%20de%20Agendar%20um%20Horario%21" target="_blank" rel="noopener" class="card--social__phone">
            <i class="fa-brands fa-whatsapp"></i>
            <span class="card--social__phone-describe">Agende pelo Whatsapp</span>
          </a>
        </div>
      </div>
    </div>
    <div class="footer--container--copyright">
      <hr class="footer--copyright__line" />
      <div class="footer--copyright__description">© 2026 KP Studio · Sertãozinho, SP · Todos os direitos reservados</div>
    </div>
  </footer>
</template>

<style scoped>
/* --------------footer geral----------------------------------------------------*/

.footer--container--content {
  display: flex;
  justify-content: space-around;
  align-items: start;

  background: var(--kp-mahogany);
  border-top: 0.3rem solid var(--kp-gold);
}

.footer--container--copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: var(--kp-mahogany);
}

.footer--container--copyright hr {
  width: 80%;
  height: 0.1rem;
  background: var(--kp-creme-low);
  border: none;
  opacity: 40%;
  margin-top: 0.5rem;
}

.footer--copyright__description {
  font-family: lato, sans-serif;
  font-size: 1.2rem;
  color: var(--kp-creme-low);
  margin: 1rem 0;
}

/* --------------informative-----------------------------------------------------*/

.footer--informative {
  margin: 1rem 0 1rem 4rem;

  font-family: lato, sans-serif;
}

.card--logo {
  display: flex;
  align-items: center;
  font-family: lato, sans-serif;

  color: var(--kp-gold);
}

.card--logo__text {
  font-family:
    Playfair Display,
    sans-serif;
  margin-left: 1rem;
  opacity: 90%;
  color: var(--kp-creme);
}

.card--adress {
  font-size: 1.3rem;
  margin-top: 1rem;

  color: var(--kp-creme-low);
}

.card--description {
  font-size: 1.2rem;

  color: var(--kp-creme-low);
}

/* --------------Nav Bar--------------------------------------------------------*/

.footer--navbar {
  display: flex;
  flex-direction: column;
  justify-content: center; /* agora centraliza na VERTICAL */
  align-items: flex-start;

  margin: 0.5rem 2rem 0.5rem 2rem;
  font-family: lato, sans-serif;

  /*background: blue;*/
}

.card--title {
  color: var(--kp-gold);
  margin-bottom: 1rem;
}

.card {
  opacity: 0.6;
  transition: all 200ms ease-in-out;

  color: var(--kp-creme);
  font-size: 1.2rem;
}

.card:hover {
  color: var(--kp-gold-low);
  opacity: 1;
  transition: none;
}

.card:active {
  color: var(--kp-gold);
}

/* -------------------Social-------------------------------------------------------*/

.footer--social {
  flex-direction: column;
  justify-content: center; /* agora centraliza na VERTICAL */
  align-items: flex-start;

  margin: 0.5rem 4rem 0.5rem 0;
}

.card--social {
  font-family: lato, sans-serif;
}

.card--social__text {
  color: var(--kp-gold);
}

.card--social__link {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
  transition: all 200ms ease-in-out;
}

.card--social__link i {
  color: var(--kp-gold);
}

.card--social__link span {
  font-family: lato, sans-serif;
  color: var(--kp-creme-low);
  margin-bottom: 0.4rem;
}

.card--social__link:hover i,
.card--social__link:hover span {
  color: var(--kp-gold-low);
  opacity: 1;
  transition: none;
}

.card--social__link:active i,
.card--social__link:active span {
  color: var(--kp-gold);
}
/* -------------------Phone-------------------------------------------------------*/

.card--social__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.5rem 0.8rem;
  margin: 0.5rem 0 0.5rem 0;

  background: var(--kp-vinho);
  border: 2px solid var(--kp-gold);
  opacity: 80%;
  border-radius: 0.8rem;

  color: var(--kp-creme);
  transition: all 200ms ease-in-out;
}

.card--social__phone span {
  font-size: 1.2rem;
  opacity: 90%;
  transition: all 200ms ease-in-out;
}

.card--social__phone i {
  transition: all 200ms ease-in-out;
}

.card--social__phone:hover i,
.card--social__phone:hover span {
  color: var(--kp-gold);
  opacity: 100%;
}

.card--social__phone:hover {
  background: var(--kp-vinho-low);
  border: 2px solid var(--kp-gold-low);
}

.card--social__phone:active i,
.card--social__phone:active span {
  color: var(--kp-creme);
  opacity: 90%;
}

.card--social__phone:active {
  background: var(--kp-vinho);
  border: 2px solid var(--kp-gold);
}
</style>
