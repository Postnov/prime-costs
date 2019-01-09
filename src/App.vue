<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/Login">Войти</router-link>
    </div> -->
    <router-view/>
    <notifications group="foo" position="bottom left" />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  box-sizing: border-box;
}

body * {
  box-sizing: inherit;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

button,
input {
  outline: none;
}

.close-btn {
  position: absolute;
  top: 50px;
  right: 40px;
  font-size: 23px;
  border: none;
  color: #666;
  display: block;
}

.form-label {
    margin: 10px;
    position: relative;
    display: block;
    width: 100%;
}
.sign-up {
    margin-top: 40px;
    text-align: center;
}

.form-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}


@import '../~font-awesome/css/font-awesome.min.css';
</style>
