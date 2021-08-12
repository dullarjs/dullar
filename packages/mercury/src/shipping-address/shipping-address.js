/*
 * @Author: Just be free
 * @Date:   2021-07-27 13:32:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-06 18:26:27
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
// genComponentName
export default defineComponent({
  name: "ShippingAddress",
  props: {
    sources: Array,
  },
  data() {
    return {
      currentTab: "",
      provinces: "请选择",
      provincesArr: [],
      cities: "",
      citiesArr: [],
      districts: "",
      districtsArr: [],
      streets: "",
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
    },
    getData(parentId, attr) {
      this[`${attr}Arr`] = [];
      this.processedSources[attr].forEach((area) => {
        if (area.parent_id === parentId) {
          this[`${attr}Arr`].push(area);
        }
      });
    },
    clearTab(index = -1) {
      const arr = Object.keys(this.processedSources);
      if (index > -1) {
        arr.forEach((a, i) => {
          if (i >= index) {
            this[a] = "";
          }
        });
      }
    },
    handleItemClick(option) {
      if (option.region_type === "1") {
        if (this.provinces === option.region_name) {
          this.currentTab = "";
          return;
        }
        this.clearTab(parseInt(option.region_type) - 1);
        this.provinces = option.region_name;
        this.citiesArr = [];
        this.getData(option.region_id, "cities");
        if (this.citiesArr.length > 0) {
          this.cities = "请选择";
        }
        this.currentTab = "cities";
      } else if (option.region_type === "2") {
        if (this.cities === option.region_name) {
          this.currentTab = "";
          return;
        }
        this.clearTab(parseInt(option.region_type) - 1);
        this.cities = option.region_name;
        this.districtsArr = [];
        this.getData(option.region_id, "districts");
        if (this.districtsArr.length > 0) {
          this.districts = "请选择";
        }
        this.currentTab = "districts";
      } else if (option.region_type === "3") {
        if (this.districts === option.region_name) {
          this.currentTab = "";
          return;
        }
        this.clearTab(parseInt(option.region_type) - 1);
        this.districts = option.region_name;
        this.streetsArr = [];
        this.getData(option.region_id, "streets");
        if (this.streetsArr.length > 0) {
          this.streets = "请选择";
        } else {
          this.streets = "";
        }
        this.currentTab = "streets";
      } else if (option.region_type === "4") {
        this.streets = option.region_name;
        this.currentTab = "";
      }
    },
  },
  render(h) {
    return h("div", { class: ["yn-shipping-address"] }, [
      h("div", { class: ["address-selection"] }, [
        h("ul", {}, [
          Array.apply(null, Object.keys(this.processedSources)).map(
            (attr, index) => {
              return h(
                "li",
                {
                  attrs: { "data-index": index, "data-name": attr },
                  class: [index !== 0 && this[attr] === "" ? "hide" : ""],
                },
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
