<template>
  <div class="reset-password">
    <div class="reset-password__container">
      <div class="reset-password__card">

        <h1 class="reset-password__title">Forgot Password</h1>
        <p class="reset-password__subtitle">
          Enter your email below and we’ll send you instructions to reset your password.
        </p>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>

        <form class="reset-password__form" @submit.prevent="handleSendResetEmail" novalidate>
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
  data() {
    return {
      email: "",
      errors: {},
      successMessage: "",
    };
  },
  methods: {
    async handleSendResetEmail() {
      this.errors = {};
      this.successMessage = "";

      if (!this.email) {
        this.errors.email = "Email is required.";
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = "Please enter a valid email.";
      }

      if (Object.keys(this.errors).length > 0) {
        return; 
      }

      try {
        const response = await this.$axios.post("/api/cp/forgot-password", {
          email: this.email,
        });

        if (response.data.result === "OK") {
          this.successMessage = "Instructions have been sent to your email.";
          this.email = "";
          setTimeout(() => {
            this.$router.push("/cp/login"); // Перенаправление через 5 секунд
          }, 5000);
        } else {
          this.errors.general =
            response.data.message || "Something went wrong. Please try again.";
        }
      } catch (error) {
        console.error("Error sending reset email:", error);
        this.errors.general =
          "An unexpected error occurred. Please try again later.";
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
