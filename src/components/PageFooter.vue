<template>
  <footer class="footer">
    <div class="footer__container">

      <div class="footer__section">
        <RouterLink to="/cp/" class="footer__logo-wrap">
          <SvgLogo />
        </RouterLink>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Video SDK</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="#" class="footer__link">Windows</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Electron</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">iOS (Swift)</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">iOS (Objective-C)</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Android</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Desktop (Win, Mac, Linux)</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Audio SDK</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="#" class="footer__link">Web</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Windows</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Extensions</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="#" class="footer__link">Why extensions?</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">AI Webcam Effects</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Background Noise Remove</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Documentation</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="#" class="footer__link">Best Practices</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">API</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Demo</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="#" class="footer__link">Video</a>
          </li>
          <li class="footer__item">
            <a href="#" class="footer__link">Audio</a>
          </li>
        </ul>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__bottom">
        <p class="footer__copyright">©Damiko Inc. 2025. All rights reserved.</p>
        <div class="footer__links">
          <a href="#" class="footer__link">Terms and Conditions</a>
          <a href="#" class="footer__link">Privacy Policy</a>
          <a href="#" class="footer__link">Refund Policy</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script>
import SvgLogo from '@/components/icons/SvgLogo.vue';

export default {
  components: {
    SvgLogo,
  }
}
</script>

<style lang="less" scoped>
.footer {
  background-color: #f8f9fa;
  padding: 30px;
  font-family: Arial, sans-serif;

  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1200px;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  &__logo-wrap {
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 150px;
    height: 20px;
    }

  &__section {
    margin: 10px;
  }

  &__title {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: @black;
  }

  &__list {
    list-style: none;
    padding: 0;
  }

  &__item {
    margin-bottom: 10px;
    font-size: 14px;
  }

  &__divider {
    width: 100%;
    height: 1px; 
    background-color: #EAECF0;
    margin: 0; 
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
  }

  &__links {
    display: flex;
    gap: 32px
  }

  &__link {
    align-self: center;
    text-decoration: none;
    color: #6F717C;

    &:hover {
      text-decoration: underline;
    }
  }

  &__copyright {
    margin: 0;
  }
}



</style>