<template>
  <div class="reset-password">
    <div class="reset-password__container">
      <div class="reset-password__card">

        <h1 class="reset-password__title">Reset Password</h1>
        <p class="reset-password__subtitle">Enter your new password below</p>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>

        <form class="reset-password__form" @submit.prevent="handleResetPassword" novalidate>
          <div class="form__group">
            <label class="form__label" for="password">New Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="New Password" 
              required 
              class="form__input"
              :class="{'input-error': errors.password}"
            />
            <span v-if="errors.password" class="form__error">{{ errors.password }}</span>
          </div>
          <div class="form__group">
            <label class="form__label" for="confirm-password">Confirm Password</label>
            <input 
              id="confirm-password"
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              required 
              class="form__input"
              :class="{'input-error': errors.confirmPassword}"
            />
            <span v-if="errors.confirmPassword" class="form__error">{{ errors.confirmPassword }}</span>
          </div>
          
          <button type="submit" class="btn btn-primary">Reset Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      errors: {},
    };
  },
  methods: {
    async handleResetPassword() {
      this.errors = {};
      
      if (!this.password) {
        this.errors.password = 'Password is required';
      } else if (this.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters';
      }
      
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password';
      } else if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword = 'Passwords do not match';
      }
      
      if (Object.keys(this.errors).length > 0) {
        return;
      }
      
      try {
        await this.$axios.post('/api/cp/reset-password', {
          password: this.password,
          password_confirmation: this.confirmPassword,
          token: this.$route.params.token, 
          email: this.$route.query.email, 
        });

        this.$router.push('/cp/login');

      } catch (error) {
        this.errors.general = error.response?.data?.message || 'Something went wrong. Please try again later.';
      }
    },
  },
};
</script>

<style lang="less">
.reset-password {
  &__container {
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

  &__title {
    font-size: 32px;
    font-weight: bold;
    color: @black;
    margin-bottom: -5px;
    margin-top: 0;
  }

  &__subtitle {
    font-size: 14px;
    color: #555;
    margin-bottom: 15px;
  }

  &__form {
    text-align: left;
  }
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;

  &.alert-success {
    background-color: #e6f9f0;
    color: #28a745;
    border: 1px solid #c3e6cb;
  }
}
</style>
