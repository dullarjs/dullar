<!--
 * @Author: yegl
 * @Date: 2021-08-05 10:07:28
 * @Last Modified by: yegl
 * @Last Modified time: 2021-09-27 15:44:15
 * @E-mail: yglgzyx@126.com
-->
<template>
    <div>
        <h2>yn-table</h2>
        <h3>普通表格</h3>
        <yn-table
            :columns="columns1"
            bordered="none"
            :dataSource="dataSource1"
            :rowSelection="rowSelection1"
            v-on:handleCkChange="handleCkChange"
            v-on:handleReset="handleReset"
            v-on:handleHideHeader="handleHideHeader"
            v-on:handleClicka="handleClicka"
            :loading="loading"
            :iconType="iconType"
            :iconSize="iconSize"
            :hideHeader="hideHeader"
            :checkBoxSize="12"
            :tableSize="tableSizeD"
            :setting="setting"
        >
        </yn-table>
        <h3>基础功能齐全table</h3>
        <div style="padding: 10px; margin: 10px;">
            <yn-table
                :columns="columns"
                :rowSelection="rowSelection"
                :bordered="true"
                :dataSource="dataSource"
                v-on:handleClick="handleClick"
                v-on:handleDelete="handleDelete"
                v-on:handleAdd="handleAdd"
                v-on:handleChange="handleChange"
                v-on:handleColumnChange="handleColumnChange"
                :pagination="pagination"
                :height="600"
                :okText="okText"
                :resetText="resetText"
                :emptyContent="emptyContent"
                :emptyText="emptyText"
                :checkBoxSize="15"
                :tableSize="tableSizeN"
            >
            </yn-table>
        </div>
    </div>
</template>
<script type="text/javascript">
// 注意为了方便约定 key 值为 数组中的索引， 可以为空
const data = [];
for (let i = 0; i < 40; i++) {
  let key = 4 * i
  data.push({
    // key: key,
    name: '张三',
    age: i + 1,
    street: '街道aa',
    building: 'C1',
    number: 29003,
    companyAddress: '软件新城',
    companyName: '元年科技',
    address: "wode 地址",
    gender: '男',
  });
  data.push({
    // key: key + 1,
    name: '李四',
    age: i + 1,
    street: '街道bb',
    building: 'C2',
    number: 1094,
    companyAddress: '软件新城',
    companyName: '元年科技',
    address: "wode 地址1",
    gender: '女',
  });
  data.push({
    // key: key + 2,
    name: '王五',
    age: i + 1,
    street: '街道cc',
    building: 'C3',
    number: 1092,
    companyAddress: '软件新城',
    companyName: '元年科技',
    address: "wode 地址2",
    gender: '女',
  });
  data.push({
    key: key + 3,
    name: '赵六',
    age: i + 1,
    street: '街道dd',
    building: 'A3',
    number: 1095,
    companyAddress: '软件新城',
    companyName: '元年科技',
    address: "wode 地址3",
    gender: '男',
  });
}
export default {
    name: "YnTablePage",
    data() {
        return {
            columns: [
                {
                    title: "Name",
                    dataIndex: "name",
                    width: 100,
                    // 列渲染调整
                    render: {
                        tagName: "a",
                        style: {
                            color: "red",
                            fontSize: "12px",
                        },
                        on: {
                            click: "handleClick",
                        },
                        attrs: {
                            title: "zssg-g"
                        },
                        content: [
                            "a标签内容1",
                            {
                                tagName: "span",
                                style: {
                                    color: "blue",
                                    fontSize: "12px",
                                },
                                content:[
                                    "|a>span内容1",
                                    {
                                        tagName: "span",
                                        style: {
                                            color: "grey",
                                            fontSize: "12px",
                                        },
                                        content:["|a>span>span内容1"]
                                    }
                                ]
                            },
                            {
                                tagName: "span",
                                style: {
                                    color: "pink",
                                    fontSize: "12px",
                                },
                                content:[{setContent: (value, record) => { return record.name + '-----' + value }}]
                            },
                            {
                                tagName: "span",
                                style: {
                                    color: "deeppink",
                                    fontSize: "12px",
                                },
                                content:["|a标签内容3 --- 点我有惊喜"]
                            }
                        ],
                    },
                    // 列过滤选项卡
                    filters: [
                        { text: '张三', value: '张三' },
                        { text: '李四', value: '李四' },
                        { text: '王五', value: '王五' },
                        { text: '赵六', value: '赵六' }
                    ],
                    // 字段的搜索功能 运行函数
                    onFilter: (value, record) => { return record.name.indexOf(value) >= 0 },
                    // fixed: 'left', 暂不支持 商城目前需求不是很需要，暂不处理
                },
                {
                    title: 'Other',
                    children: [
                        {
                            title: 'Age',
                            dataIndex: 'age',
                            key: 'age',
                            width: 150,
                        },
                        {
                            title: 'Address',
                            children: [
                            {
                                title: 'Street',
                                dataIndex: 'street',
                                key: 'street',
                                width: 120,
                            },
                            {
                                title: 'Block',
                                children: [
                                    {
                                        title: 'Building（editable）',
                                        dataIndex: 'building',
                                        key: 'building',
                                        width: 150,
                                        // 编辑功能  beforeChage 只在有editable 才生效， 用于单元格数据校验
                                        editable: true,
                                        beforeChage: this.beforeChange,
                                        onchange: "handleChange",
                                    },
                                    {
                                        title: 'Door No.',
                                        dataIndex: 'number',
                                        key: 'number',
                                        width: 100,
                                    },
                                ],
                            },
                            ],
                        },
                    ],
                },
                {
                    title: 'Company',
                    children: [
                        {
                            title: 'Company Address',
                            dataIndex: 'companyAddress',
                            key: 'companyAddress',
                            width: 150,
                        },
                        {
                            title: 'Company Name',
                            dataIndex: 'companyName',
                            key: 'companyName',
                            width: 150,
                        },
                    ],
                },
                {
                    title: "address",
                    dataIndex: "address",
                },
                {
                    title: 'gender',
                    dataIndex: "gender",
                    // 列过滤选项卡
                    filters: [
                        { text: '男', value: '男' },
                        { text: '女', value: '女' }
                    ],
                },
                {
                    title: "Action",
                    dataIndex: "",
                    render: {
                        tagName: "div",
                        style: {
                            color: "red",
                            fontSize: "12px",
                        },
                        width: 200,
                        content: [
                            {
                                tagName: "p",
                                style: {
                                    color: "red",
                                    fontSize: "12px",
                                },
                                on: {
                                    click: "handleDelete",
                                },
                                content: ["删除"]
                            },
                            {
                                tagName: "p",
                                style: {
                                    color: "blue",
                                    fontSize: "12px",
                                },
                                on: {
                                    click: "handleAdd",
                                },
                                content: ["新增"]
                            },
                            {
                                tagName: "p",
                                style: {
                                    color: "blue",
                                    fontSize: "12px",
                                },
                                on: {
                                    click: "handleColumnChange",
                                },
                                content: ["表头变更"]
                            }
                        ]
                    },
                }
            ],
            // 选择系列
            rowSelection: {
                selectedRowKeys: [0, 1, 2, 3], // radio 默认取第一个
                onChange: this.handleSelectChange, // 选中之后提供数据调整入口
                type: "checkbox", // radio 或者checkbox
            },
            dataSource: data,
            // 分页
            pagination: {
                defaultCurrent: 1,
                defaultPageSize: 10,
                total: data.length
            },
            columns1:[
                {
                    title: 'picture',
                    dataIndex: '',
                    key: 'picture',
                    width: 200,
                    render: {
                        tagName: 'div',
                        attrs: {
                            class: "img-class"
                        },
                        content: [
                            {
                                setContent: (value, record) => {
                                    return (
                                        <div onClick={ () => this.handleClicka(value, record) }>
                                            <img 
                                                src={record.img}
                                                class="img-class"
                                                style="width: 58px;height: 58px"
                                            />
                                            <span>{record.dsc}</span>
                                        </div>
                                    )
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    key: 'age',
                    width: 100
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                    editable: true,
                    onchange: "handleChange",
                    beforeChage: this.beforeChangeB,
                    width: 200
                },
                // {
                //     title: 'test',
                //     dataIndex: 'test',
                //     key: 'test',
                //     width: 200,
                //     render: {
                //         compentName: "checkbox",
                //         props: {
                //             size: 12,
                //             name: "clear",
                //         },
                //         on: {
                //             change: "handleClicka",
                //         },
                //         attrs: { "column-key": 12 }
                //     }
                // },
                {
                    title: 'Tags',
                    key: 'tags',
                    width: 160,
                    render: {
                        tagName: "div",
                        content: [
                            {
                                tagName: "span",
                                style: {
                                    color: "#389e0d",
                                    background: "#f6ffed",
                                    "border-color": "#b7eb8f",
                                    padding: "5px 20px",
                                    margin: "0 5px",
                                    cursor: "pointer"
                                },
                                on: {
                                    click: "handleReset",
                                },
                                content: ["Reset"]
                            },
                            {
                                tagName: "span",
                                style: {
                                    color: "#d4380d",
                                    background: "#fff2e8",
                                    "border-color": "#ffbb96",
                                    padding: "5px 20px",
                                    margin: "0 5px",
                                    cursor: "pointer"
                                },
                                on: {
                                    click: "handleHideHeader",
                                },
                                content: ["Header"]
                            }
                        ]
                    }
                },
                {
                    title: 'Action',
                    key: 'Action',
                    width: 160,
                    renderVNode: (<yn-button type="primary" onclick={() => {return this.handleClicka()}}>主题色</yn-button>)
                }
            ],
            dataSource1: [
                {
                    key: 1,
                    name: '名1',
                    age: 30,
                    address: '武汉市1(编辑下试试)',
                    img: "https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/190947/6/8975/84588/60cc46b4Edc1b4e04/bb6d78e8707624a1.jpg",
                    dsc: "斯得弗（STRYFER）",
                    test: false
                },
                {
                    key: 2,
                    name: '名2',
                    age: 23,
                    address: '武汉市3(编辑下试试)',
                    img: "https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/190088/33/8488/135210/60c9cb40Eb71a7dd9/65ba2694595c2e72.jpg",
                    dsc: "松深入墨 骁龙865 ",
                    test: false
                },
                {
                    key: 3,
                    name: '名3',
                    age: 15,
                    address: '武汉市3(编辑下试试)',
                    img: "https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/121150/33/8284/68362/5f22f0a4Eee68fcd2/51cd7445e9429892.jpg",
                    dsc: "黑鲨移动电源",
                    test: false
                },
            ],
            // 选择系列
            rowSelection1: {
                selectedRowKeys: [2], // radio 默认取第一个
                onChange: this.handleSelectChange, // 选中之后提供数据调整入口
                type: "radio", // radio 或者checkbox
            },
            okText: "搜索",
            resetText: "重置",
            columns2: [
                {
                    title: "Name",
                    dataIndex: "name",
                    width: 100,
                    // 列渲染调整
                    render: {
                        tagName: "a",
                        style: {
                            color: "red",
                            fontSize: "12px",
                        },
                        on: {
                            click: "handleClick",
                        },
                        attrs: {
                            title: "zssg-g"
                        },
                        content: [
                            {
                                tagName: "span",
                                style: {
                                    color: "pink",
                                    fontSize: "12px",
                                },
                                content:[{setContent: (value, record) => { return record.name + '-----' + value }}]
                            }
                        ],
                    },
                    // 列过滤选项卡
                    filters: [
                        { text: '张三', value: '张三' },
                        { text: '李四', value: '李四' },
                        { text: '王五', value: '王五' }
                    ],
                    // 字段的搜索功能 运行函数
                    onFilter: (value, record) => { return record.name.indexOf(value) >= 0 },
                    // fixed: 'left', 暂不支持 商城目前需求不是很需要，暂不处理
                },
                {
                    title: 'Other',
                    children: [
                        {
                            title: 'Age',
                            dataIndex: 'age',
                            key: 'age',
                            width: 150,
                        },
                        {
                            title: 'Address',
                            children: [
                            {
                                title: 'Street',
                                dataIndex: 'street',
                                key: 'street',
                                width: 120,
                            },
                            {
                                title: 'Block',
                                dataIndex: 'building'
                            }
                            ],
                        },
                    ],
                },
                {
                    title: 'Company',
                    children: [
                        {
                            title: 'Company Address',
                            dataIndex: 'companyAddress',
                            key: 'companyAddress',
                            width: 150,
                        },
                        {
                            title: 'Company Name',
                            dataIndex: 'companyName',
                            key: 'companyName',
                            width: 150,
                        },
                    ],
                },
                {
                    title: "address",
                    dataIndex: "address",
                },
                {
                    title: 'gender',
                    dataIndex: "gender",
                    // 列过滤选项卡
                    filters: [
                        { text: '男', value: '男' },
                        { text: '女', value: '女' }
                    ],
                },
                {
                    title: "Action",
                    dataIndex: "",
                    render: {
                        tagName: "div",
                        style: {
                            color: "red",
                            fontSize: "12px",
                        },
                        width: 200,
                        content: [
                            {
                                tagName: "p",
                                style: {
                                    color: "red",
                                    fontSize: "12px",
                                },
                                on: {
                                    click: "handleDelete",
                                },
                                content: ["删除"]
                            }
                        ]
                    },
                }
            ],
            // emptyContent: <div style="height: 200px; color: pink">这里什么都没有<i style="color: deeppink">什么都没有找到</i></div>,
            emptyContent: null,
            emptyText: "空空如也",
            loading: false,
            hideHeader: false,
            iconType: "fadingCircle",
            iconSize: 50,
            tableSizeD: "default", // default 16px middel 12 px small 8px  none 0
            tableSizeM: "middle",
            tableSizeN: "none",
            setting: {
                thead: {
                    style: { fontFamily: "PingFangSC-Medium", fontSize: "14px", color: "#4E5D78", background: "#DEDEDE" },
                    className: "table-thead-c"
                },
                tbody: {
                    style: { fontFamily: "PingFangSC-Regular", fontSize: "14px", color: "#1A253B" },
                    className: "table-tbody-c"
                }
            }
        };
    },
    methods: {
        handleClick(e) {
            console.log(e)
        },
        handleDelete(e) {
            console.log(e);
            this.dataSource.splice(e.key, 1);
        },
        handleCkChange(e){
            console.log(e)
            console.log(2)
        },
        handleDelete1(e){
            console.log(e);
            // this.dataSource1.splice(e.key, 1);
        },
        handleSelectChange(selectedRowKeys) {
            // 自己处理业务需求 record 中的值未改变
            console.log(selectedRowKeys);
        },
        handleChange(value, record, column) {
            // 自己处理业务需求 record 中的值未改变
            console.log(value);
            console.log(record);
            console.log(column);
        },
        beforeChange(value, record, column) {
            console.log(record);
            console.log(column);
            const list = this.getList();
            const result = list.indexOf(value) > -1;
            const msg = result ? "校验通过" : "校验不通过";
            console.log(msg)
            return result;
        },
        beforeChangeB(value) {
            const res = value === "武汉市软件新城";
            if (!res) {
                this.Toast(`地址必须为： 武汉市软件新城`);
            }
            return res;
        },
        getList() {
            return ["C1", "C2", "A1", "C3"];
        },
        handleAdd() {
            console.log("新增数据")
            this.dataSource.push({
                key: this.dataSource.length,
                name: '',
                age: 0,
                street: '',
                building: '',
                number: 0,
                companyAddress: '',
                companyName: '',
                address: "",
                gender: '',
            })
        },
        handleColumnChange() {
            this.columns = this.columns2;
        },
        handleReset() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 3000)
        },
        handleHideHeader() {
            this.hideHeader = !this.hideHeader;
        },
        handleClicka(e, record) {
            console.log(e);
            console.log(record);
        }
    }
    };
</script>