<template>
  <div class="registration">
    <div class="registration__container">

      <div class="registration__card">

        <!-- <div class="registration__svg-container">
          <SvgOrangeWaves class="SvgOrangeWaves" />
          <SvgYellowWaves class="SvgYellowWaves" />
          <SvgBlueStain class="SvgBlueStain" />
        </div> -->

        <h1 class="registration__title">Join us today!</h1>
        <p class="registration__subtitle">Create your account to get started</p>

        <form class="registration__form" @submit.prevent="handleRegistration" novalidate>
          <div class="form__grid">
            <div class="form__group">
              <label class="form__label" for="name">Name</label>
              <input id="name" v-model="name" type="text" class="form__input" placeholder="Your Name" required :class="{'input-error': errors.name}" />
              <span v-if="errors.name" class="form__error">{{ errors.name }}</span>
            </div>

            <div class="form__group">
              <label class="form__label" for="email">Business Email</label>
              <input id="email" v-model="email" type="email" class="form__input" placeholder="Your Email" required :class="{'input-error': errors.email}"/>
              <span v-if="errors.email" class="form__error">{{ errors.email }}</span>
            </div>

            <div class="form__group">
              <label class="form__label" for="company">Company</label>
              <input id="company" v-model="company" type="text" class="form__input" placeholder="Your Company's Name" required :class="{'input-error': errors.company}"/>
              <span v-if="errors.company" class="form__error">{{ errors.company }}</span>
            </div>

            <div class="form__group">
              <label class="form__label" for="website">Website</label>
              <input id="website" v-model="website" type="text" class="form__input" placeholder="Your Company's Website" />
            </div>


            <div class="form__group">
              <label class="form__label" for="password">Password</label>
              <input id="password" v-model="password" type="password" class="form__input" placeholder="Your Password" required :class="{'input-error': errors.password}"/>
              <span v-if="errors.password" class="form__error">{{ errors.password }}</span>
            </div>

            <div class="form__group">
              <label class="form__label" for="password-confirm">Password Confirmation</label>
              <input id="password-confirm" v-model="passwordConfirm" type="password" class="form__input" placeholder="Confirm Your Password" required :class="{'input-error': errors.passwordConfirm}"/>
              <span v-if="errors.passwordConfirm" class="form__error">{{ errors.passwordConfirm }}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-regist">Create account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SvgBlueStain from '@/components/icons/SvgBlueStain.vue';
import SvgOrangeWaves from '@/components/icons/SvgOrangeWaves.vue';
import SvgYellowWaves from '@/components/icons/SvgYellowWaves.vue';
import { useAuthStore } from '@/stores/AuthStore.js';

export default {
  name: 'Registration',
  components: {
    SvgBlueStain,
    SvgOrangeWaves,
    SvgYellowWaves,
  },
  data() {
    return {
      name: '',
      email: '',
      company: '',
      website: '',
      password: '',
      passwordConfirm: '',
      errors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.name) {
        this.errors.name = "Name is required";
      }
      if (!this.company) {
        this.errors.company = "Company's name is required";
      }
      if (!this.email) {
        this.errors.email = "Email is required";
      } else if (!this.validEmail(this.email)) {
        this.errors.email = "Email is invalid";
      }
      if (!this.password) {
        this.errors.password = "Password is required";
      } else if (this.password.length < 8) {
        this.errors.password = "Password must be at least 8 characters";
      }
      if (this.passwordConfirm !== this.password) {
        this.errors.passwordConfirm = "Passwords do not match";
      }
    },

    validEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
    },

    async handleRegistration() {
      this.validateForm();     
      // if (Object.keys(this.errors).length === 0) {
      //   alert("Form submitted successfully!");
      //   this.$router.push('/dashboard');
      // }

      if (Object.keys(this.errors).length > 0) {
        return;
      }

      try {
        const payload = {
          name: this.name,
          email: this.email,
          company: this.company,
          website: this.website,
          password: this.password
        };

        const response = await this.$axios.post('/api/cp/register', payload);

        if (response.data.result === 'OK') {
          const authStore = useAuthStore();
          authStore.setAuthStatus('OK');
          this.$router.push('/cp/dashboard');
        } else if (response.data.result === 'error') {
          this.errors.general = response.data.message || "Something went wrong. Please try again.";
        }
      } catch (error) {
        console.error("An error occurred:", error);
        this.errors.general = "Something went wrong. Please try again later.";
      }
    },
  },
};
</script>

<style lang="less">
.registration {
  &__container {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  &__card {
    position: relative;
    background: @white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-size: 32px;
    font-weight: bold;
    color: @black;
    margin-bottom: -10px;
  }

  &__subtitle {
    font-size: 16px;
    color: #555;
    margin-bottom: 24px;
  }

  &__form {
    text-align: left;
  }
}

.form {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__group {
    margin-bottom: 10px;

    &--area{
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: @black;
  }

  &__input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;

    &:focus {
      border-color: #4a90e2;
      box-shadow: 0 0 4px rgba(74, 144, 226, 0.5);
    }

    &.textarea{
      resize: vertical;
    }
  }
}

.btn-regist {
  margin-top: 30px;
  background-color: @blue2;
  color: white;
  border: 2px solid @blue2;
  &:hover{
    background-color: @blue2;
    color: @white;
    border: 2px solid @blue2;
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
  color: white;
  border: 2px solid @blue2;
  &:hover{
    background-color: @blue2;
    color: @white;
    border: 2px solid @blue2;
  }
}

.btn-secondary {
  background-color: @white;
  color: @blue2;
  border: 2px solid @blue2;
  &:hover{
    background-color: @blue2;
    color: @white;
    border: 2px solid @blue2;
  }
}


.SvgBlueStain {
  position: absolute;
  top: -30px;
  left: -30px;
  width: 160px;
  height: auto;
}

.SvgOrangeWaves {
  position: absolute;
  top: -20px;
  right: -60px;
  width: 150px;
  height: auto;
}

.SvgYellowWaves {
  position: absolute;
  bottom: -20px;
  left: -90px;
  width: 150px;
  height: auto;
}

.form__error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
}

.input-error {
  border-color: #e74c3c;
}
</style>
