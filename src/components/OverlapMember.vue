<template>
  <li class="overlap-member">
    <a v-on:click.prevent="$emit('click-colleague', activeColleague, overlapObj, rowID)" href="#">
      <img class="gallery-image" :src="activeColleague.rowParams.Headshot" :title="activeColleague.rowParams.Name">
    </a>
  </li>
</template>

<script>
export default {
  props: ['allColleagues', 'colleagueID', 'overlapObj', 'language', 'rowID'],
  data () {
    return {
      colleagueArr: [],
      activeColleague: {}
    }
  },
  beforeMount () {
    this.activeColleague = this.allColleagues.find((member) => member.rowParams.member_id === parseInt(this.colleagueID))
  },
  methods: {}
}
</script>
