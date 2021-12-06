/*
 * @Author: yegl
 * @Date: 2021-08-05 10:13:59
 * @Last Modified by: yegl
 * @Last Modified time: 2021-12-02 13:44:14
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { deepClone } from "../modules/utils/deepClone";
import { on, off } from "../modules/event";
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
      default: "没有找到任何记录",
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
    keyName: {
      type: String,
      default: "",
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
      dropDownStyle: {},
      dropDownElement: null,
      resetDisabled: true,
      tableKey: "-v",
      dropDownInfoSelectRows: [], // 当前选中下拉框的选中值
      dataList: [], // 当前列表数据
      selectedRows: [],
      selectedRowDatas: [],
      currentPageData: [], // 当前页数据，仅存在可选表格时
      pageInfoObj: {},
      randNum: null,
      dropDownTitle: "", // 当前显示的搜索列的title
      tableSizeList: {
        default: "default-size",
        middle: "middle-size",
        small: "small-size",
        none: "none-size",
      },
      minWidth: 0,
      defaultCellLeft: 0,
    };
  },
  created() {
    this.dataList = this.dataSource;
    this.pageInfoObj = this.pagination;
    // 头部序列变化
    this.serializationThead();
    this.getDefaultCellLeft();
  },
  watch: {
    dataList: "setPagination",
    dataSource: "getNewDataList",
    columns: "serializationThead",
    "rowSelection.selectedRowKeys": "setSelectRowKeys",
    "pageInfoObj.defaultPageSize": "setPagination",
  },
  methods: {
    getDefaultCellLeft() {
      const { tableSize } = this;
      switch (tableSize) {
        case "default":
          this.defaultCellLeft = 16;
          break;
        case "middle":
          this.defaultCellLeft = 12;
          break;
        default:
          this.defaultCellLeft = 8;
          break;
      }
    },
    dropDownListener(e) {
      const { dropDownStyle = {} } = this;
      const parentNode = this.$el.querySelector(".yn-dropdown");
      const isSearchNode =
        e.target.attributes &&
        e.target.attributes.iconname &&
        e.target.attributes.iconname.value === "search";
      if (
        !parentNode.contains(e.target) &&
        Object.keys(dropDownStyle).length > 0 &&
        !isSearchNode
      ) {
        this.initDropDownList();
        off(document, "click", this.dropDownListener);
      }
    },
    setPagination() {
      if (this.pageInfoObj) {
        const { dataList, pageInfoObj } = this;
        const { defaultPageSize, total, defaultCurrent } = pageInfoObj || {};
        const totalPage = Math.ceil(dataList.length / defaultPageSize);
        const oldTotalPage = Math.ceil(total / defaultPageSize);
        pageInfoObj.defaultCurrent =
          (totalPage === oldTotalPage && defaultCurrent < totalPage
            ? defaultCurrent
            : defaultCurrent > totalPage
            ? totalPage
            : defaultCurrent) || 1;
        pageInfoObj.total = dataList.length;
      }
    },
    initDropDownList() {
      this.checkDropDownChage();
      this.dropDownInfo = {};
      this.dropDownStyle = {};
      this.resetDisabled = true;
      this.dropDownInfoSelectRows = [];
      off(
        document.getElementById(`yn-table-${this.randNum}`),
        "scroll",
        this.setDDCoordinate
      );
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
    getCommonColgroup() {
      const { fieldsList, rowSelection } = this;
      let minWidth = 0;
      const h = this.$createElement;
      const colgroupList = [];

      if (rowSelection) {
        colgroupList.push(h("col", { style: { width: "50px" } }, []));
        minWidth += 50;
      }
      fieldsList.forEach((element) => {
        colgroupList.push(
          h(
            "col",
            { style: { width: !element.width ? "" : element.width + "px" } },
            []
          )
        );
        minWidth += element.width ? element.width : 100;
      });
      this.minWidth = minWidth;
      return h("colgroup", {}, [...colgroupList]);
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
    showDropDownFun(h, columnKey) {
      if (Object.keys(this.dropDownStyle).length > 0) {
        this.initDropDownList();
        off(document, "click", this.dropDownListener);
      } else {
        on(document, "click", this.dropDownListener);
        const dropDownStyle = {};
        const columnList = this.fieldsList.filter((item) => {
          return item.key === columnKey;
        });
        const [columnInfo = {}] = columnList || [];
        if (columnList.length > 0) {
          const filterCol = document.getElementById(
            `filter-${this.randNum}-${columnKey}`
          );
          const tableDoc = document.getElementById(`yn-table-${this.randNum}`);
          const tableContainerDoc = document.getElementById(
            `yn-table-${this.randNum}`
          );
          dropDownStyle.top = 0 + "px";
          dropDownStyle.left = 0 + "px";
          dropDownStyle.marginTop = filterCol.offsetTop + 32 + "px";
          dropDownStyle.marginLeft =
            filterCol.getBoundingClientRect().left -
            tableDoc.getBoundingClientRect().left +
            (filterCol.offsetWidth - 160) +
            "px";
          dropDownStyle.start = tableContainerDoc.scrollLeft;
          dropDownStyle.max = tableDoc.offsetWidth - 161;
          columnInfo.key = columnKey;
          on(tableContainerDoc, "scroll", this.setDDCoordinate);
        }
        this.dropDownInfoSelectRows = deepClone(columnInfo.filters);
        this.dropDownInfo = { ...columnInfo };
        this.filterContent = this.getDropDowmList(h);
        this.dropDownStyle = { ...dropDownStyle };
        this.checkResetDisabled();
      }
    },
    setDDCoordinate(e) {
      const {
        tableKey,
        dropDownStyle: { marginLeft, start, max },
      } = this;
      const nowLeft = parseInt(marginLeft.replace("px", ""));
      let _left = nowLeft + (start - e.target.scrollLeft);
      _left = _left <= 1 ? 1 : _left >= max ? max : _left;
      const filterCol = document.getElementById(
        `yn-table-dropdown-container${tableKey}`
      );
      filterCol.style.marginLeft = _left + "px";
    },
    // table头单元格
    renderTheadCell(column, h) {
      // 暂时只支持搜索，需要其他功能之后再说
      if (column.filters) {
        return h(
          "div",
          {
            class: ["yn-table-filter-column"],
            attrs: { id: `filter-${this.randNum}-${column.key}` },
          },
          [
            column.required && h("i", { class: ["yn-table-required"] }, ["*"]),
            h("span", { class: ["yn-table-column-title"] }, [column.title]),
            h(
              "span",
              {
                class: ["yn-table-filter-trigger"],
                on: { click: () => this.showDropDownFun(h, column.key) },
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
                  },
                  []
                ),
              ]
            ),
          ]
        );
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
      this.dropDownStyle = {};
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
        if (this.keyName) record.key = record[this.keyName];
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
      const dataList = this.dataList;
      const tableRows = this.getStartAndEndRow();
      const currentPageData = [];

      for (let i = tableRows.start; i < tableRows.end; i++) {
        if (!dataList[i].key) dataList[i].key = i;
        if (this.keyName) dataList[i].key = dataList[i][this.keyName];
        currentPageData.push(dataList[i]);
        rowContent.push(
          h("tr", { class: ["yn-table-row"] }, [
            this.renderFieldList(dataList[i]),
          ])
        );
        // 如果有子数据
        dataList[i].children &&
          dataList[i].children.length > 0 &&
          this.initChildRows(rowContent, dataList[i], h, currentPageData);
      }

      // 为空的时候
      if (currentPageData.length === 0) {
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
      this.currentPageData = currentPageData;
      return rowContent;
    },
    initChildRows(rowContent, parentRow, h, currentPageData, level = 1) {
      const _childList = parentRow.children;
      _childList.forEach((item) => {
        item.ynTableRowlevel = level;
        if (this.keyName) item.key = item[this.keyName];
        currentPageData.push(item);
        rowContent.push(
          h(
            "tr",
            {
              class: [
                "yn-table-row",
                parentRow.showChild === true ? "" : "yn-table-row-hide",
              ],
            },
            [this.renderFieldList(item)]
          )
        );
        item.children &&
          item.children.length > 0 &&
          this.initChildRows(rowContent, item, h, currentPageData, level + 1);
      });
    },
    renderFieldList(rowDatas) {
      const h = this.$createElement;
      const { fieldsList, defaultCellLeft } = this;
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
                        checked: this.selectedRows[0] === rowDatas.key,
                        size: this.checkBoxSize,
                      },
                    },
                    []
                  ),
            ]
          )
        );
      }

      fieldsList.forEach((item, ind) => {
        const value = item.dataIndex ? rowDatas[item.dataIndex] : "";
        let _content, _contentNode;
        if (item.renderVNode) {
          _content = item.renderVNode;
        } else if (item.render || item.editable) {
          _content = this.renderCell(item, value, rowDatas);
        } else {
          _content = value;
        }
        if (ind === 0) {
          const _left = (rowDatas.ynTableRowlevel || 0) * 10;
          _contentNode = h(
            "td",
            {
              class: ["yn-table-cell"],
              style: { paddingLeft: _left + defaultCellLeft + "px" },
            },
            [
              ((rowDatas.children && rowDatas.children.length > 0) ||
                rowDatas.hasChild === true) &&
                h(
                  genComponentName("iconfont"),
                  {
                    directives: [{ value: true }],
                    class: ["yn-table-expand-icon"],
                    props: {
                      size: 10,
                      name: rowDatas.showChild === true ? "minus" : "add",
                    },
                    on: {
                      click: () => {
                        this.onChildIconClick(rowDatas, !rowDatas.showChild);
                      },
                    },
                  },
                  []
                ),
              _content,
            ]
          );
        } else {
          _contentNode = h("td", { class: ["yn-table-cell"] }, [_content]);
        }
        fieldContentList.push(_contentNode);
      });
      return fieldContentList;
    },
    onChildIconClick(rowDatas, status) {
      if (
        rowDatas.hasChild === true &&
        status === true &&
        rowDatas.children &&
        rowDatas.children.length === 0
      ) {
        rowDatas.showChild = status;
        this.$emit("handleGetChildTree", rowDatas, (res) =>
          this.onResponse(res, rowDatas)
        );
      } else {
        this.hideChileRow(rowDatas, status);
      }
    },
    onResponse(response, rowDatas) {
      if (response.length > 0) this.selectAll = false;
      rowDatas.children = [...response];
      this.initTableRows();
    },
    hideChileRow(rowDatas, status) {
      if (
        status === false &&
        rowDatas.children &&
        rowDatas.children.length > 0
      ) {
        const childList = rowDatas.children;
        childList.forEach((item) => {
          this.hideChileRow(item, status);
        });
      }
      rowDatas.showChild = status;
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
      let selectedRowKeys = [],
        selectedRowDatas = [];
      const { currentPageData } = this;
      const currentPageKeys = currentPageData.map((item) => {
        return item.key;
      });
      this.selectAll = checked;
      if (checked) {
        selectedRowKeys = [...currentPageKeys];
        selectedRowDatas = [...currentPageData];
      }
      this.selectedRows = selectedRowKeys;
      this.selectedRowDatas = selectedRowDatas;
      const rowSelection = this.rowSelection;
      rowSelection.onChange &&
        rowSelection.onChange(selectedRowKeys, selectedRowDatas);
    },
    setSelectRowKeys() {
      const { rowSelection, currentPageData } = this;
      if (rowSelection && rowSelection.selectedRowKeys && rowSelection.type) {
        if (rowSelection.type === "radio") {
          const key = rowSelection.selectedRowKeys[0];
          this.selectedRows = key ? [key] : [];
          this.selectedRowDatas = currentPageData.filter(
            (item) => item.key === key
          );
        }
        if (rowSelection.type === "checkbox") {
          this.selectedRows = [...rowSelection.selectedRowKeys];
          this.selectedRowDatas = currentPageData.filter((item) => {
            return rowSelection.selectedRowKeys.indexOf(item.key) > -1;
          });
          this.selectAll =
            this.selectedRows.length === this.currentPageData.length &&
            this.selectedRows.length > 0;
        }
      }
    },
    onSelectedRows(rowDatas, checkType) {
      const { selectedRows, selectedRowDatas } = this;
      const ind = selectedRows.indexOf(rowDatas.key);
      const rowSelection = this.rowSelection;
      if (checkType === "radio") {
        const [seletekey] = selectedRows;
        let responseKey = rowDatas.key;
        if (!seletekey && seletekey !== 0) {
          selectedRows.push(rowDatas.key);
          selectedRowDatas.push(rowDatas);
        } else if (seletekey !== rowDatas.key) {
          selectedRows.splice(0, 1, rowDatas.key);
          selectedRowDatas.splice(0, 1, rowDatas);
        } else {
          selectedRows.splice(0, 1);
          selectedRowDatas.splice(0, 1);
          responseKey = "";
        }
        rowSelection.onChange &&
          rowSelection.onChange(responseKey, selectedRowDatas);
      } else {
        if (ind > -1) {
          selectedRows.splice(ind, 1);
          selectedRowDatas.splice(ind, 1);
        } else {
          selectedRows.push(rowDatas.key);
          selectedRowDatas.push(rowDatas);
        }
        this.selectAll = selectedRows.length === this.currentPageData.length;
        rowSelection.onChange &&
          rowSelection.onChange(selectedRows, selectedRowDatas);
      }
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
    const tableStyle = this.height ? { "max-height": this.height + "px" } : "";
    const {
      pageInfoObj,
      loading,
      hideHeader,
      tableSize,
      tableSizeList,
      bordered,
      setting,
      minWidth,
      dropDownStyle,
    } = this;
    const sizeClass = tableSizeList[tableSize] || "";
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
            },
            [
              h(
                "div",
                {
                  class: ["yn-table-container"],
                  attrs: { id: `yn-thead-container-${this.randNum}` },
                },
                [
                  h(
                    "div",
                    {
                      class: ["thead-table"],
                      style: { minWidth: minWidth + "px" },
                    },
                    [
                      h("table", { style: { "table-layout": "fixed" } }, [
                        this.getCommonColgroup(),
                        !hideHeader &&
                          h(
                            "thead",
                            {
                              attrs: { id: `yn-table-thead-${this.randNum}` },
                              class: ["yn-table-thead", thClassName],
                              style: { ...thStyle },
                            },
                            [this.getThead(h)]
                          ),
                      ]),
                    ]
                  ),
                  h(
                    "div",
                    {
                      style: { minWidth: minWidth + "px", ...tableStyle },
                      class: [this.height ? "yn-tbody-container" : ""],
                    },
                    [
                      h(
                        "table",
                        {
                          style: { "table-layout": "fixed" },
                          attrs: { id: `yn-tbody-${this.randNum}` },
                        },
                        [
                          this.getCommonColgroup(),
                          h(
                            "tbody",
                            {
                              class: ["yn-table-tbody", tbClassName],
                              style: { ...tbStyle },
                            },
                            [this.initTableRows()]
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
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

          h(
            "div",
            {
              class: ["yn-dropdown"],
              style: {
                top: dropDownStyle.top,
                left: dropDownStyle.left,
                marginLeft: dropDownStyle.marginLeft,
                marginTop: dropDownStyle.marginTop,
              },
              attrs: { id: "yn-table-dropdown-container" + this.tableKey },
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
                      h("span", { on: { click: this.reset.bind(this, h) } }, [
                        this.resetText,
                      ]),
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
                        { on: { click: this.checkDropDownChage.bind(this) } },
                        [this.okText]
                      ),
                    ]
                  ),
                ]),
              ]),
            ]
          ),
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
