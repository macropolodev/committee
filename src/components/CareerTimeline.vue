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
        <li v-for="(position, rowID) in member.career" :key="rowID" style="display:block;width:100%;margin:0" :data-rowID="rowID">
          <span style="display:block;text-align:center;color:#333"><strong>{{ position.org }}</strong></span>
          <div class="job-row" style="padding: 25px 0">
            <span style="padding-right:15px"><img class="gallery-image" :src="member.Headshot"></span>
            <div class="positions">
              <ul>
                <li v-for="(role, roleID) in position.roles" :key="roleID">
                  <span class="key">{{ formatYearString(position.start, position.end) }}</span>
                  <span class="value"><em>{{ role.title }}</em></span>
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
                  <span class="value"><em>{{ overlapObj.title }}</em></span>
                </li>
              </ul>
            </div>
          </div>
          {{ Object.values(position.roles) }}
          <div v-if="!Object.values(position.roles)">
            <ul v-if="position.overlaps" class="overlap-members">
              <overlap-member v-for="(overlap, key, index) in position.overlaps" :key="index"
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
          <div v-else></div>
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
      this.member.career.roles.forEach((role) => {
        role['has_rank'] = false
        if (role.title.includes('Rank')) {
          role.has_rank = true
        }
      })
      // const positions = this.member.career
      // for (var jobIndex in positions) {
      //   const overlapArr = positions[jobIndex].overlaps
      //   if (overlapArr) {
      //     let overlapObj = {}
      //     for (var oIndex in overlapArr) {
      //       const overlapMemberID = oIndex
      //       const overlapMemberPos = overlapArr[oIndex].title
      //       const overlapMemberOrg = positions[jobIndex].org
      //       const overlapMemberStart = overlapArr[oIndex].start
      //       const overlapMemberEnd = overlapArr[oIndex].end
      //       const overlapMemberObj = {
      //         'position': overlapMemberPos,
      //         'org': overlapMemberOrg,
      //         'start': overlapMemberStart,
      //         'end': overlapMemberEnd
      //       }
      //       if (overlapMemberID in overlapObj) {
      //         overlapObj[overlapMemberID].push(overlapMemberObj)
      //       } else {
      //         overlapObj[overlapMemberID] = [overlapMemberObj]
      //       }
      //     }
      //     this.member.career.positions[jobIndex].overlappingMembers = overlapObj
      //   } else {
      //     this.member.career.positions[jobIndex].overlappingMembers = false
      //   }
      //   console.log('this.member: ' + JSON.stringify(this.member))

      // }
    }
  },
  beforeMount () {
    this.getOverlaps(this.member)
  }
}
</script>
