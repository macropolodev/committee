<template>
  <div id="app" class="committee-app">
    <div class="container-fluid">
      <!-- <ul>
        <b>Active Filters</b><br>
        <li>Organizations: {{ filterOptions.Organizations.active }}</li><br>
        <li>Gender: {{ filterOptions.Gender.active }}</li><br>
      </ul> -->
      <div class="results-search-container">
        <div class="results"><span class="num-results">{{ filteredMembers.length }} results</span></div>
        <a v-if="isMobile" class="btn-reset mobile-filter-toggle" :class="mobileFilterIsOpen ? 'open' : ''" title="Filters" aria-label="open filter menu" @click="toggleMobileFilter()">
          <img v-if="mobileFilterIsOpen" src="./assets/close.svg">
          <img v-else src="./assets/filter.svg">
        </a>
        <div class="search">
           <span class="search-close" v-if="searchText != '' && !isMobile"><button class="btn-reset btn-reset-search" @click="resetSearch()">X</button></span>
          <form action="" method="get" :class="searchIsActive ? 'search-form search-is-active' : 'search-form'">
            <input id="input-search" type="search" placeholder="search..." v-model="searchText" :class="searchIsActive ? 'search-is-active' : 'search-field'">
            <select class="search-select" size="0" v-model="searchCriteria">
              <option value="name (姓名)">Name (姓名)</option>
              <option value="position (职务)">Position (职务)</option>
            </select>
            <img class="chevron" src="./assets/caret.svg">
          </form>
        </div>
      </div>
      <ul id="committee-filter-menu" class="committee-dropdown-menu" :class="mobileFilterIsOpen ? 'open' : ''">
        <li class="filter-menu-group has-submenu">
         <a class="slideout-trigger">
            <label class="filter-menu-fieldname-label">Age</label>
            <div class="filter-menu-fieldname">
              <span>{{ ageRange | formatAgeRange() }}</span>
              <img class="caret" src="./assets/caret.svg" alt="down caret icon">
            </div>
          </a>
          <div class="filter-menu-submenu-positioner">
            <ul class="filter-menu-submenu">
              <li class="filter-menu-submenu-item slider">
                <vue-slider ref="slider" v-model="ageRange" v-bind="sliderOptions" @drag-end="editFilter('Age')"></vue-slider>
                <button class="btn-reset btn-reset-age" @click="resetAge()">Reset</button>
              </li>
            </ul>
          </div>
        </li>
        <li v-for="(filter, key, index) in filterOptions" class="filter-menu-group has-submenu" :key="index">
          <a class="slideout-trigger">
            <label class="filter-menu-fieldname-label">{{ key }}</label>
            <div class="filter-menu-fieldname">
              <span>{{ filter.active }}</span>
              <img class="menu-caret" src="./assets/caret.svg" alt="down caret icon">
            </div>
          </a>
          <div class="filter-menu-submenu-positioner">
            <ul class="filter-menu-submenu">
              <li v-for="(option, idx) in filter.options" class="filter-menu-submenu-item" @click="editFilter(key, option)" :key="idx">{{ option }}</li>
            </ul>
          </div>
        </li>
        <li class="reset-container" style=""><button class="btn-reset" @click="resetFilters()">Clear All</button></li>
      </ul>
    </div>
    <div id="gallery">
      <p v-if="!filteredMembers.length"><center>No results for selected filters</center></p>
      <p v-if="isLoading" class="loading-gif"><center><img src="https://macropolodev.wpengine.com/wp-content/themes/macropolo/assets/images/loading.gif"></center></p>
      <ul class="gallery-grid" v-if="!isLoading">
        <li class="gallery-item" v-for="member in filteredMembers" :id="member.rowParams.member_id" :key="member._id">
          <a href="#" class="gallery-item-link" v-on:click.prevent="memberClick(member._id)">
            <div class="gallery-item-inner">
              <img class="gallery-image" :src="member.rowParams.Headshot">
              <!-- <img class="gallery-image" src="https://macropolo.org/wp-content/uploads/2017/09/An-Zhaoqing.jpg"> -->
            </div>
            <div class="gallery-description">
              <h2 class="gallery-title">{{ member.rowParams.Name }}</h2>
              <h2 class="gallery-title Chinese">{{ member.rowParams.姓名 }}</h2>
              <span></span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div class="detail-overlay" :class="{ open: popupIsOpen }">
      <div class="detail-popup">
        <div class="top">
          <a v-if="browsingHistory.length > 1" class="btn-back" href="#previous" v-on:click.prevent="backClick()" title="Back">
            &lsaquo;
          </a>
          <label v-if="activePanel == 1" for="langugage-select">Language:</label>
          <select v-if="activePanel == 1" id="language-select" v-model="language">
            <option class="option-english" value="EN">English</option>
            <option class="option-chinese" value="CN">中文</option>
          </select>
          <div class="top-active-member" v-if="activePanel !== 1">
            <img class="gallery-image small" :src="activeMember.Headshot">
            <span v-text="(language === 'EN') ? activeMember.Name : activeMember.姓名"></span>
          </div>
          <div class="close" v-on:click="closePopup()" title="Close">
            <img src="./assets/close.svg">
          </div>
        </div>
        <ul id="popup-navigation" class="nav nav-tabs">
          <li role="presentation" :class="{ active: activePanel === 1 }"><a href="#snapshot" v-on:click.prevent="clickPopupNavigation(1)">Snapshot</a></li>
          <li role="presentation" :class="{ active: activePanel === 2 }"><a href="#timeline" v-on:click.prevent="clickPopupNavigation(2)" v-text="(isMobile) ? 'Career' : 'Career Timeline & Overlaps'"></a></li>
          <!-- <li role="presentation" :class="{ active: activePanel === 3 }"><a href="#" v-on:click.prevent="clickPopupNavigation(3)">Career Map</a></li> -->
        </ul>
        <div class="member-panel-container">
          <div v-if="activePanel === 1" class="member-panel">
            <member-details
              :member="activeMember"
              :language="language">
            </member-details>
          </div>
          <div v-if="activePanel === 2" class="member-panel">
            <career-timeline
              :allMembers="allCommitteeMembers"
              :member="activeMember"
              :language="language"
              @change-active-member="memberClick"
            >
            ></career-timeline>
          </div>
         <!--  <div v-if="activePanel === 3" class="member-panel">
            <career-map
              :member="activeMember"
              :language="language"
            ></career-map>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'
import COMMITTEE_JSON from './assets/committee-members.json'
// import CAREER_JSON from './assets/ancillary-data.json'
import CAREER_JSON from './assets/new_career_data.json'

// re-usable constants
const WINDOW_WIDTH = document.querySelector('body').clientWidth
const ETHNICITIES = ['All', 'Bai', 'Buyei', 'Dai', 'Dong', 'Han', 'Hui', 'Kazakh', 'Korean', 'Manchu', 'Miao', 'Mongol', 'Naxi', 'Tibetan', 'Uyghur', 'Xibe', 'Yao', 'Yi', 'Zhuang']
const CN_PROVINCES = ['All', 'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou', 'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 'Inner Mongolia', 'Jiangsu', 'Jilin', 'Liaoning', 'Ningxia', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Taiwan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang']
const RANKS = ['All', 'National Leader', 'Deputy National Leader', 'Provincial-Ministerial Leader', 'Deputy Provincial-Ministerial Leader', 'Prefectural-Departmental Leader', 'County-Divisional Leader', 'General', 'Lieutenant General', 'Major General']
const SECTORS = ['All', 'County', 'GONGO', 'Military', 'Party', 'Prefecture', 'Private Company', 'Province', 'SOE', 'State']
let typingTimer

// get min and max age from data
let minAge = 100
let maxAge = 0
COMMITTEE_JSON.data.forEach((m) => {
  if (m.rowParams.Age < minAge) minAge = m.rowParams.Age
  if (m.rowParams.Age > maxAge) maxAge = m.rowParams.Age
})

export default {
  name: 'App',
  components: {
    VueSlider
  },
  data () {
    return {
      allCommitteeMembers: COMMITTEE_JSON.data,
      filteredMembers: COMMITTEE_JSON.data,
      activeMember: COMMITTEE_JSON.data[0].rowParams,
      isMobile: (WINDOW_WIDTH < 768),
      mobileFilterIsOpen: false,
      popupIsOpen: false,
      activePanel: 1,
      isLoading: true,
      searchIsActive: false,
      searchCriteria: 'name (姓名)',
      language: 'EN',
      searchText: '',
      browsingHistory: [],
      ageRange: [minAge, maxAge],
      filterOptions: {
        'Organizations': {
          options: ['All', 'Alternate Committee Member', 'Full Committee Member', 'Central Military Commission', 'Politburo', 'Politburo Standing Committee'],
          active: 'All',
          orgMatch: {
            'Politburo Standing Committee': 'Politburo Standing Committee / 中国共产党中央政治局常委会',
            'Central Military Commission': 'Central Military Commission / 中国共产党中央军事委员会',
            'Politburo': 'Politburo / 中国共产党中央政治局',
            'Full Committee Member': 'Full Committee Member / 中国共产党中央委员会委员',
            'Alternate Committee Member': 'Alternate Committee Member / 中国共产党中央委员会候补委员'
          }
        },
        'Gender': {
          options: ['All', 'Female', 'Male'],
          active: 'All'
        },
        'Ethnicity': {
          options: ETHNICITIES,
          active: 'All'
        },
        'Ancestry': {
          options: CN_PROVINCES,
          active: 'All'
        },
        'Rank': {
          options: RANKS,
          active: 'All'
        },
        'Location': {
          options: CN_PROVINCES,
          active: 'All'
        },
        'Sector': {
          options: SECTORS,
          active: 'All'
        }
      },
      sliderOptions: {
        dotSize: 14,
        width: 'auto',
        height: 14,
        contained: false,
        direction: 'ltr',
        data: null,
        min: 45,
        max: 69,
        interval: 1,
        disabled: false,
        clickable: true,
        duration: 0.5,
        adsorb: false,
        lazy: false,
        useKeyboard: true,
        keydownHook: null,
        dragOnClick: false,
        enableCross: true,
        fixed: false,
        minRange: void 0,
        maxRange: void 0,
        order: true,
        marks: false,
        dotOptions: void 0,
        process: true,
        tooltip: 'none',
        dotStyle: void 0,
        railStyle: void 0,
        processStyle: void 0,
        tooltipStyle: void 0,
        stepStyle: void 0,
        stepActiveStyle: void 0,
        labelStyle: void 0,
        labelActiveStyle: void 0
      }
    }
  },
  methods: {
    editFilter (key, value) {
      this.isLoading = true
      if (key !== 'Age' && key !== 'Search') { // age filter is handled differently
        if (this.filterOptions[key].active === value) {
          // if filter value is clicked but already active, reset it to 'All'
          this.filterOptions[key].active = 'All'
        } else {
          // assign active filter value
          this.filterOptions[key].active = value
        }
      } else {
        // age slider or search has been adjusted
      }
      // execute filter
      this.executeFilter()

      if (this.isMobile) {
        this.closeMobileFilters()
      }
    },
    executeFilter () {
      // gather all filters and start a list from scratch
      const filters = this.filterOptions
      let filteredMembers = this.allCommitteeMembers
      // filter members by age
      const _ageRange = this.ageRange
      filteredMembers = filteredMembers.filter(function (member) {
        return (member.rowParams.Age >= _ageRange[0] && member.rowParams.Age <= _ageRange[1]) || member.rowParams.Age === 'Unknown'
      })
      // loop through all other filters
      for (const key in filters) {
        let value = filters[key].active
        // if this filter option is active... (!= All)
        if (filters[key].active !== 'All') {
          // trim the list by returning only members who match this filter value
          switch (key) {
            case 'Organizations':
              for (const org in filters.Organizations.orgMatch) {
                if (org === value) {
                  filteredMembers = filteredMembers.filter(function (member) {
                    const orgString = filters.Organizations.orgMatch[org]
                    return member.rowParams[orgString] === 'Y'
                  })
                }
              }
              break
            case 'Ancestry':
              filteredMembers = filteredMembers.filter(function (member) {
                return member.rowParams['Province of Ancestry'].toLowerCase() === filters[key].active.toLowerCase()
              })
              break
            case 'Location':
              filteredMembers = filteredMembers.filter(function (member) {
                return member.rowParams['Province of Employment'].toLowerCase() === filters[key].active.toLowerCase()
              })
              break
            case 'Sector':
              filteredMembers = filteredMembers.filter(function (member) {
                return member.rowParams['Sector of Employment'].toLowerCase() === filters[key].active.toLowerCase()
              })
              break
            default: // filter name is same as its key name
              filteredMembers = filteredMembers.filter(function (member) {
                return member.rowParams[key].toLowerCase() === filters[key].active.toLowerCase()
              })
              break
          }
        }
      }
      if (this.searchIsActive) {
        const searchStr = this.searchText.toLowerCase()
        if (this.searchCriteria === 'name (姓名)') {
          // perform search query on name
          console.log('searching for name...')
          filteredMembers = filteredMembers.filter(function (member) {
            const nameEN = member.rowParams.Name.toLowerCase()
            const nameCN = member.rowParams['姓名']
            return nameEN.includes(searchStr) || nameCN.includes(searchStr)
          })
        } else if (this.searchCriteria === 'position (职务)') {
          // perform search query on position
          console.log('searching for position...')
          filteredMembers = filteredMembers.filter(function (member) {
            const posEN = member.rowParams.Position.toLowerCase()
            const posCN = member.rowParams['职务']
            return posEN.includes(searchStr) || posCN.includes(searchStr)
          })
        }
      }
      console.log(filteredMembers)
      this.filteredMembers = filteredMembers
      setTimeout(() => {
        this.isLoading = false
      }, 250)
    },
    resetFilters () {
      this.isLoading = true
      this.ageRange = [45, 69]
      this.searchText = ''
      let _filterOptions = this.filterOptions
      for (const option in _filterOptions) {
        _filterOptions[option].active = 'All'
      }
      this.filterOptions = _filterOptions
      this.filteredMembers = this.allCommitteeMembers
      if (this.isMobile) {
        this.mobileFilterIsOpen = false
      }
      setTimeout(() => {
        this.isLoading = false
      }, 250)
    },
    resetSearch () {
      this.searchText = ''
      this.searchIsActive = false
      this.executeFilter()
    },
    resetAge () {
      this.ageRange = [minAge, maxAge]
      this.executeFilter()
    },
    selectCriteria () {
      console.log('search criteria')
    },
    memberClick (id) {
      const foundMember = this.allCommitteeMembers.find(element => element._id === id)
      if (this.popupIsOpen) {
        this.browsingHistory.push(this.activeMember)
      } else {
        this.browsingHistory = [COMMITTEE_JSON.data[0].rowParams]
      }
      this.activeMember = foundMember.rowParams
      this.activeMember.career = this.findMemberCareer(this.activeMember.member_id)
      this.activePanel = 1
      this.popupIsOpen = true
      document.querySelector('body').classList.add('noscroll')
    },
    backClick () {
      // length is at least 2, ignore the first entry
      const len = this.browsingHistory.length
      this.activeMember = this.browsingHistory[len - 1]
      this.browsingHistory.pop()
      this.activePanel = 1
    },
    findMemberCareer (id) {
      console.log(CAREER_JSON.find(element => parseInt(element.id) === parseInt(id)))
      const career = CAREER_JSON.find(element => parseInt(element.id) === parseInt(id))
      return career['career']
    },
    toggleMobileFilter () {
      if (this.mobileFilterIsOpen === true) {
        this.mobileFilterIsOpen = false
      } else {
        this.mobileFilterIsOpen = true
      }
    },
    closeMobileFilters () {
      let submenus = document.querySelectorAll('li.filter-menu-group')
      submenus.forEach(el => {
        el.classList.remove('hovering')
      })
    },
    closePopup () {
      this.browsingHistory = []
      this.popupIsOpen = false
      document.querySelector('body').classList.remove('noscroll')
    },
    clickPopupNavigation (tab) {
      this.activePanel = tab
    }
  },
  watch: {
    searchText: function () {
      const textLength = this.searchText.length
      const searchText = this.searchText
      const timerInterval = 1000
      const self = this

      clearTimeout(typingTimer)
      typingTimer = setTimeout(function () {
        if (textLength >= 1 && searchText !== ' ') {
          self.searchIsActive = true
          self.editFilter('Search', searchText)
        } else if (textLength === 0) {
          self.searchIsActive = false
          self.executeFilter()
        } else {
          console.log("don't know what to do here")
        }
      }, timerInterval)
    },
    searchCriteria: function () {
      if (this.searchIsActive === true) {
        this.editFilter('Search', this.searchText)
      }
    }
  },
  filters: {
    formatAgeRange (ageRange) {
      if (ageRange[0] === minAge && ageRange[1] === maxAge) {
        return 'All'
      } else {
        return ageRange[0] + ' - ' + ageRange[1]
      }
    }
  },
  created () {
    setTimeout(() => {
      this.isLoading = false
    }, 0)
    console.log(CAREER_JSON)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir Medium', 'Nunito', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  font-size: 18px;
  margin: 50px auto;
  width: 1070px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}
@media screen and (max-width:768px) {
  #app { width: 100%; }
}
</style>
