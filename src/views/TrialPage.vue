<template>
  <div class="trial">
    <div class="trial__container">
      <div class="trial__card">
        <h1 class="trial__title">Get Free Trial</h1>
        <p class="trial__subtitle">Submit the form to get full-featured SDK packages and Pricing:</p>

        <div v-if="errors.general" class="form__general-error">
          {{ errors.general }}
        </div>

        <form class="trial__form" @submit.prevent="handleTrial" novalidate>

          <div class="form__group">
            <label class="form__label" for="end-users">Number of End Users</label>
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
            <label class="form__label">Platform:</label>
            <div class="checkbox-group">
              <label v-for="option in platforms" :key="option" class="checkbox-item">
                <input type="checkbox" v-model="selectedPlatforms" :value="option"> {{ option }}
              </label>
            </div>
            <p v-if="errors.selectedPlatforms" class="form__error">{{ errors.selectedPlatforms }}</p>
          </div>

          <!-- Features Selection -->
          <div class="form__group">
            <label class="form__label">Features:</label>
            <div class="checkbox-group">
              <label v-for="option in features" :key="option" class="checkbox-item">
                <input type="checkbox" v-model="selectedFeatures" :value="option"> {{ option }}
              </label>
            </div>
            <p v-if="errors.selectedFeatures" class="form__error">{{ errors.selectedFeatures }}</p>
          </div>

          <div class="form__group">
            <label class="form__label" for="project">Project Description</label>
            <textarea id="project" v-model="projectDescription" class="form__input textarea" rows="4"></textarea>
          </div>

          <div class="form__actions">
            <button type="submit" class="btn btn-trial">Get Demo SDK and Pricing</button>
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
      selectedFeatures: [],
      projectDescription: '',
      errors: {},
      platforms: ['Web', 'Android', 'iOS', 'Win', 'Mac', 'Linux'],
      features: [
        'Blur/Replace/Remove Background', 'Smart Zoom', 'Auto Framing',
        'Beautification', 'Sharpness', 'Low Light', 'Color Correction',
        'Lower Thirds', 'Layouts', 'Objects (Emoji)', 'Overlays', 'Noise Remover'
      ]
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.endUsers) this.errors.endUsers = "Select number of end users";
      if (this.selectedPlatforms.length === 0) this.errors.selectedPlatforms = "Select at least one platform";
      if (this.selectedFeatures.length === 0) this.errors.selectedFeatures = "Select at least one feature";
    },

    async handleTrial() {
      this.validateForm();
      if (Object.keys(this.errors).length > 0) return;

      const payload = {
        endUsers: this.endUsers,
        platforms: this.selectedPlatforms,
        features: this.selectedFeatures,
        projectDescription: this.projectDescription
      };

      try {
        const response = await this.$axios.post('/api/cp/get-free-trial', payload);
          
        if (response.data.result === 'OK') {
          this.$router.push('/');
        } else if (response.data.result === 'error') {
          this.errors.general = response.data.message || 'Something went wrong. Please try again.';
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.errors.general = 'Something went wrong. Please try again later.';
      }
    }
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.checkbox-item {
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
