<template>
  <div class="login">
    <div class="login__container">
      <div class="login__card">

        <div class="login__logo">
          <SvgLogo />
        </div>

        <h1 class="login__title">Welcome back!</h1>
        <p class="login__subtitle">Please sign in to continue</p>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>


        <form class="login__form" @submit.prevent="handleLogin" novalidate>
          <div class="form__group">
            <label class="form__label" for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Email" 
              required 
              class="form__input"
              :class="{'input-error': errors.email}"
            />
            <span v-if="errors.email" class="form__error">{{ errors.email }}</span>
          </div>
          <div class="form__group">
            <label class="form__label" for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Password" 
              required 
              class="form__input"
              :class="{'input-error': errors.password}"
            />
            <span v-if="errors.password" class="form__error">{{ errors.password }}</span>
            <a href="#" class="form__forgot-password">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary" @click="handleLogin">Sign in</button>
          <button type="button" class="btn btn-secondary" @click="redirectToRegister">
            Don’t have an account?
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SvgLogo from '@/components/icons/SvgLogo.vue';
import { useAuthStore } from '@/stores/AuthStore.js';

export default {
  name: 'LoginPage',
  components: {
    SvgLogo,
  },
  data() {
    return {
      email: '',
      password: '',
      errors: {}
    };
  },
  methods: {
    async handleLogin() {
      this.errors = {}; 

      if (!this.email) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = 'Please enter a valid email';
      }

      if (!this.password) {
        this.errors.password = 'Password is required';
      }

      if (Object.keys(this.errors).length > 0) {
        return; 
      }

      try {
        const response = await this.$axios.post('/api/cp/login', {
          email: this.email,
          password: this.password,
        });

        if (response.data.result === 'OK') {
          const authStore = useAuthStore();
          authStore.setAuthStatus('OK');
          this.$router.push('/cp/dashboard');
        } else if (response.data.result === 'error') {
          this.errors.general = response.data.message || 'Something went wrong. Please try again.';
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.errors.general = 'Something went wrong. Please try again later.';
      }
    },

    redirectToRegister() {
      this.$router.push('/cp/registration');
    },

    isValidEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
    },

  },
};
</script>

<style lang="less">
*,
*::before,
*::after {
  box-sizing: border-box; 
}
.login{

  &__container{
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  &__card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  }


  &__title{
    font-size: 32px;
    font-weight: bold;
    color: @black;
    margin-bottom: -15px;
  }

  &__subtitle{
    font-size: 14px;
    color: #555;
    margin-bottom: 24px;
  }

  &__form{
    margin-bottom: 16px;
    text-align: left;
  }

}
.form {
  box-sizing: border-box;
  &__group{
    margin-bottom: 16px;
    text-align: left;
  }

  &__label{
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: @black;
  }

  &__input{
    width: 100%;
    padding: 12px;  
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;  
    outline: none;

    &:focus{
      border-color: @blue2;
      box-shadow: 0 0 4px rgba(74, 144, 226, 0.5);
    }
  }

  &__forgot-password {
  display: block;
  font-size: 12px;
  color: #4a90e2;
  text-align: right;
  margin-top: 4px;
  text-decoration: none;

  &:hover{
    text-decoration: underline;
  }

  
}
}
.btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 12px;
}

.btn-primary {
  background-color: @blue2;
  color: @white;
  border: none;
  &:hover{
    background-color: @blue2;
  }
}

.btn-secondary {
  background-color: @white;
  color: @blue2;
  border: 2px solid @blue2;
  &:hover{
    background-color: @blue2;
    color: @white;
  }
}

.form__general-error {
  color: #d9534f; 
  background-color: #f8d7da;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

</style>
