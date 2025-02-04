<template>
  <div class="forgot-password">
    <div class="forgot-password__container">
      <div class="forgot-password__card">

        <h1 class="forgot-password__title">Forgot Password</h1>
        <p class="forgot-password__subtitle">
          Enter your email below and we’ll send you instructions to reset your password.
        </p>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>

        <form class="forgot-password__form" @submit.prevent="handleForgotPassword" novalidate>
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

          <button type="submit" class="btn btn-primary">
            Send Reset Instructions
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup(){
    const getToken = async () =>{
      await axios.get('/sanctum/csrf-cookie')
    }
  },
  data() {
    return {
      email: "",
      errors: {},
      successMessage: "",
    };
  },
  methods: {
    async handleForgotPassword() {
      this.errors = {};
      this.successMessage = "";

      if (!this.isValidEmail(this.email)) {
        this.errors.email = "Please enter a valid email address.";
        return;
      }

      try {
        // await getToken();
        const response = await this.$axios.post("api/cp/forgot-password", {
          email: this.email
        });

        if (response.data.status) {
          this.successMessage = "Reset instructions have been sent to your email.";
          this.email = "";
        }
      } catch (error) {
        this.errors.general = error.response?.data?.message || "An error occurred. Please try again.";
      }
    },


    isValidEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
    },
  },
};
</script>

<style lang="less">
.forgot-password {
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
