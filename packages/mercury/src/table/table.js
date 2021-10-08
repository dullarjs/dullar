/*
 * @Author: yegl
 * @Date: 2021-08-05 10:13:59
 * @Last Modified by: yegl
 * @Last Modified time: 2021-10-03 16:49:48
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { deepClone } from "../modules/utils/deepClone";
import Checkbox from "../checkbox";
export default defineComponent({
  name: "Table",
  components: {
    Checkbox,
  },
  props: {
    bordered: {
      type: Boolean | String,
      default: false,
    },
    columns: {
      type: Array,
      default: [],
    },
    rowSelection: {
      type: Object,
      default: null,
    },
    dataSource: {
      type: Array,
      default: [],
    },
    pagination: {
      type: Object,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    okText: {
      type: String,
      default: "确定",
    },
    resetText: {
      type: String,
      default: "重置",
    },
    emptyText: {
      type: String,
      default: "这里什么都没有",
    },
    emptyContent: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    iconType: {
      type: String,
      default: "tripleBounce",
    },
    iconSize: {
      type: Number,
      default: 36,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    checkBoxSize: {
      type: Number,
      default: 14,
    },
    tableSize: {
      type: String,
      default: "default",
    },
    setting: {
      type: Object,
      default: null,
    },
    iconColor: String,
  },
  data() {
    return {
      selectAll: false,
      fieldsList: [], // 将数据列
      serializaThead: [], // 序列化之后的渲染顺序 每一行一个数据维度
      nextSerializaThead: [], // 下一步需要序列化的表头
      filterContent: [], // 头部列搜索是否显示
      dropDownInfo: {}, // 显示的搜索的列数据
      dropDownElement: null,
      resetDisabled: true,
      tableKey: "-v",
      dropDownInfoSelectRows: [], // 当前选中下拉框的选中值
      dataList: [], // 当前列表数据
      selectedRows: [], // 多选
      selectedRow: -1, // 单选
      selectedRowDatas: [],
      fixed: { top: false },
      clientRect: { top: 0 },
      pageInfoObj: {},
      randNum: null,
      currentPageKeys: [],
      dropDownTitle: "", // 当前显示的搜索列的title
      tableSizeLIst: {
        default: "default-size",
        middle: "middle-size",
        small: "small-size",
        none: "none-size",
      },
    };
  },
  created() {
    this.dataList = this.dataSource;
    this.pageInfoObj = this.pagination;
    // 头部序列变化
    this.serializationThead();
    this.setSelectRowKeys();
  },
  computed: {
    theadStyle() {
      const top = this.clientRect.top;
      return {
        transform: `translate3d(0px, ${this.fixed.top ? -top : 0}px, 1px)`,
        "border-top": "1px solid #e4e4e4",
      };
    },
  },
  watch: {
    dataList: "setPagination",
    dataSource: "getNewDataList",
    "clientRect.top": function (val) {
      this.fixed.top = val < 0;
    },
    columns: "serializationThead",
  },
  mounted() {
    document.addEventListener("click", this.dropDownListener);
    document
      .getElementById(`yn-table-${this.randNum}`)
      .addEventListener("scroll", this.scrollHandle, {
        capture: false,
        passive: true,
      });
  },
  beforeDestroy() {
    document.removeEventListener("click", this.dropDownListener);
    document.removeEventListener("scroll", this.scrollHandle);
  },
  methods: {
    dropDownListener(e) {
      const offsetParent =
        e.target && e.target.offsetParent && e.target.offsetParent.className;
      const patentsList = [
        "yn-dropdown",
        "yn-dropdown-menu",
        "yn-table-filter-trigger",
        "yn-table-cell",
        "yn-button yn-button-default yn-button-small yn-button-disable",
        "yn-button yn-button-default yn-button-small",
      ];
      if (
        !this.$el.contains(e.target) ||
        patentsList.indexOf(offsetParent) < 0
      ) {
        this.initDropDownList();
      }
    },
    setPagination() {
      if (this.pageInfoObj) {
        const dataList = this.dataList;
        this.pageInfoObj.defaultCurrent =
          this.pageInfoObj.total === dataList.length
            ? this.pageInfoObj.defaultCurrent
            : 1;
        this.pageInfoObj.total = dataList.length;
        this.$refs["yn-pagination"].totalPage = Math.ceil(
          dataList.length / this.pageInfoObj.defaultPageSize
        );
        this.$refs["yn-pagination"].page = this.pageInfoObj.defaultCurrent;
      }
    },
    scrollHandle(e) {
      // const top = document.getElementById(`yn-table-thead-${this.randNum}`).offsetTop
      this.clientRect.top = Math.floor(0 - parseInt(e.target.scrollTop));
    },
    initDropDownList() {
      this.checkDropDownChage();
      this.dropDownInfo = {};
      this.resetDisabled = true;
      this.dropDownInfoSelectRows = [];
      const dropDownTitle = this.dropDownTitle;
      if (dropDownTitle) {
        const _dropDownModal = document.getElementById(
          "yn-table-dropdown-container" + dropDownTitle
        );
        _dropDownModal.style.display = "none";
      }
    },
    serializationThead() {
      const columns = deepClone(this.columns);
      if (columns.length < 1) return false;
      //产生随机数
      const randNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .sort(() => Math.random() - 0.5)
        .join("");
      this.tableKey += randNum;
      this.randNum = randNum;
      this.getTheadRenderObj(columns);
    },
    getTheadRenderObj(nextSerializaThead = [], serializaThead = []) {
      let nextRow = [],
        row = [];
      nextSerializaThead.forEach((item) => {
        if (!item.children || (item.children && item.children.length === 0)) {
          item.parents && this.setSerializaTheadCell(item, serializaThead);
        } else {
          let parentsPosition = {
            [item.title]: [serializaThead.length, row.length],
          };
          if (item.parents) {
            parentsPosition = { ...item.parents, ...parentsPosition };
          }
          const newChildren = item.children.map((element) => {
            element.parents = parentsPosition;
            return element;
          });
          nextRow = [...nextRow, ...newChildren];
        }
        row.push({
          ...item,
          children: [],
          key: item.key && item.key.toString(),
        });
      });
      serializaThead.push(row);
      if (nextRow.length > 0) {
        this.getTheadRenderObj(nextRow, serializaThead);
      } else {
        this.serializaThead = serializaThead;
        this.fieldsList = this.setFieldsList();
      }
    },
    setFieldsList() {
      let list = [];
      this.serializaThead.length > 0 &&
        this.serializaThead[0].forEach((item) => {
          item.key =
            (item.key && item.key.toString()) || list.length.toString();
          if (item.children.length > 0) {
            list = [...list, ...item.children];
          } else {
            list.push(item);
          }
        });
      return list;
    },
    setSerializaTheadCell(child = {}, serializaThead = []) {
      for (let key in child.parents) {
        const postion = child.parents[key];
        if (
          serializaThead[postion[0]] &&
          serializaThead[postion[0]][postion[1]] &&
          serializaThead[postion[0]][postion[1]].title === key
        ) {
          let cell = serializaThead[postion[0]][postion[1]];
          cell.children.push(child);
        }
      }
    },
    // table 头部
    getThead(h) {
      const header = [];
      const serializaThead = this.serializaThead;
      serializaThead.length > 0 &&
        serializaThead.forEach((element, ind) => {
          header.push(h("tr", {}, [this.renderTheadRow(element, ind, h)]));
        });
      return header;
    },
    checkResetDisabled() {
      if (Object.keys(this.dropDownInfo).length > 0) {
        const { filters } = this.dropDownInfo;

        let selectRowNums = 0;
        filters.forEach((item) => {
          if (item.checked) {
            selectRowNums += 1;
          }
        });
        this.resetDisabled = selectRowNums === 0;
      }
    },
    showDropDownFun(key, title) {
      const h = this.$createElement;
      const dropDownTitle = this.dropDownTitle;
      if (dropDownTitle) {
        const _oldDropDownModal = document.getElementById(
          "yn-table-dropdown-container" + dropDownTitle
        );
        _oldDropDownModal.style.display = "none";
      }
      const columnName = key;
      const _dropDownModal = document.getElementById(
        "yn-table-dropdown-container" + title
      );
      const columnInfo = {};
      for (let item of this.fieldsList) {
        if (columnName === item.key) {
          columnInfo.filters = item.filters;
          columnInfo.onFilter = item.onFilter ? item.onFilter : null;
          columnInfo.key = item.key;
          break;
        }
      }

      _dropDownModal.style.display = "block";
      this.dropDownInfoSelectRows = deepClone(columnInfo.filters);
      this.dropDownInfo = { ...columnInfo };
      this.dropDownTitle = title;
      this.filterContent = this.getDropDowmList(h);
      this.checkResetDisabled();
    },
    // table头单元格
    renderTheadCell(column, h) {
      // 暂时只支持搜索，需要其他功能之后再说
      if (column.filters) {
        return h("div", { class: ["yn-table-filter-column"] }, [
          column.required && h("i", { class: ["yn-table-required"] }, ["*"]),
          h("span", { class: ["yn-table-column-title"] }, [column.title]),
          h(
            "span",
            {
              class: ["yn-table-filter-trigger"],
              attrs: { "column-key": column.key },
            },
            [
              h(
                genComponentName("iconfont"),
                {
                  directives: [{ value: true }],
                  props: {
                    size: 12,
                    name: "search",
                  },
                  on: {
                    click: () => this.showDropDownFun(column.key, column.title),
                  },
                },
                []
              ),

              h(
                "div",
                {
                  class: ["yn-dropdown"],
                  style: { diplay: "none" },
                  attrs: { id: "yn-table-dropdown-container" + column.title },
                },
                [
                  h("div", { class: ["yn-table-filter-dropdown"] }, [
                    h("ul", { class: ["yn-dropdown-menu"] }, [
                      ...this.filterContent,
                    ]),
                    h("div", { class: ["yn-table-filter-dropdown-btns"] }, [
                      h(
                        genComponentName("button"),
                        {
                          props: {
                            disabled: this.resetDisabled,
                            size: "small",
                          },
                        },
                        [
                          h(
                            "span",
                            { on: { click: this.reset.bind(this, h) } },
                            [this.resetText]
                          ),
                        ]
                      ),
                      h(
                        genComponentName("button"),
                        {
                          props: {
                            type: "primary",
                            size: "small",
                          },
                        },
                        [
                          h(
                            "span",
                            { on: { click: () => this.checkDropDownChage } },
                            [this.okText]
                          ),
                        ]
                      ),
                    ]),
                  ]),
                ]
              ),
            ]
          ),
        ]);
      } else {
        return column.required
          ? [h("i", { class: ["yn-table-required"] }, ["*"]), column.title]
          : column.title;
      }
    },
    // 头部行
    renderTheadRow(list, ind, h) {
      const row = [];
      const serializaThead = this.serializaThead;
      if (
        ind === 0 &&
        this.rowSelection &&
        this.rowSelection.type &&
        (this.rowSelection.type === "checkbox" ||
          this.rowSelection.type === "radio")
      ) {
        row.push(
          h(
            "th",
            {
              class: ["yn-table-cell", "yn-table-selection-column"],
              attrs: { rowspan: serializaThead.length },
            },
            [
              this.rowSelection.type === "checkbox"
                ? h(
                    genComponentName("checkbox"),
                    {
                      props: {
                        checked: this.selectAll,
                        size: this.checkBoxSize,
                      },
                      on: {
                        change: this.onSelectAll,
                      },
                    },
                    []
                  )
                : "",
            ]
          )
        );
      }
      list.forEach((item) => {
        const _obj = {};
        if (item.children.length === 0) {
          _obj.rowspan = serializaThead.length - ind;
        } else {
          _obj.colspan = item.children.length;
          _obj.textCenter = item.children.length > 1;
        }
        row.push(
          h(
            "th",
            {
              class: ["yn-table-cell", _obj.textCenter ? "text-center" : ""],
              style: { width: !_obj.textCenter ? item.width + "px" : "" },
              attrs: { ..._obj },
            },
            [this.renderTheadCell(item, h)]
          )
        );
      });
      return row;
    },
    getDropDowmList(h) {
      const list = [];
      const dropDownInfo = this.dropDownInfo;
      Object.keys(dropDownInfo).length > 0 &&
        dropDownInfo.filters &&
        dropDownInfo.filters.forEach((item, ind) => {
          list.push(
            h("li", { class: ["yn-dropdown-menu-item"] }, [
              h("span", { class: ["yn-dropdown-menu-title-content"] }, [
                h(
                  "label",
                  {
                    class: ["yn-checkbox-wrapper"],
                    on: { click: this.filtersChecked.bind(this, ind, h) },
                  },
                  [
                    h(
                      genComponentName("checkbox"),
                      {
                        props: {
                          checked: item.checked || false,
                          size: 20,
                        },
                      },
                      []
                    ),
                  ]
                ),
                h("span", { attrs: { title: item.text } }, [item.text]),
              ]),
            ])
          );
        });
      return list;
    },
    filtersChecked(checkboxKey, h) {
      this.dropDownInfo.filters[checkboxKey].checked =
        !this.dropDownInfo.filters[checkboxKey].checked;
      const dropDownInfo = this.dropDownInfo;
      for (let item of this.fieldsList) {
        if (dropDownInfo.key === item.key) {
          item.filters = dropDownInfo.filters;
          break;
        }
      }
      this.filterContent = this.getDropDowmList(h);
      this.checkResetDisabled();
    },
    reset(h) {
      const dropDownInfo = this.dropDownInfo;
      dropDownInfo.filters.forEach((item) => {
        item.checked = false;
      });
      for (let item of this.fieldsList) {
        if (dropDownInfo.key === item.key) {
          item.filters = dropDownInfo.filters;
          break;
        }
      }
      this.resetDisabled = true;
      this.filterContent = this.getDropDowmList(h);
    },
    // 初始化表格数据
    checkDropDownChage() {
      const oldDropDownInfoSelectRows = this.dropDownInfoSelectRows;
      const dropDownInfo = this.dropDownInfo;
      const dropDownInfoSelectRows = [];
      dropDownInfo.filters &&
        dropDownInfo.filters.forEach((item, ind) => {
          const checked = item.checked || false;
          const _checked = oldDropDownInfoSelectRows[ind].checked || false;
          if (
            _checked !== checked &&
            item.value === oldDropDownInfoSelectRows[ind].value
          ) {
            dropDownInfoSelectRows.push("false");
          }
        });
      dropDownInfoSelectRows.length > 0 && this.getNewDataList();
    },
    getNewDataList() {
      const dataList = [];
      const dataSource = this.dataSource;
      // 首先获取检索列
      const filterList = this.getFilterList();

      for (let i = 0, j = dataSource.length; i < j; i++) {
        let addList = true;
        const record = dataSource[i];
        if (!record.key) record.key = i;
        filterList.forEach((item) => {
          if (item.onFilter && typeof item.onFilte === "function") {
            addList =
              addList && item.onFilter(item.checkedList, record) === true;
          } else {
            addList =
              addList && item.checkedList.indexOf(record[item.dataIndex]) > -1;
          }
        });
        addList && dataList.push(record);
      }
      this.dataList = dataList;
    },
    getStartAndEndRow() {
      const pageInfoObj = this.pageInfoObj;
      const dataListLength = this.dataList.length;
      const result = {};
      if (pageInfoObj) {
        let defaultCurrent, defaultPageSize;
        defaultCurrent = pageInfoObj.defaultCurrent || 1;
        defaultPageSize = pageInfoObj.defaultPageSize || 10;
        result.start = (defaultCurrent - 1) * defaultPageSize;
        const end = defaultPageSize * defaultCurrent;
        result.end = end > dataListLength ? dataListLength : end;
      } else {
        result.start = 0;
        result.end = dataListLength;
      }
      return result;
    },
    initTableRows() {
      const h = this.$createElement;
      const rowContent = [];
      const currentPageKeys = [];
      const dataList = this.dataList;
      const tableRows = this.getStartAndEndRow();

      for (let i = tableRows.start; i < tableRows.end; i++) {
        if (!dataList[i].key) dataList[i].key = i;
        currentPageKeys.push(dataList[i].key);
        rowContent.push(
          h("tr", { class: ["yn-table-row"] }, [
            this.renderFieldList(dataList[i]),
          ])
        );
      }
      this.currentPageKeys = currentPageKeys;

      // 为空的时候
      if (currentPageKeys.length === 0) {
        let _emptyContent;
        _emptyContent = this.emptyContent ? this.emptyContent : this.emptyText;
        rowContent.push(
          h("tr", { class: ["yn-table-empty-row"] }, [
            h(
              "td",
              { class: [], attrs: { colspan: this.fieldsList.length + 2 } },
              [_emptyContent]
            ),
          ])
        );
      }

      return rowContent;
    },
    renderFieldList(rowDatas) {
      const h = this.$createElement;
      const fieldsList = this.fieldsList;
      const fieldContentList = [];

      if (
        this.rowSelection &&
        this.rowSelection.type &&
        (this.rowSelection.type === "checkbox" ||
          this.rowSelection.type === "radio")
      ) {
        fieldContentList.push(
          h(
            "td",
            {
              class: ["yn-table-cell", "yn-table-selection-column"],
              on: {
                click: this.onSelectedRows.bind(
                  this,
                  rowDatas,
                  this.rowSelection.type
                ),
              },
              attrs: { "row-key": rowDatas.key },
            },
            [
              this.rowSelection.type === "checkbox"
                ? h(
                    genComponentName("checkbox"),
                    {
                      props: {
                        checked: this.selectedRows.indexOf(rowDatas.key) > -1,
                        size: this.checkBoxSize,
                      },
                    },
                    []
                  )
                : h(
                    genComponentName("radiobox"),
                    {
                      props: {
                        checked: this.selectedRow === rowDatas.key,
                        size: this.checkBoxSize,
                      },
                    },
                    []
                  ),
            ]
          )
        );
      }

      fieldsList.forEach((item) => {
        const value = item.dataIndex ? rowDatas[item.dataIndex] : "";
        let _content;
        if (item.renderVNode) {
          _content = item.renderVNode;
        } else if (item.render || item.editable) {
          _content = this.renderCell(item, value, rowDatas);
        } else {
          _content = value;
        }
        fieldContentList.push(
          h("td", { class: ["yn-table-cell"] }, [_content])
        );
      });
      return fieldContentList;
    },
    renderCell(column, value, record) {
      // 首先将数据序列化分层
      const h = this.$createElement;
      if (column.editable && column.editable === true) {
        return h("div", { class: ["yn-editable-cell-value-wrap"] }, [
          h(
            "input",
            {
              attrs: { value: value },
              domProps: {
                value: value,
              },
              on: {
                change: (e) => this.onHandleChage(e, value, record, column),
              },
            },
            []
          ),
        ]);
      } else {
        const renderList = column.render;
        const _noed = renderList.compentName
          ? genComponentName(renderList.compentName)
          : renderList.tagName || "";
        if (renderList.on) {
          const _on = this.getBoundEvent(renderList.on, value, record);
          _on.listeners = this.$listeners;
          return h(
            _noed,
            {
              style: renderList.style || {},
              on: _on,
              attrs: renderList.attrs || {},
              props: renderList.props || {},
            },
            [this.serializationColumnList(renderList.content, value, record)]
          );
        } else {
          return h(
            _noed,
            {
              style: renderList.style || {},
              attrs: renderList.attrs || {},
              props: renderList.props || {},
            },
            [this.serializationColumnList(renderList.content, value, record)]
          );
        }
      }
    },
    onHandleChage(e, value, record, column) {
      let resetValue = e.target.value;
      // 判断是否有前置校验
      if (column.beforeChage) {
        const reseult = column.beforeChage(resetValue, record, column);
        e.target.value = resetValue = reseult === true ? resetValue : value;
        record[column.dataIndex] = e.target.value;
        reseult === true &&
          this.$emit(column.onchange, resetValue, record, column);
      } else {
        this.$emit(column.onchange, resetValue, record, column);
      }
    },
    serializationColumnList(content, value, record) {
      const contentList = [];
      const h = this.$createElement;
      content &&
        content.length > 0 &&
        content.forEach((item) => {
          const _noed = item.compentName
            ? genComponentName(item.compentName)
            : item.tagName || "";
          let _tag;
          if (typeof item === "string") {
            _tag = item;
          } else if (
            typeof item === "object" &&
            item !== null &&
            item.setContent
          ) {
            _tag = item.setContent(value, record, h);
          } else if (typeof item === "object" && item !== null && _noed) {
            if (item.on) {
              const _on = this.getBoundEvent(item.on, value, record);
              _tag = h(
                _noed,
                {
                  style: item.style || {},
                  on: { ..._on },
                  attrs: item.attrs || {},
                  props: item.props || {},
                },
                [
                  item.content &&
                    this.serializationColumnList(item.content, value, record),
                ]
              );
            } else {
              _tag = h(
                _noed,
                {
                  style: item.style || {},
                  attrs: item.attrs || {},
                  props: item.props || {},
                },
                [
                  item.content &&
                    this.serializationColumnList(item.content, value, record),
                ]
              );
            }
          }
          contentList.push(_tag);
        });
      const result = contentList.length > 0 ? contentList : "";
      return result;
    },
    getBoundEvent(list, value, record) {
      const _on = {};
      for (const key in list) {
        _on[key] = (e) => this.$emit(list[key], { e, value, record });
      }
      return _on;
    },
    getFilterList() {
      const fieldSList = this.fieldsList;
      const filterList = [];
      fieldSList.forEach((item) => {
        let checked = false;
        const checkedList = [];
        item.filters &&
          item.filters.forEach((element) => {
            checked = checked || element.checked || false;
            element.checked && checkedList.push(element.value);
          });
        checked && filterList.push({ ...item, checkedList });
      });
      return filterList;
    },
    onSelectAll(checked) {
      let selectedRows = [];
      const currentPageKeys = this.currentPageKeys;
      this.selectAll = checked;
      if (checked) {
        selectedRows = [...currentPageKeys];
      }
      this.selectedRows = selectedRows;
      const rowSelection = this.rowSelection;
      rowSelection.onChange && rowSelection.onChange(selectedRows);
    },
    setSelectRowKeys() {
      if (
        this.rowSelection &&
        this.rowSelection.selectedRowKeys &&
        this.rowSelection.type
      ) {
        if (this.rowSelection.type === "radio") {
          const key = this.rowSelection.selectedRowKeys[0];
          this.selectedRow = key;
        }
        if (this.rowSelection.type === "checkbox") {
          this.selectedRows = [...this.rowSelection.selectedRowKeys];
        }
      }
    },
    onSelectedRows(rowDatas, checkType) {
      const selectedRows = this.selectedRows;
      const ind = selectedRows.indexOf(rowDatas.key);
      const rowSelection = this.rowSelection;
      if (checkType === "radio") {
        this.selectedRow = rowDatas.key;
        rowSelection.onChange && rowSelection.onChange(rowDatas.key);
        return;
      }
      if (ind > -1) {
        selectedRows.splice(ind, 1);
      } else {
        selectedRows.push(rowDatas.key);
      }
      this.selectAll = selectedRows.length === this.currentPageKeys.length;
      rowSelection.onChange && rowSelection.onChange(selectedRows);
    },
    handlePageSizeChange(pageSize) {
      this.pageInfoObj.defaultPageSize = pageSize;
    },
    handlePageChange(page) {
      if (this.pageInfoObj.defaultCurrent !== page) {
        this.selectedRows = [];
      }
      this.pageInfoObj.defaultCurrent = page;
    },
  },
  render(h) {
    const tableStyle = this.height
      ? { "max-height": this.height + "px", overflow: "scroll" }
      : "";
    const {
      pageInfoObj,
      loading,
      hideHeader,
      tableSize,
      tableSizeLIst,
      bordered,
      setting,
    } = this;
    const sizeClass = tableSizeLIst[tableSize] || "";
    const borderClass =
      bordered === true
        ? "yn-table-bordered"
        : bordered === "none"
        ? ""
        : "yn-table-b-b";
    const {
      thead: { style: thStyle = {}, className: thClassName = "" } = {},
      tbody: { style: tbStyle = {}, className: tbClassName = "" } = {},
    } = setting || {};
    return h(
      "div",
      {
        class: ["yn-table-wrapper"],
      },
      [
        h("div", { class: ["yn-spin-container", sizeClass] }, [
          h(
            "div",
            {
              attrs: { id: `yn-table-${this.randNum}` },
              class: ["yn-table", borderClass],
              style: tableStyle,
            },
            [
              h("div", { class: ["yn-table-container"] }, [
                h("table", { style: { "table-layout": "auto" } }, [
                  !hideHeader &&
                    h(
                      "thead",
                      {
                        attrs: { id: `yn-table-thead-${this.randNum}` },
                        class: ["yn-table-thead", thClassName],
                        style: { ...this.theadStyle, ...thStyle },
                      },
                      [this.getThead(h)]
                    ),
                  h(
                    "tbody",
                    {
                      class: ["yn-table-tbody", tbClassName],
                      style: { ...tbStyle },
                    },
                    [this.initTableRows()]
                  ),
                ]),
              ]),
            ]
          ),
          pageInfoObj &&
            h(genComponentName("pagination"), {
              props: pageInfoObj,
              on: {
                pageSizeChange: this.handlePageSizeChange,
                pageChange: this.handlePageChange,
              },
              class: ["yn-table-pagination"],
              ref: `yn-pagination`,
            }),

          loading &&
            h("div", { class: ["yn-table-loading"] }, [
              h(
                genComponentName("spin"),
                {
                  class: ["loading"],
                  props: {
                    type: this.iconType,
                    size: this.iconSize,
                    color: this.iconColor,
                  },
                },
                []
              ),
            ]),
        ]),
      ]
    );
  },
});
