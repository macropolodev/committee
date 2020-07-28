// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MemberDetails from './components/MemberDetails'
import CareerTimeline from './components/CareerTimeline'
import OverlapMember from './components/OverlapMember'
import CareerMap from './components/CareerMap'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import './assets/css/bootstrap.min.css'
import './assets/css/custom.css'
import './assets/css/style-updated-6-28-2020.css'
import './assets/css/committee.css'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    createLeadershipString (member) {
      let leadershipStr = ''
      if (member['Full Committee Member / 中国共产党中央委员会委员'] === 'Y') {
        if (this.language === 'EN') {
          leadershipStr += 'Full Committee Member'
        } else {
          leadershipStr += '中国共产党中央委员会委员'
        }
      }
      if (member['Alternate Committee Member / 中国共产党中央委员会候补委员'] === 'Y') {
        if (this.language === 'EN') {
          leadershipStr += 'Alternate Committee Member'
        } else {
          leadershipStr += '中国共产党中央委员会候补委员'
        }
      }
      if (member['Central Military Commission / 中国共产党中央军事委员会'] === 'Y') {
        if (this.language === 'EN') {
          leadershipStr += ', Central Military Commission'
        } else {
          leadershipStr += ', 中国共产党中央军事委员会'
        }
      }
      if (member['Politburo / 中国共产党中央政治局'] === 'Y') {
        if (this.language === 'EN') {
          leadershipStr += ', Politburo'
        } else {
          leadershipStr += ', 中国共产党中央政治局'
        }
      }
      if (member['Politburo Standing Committee / 中国共产党中央政治局常委会'] === 'Y') {
        if (this.language === 'EN') {
          leadershipStr += ', Politburo Standing Committee'
        } else {
          leadershipStr += ', 中国共产党中央政治局常委会'
        }
      }
      return leadershipStr
    },
    formatYearString (start, end) {
      if (end === 'Present' && this.language === 'CN') {
        end = '现'
      }
      return (start === end) ? start : start + ' - ' + end
    }
  }
})

Vue.component('member-details', MemberDetails)
Vue.component('career-timeline', CareerTimeline)
Vue.component('overlap-member', OverlapMember)
Vue.component('career-map', CareerMap)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App, VueSlider, MemberDetails, CareerTimeline, CareerMap },
  template: '<App/>'
})

// FILTER MENU HOVER
let menuGroups = document.querySelectorAll('.filter-menu-group.has-submenu')
menuGroups.forEach(el => {
  el.addEventListener('mouseover', () => {
    el.classList.add('hovering')
  })
  el.addEventListener('mouseout', () => {
    el.classList.remove('hovering')
  })
})
