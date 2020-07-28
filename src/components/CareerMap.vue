<template>
 <div class="detail-wrapper timeline-wrapper small-header">
    <div class="middle">
      <img class="gallery-image" :src="member.Headshot">
      <div class="right">
        <h2 class="detail-header" v-text="language === 'EN' ? member.Name : member.姓名"></h2>
        <div class="value">
          <span v-text="language === 'EN' ? member.Position : member.职务 "></span>
          (<span v-text="language === 'EN' ? member['Province of Employment'] : member['工作地点 （省份)']"></span>)
        </div>
      </div>
    </div>
    <div class="bottom">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/China_Blank_Map_with_Province_Names.svg">
    </div>
  </div>
</template>

<script>
export default {
  props: ['member', 'language'],
  data () {
    return {}
  },
  methods: {}
}
</script>
