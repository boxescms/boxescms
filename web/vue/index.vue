<template lang="pug">

</template>

<script>
import api from '../library/api'

export default {
  name: 'index',
  async created () {
    console.log('here')
    const pages = await api.get('admin/pages')
  }
}
</script>
