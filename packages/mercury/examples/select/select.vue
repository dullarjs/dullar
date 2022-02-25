<!--
 * @Author: yegl
 * @Date: 2022-01-25 11:27:59
 * @Last Modified by: yegl
 * @Last Modified time: 2022-02-25 14:21:03
 * @E-mail: yglgzyx@126.com
-->
<template>
    <div class="select-demo">
        <h2>yn-select</h2>
        <p>基础用法(有禁用选项)</p>
        <yn-select v-model="value">
            <yn-option v-for="item in options" placeholder="请选择" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"><a>{{item.label}}</a></yn-option>
        </yn-select>
        <p>禁用状态</p>
        <yn-select v-model="value" disabled>
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></yn-option>
        </yn-select>
        <p>自定义模板</p>
        <yn-select v-model="value1">
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </yn-option>
        </yn-select>
        <p>分组</p>
        <yn-select v-model="value2">
            <yn-option-group v-for="group in groupOptions" :key= "group.label" :label="group.label">
                <yn-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </yn-option>
            </yn-option-group>
        </yn-select>
        <p>多选(展示所有选项)</p>
        <yn-select v-model="multipleValue" multiple>
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></yn-option>
        </yn-select>
        <p>多选(行内展示)</p>
        <yn-select v-model="multipleValue1" multiple collapse-tags>
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></yn-option>
        </yn-select>
        <p>创建条目</p>
        <yn-select v-model="multipleValue2" multiple filterable>
            <yn-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></yn-option>
        </yn-select>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "YnSelectPage",
    data() {
        return {
            options: [{
                value: '选项1',
                label: '选项01'
            }, {
                value: '选项2',
                label: '选项02',
                disabled: true
            }, {
                value: '选项3',
                label: '选项03'
            }, {
                value: '选项4',
                label: '选项04'
            }, {
                value: '选项5',
                label: '选项05'
            }],
            groupOptions: [{
                label: '热门城市',
                options: [{
                    value: 'Shanghai',
                    label: '上海'
                }, {
                    value: 'Beijing',
                    label: '北京'
                }]
                }, {
                label: '城市名',
                options: [{
                    value: 'Chengdu',
                    label: '成都'
                }, {
                    value: 'Shenzhen',
                    label: '深圳'
                }, {
                    value: 'Guangzhou',
                    label: '广州'
                }, {
                    value: 'Dalian',
                    label: '大连'
                }]
            }],
            value: '选项1',
            value1: '选项2',
            value2: "",
            multipleValue: ['选项3', '选项2', '选项5'],
            multipleValue1: ['选项3'],
            multipleValue2: ['选项3']
        }
    },
    watch: {
        multipleValue2: function(newV) {
            console.log(newV);
        }
    },
    methods: {
        handleSelect(item) {
            console.log(item)
        },
    }
}
</script>
<style type="text/css">
.select-demo {
  padding: 20px;
}
</style>