<template>
 <div class="detail-wrapper timeline-wrapper small-header">
   <!--  <div class="middle">
      <img class="gallery-image" :src="member.Headshot">
      <div class="right">
        <h2 class="detail-header" v-text="language === 'EN' ? member.Name : member.姓名"></h2>
        <div style="font-size:0.8em">
          <span v-text="language === 'EN' ? member.Position : member.职务 "></span>
          (<span v-text="language === 'EN' ? member['Province of Employment'] : member['工作地点 （省份)']"></span>)
        </div>
      </div>
    </div> -->
    <div v-if="member.career" class="bottom">
      <ul class="member-timeline">
        <li v-for="(position, rowID) in member.career.positions" :key="rowID" style="display:block;width:100%;margin:0" :data-rowID="rowID">
          <span style="display:block;text-align:center;color:#333"><strong>{{ position.org }}</strong></span>
          <div class="job-row" style="padding: 25px 0">
            <span style="padding-right:15px"><img class="gallery-image" :src="member.Headshot"></span>
            <div class="positions">
              <ul>
                <li>
                  <span class="key">{{ formatYearString(position.yearStart, position.yearEnd) }}</span>
                  <span class="value"><em>{{ position.title }}</em></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="job-row active-colleague-display" style="display:flex" v-if="activeColleague && activeRow === rowID">
            <span style="display:flex;padding-right:15px"><img class="gallery-image colleague-image" :src="activeColleague.rowParams.Headshot" @click="$emit('change-active-member', activeColleague._id)" style="cursor:pointer" :title="activeColleague.rowParams.Name"></span>
            <div class="positions">
              <a href="#" class="colleague-name" @click.prevent="$emit('change-active-member', activeColleague._id)">{{ activeColleague.rowParams.Name }}</a>
              <ul>
                <li v-for="(overlapObj, index) in activeColleague.overlaps" :key="index">
                  <span class="key">{{ formatYearString(overlapObj.start, overlapObj.end) }}</span>
                  <span class="value"><em>{{ overlapObj.position }}</em></span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="!position.title.includes('Rank')">
            <ul v-if="position.overlappingMembers" class="overlap-members">
              <overlap-member v-for="(overlap, key, index) in position.overlappingMembers" :key="index"
                :allColleagues="allMembers"
                :colleagueID="key"
                :overlapObj="overlap"
                :language="language"
                :rowID="rowID"
                v-on:click-colleague="onClickColleague"
              ></overlap-member>
            </ul>
            <p v-else style="font-size:0.8em"><center>No overlapping members</center></p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="bottom">
      <p class="value text-center">No career timeline data available</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['allMembers', 'member', 'language'],
  data () {
    return {
      activeColleague: false,
      activeRow: null
    }
  },
  methods: {
    onClickColleague (colleague, obj, rowID) {
      console.log(colleague)
      console.log(obj)
      this.activeColleague = colleague
      this.activeColleague.overlaps = obj
      this.activeRow = rowID
    },
    getOverlaps (member) {
      if (!this.member.career) { return false }
      const positions = this.member.career.positions
      for (let i = 0; i < positions.length; i++) {
        const overlapArr = positions[i].overlappingMemberIds
        if (overlapArr.length > 0) {
          let overlapObj = {}
          for (let j = 0; j < overlapArr.length; j++) {
            const singleOverlap = overlapArr[j].split('&&')
            const overlapMemberID = singleOverlap[0]
            const overlapMemberPos = singleOverlap[1]
            const overlapMemberOrg = singleOverlap[2]
            const overlapMemberStart = singleOverlap[3]
            const overlapMemberEnd = singleOverlap[4]
            const overlapMemberObj = {
              'position': overlapMemberPos,
              'org': overlapMemberOrg,
              'start': overlapMemberStart,
              'end': overlapMemberEnd
            }
            if (overlapMemberID in overlapObj) {
              overlapObj[overlapMemberID].push(overlapMemberObj)
            } else {
              overlapObj[overlapMemberID] = [overlapMemberObj]
            }
          }
          this.member.career.positions[i].overlappingMembers = overlapObj
        } else {
          this.member.career.positions[i].overlappingMembers = false
        }
      }
    }
  },
  beforeMount () {
    this.getOverlaps(this.member)
  }
}
</script>
