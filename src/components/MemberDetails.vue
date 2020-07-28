<template>
  <div class="detail-wrapper">
    <div class="middle">
      <img class="gallery-image" :src="member.Headshot">
      <div class="right">
        <h2 class="detail-header" v-text="language === 'EN' ? member.Name : member.姓名"></h2>
        <span class="leadership-positions value">{{ createLeadershipString(member) }}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="three-col">
        <div>
          <div class="key" v-text="language === 'EN' ? 'Age' : '年龄' "></div>
          <div class="value">{{ member.Age }}</div>
        </div>
        <div>
          <div class="key" v-text="language === 'EN' ? 'Gender' : '性别' "></div>
          <div class="value" v-text="language === 'EN' ? member.Gender : member.性别 "></div>
        </div>
         <div>
          <div class="key" v-text="language === 'EN' ? 'Ethnicity' : '民族' "></div>
          <div class="value" v-text="language === 'EN' ? member.Ethnicity : member.民族 "></div>
        </div>
      </div>
      <ul>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Position' : '职务' "></div>
          <div class="value" v-text="language === 'EN' ? member.Position : member.职务 "></div>
        </li>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Previous Position' : '前职务' "></div>
          <div class="value" v-text="language === 'EN' ? member['Previous Position'] : member.前职务 "></div>
        </li>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Rank' : '领导职务层次' "></div>
          <div class="value" v-text="language === 'EN' ? member.Rank : member.领导职务层次 "></div>
        </li>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Place of Ancestry' : '籍贯' "></div>
          <div class="value" v-text="language === 'EN' ? member['Place of Ancestry'] : member.籍贯 "></div>
        </li>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Province of Employment' : '工作地点 （省份)' "></div>
          <div class="value" v-text="language === 'EN' ? member['Province of Employment'] : member['工作地点 （省份)'] "></div>
        </li>
        <li>
          <div class="key" v-text="language === 'EN' ? 'Sector of Employment' : '工作单位' "></div>
          <div class="value" v-text="language === 'EN' ? member['Sector of Employment'] : member.工作单位 "></div>
        </li>
      </ul>
    </div>
    <div class="timeline"></div>
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
