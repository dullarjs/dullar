<!--
 * @Author: yegl
 * @Date: 2021-08-05 10:07:28
 * @Last Modified by: yegl
 * @Last Modified time: 2021-08-20 19:34:41
 * @E-mail: yglgzyx@126.com
-->
<template>
    <div>
        <h2>yn-table</h2>
        <h3>普通表格</h3>
        <yn-table
            :columns="columns1"
            :bordered="false"
            :dataSource="dataSource1"
            :rowSelection="rowSelection1"
            v-on:handleCkChange="handleCkChange"
            v-on:handleClick="handleClick"
            :pagination="pagination"
        >
        </yn-table>
        <h3>基础功能齐全table</h3>
        <yn-table
            :columns="columns"
            :rowSelection="rowSelection"
            :bordered="true"
            :dataSource="dataSource"
            v-on:handleClick="handleClick"
            v-on:handleDelete="handleDelete"
            v-on:handleAdd="handleAdd"
            v-on:handleChange="handleChange"
            :pagination="pagination"
            :height="600"
        >
        </yn-table>
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
                defaultPageSize: 15,
                total: data.length
            },
            columns1:[
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
                {
                    title: 'picture',
                    dataIndex: '',
                    key: 'picture',
                    width: 200,
                    render: {
                        tagName: 'img',
                        attrs: {
                            src: 'https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/171769/14/12515/117439/60b4d115E010780e1/6a74fc1f3b92de32.jpg',
                            class: "img-class"
                        },
                        style:{
                            width: '58px',
                            height: '58px'
                        },
                        content: []
                    }
                },
                {
                    title: 'test',
                    dataIndex: 'test',
                    key: 'test',
                    width: 200,
                    render: {
                        compentName: "iconfont",
                        props: {
                            size: 12,
                            name: "clear",
                        },
                        attrs: { "column-key": 12 }
                    }
                },
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
                                    click: "handleClick",
                                },
                                content: ["Success"]
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
                                    click: "handleClick",
                                },
                                content: ["Error"]
                            }
                        ]
                    }
                },
            ],
            dataSource1: [
                {
                    key: 1,
                    name: '名1',
                    age: 30,
                    address: '武汉市1(编辑下试试)'
                },
                {
                    key: 2,
                    name: '名2',
                    age: 23,
                    address: '武汉市3(编辑下试试)'
                },
                {
                    key: 3,
                    name: '名3',
                    age: 15,
                    address: '武汉市3(编辑下试试)'
                },
            ],
            // 选择系列
            rowSelection1: {
                selectedRowKeys: [2], // radio 默认取第一个
                onChange: this.handleSelectChange, // 选中之后提供数据调整入口
                type: "radio", // radio 或者checkbox
            },
            okText: "搜索",
            resetText: "重置"
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
    }
    };
</script>