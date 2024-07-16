<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-4" color="black" dark>
            <v-card-title class="text-center">
              <span class="headline">Dollars Login</span>
            </v-card-title>
  
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  label="Username"
                  name="username"
                  solo
                  hide-details
                  class="mb-4"
                ></v-text-field>
  
                <v-text-field
                  v-model="password"
                  label="Password"
                  name="password"
                  type="password"
                  solo
                  hide-details
                  class="mb-4"
                ></v-text-field>
              </v-form>
            </v-card-text>
  
            <v-card-actions class="justify-center">
              <v-btn color="primary" @click="login" class="ma-2">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        // Handle login logic here
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        // Add your authentication logic here
      }
    }
  };
  </script>
  
  <style scoped>
  .fill-height {
    min-height: 100vh;
    background-color: #121212; /* Dark background */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .pa-4 {
    padding: 24px !important;
  }
  
  .text-center {
    text-align: center !important;
  }
  
  .mb-4 {
    margin-bottom: 16px !important;
  }
  
  .justify-center {
    justify-content: center !important;
  }
  
  .ma-2 {
    margin: 8px !important;
  }
  
  .headline {
    font-size: 24px;
    font-weight: 500;
    color: #90caf9; /* Light blue color */
  }
  </style>
  