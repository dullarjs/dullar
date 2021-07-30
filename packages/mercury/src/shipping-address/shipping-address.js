/*
 * @Author: Just be free
 * @Date:   2021-07-27 13:32:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-30 14:08:08
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
// import Tabs from "../tabs";
// import TabItem from "../tab-item";
// genComponentName
export default defineComponent({
  name: "ShippingAddress",
  // components: { Tabs, TabItem },
  props: {
    sources: Array,
  },
  data() {
    return {
      currentTab: "",
      provinces: "请选择",
      provincesArr: [],
      cities: "请选择",
      citiesArr: [],
      districts: "请选择",
      districtsArr: [],
      streets: "请选择",
      streetsArr: [],
    };
  },
  computed: {
    processedSources() {
      let provinces = [];
      let cities = [];
      let districts = [];
      let streets = [];
      if (Array.isArray(this.sources) && this.sources.length > 0) {
        this.sources.forEach((area) => {
          if (area.region_type === "1") {
            provinces.push(area);
          } else if (area.region_type === "2") {
            cities.push(area);
          } else if (area.region_type === "3") {
            districts.push(area);
          } else if (area.region_type === "4") {
            streets.push(area);
          }
        });
        return {
          provinces,
          cities,
          districts,
          streets,
        };
      }
    },
  },
  methods: {
    handleSwitchTab(tab) {
      this.currentTab = tab;
      if (tab === "provinces") {
        this.provincesArr = this.processedSources.provinces;
      }
      console.log("tab", tab);
    },
    getCities(parentId) {
      this.citiesArr = [];
      this.processedSources.cities.forEach((city) => {
        if (city.parent_id === parentId) {
          this.citiesArr.push(city);
        }
      });
    },
    getDistricts(parentId) {
      this.districtsArr = [];
      this.processedSources.districts.forEach((district) => {
        if (district.parent_id === parentId) {
          this.districtsArr.push(district);
        }
      });
    },
    getStreets(parentId) {
      this.streetsArr = [];
      this.processedSources.streets.forEach((street) => {
        if (street.parent_id === parentId) {
          this.streetsArr.push(street);
        }
      });
    },
    handleItemClick(option) {
      console.log(option);
      if (option.region_type === "1") {
        this.provinces = option.region_name;
        this.getCities(option.region_id);
      } else if (option.region_type === "2") {
        this.cities = option.region_name;
        this.getDistricts(option.region_id);
      } else if (option.region_type === "3") {
        this.districts = option.region_name;
        this.getStreets(option.region_id);
      } else if (option.region_type === "4") {
        this.streets = option.region_name;
        this.currentTab = "";
      }
    },
  },
  render(h) {
    // console.log("dddd", this.processedSources.provinces);
    // console.log(Object.keys(this.processedSources));
    return h("div", { class: ["yn-shipping-address"] }, [
      h("div", { class: ["address-selection"] }, [
        h("ul", {}, [
          Array.apply(null, Object.keys(this.processedSources)).map(
            (attr, index) => {
              return h(
                "li",
                { attrs: { "data-index": index, "data-name": attr } },
                [
                  h(
                    "span",
                    {
                      class: [
                        "label",
                        this.currentTab === attr ? "active" : "",
                      ],
                      on: {
                        click: this.handleSwitchTab.bind(this, attr),
                      },
                    },
                    [this[attr]]
                  ),
                  h(
                    "div",
                    {
                      class: ["result", this.currentTab === attr ? "" : "hide"],
                    },
                    Array.apply(null, this[`${attr}Arr`]).map((option, key) => {
                      return h(
                        "span",
                        {
                          class: ["option"],
                          key,
                          on: {
                            click: this.handleItemClick.bind(this, option),
                          },
                        },
                        option.region_name
                      );
                    })
                  ),
                ]
              );
            }
          ),
        ]),
      ]),
    ]);
  },
});
