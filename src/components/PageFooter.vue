<template>
  <footer class="footer">
    <div class="footer__container">

      <div class="footer__section">
        <!-- <RouterLink to="/" class="footer__logo-wrap">
          <SvgLogo />
        </RouterLink> -->
        <a href="/" class="footer__logo-wrap">
        <SvgLogo />
      </a>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Video SDK</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/web-integration-sample" class="footer__link">Web</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/electron-integration-sample" class="footer__link">Electron</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/swift-video-effects-sdk" class="footer__link">iOS (Swift)</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/ios-xcframework-integration-sample" class="footer__link">iOS (Objective-C)</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/android-integration-sample" class="footer__link">Android</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/desktop-demo-samples" class="footer__link">Desktop (Win, Mac, Linux)</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Audio SDK</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/audio-effects-sdk-web" class="footer__link">Web</a>
          </li>
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/audio-desktops" class="footer__link">Windows</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Extensions</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="https://chromewebstore.google.com/detail/ai-webcam-effects-+-recor/iedbphhbpflhgpihkcceocomcdnemcbj" class="footer__link">AI Webcam Effects</a>
          </li>
          <li class="footer__item">
            <a href="https://chromewebstore.google.com/detail/background-noise-remover/njmhcidcdbaannpafjdljminaigdgolj" class="footer__link">Background Noise Remove</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Documentation</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="https://github.com/EffectsSDK/web-integration-sample/blob/main/docs/Best-Practices.md" class="footer__link">Best Practices</a>
          </li>
          <li class="footer__item">
            <a href="=https://effectssdk.ai/sdk/web/docs/classes/tsvb.html" class="footer__link">API</a>
          </li>
        </ul>
      </div>

      <div class="footer__section">
        <h4 class="footer__title">Demo</h4>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="https://effectssdk.ai/sdk/dev/demo-latest.html" class="footer__link">Video</a>
          </li>
          <li class="footer__item">
            <a href="https://effectssdk.ai/products/audio-effects-sdk" class="footer__link">Audio</a>
          </li>
        </ul>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__bottom">
        <p class="footer__copyright">©Damiko Inc. 2025. All rights reserved.</p>
        <div class="footer__links">
          <a href="/terms" class="footer__link">Terms and Conditions</a>
          <a href="/privacy-policy" class="footer__link">Privacy Policy</a>
          <a href="/refund-policy" class="footer__link">Refund Policy</a>
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
  flex-shrink: 0;

  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 0 135px;

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
    transition: all 0.3s ease-in-out;

    &:hover {
      color: @blue2;
    }
  }

  &__copyright {
    margin: 0;
  }
}



</style>