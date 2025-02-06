<template>
  <div class="trial">
    <div class="trial__container">
      <div class="trial__card">
        <h1 class="trial__title">Request Trial</h1>
        <p class="trial__subtitle">Submit the form to get full-featured SDK</p>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>

        <form class="trial__form" @submit.prevent="handleTrial" novalidate>

          <div class="form__group">
            <label class="form__label">Platform:</label>
            <div class="radio-group">
              <div class="radio-column">
                <label v-for="(option, index) in platforms.slice(0, Math.ceil(platforms.length / 2))" :key="option" class="radio-item">
                  <input 
                    type="radio" 
                    :value="option" 
                    v-model="selectedPlatforms" 
                    :disabled="isSubscribed(option)" 
                  >
                  {{ option }}
                  <span v-if="isSubscribed(option)" class="already-subscribed">(Already subscribed)</span>
                </label>
              </div>
              <div class="radio-column">
                <label v-for="(option, index) in platforms.slice(Math.ceil(platforms.length / 2))" :key="option" class="radio-item">
                  <input 
                    type="radio" 
                    :value="option" 
                    v-model="selectedPlatforms" 
                    :disabled="isSubscribed(option)" 
                  >
                  {{ option }}
                  <span v-if="isSubscribed(option)" class="already-subscribed">(Already subscribed)</span>
                </label>
              </div>
            </div>
            <p v-if="errors.selectedPlatforms" class="form__error">{{ errors.selectedPlatforms }}</p>
          </div>


          <div class="form__group">
            <label class="form__label">SDK:</label>
            <div class="checkbox-group">
              <label v-for="option in SDK" :key="option" class="checkbox-item">
                <input type="checkbox" v-model="selectedSDK" :value="option"> {{ option }}
              </label>
            </div>
            <p v-if="errors.selectedSDK" class="form__error">{{ errors.selectedSDK }}</p>
          </div>


          <div class="form__group">
            <label class="form__label" for="end-users">Estimate of your users on this platform</label>
            <select id="end-users" v-model="endUsers" class="form__input" :class="{'input-error': errors.endUsers}" required>
              <option disabled value="">Select</option>
              <option><100</option>
              <option>100-1,000</option>
              <option>1,000-10,000</option>
              <option>10,000-50,000</option>
              <option>>50,000</option>
            </select>
            <p v-if="errors.endUsers" class="form__error">{{ errors.endUsers }}</p>
          </div>

          <div class="form__group">
            <label class="form__label" for="project">Project Description</label>
            <textarea id="project" v-model="projectDescription" class="form__input textarea" rows="4"></textarea>
          </div>

          <div class="form__actions">
            <button type="submit" class="btn btn-trial">Get Free Trial</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      endUsers: '',
      selectedPlatforms: [],
      selectedSDK: [],
      projectDescription: '',
      errors: {},
      platforms: ['Web', 'Android', 'iOS', 'Win', 'Mac', 'Linux'],
      SDK: [
        'Video SDK (Blur/Replace/Remove Background, Smart Zoom, Auto Framing, Beautification, Sharpness and more)',
        'Audio SDK (Noise Cancellation)'
      ],
      subscriptions: [], 
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.endUsers) this.errors.endUsers = "Select number of end users";
      if (this.selectedPlatforms.length === 0) this.errors.selectedPlatforms = "Select at least one platform";
      if (this.selectedSDK.length === 0) this.errors.selectedSDK = "Select at least one SDK";
    },

    async handleTrial() {
      this.validateForm();
      if (Object.keys(this.errors).length > 0) return;

      const payload = {
        endUsers: this.endUsers,
        platforms: this.selectedPlatforms,
        SDK: this.selectedSDK,
        projectDescription: this.projectDescription
      };

      try {
        const response = await this.$axios.post('/api/cp/get-free-trial', payload);

        console.log(response)
          
        if (response.data.result === 'OK') {
          this.$router.push('/');
        } else if (response.data.result === 'error') {
          this.errors.general = response.data.message || 'Something went wrong. Please try again.';
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.errors.general = 'Something went wrong. Please try again later.';
      }
    },

    async fetchSubscriptions() {
      try {
        const response = await this.$axios.get("/api/cp/products");
        if (response.data.result === "OK") {
          this.subscriptions = response.data.response;

          const subscribedPlatforms = this.subscriptions.map(sub => sub.platform.toLowerCase());
          this.selectedPlatforms = this.platforms.filter(platform => subscribedPlatforms.includes(platform.toLowerCase()));
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        this.errors.general = 'Failed to load your subscriptions. Please try again later.';
      }
    },

    isSubscribed(platform) {
      return this.subscriptions.some(sub => sub.platform.toLowerCase() === platform.toLowerCase());
    },

    handlePlatformChange(platform) {
      if (this.isSubscribed(platform)) {
        this.selectedPlatforms.push(platform);
      }
    }
  },
  created() {
    this.fetchSubscriptions();
  }
};
</script>

<style lang="less">
.trial {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  &__card {
    position: relative;
    background: @white;
    border-radius: 12px;
    padding: 32px;
    margin: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;

  }

  &__title {
    font-size: 32px;
    font-weight: bold;
    color: @black;
    margin:0;
  }
}

.form__group {
  margin-bottom: 16px;
}

.form__input{
  color: @black;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item input[type="checkbox"] {
  flex-shrink: 0;
}

.radio-group {
  display: flex;
  gap: 25px;
}

.radio-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form__input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.input-error {
  border-color: #e74c3c;
}

.form__error {
  color: #d9534f;
  font-size: 14px;
  margin-top: 5px;
  min-height: 18px;
  display: block;
}

.btn-trial {
  background-color: @blue2;
  color: white;
  border: 2px solid @blue2;
  &:hover{
    background-color: @blue2;
    color: @white;
    border: 2px solid @blue2;
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

}
</style>
